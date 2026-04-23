import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/validators'
import { sendEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = contactSchema.parse(body)

    await sendEmail({
      to: process.env.SUPPORT_EMAIL ?? process.env.FROM_EMAIL ?? 'support@novacart.demo',
      subject: `Contact Form: ${data.subject}`,
      html: `<p><strong>From:</strong> ${data.name} &lt;${data.email}&gt;</p><p><strong>Subject:</strong> ${data.subject}</p><p>${data.message}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 400 })
  }
}
