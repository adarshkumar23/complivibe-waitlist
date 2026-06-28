import { Resend } from 'resend'
import type { WaitlistSignup } from './types'

const LOGIN_URL = 'https://app.complivibe.in/login'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Readable temporary password, e.g. "CV-7f3a9c2b". */
export function generateTempPassword(): string {
  const rand = Math.random().toString(36).slice(2, 10)
  return `CV-${rand}`
}

const ACTIVATED = [
  '🎁 3 months free — already applied to your account',
  '🔒 Founder pricing locked forever',
  '🔍 Free AI compliance audit ($2,000 value)',
  '📞 Direct founder access for onboarding',
]

export function buildLaunchEmailHtml(signup: WaitlistSignup, tempPassword: string): string {
  const activatedHtml = ACTIVATED.map(
    (a) => `
      <tr><td style="padding:6px 0;color:#9CA3AF;font-size:14px;line-height:1.7;">${escapeHtml(
        a
      )}</td></tr>`
  ).join('')

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0A0A14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A14;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#0A0A14;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

        <!-- Logo -->
        <tr><td align="center" style="padding:32px 40px 8px;">
          <span style="display:inline-block;width:34px;height:34px;line-height:34px;text-align:center;background:linear-gradient(135deg,#5B5FE3,#6EE7B7);border-radius:9px;color:#ffffff;font-weight:800;font-size:14px;vertical-align:middle;">CV</span>
          <span style="color:#ffffff;font-weight:800;font-size:20px;letter-spacing:-0.5px;margin-left:10px;vertical-align:middle;">CompliVibe</span>
        </td></tr>

        <!-- Hero -->
        <tr><td style="padding:24px 40px 28px;">
          <p style="margin:0 0 12px;color:#6B7280;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">It's Launch Day</p>
          <h1 style="margin:0 0 10px;color:#ffffff;font-size:34px;font-weight:700;letter-spacing:-1px;line-height:1.1;">The wait is over.</h1>
          <p style="margin:0;color:#9CA3AF;font-size:16px;line-height:1.6;">Your CompliVibe account is ready, ${escapeHtml(
            signup.name
          )}.</p>
        </td></tr>

        <!-- Credentials -->
        <tr><td style="padding:0 40px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F0F1A;border:1px solid rgba(255,255,255,0.08);border-radius:16px;">
            <tr><td style="padding:28px 32px;">
              <p style="margin:0 0 14px;color:#6B7280;font-size:12px;letter-spacing:1px;">YOUR LOGIN</p>
              <p style="margin:0 0 6px;color:#9CA3AF;font-size:13px;">Username</p>
              <p style="margin:0 0 16px;color:#ffffff;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:15px;">${escapeHtml(
                signup.email
              )}</p>
              <p style="margin:0 0 6px;color:#9CA3AF;font-size:13px;">Temporary password</p>
              <p style="margin:0;color:#6EE7B7;font-family:'SF Mono',Menlo,Consolas,monospace;font-size:18px;font-weight:700;">${escapeHtml(
                tempPassword
              )}</p>
              <p style="margin:14px 0 0;color:#6B7280;font-size:12px;">You'll be asked to set a new password on first login.</p>
            </td></tr>
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td align="center" style="padding:28px 40px 8px;">
          <a href="${LOGIN_URL}" style="display:inline-block;padding:16px 44px;border-radius:100px;background:linear-gradient(135deg,#5B5FE3,#6EE7B7);color:#ffffff;font-weight:700;font-size:16px;text-decoration:none;">Log in to your account →</a>
        </td></tr>

        <!-- Activated benefits -->
        <tr><td style="padding:32px 40px;">
          <p style="margin:0 0 14px;color:#6B7280;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;">Your Waitlist Benefits — Activated</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${activatedHtml}</table>
          ${
            signup.waitlist_id
              ? `<p style="margin:16px 0 0;color:#9CA3AF;font-size:13px;">Waitlist ID: <span style="font-family:'SF Mono',Menlo,Consolas,monospace;color:#6EE7B7;font-weight:700;">${escapeHtml(
                  signup.waitlist_id
                )}</span></p>`
              : ''
          }
        </td></tr>

        <!-- Personal note -->
        <tr><td style="padding:0 40px 32px;">
          <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#A5A8F0;">— A note from Adarsh</p>
          <p style="margin:0 0 18px;color:#E5E7EB;font-size:16px;font-style:italic;line-height:1.8;">
            "Welcome aboard. I'll personally check in after your first week to make sure CompliVibe is pulling its weight. Reply to this email anytime."
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;">
              <span style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;border-radius:50%;background:linear-gradient(135deg,#5B5FE3,#6EE7B7);color:#ffffff;font-weight:800;font-size:14px;">AS</span>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="margin:0;color:#ffffff;font-weight:600;font-size:15px;">Adarsh Sharma</p>
              <p style="margin:0;color:#9CA3AF;font-size:14px;">Founder &amp; CEO, CompliVibe</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding:28px 40px;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0 0 4px;color:#6B7280;font-size:13px;">CompliVibe · AI Trust Infrastructure</p>
          <p style="margin:0 0 4px;color:#4B5563;font-size:12px;">complivibe.in · dataroom.complivibe.in</p>
          <p style="margin:0;color:#4B5563;font-size:12px;">© 2026 CompliVibe. All rights reserved.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/**
 * Send the launch-day "your account is ready" email.
 *
 * NOT wired into any route — call this manually or from a script when
 * CompliVibe goes live. If no tempPassword is provided, one is generated
 * and returned so the caller can persist/provision it.
 */
export async function sendLaunchEmail(
  signup: WaitlistSignup,
  tempPassword: string = generateTempPassword()
): Promise<{ sent: boolean; tempPassword: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { sent: false, tempPassword, error: 'RESEND_API_KEY not configured' }

  try {
    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: 'CompliVibe <hello@complivibe.in>',
      to: signup.email,
      subject: `CompliVibe is live. Your account is ready. ${signup.name}`,
      html: buildLaunchEmailHtml(signup, tempPassword),
    })
    if (error) return { sent: false, tempPassword, error: error.message }
    return { sent: true, tempPassword }
  } catch (err) {
    return {
      sent: false,
      tempPassword,
      error: err instanceof Error ? err.message : 'Unknown email error',
    }
  }
}
