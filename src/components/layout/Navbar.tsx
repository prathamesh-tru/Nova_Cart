'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Search, User, LogOut, Package, Settings, Menu } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCartStore } from '@/store/cart'
import { useUiStore } from '@/store/ui'
import { useAuthStore } from '@/store/auth'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  link: string
  children?: { label: string; link: string }[]
}

interface NavbarProps {
  navItems?: NavItem[]
  siteName?: string
}

export function Navbar({ navItems = [], siteName = 'LUXESHOP' }: NavbarProps) {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
  const { openCart } = useCartStore()
  const { toggleMenu, toggleSearch } = useUiStore()
  const { user, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  async function handleLogout() {
    await fetch('/api/users/logout', { method: 'POST', credentials: 'include' })
    useAuthStore.getState().clearUser()
    window.location.href = '/'
  }

  const defaultNav: NavItem[] = [
    { label: 'Home', link: '/' },
    { label: 'Shop', link: '/shop' },
    { label: 'Categories', link: '/shop?view=categories' },
    { label: 'Deals', link: '/shop?deals=true' },
    { label: 'Account', link: '/account' },
  ]

  const links = navItems.length ? navItems : defaultNav

  return (
    <header className="sticky top-0 z-40 w-full bg-primary-800 shadow-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-sans text-xl font-black text-white hover:opacity-90 transition-opacity shrink-0 tracking-wider"
        >
          <ShoppingBag className="h-6 w-6 text-white" />
          {siteName}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {links.map((item, i) => (
            <Link
              key={`${item.link}-${i}`}
              href={item.link}
              className={cn(
                'text-sm font-medium transition-colors hover:text-blue-200 relative py-1',
                pathname === item.link ||
                  (item.link !== '/' && pathname.startsWith(item.link.split('?')[0]))
                  ? 'text-blue-200 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-200 after:rounded-full'
                  : 'text-white',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSearch}
            aria-label="Search"
            className="text-white hover:text-blue-200 hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white hover:text-blue-200 hover:bg-white/10"
            onClick={openCart}
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <AnimatePresence>
              {itemCount > 0 && (
                <motion.span
                  key="count"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-0.5 -right-0.5 h-[18px] min-w-[18px] rounded-full bg-accent text-white text-[10px] font-bold flex items-center justify-center leading-none px-0.5"
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Button>

          {/* User */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:text-blue-200 hover:bg-white/10"
                >
                  <div className="h-7 w-7 rounded-full bg-white/20 text-white flex items-center justify-center text-xs font-bold border border-white/30">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-medium">{user.firstName} {user.lastName}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/account"><User className="h-4 w-4" />Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account/orders"><Package className="h-4 w-4" />Orders</Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin"><Settings className="h-4 w-4" />Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" />Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-white hover:text-blue-200 hover:bg-white/10"
            >
              <Link href="/login" aria-label="Account">
                <User className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:text-blue-200 hover:bg-white/10"
            onClick={toggleMenu}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
