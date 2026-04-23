'use client'

import { create } from 'zustand'

interface UiState {
  searchOpen: boolean
  mobileMenuOpen: boolean
  quickViewProduct: string | null
  compareList: string[]
  toggleSearch: () => void
  closeSearch: () => void
  openSearch: () => void
  toggleMenu: () => void
  closeMenu: () => void
  openQuickView: (productId: string) => void
  closeQuickView: () => void
  addToCompare: (productId: string) => void
  removeFromCompare: (productId: string) => void
}

export const useUiStore = create<UiState>((set) => ({
  searchOpen: false,
  mobileMenuOpen: false,
  quickViewProduct: null,
  compareList: [],
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),
  closeSearch: () => set({ searchOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  toggleMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  closeMenu: () => set({ mobileMenuOpen: false }),
  openQuickView: (productId) => set({ quickViewProduct: productId }),
  closeQuickView: () => set({ quickViewProduct: null }),
  addToCompare: (productId) =>
    set((s) =>
      s.compareList.includes(productId) || s.compareList.length >= 4
        ? s
        : { compareList: [...s.compareList, productId] },
    ),
  removeFromCompare: (productId) =>
    set((s) => ({ compareList: s.compareList.filter((id) => id !== productId) })),
}))
