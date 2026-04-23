'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Trash2, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { QuantityStepper } from '@/components/shared/QuantityStepper'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { useCartStore, useCartComputed } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, coupon } = useCartStore()
  const { itemCount, subtotal, discount, shipping, tax, total } = useCartComputed()

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent side="right" className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Cart
            {itemCount > 0 && (
              <span className="ml-auto text-sm font-normal text-muted-foreground">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <div className="rounded-full bg-muted p-6">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium mb-1">Your cart is empty</p>
                <p className="text-sm text-muted-foreground">Add items to get started</p>
              </div>
              <Button onClick={closeCart} asChild>
                <Link href="/shop">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="flex gap-4 py-4">
                    <div className="relative h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-muted">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="font-medium text-sm leading-tight line-clamp-2 hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                      {item.variant && <p className="text-xs text-muted-foreground mt-0.5">{item.variant}</p>}
                      <div className="flex items-center justify-between mt-2">
                        <QuantityStepper
                          value={item.quantity}
                          max={item.stock}
                          onChange={(q) => updateQty(item.id, q)}
                          size="sm"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3 bg-muted/30">
            {coupon && (
              <div className="flex justify-between text-sm">
                <span className="text-green-700 font-medium">Coupon: {coupon.code}</span>
                <span className="text-green-700">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (10%)</span><span>{formatPrice(tax)}</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-base">
              <span>Total</span><span>{formatPrice(total)}</span>
            </div>
            <Button asChild className="w-full" size="lg" onClick={closeCart}>
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
            <Button variant="outline" className="w-full" onClick={closeCart} asChild>
              <Link href="/cart">View Full Cart</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
