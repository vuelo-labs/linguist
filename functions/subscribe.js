import { createClient } from '@supabase/supabase-js';

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
export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const email   = sanitizeEmail(body.email || '');
  const context = sanitizeText(body.context || '', MAX_CONTEXT_CHARS);
  const source  = 'pdf_download';

  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ error: 'A valid email address is required.' }),
      { status: 400 }
    );
  }

  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

  const { error } = await supabase
    .from('subscribers')
    .upsert(
      { email, context, source, updated_at: new Date().toISOString() },
      { onConflict: 'email', ignoreDuplicates: false }
    );

  if (error) {
    console.error('Supabase subscribe error:', error.message);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500 }
    );
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}
