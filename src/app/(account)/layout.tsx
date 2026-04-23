import type { Metadata } from 'next'
import '@/styles/globals.css'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Package, User, LayoutDashboard, ShoppingBag } from 'lucide-react'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { SearchOverlay } from '@/components/layout/SearchOverlay'

export const metadata: Metadata = {
  title: { default: 'Account | NovaCart', template: '%s | NovaCart' },
  description: 'Manage your NovaCart account.',
}

const SIDEBAR_LINKS = [
  { label: 'Dashboard', href: '/account', icon: LayoutDashboard },
  { label: 'Orders', href: '/account/orders', icon: Package },
  { label: 'Profile', href: '/account/profile', icon: User },
]

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen">
        <Navbar />
        <CartDrawer />
        <SearchOverlay />
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="md:col-span-1">
              <nav className="space-y-1 bg-card rounded-2xl border p-3">
                {SIDEBAR_LINKS.map(({ label, href, icon: Icon }) => (
                  <Link key={href} href={href}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all">
                    <Icon className="h-4 w-4 shrink-0" />{label}
                  </Link>
                ))}
                <Link href="/shop" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all mt-2 border-t pt-3">
                  <ShoppingBag className="h-4 w-4 shrink-0" />Continue Shopping
                </Link>
              </nav>
            </aside>
            {/* Content */}
            <main className="md:col-span-3">{children}</main>
          </div>
        </div>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  )
}
