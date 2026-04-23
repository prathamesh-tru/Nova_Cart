'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, ShoppingBag, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginSchema, type LoginInput } from '@/lib/validators'
import { useAuthStore } from '@/store/auth'
import { toast } from 'sonner'

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const params = useSearchParams()
  const { setUser } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    try {
      const res = await fetch('/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      const json = await res.json()
      if (!res.ok) { toast.error(json.errors?.[0]?.message ?? 'Login failed'); return }
      setUser(json.user)
      toast.success(`Welcome back, ${json.user.firstName}!`)
      router.push(params.get('redirect') ?? '/account')
    } catch {
      toast.error('An error occurred. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@email.com" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-accent hover:underline">Forgot password?</Link>
        </div>
        <div className="relative">
          <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" autoComplete="current-password" className="pr-10" {...register('password')} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl font-bold text-primary-800 mb-2">
            <ShoppingBag className="h-7 w-7 text-accent" />NovaCart
          </Link>
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <Suspense fallback={<div className="h-40 flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>}>
            <LoginForm />
          </Suspense>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent font-medium hover:underline">Create one</Link>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo: <code className="bg-muted px-1 rounded">admin@store.com</code> / <code className="bg-muted px-1 rounded">Admin@123456</code>
        </p>
      </div>
    </div>
  )
}
