const { createClient } = require('@supabase/supabase-js');

// =============================================
// Input sanitization
// =============================================
function sanitizeEmail(raw) {
  if (typeof raw !== 'string') return '';
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._+\-]/g, '')
    .slice(0, 254);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// =============================================
// Handler
// =============================================
exports.handler = async function (event) {

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const email     = sanitizeEmail(body.email || '');
  const profile   = ['newrole', 'professional', 'maker'].includes(body.profile) ? body.profile : null;
  const completed = Array.isArray(body.completed)
    ? body.completed.filter(c => typeof c === 'string' && /^[a-z]-\d{2}$/.test(c)).slice(0, 50)
    : [];

  if (!isValidEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Valid email required.' })
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  const { error } = await supabase
    .from('course_progress')
    .upsert(
      { email, profile, completed_modules: completed, updated_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false }
    );

  if (error) {
    console.error('progress upsert error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not save.' })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ ok: true }),
  };
};
