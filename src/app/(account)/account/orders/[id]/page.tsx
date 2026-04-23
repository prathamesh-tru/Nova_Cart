'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Package, MapPin, CreditCard, Truck, ArrowLeft, Copy, CheckCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatPrice } from '@/lib/utils'
import { PAYMENT_STATUS_LABELS } from '@/lib/constants'

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`/api/orders/${id}?depth=2`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { setOrder(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  function copyTracking() {
    if (!order?.shippingInfo?.trackingNumber) return
    navigator.clipboard.writeText(order.shippingInfo.trackingNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        <div className="h-64 rounded-2xl bg-muted animate-pulse" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Package className="h-14 w-14 mx-auto mb-3 opacity-20" />
        <p className="font-medium">Order not found</p>
        <Button asChild size="sm" variant="outline" className="mt-4">
          <Link href="/account/orders"><ArrowLeft className="h-4 w-4 mr-2" />Back to Orders</Link>
        </Button>
      </div>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled' || order.status === 'refunded'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/account/orders"><ArrowLeft className="h-4 w-4 mr-1" />Orders</Link>
        </Button>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <StatusBadge status={order.status} className="text-sm px-3 py-1" />
      </div>

      {/* Progress tracker */}
      {!isCancelled && (
        <div className="bg-card rounded-2xl border p-5">
          <h2 className="text-sm font-semibold mb-4">Order Progress</h2>
          <div className="flex items-center gap-0">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= currentStep
              const active = i === currentStep
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all text-xs font-bold ${
                      done ? 'border-black bg-black text-white' : 'border-border text-muted-foreground'
                    } ${active ? 'ring-2 ring-black/20' : ''}`}>
                      {done && i < currentStep ? '✓' : i + 1}
                    </div>
                    <span className={`text-[10px] capitalize text-center leading-tight ${done ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mb-5 mx-1 transition-all ${i < currentStep ? 'bg-black' : 'bg-border'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-card rounded-2xl border overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center gap-2">
          <Package className="h-4 w-4" />
          <h2 className="font-semibold text-sm">Items ({order.items?.length ?? 0})</h2>
        </div>
        <div className="divide-y">
          {(order.items ?? []).map((item: any, i: number) => {
            const name = item.snapshot?.name ?? item.product?.name ?? 'Product'
            const image = item.snapshot?.image ?? item.product?.images?.[0]?.image?.url
            const price = item.unitPrice ?? 0
            const qty = item.quantity ?? 1
            const variant = item.variantLabel

            return (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0">
                  {image ? (
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-snug">{name}</p>
                  {variant && <p className="text-xs text-muted-foreground mt-0.5">{variant}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">Qty: {qty}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">{formatPrice(price * qty)}</p>
                  {qty > 1 && <p className="text-xs text-muted-foreground">{formatPrice(price)} each</p>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Totals */}
        <div className="border-t px-5 py-4 space-y-2 bg-muted/20">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(order.subtotal ?? 0)}</span>
          </div>
          {(order.discount ?? 0) > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Discount</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          {(order.shippingCost ?? 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
          )}
          {(order.tax ?? 0) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-base pt-2 border-t">
            <span>Total</span>
            <span>{formatPrice(order.total ?? 0)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipping address */}
        {order.shippingAddress?.line1 && (
          <div className="bg-card rounded-2xl border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <h2 className="font-semibold text-sm">Shipping Address</h2>
            </div>
            <div className="text-sm text-muted-foreground space-y-0.5">
              {order.shippingAddress.name && <p className="font-medium text-foreground">{order.shippingAddress.name}</p>}
              <p>{order.shippingAddress.line1}</p>
              {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
              <p>{[order.shippingAddress.city, order.shippingAddress.state, order.shippingAddress.zip].filter(Boolean).join(', ')}</p>
              {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
            </div>
          </div>
        )}

        {/* Payment */}
        <div className="bg-card rounded-2xl border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <h2 className="font-semibold text-sm">Payment</h2>
          </div>
          <div className="text-sm text-muted-foreground space-y-1">
            {order.payment?.provider && (
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium text-foreground uppercase">{order.payment.provider}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Status</span>
              <span className={`font-medium ${order.payment?.status === 'paid' ? 'text-green-700' : 'text-foreground'}`}>
                {PAYMENT_STATUS_LABELS[order.payment?.status] ?? order.payment?.status ?? 'Pending'}
              </span>
            </div>
            {order.payment?.paidAt && (
              <div className="flex justify-between">
                <span>Paid on</span>
                <span className="text-foreground">{new Date(order.payment.paidAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping info / tracking */}
        {(order.shippingInfo?.trackingNumber || order.shippingInfo?.carrier) && (
          <div className="bg-card rounded-2xl border p-5 space-y-3 sm:col-span-2">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <h2 className="font-semibold text-sm">Shipping Info</h2>
            </div>
            <div className="text-sm space-y-1.5">
              {order.shippingInfo.carrier && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Carrier</span>
                  <span className="text-foreground font-medium">{order.shippingInfo.carrier}</span>
                </div>
              )}
              {order.shippingInfo.trackingNumber && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tracking #</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{order.shippingInfo.trackingNumber}</span>
                    <button onClick={copyTracking} className="text-muted-foreground hover:text-foreground transition-colors">
                      {copied ? <CheckCheck className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              )}
              {order.shippingInfo.estimatedDelivery && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Delivery</span>
                  <span className="text-foreground">{new Date(order.shippingInfo.estimatedDelivery).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
              {order.shippingInfo.deliveredAt && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivered on</span>
                  <span className="text-green-700 font-medium">{new Date(order.shippingInfo.deliveredAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Status history */}
      {(order.statusHistory ?? []).length > 0 && (
        <div className="bg-card rounded-2xl border p-5 space-y-4">
          <h2 className="font-semibold text-sm">Status History</h2>
          <div className="space-y-3">
            {[...order.statusHistory].reverse().map((h: any, i: number) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1 h-2 w-2 rounded-full bg-black shrink-0" />
                <div>
                  <span className="font-medium capitalize">{h.status}</span>
                  {h.note && <p className="text-muted-foreground text-xs mt-0.5">{h.note}</p>}
                  {h.updatedAt && <p className="text-muted-foreground text-xs">{new Date(h.updatedAt).toLocaleString()}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
          <p className="font-medium mb-1">Order Notes</p>
          <p>{order.notes}</p>
        </div>
      )}
    </div>
  )
}
