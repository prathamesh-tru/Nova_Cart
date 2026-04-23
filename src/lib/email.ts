import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY ?? '')
const FROM = process.env.FROM_EMAIL ?? 'noreply@novacart.demo'

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: `NovaCart <${FROM}>`,
      to,
      subject,
      html,
    })
    if (error) console.error('Resend error:', error)
    return { success: !error, data }
  } catch (err) {
    console.error('Email send failed:', err)
    return { success: false, data: null }
  }
}

export function orderConfirmationHtml(params: {
  orderNumber: string
  customerName: string
  items: { name: string; qty: number; price: number }[]
  total: number
}) {
  const rows = params.items
    .map(
      (i) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} × ${i.qty}</td>
         <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">$${(i.price * i.qty).toFixed(2)}</td></tr>`,
    )
    .join('')
  return `
  <div style="font-family:Inter,sans-serif;max-width:580px;margin:0 auto;padding:40px 24px;background:#fff">
    <h1 style="font-size:28px;color:#1e3a5f;margin-bottom:8px">Order Confirmed!</h1>
    <p style="color:#666">Hi ${params.customerName}, your order <strong>${params.orderNumber}</strong> has been confirmed.</p>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">${rows}</table>
    <div style="text-align:right;font-size:18px;font-weight:700;color:#1e3a5f">Total: $${params.total.toFixed(2)}</div>
    <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/account/orders" style="display:inline-block;margin-top:24px;padding:12px 32px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">View Order</a>
  </div>`
}

export function welcomeEmailHtml(firstName: string) {
  return `
  <div style="font-family:Inter,sans-serif;max-width:580px;margin:0 auto;padding:40px 24px;background:#fff">
    <h1 style="font-size:28px;color:#1e3a5f">Welcome to NovaCart, ${firstName}! 🎉</h1>
    <p style="color:#666;font-size:16px;line-height:1.6">Your account is ready. Start exploring thousands of curated products.</p>
    <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/shop" style="display:inline-block;margin-top:24px;padding:12px 32px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Shop Now</a>
  </div>`
}

export function shippingUpdateHtml(params: {
  orderNumber: string
  customerName: string
  carrier: string
  trackingNumber: string
}) {
  return `
  <div style="font-family:Inter,sans-serif;max-width:580px;margin:0 auto;padding:40px 24px;background:#fff">
    <h1 style="font-size:28px;color:#1e3a5f">Your Order is On Its Way! 📦</h1>
    <p style="color:#666">Hi ${params.customerName}, order <strong>${params.orderNumber}</strong> has shipped.</p>
    <div style="background:#f0f5fa;border-radius:8px;padding:16px;margin:24px 0">
      <p style="margin:0;color:#1e3a5f"><strong>Carrier:</strong> ${params.carrier}</p>
      <p style="margin:8px 0 0;color:#1e3a5f"><strong>Tracking:</strong> ${params.trackingNumber}</p>
    </div>
    <a href="${process.env.NEXT_PUBLIC_SERVER_URL}/account/orders" style="display:inline-block;padding:12px 32px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Track Order</a>
  </div>`
}

export function passwordResetHtml(firstName: string, resetUrl: string) {
  return `
  <div style="font-family:Inter,sans-serif;max-width:580px;margin:0 auto;padding:40px 24px;background:#fff">
    <h1 style="font-size:28px;color:#1e3a5f">Reset Your Password</h1>
    <p style="color:#666">Hi ${firstName}, click below to reset your password. Link expires in 1 hour.</p>
    <a href="${resetUrl}" style="display:inline-block;margin-top:24px;padding:12px 32px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none;font-weight:600">Reset Password</a>
    <p style="color:#999;font-size:12px;margin-top:24px">If you didn't request this, please ignore this email.</p>
  </div>`
}
