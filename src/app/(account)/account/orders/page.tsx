'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, ChevronRight, ShoppingBag, Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatPrice } from '@/lib/utils'

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetch('/api/orders?limit=100&sort=-createdAt&depth=2', { credentials: 'include' })
      .then(r => r.ok ? r.json() : { docs: [] })
      .then(d => { setOrders(d.docs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const statuses = ['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter
    const matchSearch = !search || o.orderNumber?.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <span className="text-sm text-muted-foreground">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all capitalize ${
                statusFilter === s ? 'bg-black text-white border-black' : 'border-border text-muted-foreground hover:border-black/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Package className="h-14 w-14 mx-auto mb-3 opacity-20" />
          <p className="font-medium text-base">No orders found</p>
          {orders.length === 0 ? (
            <>
              <p className="text-sm mt-1">You haven't placed any orders yet.</p>
              <Button asChild size="sm" className="mt-4"><Link href="/shop"><ShoppingBag className="h-4 w-4 mr-2" />Start Shopping</Link></Button>
            </>
          ) : (
            <p className="text-sm mt-1">Try a different filter or search term.</p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const itemCount = (order.items ?? []).length
            const firstImage = order.items?.[0]?.snapshot?.image || order.items?.[0]?.product?.images?.[0]?.image?.url
            const names = (order.items ?? []).slice(0, 2).map((it: any) => it.snapshot?.name ?? it.product?.name ?? 'Product').join(', ')
            const extra = itemCount > 2 ? ` +${itemCount - 2} more` : ''

            return (
              <motion.div key={order.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link href={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 rounded-2xl border bg-card hover:shadow-md transition-all group">
                  {/* Thumbnail */}
                  <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden shrink-0">
                    {firstImage ? (
                      <img src={firstImage} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{order.orderNumber}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{names}{extra}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      {' · '}{itemCount} item{itemCount !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Total + arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold text-sm">{formatPrice(order.total ?? 0)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
