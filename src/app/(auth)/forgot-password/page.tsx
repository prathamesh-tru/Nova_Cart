'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ShoppingBag, Loader2, Mail, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { toast } from 'sonner'

const schema = z.object({ email: z.string().email('Invalid email') })
type FormInput = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInput>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormInput) {
    try {
      await fetch('/api/users/forgot-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.email }),
      })
      setSent(true)
    } catch { toast.error('An error occurred.') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-serif text-2xl font-bold text-primary-800 mb-2">
            <ShoppingBag className="h-7 w-7 text-accent" />NovaCart
          </Link>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground mt-1">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border p-8">
          {sent ? (
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Check your inbox</h3>
              <p className="text-muted-foreground text-sm">If an account exists for that email, you'll receive a password reset link shortly.</p>
              <Button asChild className="mt-6 w-full" variant="outline">
                <Link href="/login"><ArrowLeft className="h-4 w-4" />Back to Login</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="you@email.com" {...register('email')} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
              </Button>
              <Button asChild variant="ghost" className="w-full">
                <Link href="/login"><ArrowLeft className="h-4 w-4" />Back to Login</Link>
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
