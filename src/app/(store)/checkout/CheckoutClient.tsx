'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Lock, CreditCard, Truck, ShieldCheck, ChevronRight, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCartStore, useCartComputed } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'UAE' },
]

export function CheckoutClient() {
  const router = useRouter()
  const { items, coupon, clearCart } = useCartStore()
  const { subtotal, discount, shipping, tax, total } = useCartComputed()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })

  useEffect(() => { setMounted(true) }, [])

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!items.length) { toast.error('Your cart is empty'); return }

    const required = ['email', 'firstName', 'lastName', 'address', 'city', 'state', 'zip']
    for (const f of required) {
      if (!form[f as keyof typeof form].trim()) {
        toast.error('Please fill in all required fields')
        return
      }
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            variant: i.variant,
            image: i.image,
          })),
          shippingAddress: {
            name: `${form.firstName} ${form.lastName}`,
            email: form.email,
            address: form.apartment ? `${form.address}, ${form.apartment}` : form.address,
            city: form.city,
            state: form.state,
            zip: form.zip,
            country: form.country,
          },
          couponCode: coupon?.code,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error ?? 'Checkout failed'); return }
      clearCart()
      toast.success('Order placed successfully!')
      router.push(`/checkout/success${data.orderId ? `?orderId=${data.orderId}` : ''}`)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  if (!items.length) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-muted mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">Add products before proceeding to checkout</p>
        <Button asChild size="lg"><Link href="/shop">Browse Products</Link></Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12">
        {/* ── Left: Form ── */}
        <div className="space-y-10">
          {/* Step breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="font-semibold text-foreground">Checkout</span>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Confirmation</span>
          </div>

          {/* Contact */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-3">Contact Information</h2>
            <div>
              <Label htmlFor="email">Email address <span className="text-red-500">*</span></Label>
              <Input id="email" type="email" required placeholder="you@example.com"
                value={form.email} onChange={(e) => update('email', e.target.value)} className="mt-1.5" />
            </div>
          </motion.section>

          {/* Shipping */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-3">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name <span className="text-red-500">*</span></Label>
                <Input id="firstName" required placeholder="John"
                  value={form.firstName} onChange={(e) => update('firstName', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="lastName">Last name <span className="text-red-500">*</span></Label>
                <Input id="lastName" required placeholder="Doe"
                  value={form.lastName} onChange={(e) => update('lastName', e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Street address <span className="text-red-500">*</span></Label>
              <Input id="address" required placeholder="123 Main Street"
                value={form.address} onChange={(e) => update('address', e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="apartment">Apartment, suite, etc. <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input id="apartment" placeholder="Apt 4B"
                value={form.apartment} onChange={(e) => update('apartment', e.target.value)} className="mt-1.5" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input id="city" required placeholder="New York"
                  value={form.city} onChange={(e) => update('city', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="state">State / Province <span className="text-red-500">*</span></Label>
                <Input id="state" required placeholder="NY"
                  value={form.state} onChange={(e) => update('state', e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="zip">ZIP / Postal code <span className="text-red-500">*</span></Label>
                <Input id="zip" required placeholder="10001"
                  value={form.zip} onChange={(e) => update('zip', e.target.value)} className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <select id="country" value={form.country} onChange={(e) => update('country', e.target.value)}
                className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
          </motion.section>

          {/* Payment */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-lg font-semibold">Payment</h2>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="h-3.5 w-3.5" />SSL encrypted
              </div>
            </div>
            <div className="rounded-xl border bg-muted/20 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <CreditCard className="h-4 w-4" />
                  Credit / Debit Card
                </div>
                <div className="flex items-center gap-1.5">
                  {['VISA', 'MC', 'AMEX', 'UPI'].map((b) => (
                    <span key={b} className="text-[10px] font-bold bg-white border rounded px-1.5 py-0.5 text-gray-600">{b}</span>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Card number</Label>
                <div className="relative mt-1.5">
                  <Input placeholder="4242 4242 4242 4242" className="font-mono pr-10" readOnly
                    onClick={() => toast.info('Demo mode — enter any value')} />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Expiry date</Label>
                  <Input placeholder="MM / YY" className="mt-1.5" readOnly />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Security code (CVC)</Label>
                  <Input placeholder="123" className="mt-1.5" readOnly />
                </div>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2.5">
                <span className="text-base leading-none mt-0.5">🚧</span>
                <p><strong>Demo mode</strong> — no real payment is processed. Fill the form and click <strong>Place Order</strong> to complete.</p>
              </div>
            </div>
          </motion.section>

          {/* Mobile submit */}
          <div className="lg:hidden">
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading
                ? <><span className="animate-spin mr-2">⟳</span>Processing...</>
                : <><Lock className="h-4 w-4 mr-2" />Place Order · {formatPrice(total)}</>
              }
            </Button>
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        <div className="lg:sticky lg:top-24 h-fit">
          <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="rounded-2xl border bg-card overflow-hidden">
            <div className="bg-muted/40 px-6 py-4 border-b">
              <h2 className="font-semibold text-base">Order Summary</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{items.reduce((s, i) => s + i.quantity, 0)} item{items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Items */}
              <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-start">
                    <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-muted border">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-gray-700 text-white text-[10px] font-bold flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight line-clamp-2">{item.name}</p>
                      {item.variant && <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>}
                    </div>
                    <span className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Totals */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-700">
                    <span>Discount {coupon?.code && <span className="font-mono text-xs bg-green-100 px-1 rounded">{coupon.code}</span>}</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  {shipping === 0
                    ? <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100">Free</Badge>
                    : <span>{formatPrice(shipping)}</span>
                  }
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <span className="font-bold text-base">Total</span>
                <span className="font-bold text-xl">{formatPrice(total)}</span>
              </div>

              {/* Submit — desktop */}
              <Button type="submit" size="lg" className="w-full hidden lg:flex" disabled={loading}>
                {loading
                  ? <><span className="animate-spin mr-2 text-base">⟳</span>Processing...</>
                  : <><Lock className="h-4 w-4 mr-1.5" />Place Order · {formatPrice(total)}</>
                }
              </Button>

              {/* Trust row */}
              <div className="grid grid-cols-3 gap-3 pt-1">
                {[
                  { Icon: Lock, label: 'Secure Pay' },
                  { Icon: Truck, label: 'Fast Delivery' },
                  { Icon: ShieldCheck, label: '30-day Return' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1 text-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground leading-tight">{label}</span>
                  </div>
                ))}
              </div>

              <p className="text-center text-[11px] text-muted-foreground">
                By placing your order you agree to our{' '}
                <span className="underline cursor-pointer">Terms of Service</span> and{' '}
                <span className="underline cursor-pointer">Privacy Policy</span>.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </form>
  )
}
