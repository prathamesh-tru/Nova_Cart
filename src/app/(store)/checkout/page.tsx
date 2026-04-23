import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { CheckoutClient } from './CheckoutClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Checkout' }

export default function CheckoutPage() {
  return (
    <div className="container py-8 max-w-6xl">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} className="mb-8" />
      <h1 className="text-3xl font-sans font-bold mb-8">Checkout</h1>
      <CheckoutClient />
    </div>
  )
}
