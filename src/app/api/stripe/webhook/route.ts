import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature') ?? ''
  const body = await req.text()

  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const payload = await getPayload()

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object
      const orders = await payload.find({ collection: 'orders', where: { 'payment.stripePaymentIntentId': { equals: pi.id } }, limit: 1 })
      const order = orders.docs[0] as any
      if (order) {
        await payload.update({ collection: 'orders', id: order.id, data: { status: 'confirmed', 'payment.status': 'paid', 'payment.paidAt': new Date().toISOString() } as any })
        // Decrement stock
        for (const item of order.items ?? []) {
          if (item.product?.id) {
            const prod = await payload.findByID({ collection: 'products', id: item.product.id }).catch(() => null)
            if (prod?.inventory?.stock) {
              await payload.update({ collection: 'products', id: item.product.id, data: { inventory: { ...prod.inventory, stock: Math.max(0, prod.inventory.stock - item.quantity) } } as any })
            }
          }
        }
      }
    }
    if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object
      const orders = await payload.find({ collection: 'orders', where: { 'payment.stripePaymentIntentId': { equals: pi.id } }, limit: 1 })
      const order = orders.docs[0] as any
      if (order) await payload.update({ collection: 'orders', id: order.id, data: { 'payment.status': 'failed' } as any })
    }
  } catch (err) {
    console.error('Webhook handling error:', err)
  }

  return NextResponse.json({ received: true })
}

export const config = { api: { bodyParser: false } }
