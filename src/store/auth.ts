'use client'

import { create } from 'zustand'

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'customer' | 'vendor' | 'admin'
  loyaltyPoints?: number
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  clearUser: () => void
  checkAuth: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null }),
  checkAuth: async () => {
    try {
      set({ isLoading: true })
      const res = await fetch('/api/users/me', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        set({ user: data.user ?? null, isLoading: false })
      } else {
        set({ user: null, isLoading: false })
      }
    } catch {
      set({ user: null, isLoading: false })
    }
  },
}))
