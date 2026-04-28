// POST /cyborg/request-token — public form endpoint.
// Records the request in Supabase, mints HMAC-signed approve/reject URLs,
// and forwards the package to the Tines webhook (env.TINES_REQUEST_WEBHOOK).
// The token itself is NOT minted yet — that happens at approval time.

import { createClient } from '@supabase/supabase-js';
import { hmacHex, jsonResponse, originFromRequest } from './_lib.js';

const MAX_NAME    = 200;
const MAX_EMAIL   = 320;
const MAX_NOTES   = 2000;
const MAX_BODY_KB = 8;

export async function onRequestPost({ request, env }) {
  if (!env.TINES_REQUEST_WEBHOOK) return jsonResponse({ ok: false, reason: 'not_configured' }, 503);
  if (!env.ADMIN_SECRET)          return jsonResponse({ ok: false, reason: 'not_configured' }, 503);

  const ctype = request.headers.get('content-type') || '';
  if (!ctype.includes('application/json')) return jsonResponse({ ok: false, reason: 'bad_content_type' }, 415);

  const raw = await request.text();
  if (raw.length > MAX_BODY_KB * 1024) return jsonResponse({ ok: false, reason: 'too_large' }, 413);

  let body;
  try { body = JSON.parse(raw); } catch { return jsonResponse({ ok: false, reason: 'bad_json' }, 400); }

  const name  = clean(body.name,  MAX_NAME);
  const email = clean(body.email, MAX_EMAIL);
  const notes = clean(body.notes, MAX_NOTES);
  const hp    = (body.website || '').toString();   // honeypot

  if (hp)              return jsonResponse({ ok: true });   // pretend success, drop silently
  if (!name || !email) return jsonResponse({ ok: false, reason: 'missing_fields' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return jsonResponse({ ok: false, reason: 'bad_email' }, 400);

  const ip      = request.headers.get('cf-connecting-ip') || '';
  const country = request.headers.get('cf-ipcountry')     || '';
  const ua      = (request.headers.get('user-agent')      || '').slice(0, 300);

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { data, error } = await supabase
    .from('cyborg_token_requests')
    .insert({ name, email, notes, ip, country, user_agent: ua, status: 'pending' })
    .select('request_id, created_at')
    .single();

  if (error || !data) {
    console.error('insert request failed:', error?.message);
    return jsonResponse({ ok: false, reason: 'db_error' }, 500);
  }

  const requestId = data.request_id;
  const origin    = originFromRequest(request);

  const approveSig = await hmacHex(env.ADMIN_SECRET, `${requestId}:approve`);
  const rejectSig  = await hmacHex(env.ADMIN_SECRET, `${requestId}:reject`);
  const approveUrl = `${origin}/cyborg/approve?req=${requestId}&decision=approve&sig=${approveSig}`;
  const rejectUrl  = `${origin}/cyborg/approve?req=${requestId}&decision=reject&sig=${rejectSig}`;

  const tinesPayload = {
    type:         'cyborg_token_request',
    event_type:   'cyborg_token_request',   // for Tines branching
    request_id:   requestId,
    submitted_at: data.created_at,
    name, email, notes,
    request_meta: { ip, country, user_agent: ua },
    approve_url:  approveUrl,
    reject_url:   rejectUrl,
  };

  try {
    const r = await fetch(env.TINES_REQUEST_WEBHOOK, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(tinesPayload),
    });
    if (!r.ok) {
      console.error('Tines webhook returned', r.status);
      return jsonResponse({ ok: false, reason: 'forward_failed' }, 502);
    }
  } catch (e) {
    console.error('Tines webhook error', e);
    return jsonResponse({ ok: false, reason: 'forward_error' }, 502);
  }

  return jsonResponse({ ok: true });
}

function clean(v, max) {
  if (typeof v !== 'string') return '';
  let s = '';
  for (let i = 0; i < v.length; i++) {
    const c = v.charCodeAt(i);
    if (c === 9 || c === 10 || c === 13 || c >= 32) s += v[i];
  }
  return s.trim().slice(0, max);
}
