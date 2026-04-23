'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'

interface SuccessContentProps {
  heading: string
  subheading: string
  description: string
  stepsHeading: string
  steps: string[]
}

export function SuccessContent({ heading, subheading, description, stepsHeading, steps }: SuccessContentProps) {
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    clearCart()
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 }, colors: ['#000', '#333', '#666', '#999'] })
      })
    }
  }, [clearCart])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6 mx-auto">
          <CheckCircle className="h-14 w-14 text-green-600" />
        </motion.div>

        <h1 className="text-4xl font-sans font-bold text-black mb-3">{heading}</h1>
        <p className="text-muted-foreground text-lg mb-2">{subheading}</p>
        <p className="text-muted-foreground mb-8">{description}</p>

        {steps.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <Package className="h-5 w-5 text-green-700" />
              <h3 className="font-semibold text-green-900">{stepsHeading}</h3>
            </div>
            <ul className="space-y-2 text-sm text-green-800">
              {steps.map((text, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px] shrink-0">{i + 1}</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild size="lg">
            <Link href="/account/orders"><Package className="h-4 w-4" />Track Order</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/shop"><ShoppingBag className="h-4 w-4" />Continue Shopping <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
