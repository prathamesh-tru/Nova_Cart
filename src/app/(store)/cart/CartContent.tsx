'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, ArrowRight, Trash2, CreditCard, Lock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { QuantityStepper } from '@/components/shared/QuantityStepper'
import { ProductCard } from '@/components/shop/ProductCard'
import { useCartStore, useCartComputed } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'

interface UpsellProduct {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  stock: number
  rating: number
  reviewCount: number
}

interface CartContentProps {
  upsellProducts: UpsellProduct[]
  upsellHeading: string
}

export function CartContent({ upsellProducts, upsellHeading }: CartContentProps) {
  const { items, coupon, removeItem, updateQty, applyCoupon, removeCoupon } = useCartStore()
  const { itemCount, subtotal, discount, shipping, tax, total } = useCartComputed()
  const [couponCode, setCouponCode] = useState('')
  const [validating, setValidating] = useState(false)

  async function handleCoupon() {
    if (!couponCode.trim()) return
    setValidating(true)
    try {
      const res = await fetch('/api/coupon/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, cartTotal: subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        applyCoupon({ code: couponCode.toUpperCase(), type: data.type, value: data.discount })
        toast.success(`Coupon applied! You saved ${formatPrice(data.discount)}`)
      } else {
        toast.error(data.error ?? 'Invalid coupon code')
      }
    } catch {
      toast.error('Could not validate coupon')
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-sans font-bold mb-8">
        Shopping Cart {itemCount > 0 && <span className="text-muted-foreground text-xl font-normal ml-2">({itemCount} item{itemCount !== 1 ? 's' : ''})</span>}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-muted mb-6">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Add some amazing products to get started</p>
          <Button asChild size="lg"><Link href="/shop">Browse Products <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-1">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}>
                  <div className="flex gap-5 py-6 border-b">
                    <Link href={`/shop/${item.slug}`} className="relative h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/shop/${item.slug}`} className="font-medium leading-tight hover:underline transition-colors">{item.name}</Link>
                        <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors shrink-0 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      {item.variant && <p className="text-sm text-muted-foreground mt-0.5">{item.variant}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <QuantityStepper value={item.quantity} max={item.stock} onChange={(q) => updateQty(item.id, q)} size="sm" />
                        <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Coupon */}
            <div className="pt-6">
              <p className="text-sm font-medium mb-2">Have a coupon?</p>
              <div className="flex gap-2">
                <Input placeholder="Enter coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleCoupon()} className="max-w-xs" disabled={!!coupon} />
                {coupon ? (
                  <Button variant="outline" onClick={() => { removeCoupon(); setCouponCode('') }}>Remove</Button>
                ) : (
                  <Button onClick={handleCoupon} disabled={validating || !couponCode.trim()}>Apply</Button>
                )}
              </div>
              {coupon && <p className="text-xs text-green-700 mt-1.5 font-medium">✓ Coupon "{coupon.code}" applied</p>}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border bg-card p-6 space-y-4">
              <h2 className="font-semibold text-lg">Order Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                {discount > 0 && <div className="flex justify-between text-green-700"><span>Discount</span><span>-{formatPrice(discount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? <Badge variant="success" className="text-xs">Free</Badge> : formatPrice(shipping)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Tax (10%)</span><span>{formatPrice(tax)}</span></div>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span><span>{formatPrice(total)}</span>
              </div>
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout"><Lock className="h-4 w-4" />Secure Checkout</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/shop">Continue Shopping</Link>
              </Button>

              <div className="flex items-center justify-center gap-2 pt-2 opacity-60">
                {['Visa', 'MC', 'PayPal', 'Apple Pay'].map((p) => (
                  <span key={p} className="text-xs font-medium bg-muted px-2 py-1 rounded border">{p}</span>
                ))}
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <CreditCard className="h-3.5 w-3.5" /> SSL encrypted, PCI compliant
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upsell */}
      {upsellProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-sans font-bold mb-6">{upsellHeading}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
            {upsellProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </div>
  )
}
