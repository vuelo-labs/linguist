// POST /cyborg/mint — admin-only token minting.
// Auth: header `Authorization: Bearer <ADMIN_SECRET>` (env var, set via wrangler secret).

import { createClient } from '@supabase/supabase-js';
import { verifyAccessJwt } from './_access.js';

const DEFAULT_DAYS = 8;  // assessment is 7 days; +1 day grace

export async function onRequestPost({ request, env }) {
  const access = await verifyAccessJwt(request, env);
  if (!access.ok) {
    console.error(`mint 401: ${access.reason}`);
    return json({ error: 'Unauthorized', reason: access.reason }, 401);
  }

  let body;
  try { body = await request.json(); } catch { body = {}; }

  const label = (body.label || '').toString().slice(0, 200) || null;
  const days  = Number.isFinite(body.days) ? Math.min(Math.max(body.days, 1), 30) : DEFAULT_DAYS;
  const notes = body.notes ? String(body.notes).slice(0, 500) : null;

  const token = generateToken();
  const expiresAt = new Date(Date.now() + days * 86400000).toISOString();

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
  const { error } = await supabase.from('cyborg_tokens').insert({
    token,
    candidate_label: label,
    expires_at:      expiresAt,
    approved_at:     new Date().toISOString(),   // admin-minted = pre-approved
    notes,
  });
  if (error) {
    console.error('mint insert error:', error.message);
    return json({ error: 'Failed to mint token.' }, 500);
  }

  return json({
    ok:          true,
    token,
    expires_at:  expiresAt,
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
