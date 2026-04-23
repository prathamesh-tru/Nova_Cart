'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Package, Heart, Star, ArrowRight, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { formatPrice } from '@/lib/utils'

export default function AccountPage() {
  const [user, setUser] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [wishlistCount, setWishlistCount] = useState(0)

  useEffect(() => {
    fetch('/api/users/me', { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUser(d.user))
      .catch(() => {})
    fetch('/api/orders?limit=5&sort=-createdAt', { credentials: 'include' })
      .then(r => r.ok ? r.json() : { docs: [] })
      .then(d => setOrders(d.docs ?? []))
      .catch(() => {})
    setWishlistCount(JSON.parse(localStorage.getItem('wishlist') ?? '[]').length)
  }, [])

  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Spent', value: formatPrice(orders.reduce((s: number, o: any) => s + (o.total ?? 0), 0)), icon: ShoppingBag, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Loyalty Points', value: `${user?.loyaltyPoints ?? 0} pts`, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Wishlist Items', value: wishlistCount, icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-800 to-accent rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-serif font-bold mb-1">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
        </h1>
        <p className="text-white/80">Here's what's happening with your account</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card>
              <CardContent className="p-4">
                <div className={`inline-flex h-10 w-10 rounded-xl ${bg} items-center justify-center mb-3`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Button variant="ghost" size="sm" asChild><Link href="/account/orders">View all <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No orders yet</p>
              <Button asChild size="sm" className="mt-3"><Link href="/shop">Start Shopping</Link></Button>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <Link key={order.id} href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors border">
                  <div>
                    <p className="font-medium text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={order.status} />
                    <span className="font-semibold text-sm">{formatPrice(order.total ?? 0)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
