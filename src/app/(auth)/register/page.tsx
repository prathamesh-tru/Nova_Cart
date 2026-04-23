'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShoppingBag, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { registerSchema, type RegisterInput } from '@/lib/validators'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (!pw) return { label: '', color: '', width: '0%' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const levels = [
    { label: 'Weak', color: 'bg-red-400', width: '25%' },
    { label: 'Fair', color: 'bg-amber-400', width: '50%' },
    { label: 'Strong', color: 'bg-blue-500', width: '75%' },
    { label: 'Very Strong', color: 'bg-green-500', width: '100%' },
  ]
  return levels[score - 1] ?? levels[0]
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const { setUser } = useAuthStore()
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })

  const password = watch('password', '')
  const strength = getPasswordStrength(password)

  async function onSubmit(data: RegisterInput) {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName: data.firstName, lastName: data.lastName, email: data.email, password: data.password, role: 'customer' }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.errors?.[0]?.message ?? 'Registration failed'); return }
      toast.success('Account created! Welcome to NovaCart 🎉')
      // Auto-login
      const loginRes = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      if (loginRes.ok) {
        const loginJson = await loginRes.json()
        setUser(loginJson.user)
      }
      router.push('/account')
    } catch {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl font-bold text-primary-800 mb-2">
            <ShoppingBag className="h-7 w-7 text-accent" />NovaCart
          </Link>
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground mt-1">Join thousands of happy shoppers</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" placeholder="Jane" {...register('firstName')} />
                {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" placeholder="Doe" {...register('lastName')} />
                {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@email.com" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" className="pr-10" {...register('password')} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="h-1 bg-muted rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all duration-300', strength.color)} style={{ width: strength.width }} />
                  </div>
                  <p className={cn('text-xs font-medium', strength.color.replace('bg-', 'text-'))}>{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="Repeat your password" {...register('confirmPassword')} />
              {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Check className="h-4 w-4" />Create Account</>}
            </Button>
          </form>
          <div className="mt-5 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
