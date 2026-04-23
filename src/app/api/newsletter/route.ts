import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const body = req.headers.get('content-type')?.includes('json')
      ? await req.json()
      : Object.fromEntries(await req.formData())

    const { email } = schema.parse(body)
    console.log('Newsletter signup:', email)
    // In production: call Resend contacts API or save to DB
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
}
