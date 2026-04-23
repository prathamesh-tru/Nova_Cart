import { SuccessContent } from './SuccessContent'
import { getPayload } from '@/lib/payload'

async function getSuccessData() {
  try {
    const payload = await getPayload()
    const data = await payload.findGlobal({ slug: 'order-success', depth: 0 }) as any
    return {
      heading: data?.heading ?? 'Order Confirmed!',
      subheading: data?.subheading ?? 'Thank you for your purchase.',
      description: data?.description ?? "You'll receive a confirmation email shortly with your order details and tracking information.",
      stepsHeading: data?.stepsHeading ?? 'What happens next?',
      steps: (data?.steps ?? []).map((s: any) => s.text).filter(Boolean) as string[],
    }
  } catch {
    return {
      heading: 'Order Confirmed!',
      subheading: 'Thank you for your purchase.',
      description: "You'll receive a confirmation email shortly with your order details and tracking information.",
      stepsHeading: 'What happens next?',
      steps: [
        'Order confirmation sent to your email',
        'Your items will be prepared for shipping',
        "You'll get tracking info once shipped (2-5 business days)",
      ],
    }
  }
}

export default async function OrderSuccessPage() {
  const data = await getSuccessData()
  return <SuccessContent {...data} />
}
