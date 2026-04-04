const { createClient } = require('@supabase/supabase-js');

// =============================================
// Constants
// =============================================
const MAX_CONTEXT_CHARS = 400;

// =============================================
// Input sanitization
// =============================================
function sanitizeText(raw, maxLen) {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/<[^>]{0,100}>/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, maxLen);
}

function sanitizeEmail(raw) {
  if (typeof raw !== 'string') return '';
  // Lowercase, strip whitespace, basic character whitelist
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._+\-]/g, '')
    .slice(0, 254);
}

function isValidEmail(email) {
  // RFC-compliant enough for our purposes
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
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request body' }) };
  }

  const email   = sanitizeEmail(body.email || '');
  const context = sanitizeText(body.context || '', MAX_CONTEXT_CHARS);
  const source  = 'pdf_download';

  if (!isValidEmail(email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'A valid email address is required.' })
    };
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );

  // Upsert — if they've already subscribed, update their context
  // but don't error or reveal that the email already exists
  const { error } = await supabase
    .from('subscribers')
    .upsert(
      { email, context, source, updated_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false }
    );

  if (error) {
    console.error('Supabase subscribe error:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong. Please try again.' })
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ success: true }),
  };
};
