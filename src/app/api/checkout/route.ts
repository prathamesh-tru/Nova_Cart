import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { items, shippingAddress, couponCode } = body

    if (!items?.length) return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })

    const payload = await getPayload()

    // Validate stock
    for (const item of items) {
      const product = await payload.findByID({ collection: 'products', id: item.productId }).catch(() => null)
      if (!product) return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 })
      if (product.inventory?.trackStock && (product.inventory?.stock ?? 0) < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${item.name}` }, { status: 400 })
      }
    }

    const subtotal = items.reduce((sum: number, i: any) => sum + i.price * i.quantity, 0)

    // Coupon
    let discount = 0
    if (couponCode) {
      const couponResult = await payload.find({
        collection: 'coupons',
        where: { and: [{ code: { equals: couponCode.toUpperCase() } }, { isActive: { equals: true } }] },
        limit: 1,
      })
      const coupon = couponResult.docs[0] as any
      if (coupon) {
        if (coupon.type === 'percentage') discount = (subtotal * coupon.value) / 100
        else if (coupon.type === 'fixed') discount = Math.min(coupon.value, subtotal)
      }
    }

    const shipping = subtotal - discount >= 50 ? 0 : 5.99
    const taxable = subtotal - discount
    const tax = taxable * 0.1
    const total = taxable + shipping + tax

    // Create Stripe PaymentIntent
    let clientSecret = null
    try {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),
        currency: 'usd',
        metadata: { cartSubtotal: subtotal.toString(), discount: discount.toString() },
      })
      clientSecret = intent.client_secret
    } catch {
      // Stripe not configured — demo mode
    }

    // Create order
    const tokenCookie = req.cookies.get('payload-token')
    let userId: string | undefined
    if (tokenCookie) {
      try {
        const me = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`, {
          headers: { Cookie: `payload-token=${tokenCookie.value}` },
        }).then((r) => r.json())
        userId = me?.user?.id
      } catch {}
    }

    const order = userId
      ? await payload.create({
          collection: 'orders',
          data: {
            user: userId,
            status: 'pending',
            items: items.map((i: any) => ({
              product: i.productId,
              variantLabel: i.variant,
              quantity: i.quantity,
              unitPrice: i.price,
              totalPrice: i.price * i.quantity,
              snapshot: { name: i.name, image: i.image },
            })),
            subtotal,
            discount,
            tax,
            shippingCost: shipping,
            total,
            shippingAddress,
            payment: { provider: 'stripe', status: 'pending' },
          } as any,
        })
      : null

    return NextResponse.json({
      clientSecret,
      orderId: order?.id,
      breakdown: { subtotal, discount, shipping, tax, total },
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
