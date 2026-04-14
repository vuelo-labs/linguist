import { createClient } from '@supabase/supabase-js';

function sanitizeEmail(raw) {
  if (typeof raw !== 'string') return '';
  return raw.toLowerCase().trim().replace(/[^a-z0-9@._+\-]/g, '').slice(0, 254);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 }); }

  const email     = sanitizeEmail(body.email || '');
  const profile   = ['newrole','professional','maker'].includes(body.profile) ? body.profile : null;
  const completed = Array.isArray(body.completed)
    ? body.completed.filter(c => typeof c === 'string' && /^[a-z]-\d{2}$/.test(c)).slice(0, 50)
    : [];

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Valid email required.' }), { status: 400 });
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { error } = await supabase
    .from('course_progress')
    .upsert(
      { email, profile, completed_modules: completed, updated_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false }
    );

  if (error) {
    console.error('progress upsert error:', error.message);
    return new Response(JSON.stringify({ error: 'Could not save.' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}
