// POST /cyborg/mint — admin-only token minting.
// Auth: header `Authorization: Bearer <ADMIN_SECRET>` (env var, set via wrangler secret).

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from './_access.js';
import { writeAuditLog, requestMeta, generateJitToken } from './_lib.js';

const DEFAULT_DAYS = 8;  // assessment is 7 days; +1 day grace

export async function onRequestPost({ request, env }) {
  const meta = requestMeta(request);
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    console.error(`mint 401: ${access.reason}`);
    const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
    await writeAuditLog(supabase, {
      actorEmail: '(unauthenticated)', action: 'mint',
      success: false, detail: { reason: access.reason }, ...meta,
    });
    return json({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }

  const label = (body.label || '').toString().slice(0, 200) || null;
  const days  = Number.isFinite(body.days) ? Math.min(Math.max(body.days, 1), 30) : DEFAULT_DAYS;
  const notes = body.notes ? String(body.notes).slice(0, 500) : null;
  const campaignId = body.campaign_id ? String(body.campaign_id).trim() : null;

  const token = generateToken();
  const jitToken = generateJitToken();   // opaque /c/<jit> launch ticket (2026-06-09)
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  let campaignOrgId = null;
  if (campaignId) {
    const { data: campaign, error: campaignErr } = await supabase
      .from('campaigns')
      .select('id, organisation_id')
      .eq('id', campaignId)
      .maybeSingle();
    if (campaignErr || !campaign) {
      await writeAuditLog(supabase, {
        actorEmail: access.email, action: 'mint',
        target: label, success: false,
        detail: { error: 'campaign_id not found', campaign_id: campaignId }, ...meta,
      });
      return json({ error: 'Campaign not found.' }, 400);
    }
    campaignOrgId = campaign.organisation_id;
  }

  const { error } = await supabase.from('cyborg_tokens').insert({
    token,
    jit_token:       jitToken,
    candidate_label: label,
    expires_at:      expiresAt,
    approved_at:     new Date().toISOString(),   // admin-minted = pre-approved
    notes,
    campaign_id:     campaignId,
    organisation_id: campaignOrgId,
  });
  if (error) {
    console.error('mint insert error:', error.message);
    await writeAuditLog(supabase, {
      actorEmail: access.email, action: 'mint',
      target: label, success: false,
      detail: { error: error.message }, ...meta,
    });
    return json({ error: 'Failed to mint token.' }, 500);
  }

  await writeAuditLog(supabase, {
    actorEmail: access.email, action: 'mint',
    target: token, success: true,
    detail: { label, days, expires_at: expiresAt, campaign_id: campaignId }, ...meta,
  });

  // launch_url is the candidate-facing link (opaque jit — real token stays
  // server-side). install_cmd is the separate local-CLI channel: unchanged.
  const origin = new URL(request.url).origin;
  return json({
    ok:          true,
    token,
    expires_at:  expiresAt,
    launch_url:  `${origin}/c/${jitToken}`,
    install_cmd: `curl -fsSL https://raw.githubusercontent.com/vuelo-labs/cyborg_versions/main/install.sh | bash -s ${token}`,
  });
}

function generateToken() {
  // 32 hex chars, prefixed for readability
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const hex   = Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  return `cyb_${hex}`;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
