import { createClient } from '@supabase/supabase-js';

const REQUIRED_FIELDS = ['candidateToken', 'stakeholders', 'rationale', 'submittedAt'];

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  // Basic validation
  for (const field of REQUIRED_FIELDS) {
    if (!body[field]) return json({ error: `Missing field: ${field}` }, 400);
  }
  if (!Array.isArray(body.stakeholders) || body.stakeholders.length !== 3) {
    return json({ error: 'Exactly 3 stakeholders required' }, 400);
  }
  if (typeof body.rationale !== 'string' || body.rationale.trim().length < 20) {
    return json({ error: 'Rationale too short' }, 400);
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { error } = await supabase.from('cyborg_submissions').insert({
    candidate_token: body.candidateToken,
    profile:         body.profile || null,
    submitted_at:    body.submittedAt,
    stakeholders:    body.stakeholders,
    rationale:       body.rationale.trim(),
    session_log:     body.sessionLog || null,
    received_at:     new Date().toISOString(),
  });

  if (error) {
    console.error('Supabase insert error:', error.message);
    return json({ error: 'Failed to store submission.' }, 500);
  }

  return json({ ok: true, message: 'Submission received. See you Monday.' });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
