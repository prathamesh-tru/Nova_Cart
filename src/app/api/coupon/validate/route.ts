import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

export async function POST(req: NextRequest) {
  try {
    const { code, cartTotal } = await req.json()
    if (!code) return NextResponse.json({ valid: false, error: 'Code is required' })

    const payload = await getPayload()
    const result = await payload.find({
      collection: 'coupons',
      where: { and: [{ code: { equals: code.toUpperCase() } }, { isActive: { equals: true } }] },
      limit: 1,
    })

    const coupon = result.docs[0] as any
    if (!coupon) return NextResponse.json({ valid: false, error: 'Invalid coupon code' })

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: 'This coupon has expired' })
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ valid: false, error: 'This coupon has reached its usage limit' })
    }
    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return NextResponse.json({ valid: false, error: `Minimum order of $${coupon.minOrderValue} required` })
    }

    let discount = 0
    if (coupon.type === 'percentage') discount = (cartTotal * coupon.value) / 100
    else if (coupon.type === 'fixed') discount = Math.min(coupon.value, cartTotal)

    return NextResponse.json({ valid: true, discount, type: coupon.type, code: coupon.code, message: `${coupon.type === 'percentage' ? coupon.value + '% off' : '$' + coupon.value + ' off'} applied!` })
  } catch {
    return NextResponse.json({ valid: false, error: 'Could not validate coupon' })
  }
}
