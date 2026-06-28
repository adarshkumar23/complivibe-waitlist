import { Resend } from 'resend'
import type { RiskScore } from './types'

const RISK_COLORS: Record<RiskScore, string> = {
  HIGH: '#EF4444',
  MEDIUM: '#F59E0B',
  LOW: '#10B981',
}

const RISK_PILL: Record<RiskScore, { bg: string; border: string; color: string }> = {
  HIGH: { bg: '#FEF2F2', border: '#EF4444', color: '#DC2626' },
  MEDIUM: { bg: '#FFFBEB', border: '#F59E0B', color: '#D97706' },
  LOW: { bg: '#F0FDF4', border: '#10B981', color: '#059669' },
}

export interface RiskEmailData {
  name: string
  email: string
  riskScore: RiskScore
  gaps: string[]
  waitlistId?: string
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const BENEFITS = [
  {
    icon: '🎁',
    iconBg: '#FEF3C7',
    title: '3 Months Free',
    desc: 'Full platform, no credit card, from day one.',
  },
  {
    icon: '🔍',
    iconBg: '#EFF6FF',
    title: 'Free AI Compliance Audit',
    desc: '$2,000 value. Gap report in 48 hours.',
  },
  {
    icon: '🔒',
    iconBg: '#F3E8FF',
    title: 'Founder Pricing Forever',
    desc: '$50/mo Starter · $149/mo Growth · $299/mo Enterprise. Locked. Never increases.',
  },
  {
    icon: '📞',
    iconBg: '#F0FDF4',
    title: 'Direct Founder Access',
    desc: 'Onboard with Adarsh directly. Not a rep.',
  },
]

const LAUNCH_STEPS = [
  "You'll receive a personal onboarding email from Adarsh",
  'It will contain your unique login link for CompliVibe',
  'Your account will be pre-configured with your company details',
  'Your 3-month free trial starts automatically',
  'A call will be scheduled for your free AI compliance audit',
]

export function buildRiskEmailHtml(data: RiskEmailData): string {
  const dot = RISK_COLORS[data.riskScore]
  const pill = RISK_PILL[data.riskScore]
  const auditLink = `mailto:adarsh@complivibe.in?subject=${encodeURIComponent(
    `Free AI Audit${data.waitlistId ? ` - ${data.waitlistId}` : ''}`
  )}`

  const gapsHtml = data.gaps
    .map(
      (g) => `
      <tr><td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:top;padding-top:6px;">
            <span style="display:inline-block;width:6px;height:6px;border-radius:2px;background:${dot};"></span>
          </td>
          <td style="padding-left:12px;color:#4B5563;font-size:14px;line-height:1.6;">${escapeHtml(
            g
          )}</td>
        </tr></table>
      </td></tr>`
    )
    .join('')

  const benefitsHtml = BENEFITS.map(
    (b) => `
      <tr><td style="padding-bottom:8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #F3F4F6;border-radius:12px;">
          <tr><td style="padding:16px 20px;">
            <table role="presentation" cellpadding="0" cellspacing="0"><tr>
              <td style="vertical-align:middle;">
                <span style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;background:${b.iconBg};border-radius:10px;font-size:18px;">${b.icon}</span>
              </td>
              <td style="padding-left:16px;vertical-align:middle;">
                <p style="margin:0;color:#0F0F1A;font-size:15px;font-weight:600;">${b.title}</p>
                <p style="margin:2px 0 0;color:#6B7280;font-size:13px;line-height:1.5;">${b.desc}</p>
              </td>
            </tr></table>
          </td></tr>
        </table>
      </td></tr>`
  ).join('')

  const stepsHtml = LAUNCH_STEPS.map(
    (s, i) => `
      <tr><td style="padding:8px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="vertical-align:top;">
            <span style="display:inline-block;width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;background:linear-gradient(135deg,#5B5FE3,#6EE7B7);color:#ffffff;font-size:11px;font-weight:700;">${
              i + 1
            }</span>
          </td>
          <td style="padding-left:12px;color:#4B5563;font-size:14px;line-height:1.5;vertical-align:middle;">${escapeHtml(
            s
          )}</td>
        </tr></table>
      </td></tr>`
  ).join('')

  const waitlistPillHtml = data.waitlistId
    ? `<tr><td align="center" style="padding:20px 40px 0;">
        <span style="display:inline-block;padding:8px 20px;border-radius:100px;background:linear-gradient(135deg,rgba(91,95,227,0.08),rgba(110,231,183,0.08));border:1px solid rgba(91,95,227,0.2);font-family:'SF Mono',Menlo,Consolas,monospace;font-size:13px;color:#5B5FE3;">Waitlist ID: ${escapeHtml(
          data.waitlistId
        )}</span>
      </td></tr>`
    : ''

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F8F7FF;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F8F7FF;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border-radius:20px;overflow:hidden;border:1px solid #E5E7EB;">

        <!-- Top gradient bar -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#5B5FE3,#6EE7B7);font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- Header -->
        <tr><td align="center" style="padding:40px 40px 32px;">
          <p style="margin:0 0 24px;">
            <span style="display:inline-block;width:36px;height:36px;line-height:36px;text-align:center;background:linear-gradient(135deg,#5B5FE3,#6EE7B7);border-radius:10px;color:#ffffff;font-weight:800;font-size:14px;vertical-align:middle;">CV</span>
            <span style="font-size:20px;font-weight:700;letter-spacing:-0.3px;margin-left:10px;vertical-align:middle;"><span style="color:#0F0F1A;">Compli</span><span style="color:#5B5FE3;">Vibe</span></span>
          </p>
          <p style="margin:0 0 12px;color:#5B5FE3;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;">Early Access Confirmed</p>
          <h1 style="margin:0 0 10px;color:#0F0F1A;font-size:32px;font-weight:800;letter-spacing:-0.02em;line-height:1.15;">You're in, ${escapeHtml(
            data.name
          )}.</h1>
          <p style="margin:0;color:#6B7280;font-size:16px;line-height:1.6;">CompliVibe launches in 15 days. You're among the first.</p>
        </td></tr>

        <!-- Waitlist ID pill -->
        ${waitlistPillHtml}

        <!-- Risk score card -->
        <tr><td style="padding:24px 40px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:1px solid #E5E7EB;border-radius:16px;overflow:hidden;">
            <tr><td style="height:2px;background:linear-gradient(90deg,#5B5FE3,#6EE7B7);font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:32px;">
              <p style="margin:0 0 16px;color:#9CA3AF;font-size:10px;letter-spacing:0.2em;text-align:center;">YOUR AI COMPLIANCE RISK SCORE</p>
              <p style="margin:0 0 24px;text-align:center;">
                <span style="display:inline-block;padding:12px 32px;border-radius:100px;background:${
                  pill.bg
                };border:1.5px solid ${pill.border};color:${
    pill.color
  };font-size:28px;font-weight:800;letter-spacing:-0.02em;">${data.riskScore} RISK</span>
              </p>
              <p style="margin:0 0 12px;color:#374151;font-size:13px;font-weight:600;">3 gaps identified in your AI governance:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${gapsHtml}</table>
            </td></tr>
          </table>
        </td></tr>

        <!-- What you've unlocked -->
        <tr><td style="padding:8px 40px 24px;">
          <p style="margin:0 0 16px;color:#5B5FE3;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;">What You've Unlocked</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${benefitsHtml}</table>
        </td></tr>

        <!-- Launch day promise -->
        <tr><td style="padding:0 40px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,rgba(91,95,227,0.04),rgba(110,231,183,0.04));border:1px solid rgba(91,95,227,0.12);border-radius:16px;">
            <tr><td style="padding:28px 32px;">
              <p style="margin:0 0 12px;font-size:28px;line-height:1;">🚀</p>
              <p style="margin:0 0 12px;color:#0F0F1A;font-size:16px;font-weight:700;">On launch day, here's what happens:</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${stepsHtml}</table>
              <p style="margin:20px 0 0;text-align:center;">
                <a href="${auditLink}" style="display:inline-block;padding:14px 32px;border-radius:100px;background:linear-gradient(135deg,#5B5FE3,#6EE7B7);color:#ffffff;font-weight:700;font-size:15px;text-decoration:none;box-shadow:0 4px 16px rgba(91,95,227,0.25);">Book a Free 15-min AI Audit →</a>
              </p>
            </td></tr>
          </table>
        </td></tr>

        <!-- Personal note -->
        <tr><td style="padding:32px 40px;border-top:1px solid #F3F4F6;">
          <p style="margin:0 0 12px;color:#9CA3AF;font-size:12px;font-style:italic;">— A note from Adarsh</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
            <tr>
              <td width="3" style="background:linear-gradient(180deg,#5B5FE3,#6EE7B7);">&nbsp;</td>
              <td style="background:#F9FAFB;border-radius:0 12px 12px 0;padding:20px 24px;">
                <p style="margin:0;color:#374151;font-size:15px;font-style:italic;line-height:1.8;">
                  "I've been in your position — shipping AI products at enterprise companies with zero governance visibility. I built CompliVibe because that problem deserves a real solution, not another consultant's checklist.<br><br>
                  You're early. That matters to us. We'll make sure your first 90 days prove the value."
                </p>
              </td>
            </tr>
          </table>
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:middle;">
              <span style="display:inline-block;width:44px;height:44px;line-height:44px;text-align:center;border-radius:50%;background:linear-gradient(135deg,#5B5FE3,#6EE7B7);color:#ffffff;font-weight:700;font-size:14px;">AS</span>
            </td>
            <td style="padding-left:12px;vertical-align:middle;">
              <p style="margin:0;color:#0F0F1A;font-weight:700;font-size:15px;">Adarsh Sharma</p>
              <p style="margin:0;color:#6B7280;font-size:13px;">Founder &amp; CEO, CompliVibe</p>
              <p style="margin:2px 0 0;color:#5B5FE3;font-size:12px;">Reply directly to this email — I read every one.</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- Footer -->
        <tr><td align="center" style="padding:24px 40px;background:#F9FAFB;border-top:1px solid #E5E7EB;">
          <p style="margin:0 0 4px;color:#9CA3AF;font-size:13px;">CompliVibe · AI Trust Infrastructure</p>
          <p style="margin:0;color:#5B5FE3;font-size:12px;">complivibe.in · dataroom.complivibe.in</p>
          <p style="margin:8px 0 0;color:#D1D5DB;font-size:11px;">© 2026 CompliVibe. All rights reserved.</p>
          <p style="margin:4px 0 0;color:#D1D5DB;font-size:11px;">You're receiving this because you joined our waitlist.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

/**
 * Send the personalized risk-score confirmation email.
 * Returns { sent: boolean } — never throws, so a mail failure won't
 * block a successful signup.
 */
export async function sendRiskScoreEmail(
  data: RiskEmailData
): Promise<{ sent: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return { sent: false, error: 'RESEND_API_KEY not configured' }

  try {
    const resend = new Resend(apiKey)
    const emailResult = await resend.emails.send({
      from: 'CompliVibe <hello@complivibe.in>',
      to: data.email,
      subject: `You're in. Your AI compliance risk is ${data.riskScore} — CompliVibe Early Access`,
      html: buildRiskEmailHtml(data),
    })
    console.log('Resend result:', emailResult)
    if (emailResult.error) return { sent: false, error: emailResult.error.message }
    return { sent: true }
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : 'Unknown email error' }
  }
}
