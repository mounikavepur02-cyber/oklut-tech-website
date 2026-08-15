// Application received confirmation email.
//
// Deploy:
//   supabase functions deploy send-application-confirmation
//   supabase secrets set RESEND_API_KEY=re_... EMAIL_FROM="Oklut <no-reply@oklut.com>"
//
// Requires an authenticated user (verified JWT) so the endpoint cannot be
// abused as an open email relay. Supabase injects SUPABASE_URL and
// SUPABASE_ANON_KEY automatically.
//
// If this function is not deployed or the provider key is missing, the client
// keeps the application and only logs the error — the application is never
// blocked by email delivery.

import { createClient } from 'npm:@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'

interface ConfirmationRequest {
  to: string
  name: string
  jobTitle: string
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const EMAIL_FROM = Deno.env.get('EMAIL_FROM') ?? 'Oklut Technologies <no-reply@oklut.com>'
const EMAIL_SUBJECT = 'Application Received – Oklut Technologies'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function renderEmail(name: string, jobTitle: string): { text: string; html: string } {
  const greeting = `Dear ${name.trim()},`
  const body = [
    `Thank you for applying for the ${jobTitle.trim()} position at Oklut Technologies.`,
    `We have successfully received your application. Our recruitment team will carefully review your profile and qualifications.`,
    `If your profile matches our requirements, we will contact you regarding the next steps in the hiring process.`,
    `Thank you for your interest in joining our team.`,
  ]
  const closing = 'Best Regards,\nOklut Technologies Recruitment Team'

  const text = `${greeting}\n\n${body.join('\n\n')}\n\n${closing}`

  const html = `
    <div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; line-height: 1.6; color: #111827;">
      <p>${greeting}</p>
      ${body.map((paragraph) => `<p>${paragraph}</p>`).join('')}
      <p>Best Regards,<br />Oklut Technologies Recruitment Team</p>
    </div>
  `

  return { text, html }
}

async function sendConfirmation(request: ConfirmationRequest): Promise<Response> {
  if (!RESEND_API_KEY) {
    console.error(
      'send-application-confirmation: RESEND_API_KEY is not configured. Run: supabase secrets set RESEND_API_KEY=...',
    )
    return new Response(
      JSON.stringify({ error: 'Email provider is not configured' }),
      { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  const { text, html } = renderEmail(request.name, request.jobTitle)
  const payload = {
    from: EMAIL_FROM,
    to: [request.to],
    subject: EMAIL_SUBJECT,
    text,
    html,
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const detail = await response.text()
    console.error(
      `send-application-confirmation: Resend responded ${response.status}: ${detail}`,
    )
    return new Response(
      JSON.stringify({ error: 'Email provider rejected the request' }),
      { status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
    )
  }

  console.log(`send-application-confirmation: email sent to ${request.to}`)
  return new Response(
    JSON.stringify({ ok: true }),
    { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } },
  )
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Missing authorization' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  // Verify the caller is a signed-in user (prevents open-relay abuse).
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    console.error('send-application-confirmation: unauthenticated call rejected')
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  let body: ConfirmationRequest
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  const { to, name, jobTitle } = body
  if (!to || !name || !jobTitle) {
    return new Response(JSON.stringify({ error: 'to, name and jobTitle are required' }), {
      status: 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    })
  }

  return sendConfirmation({ to, name, jobTitle })
})
