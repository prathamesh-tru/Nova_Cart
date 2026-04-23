'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

export interface CartItem {
  id: string
  productId: string
  slug: string
  name: string
  price: number
  image: string
  variant?: string
  quantity: number
  stock: number
}

export interface Coupon {
  code: string
  type: 'percentage' | 'fixed' | 'freeShipping'
  value: number
}

interface CartState {
  items: CartItem[]
  coupon: Coupon | null
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void
  removeItem: (id: string) => void
  updateQty: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
}

function computedValues(items: CartItem[], coupon: Coupon | null) {
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  let discount = 0
  if (coupon) {
    if (coupon.type === 'percentage') discount = (subtotal * coupon.value) / 100
    else if (coupon.type === 'fixed') discount = Math.min(coupon.value, subtotal)
  }
  const shipping = subtotal >= 50 || coupon?.type === 'freeShipping' ? 0 : 5.99
  const tax = (subtotal - discount) * 0.1
  const total = subtotal - discount + shipping + tax
  return { itemCount, subtotal, discount, shipping, tax, total }
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: null,
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const key = `${item.productId}-${item.variant ?? 'default'}`
          const existing = state.items.find(
            (i) => i.productId === item.productId && i.variant === item.variant,
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity ?? 1), i.stock) }
                  : i,
              ),
              isOpen: true,
            }
          }
          return {
            items: [...state.items, { ...item, id: key, quantity: item.quantity ?? 1 }],
            isOpen: true,
          }
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQty: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      clearCart: () => set({ items: [], coupon: null }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),
    }),
    { name: 'novacart-cart', skipHydration: true },
  ),
)

export function useCartComputed() {
  return useCartStore(useShallow((s) => computedValues(s.items, s.coupon)))
}
