// GET /cyborg/approve?req=<uuid>&decision=approve|reject&sig=<hmac>
//
// Liam's approval emails contain a link to this endpoint with an HMAC-signed
// query string. We verify the signature, transition the request to its final
// state, and (on approval) mint a fresh token. We then forward the result to
// the same Tines webhook with a different `event_type` so Tines can branch
// to the candidate-facing email.

import { createClient } from '@supabase/supabase-js';
import { hmacHex, timingSafeEqual, generateToken, htmlPage, fetchDadJokes, originFromRequest } from './_lib.js';

const TOKEN_DAYS = 8;       // 7-day window + 1-day grace

export async function onRequestGet({ request, env }) {
  const url       = new URL(request.url);
  const requestId = url.searchParams.get('req') || '';
  const decision  = url.searchParams.get('decision') || '';
  const sig       = url.searchParams.get('sig') || '';

  if (!env.ADMIN_SECRET || !env.TINES_REQUEST_WEBHOOK) {
    return htmlPage(503, 'Service not configured', 'Approval endpoint is not fully wired up. Contact the operator.');
  }
  if (!requestId || !['approve', 'reject'].includes(decision) || !sig) {
    return htmlPage(400, 'Bad request', 'Missing or invalid parameters.');
  }

  const expected = await hmacHex(env.ADMIN_SECRET, `${requestId}:${decision}`);
  if (!timingSafeEqual(sig, expected)) {
    return htmlPage(403, 'Invalid signature', 'This approval link is not valid.');
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  // Atomic claim: only the first click for a pending request wins.
  const finalStatus = decision === 'approve' ? 'approved' : 'rejected';
  const nowIso = new Date().toISOString();

  const { data: claimed, error: claimErr } = await supabase
    .from('cyborg_token_requests')
    .update({ status: finalStatus, decided_at: nowIso })
    .eq('request_id', requestId)
    .eq('status', 'pending')
    .select('request_id, name, email, notes, created_at')
    .maybeSingle();

  if (claimErr) {
    console.error('claim failed:', claimErr.message);
    return htmlPage(500, 'Database error', 'Could not record decision. Try again.');
  }
  if (!claimed) {
    // Already decided (or unknown id). Fetch current state for friendlier copy.
    const { data: current } = await supabase
      .from('cyborg_token_requests')
      .select('status, decided_at, email')
      .eq('request_id', requestId)
      .maybeSingle();
    const already = current?.status || 'unknown';
    return htmlPage(200, 'Already handled',
      `This request was already marked as "${already}". One-shot link — no action taken.`);
  }

  if (decision === 'approve') {
    // Mint a fresh, approved-on-creation token.
    const token = generateToken();
    const expiresAt = new Date(Date.now() + TOKEN_DAYS * 86400000).toISOString();

    const { error: tokenErr } = await supabase.from('cyborg_tokens').insert({
      token,
      candidate_label: `${claimed.name} (${claimed.email}) — request ${claimed.request_id.slice(0, 8)}`,
      expires_at:      expiresAt,
      approved_at:     nowIso,
    });
    if (tokenErr) {
      // Roll back the request status so the operator can retry.
      await supabase.from('cyborg_token_requests')
        .update({ status: 'pending', decided_at: null })
        .eq('request_id', requestId);
      console.error('token mint failed:', tokenErr.message);
      return htmlPage(500, 'Could not mint token', 'Approval rolled back. Try again.');
    }

    // Stash the token on the request row for audit.
    await supabase.from('cyborg_token_requests')
      .update({ token })
      .eq('request_id', requestId);

    const origin = originFromRequest(request);
    const installUrl = `${origin}/cyborg/?t=${encodeURIComponent(token)}`;
    const installCmd = `curl -fsSL https://raw.githubusercontent.com/vuelo-labs/cyborg_versions/main/install.sh | bash -s ${token}`;

    await forwardToTines(env, {
      event_type:   'cyborg_approval',
      request_id:   requestId,
      name:         claimed.name,
      email:        claimed.email,
      token,
      expires_at:   expiresAt,
      install_url:  installUrl,
      install_cmd:  installCmd,
    });

    return htmlPage(200, 'Approved', `Token minted and emailed to ${claimed.email}. Window: ${TOKEN_DAYS} days.`, '#2d5a26');
  }

  // Rejection branch — pull a few dad jokes and forward to Tines.
  const jokes = await fetchDadJokes(3);
  await supabase.from('cyborg_token_requests')
    .update({ rejection_jokes: jokes })
    .eq('request_id', requestId);

  await forwardToTines(env, {
    event_type:   'cyborg_rejection',
    request_id:   requestId,
    name:         claimed.name,
    email:        claimed.email,
    dad_jokes:    jokes,
  });

  return htmlPage(200, 'Rejected', `Apology email (with dad jokes) sent to ${claimed.email}.`, '#6e2618');
}

async function forwardToTines(env, payload) {
  try {
    const r = await fetch(env.TINES_REQUEST_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });
    if (!r.ok) console.error('Tines forward returned', r.status);
  } catch (e) {
    console.error('Tines forward error:', e);
  }
}
