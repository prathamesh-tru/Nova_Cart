'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: {
    id: string
    slug: string
    name: string
    price: number
    image: string
    stock: number
    variant?: string
  }
  quantity?: number
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'xl'
  disabled?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = 'default',
  disabled,
}: AddToCartButtonProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'added'>('idle')
  const addItem = useCartStore((s) => s.addItem)

  async function handleAdd() {
    if (product.stock <= 0) return
    setState('loading')
    await new Promise((r) => setTimeout(r, 400))
    addItem({
      productId: product.id,
      id: `${product.id}-${product.variant ?? 'default'}`,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      variant: product.variant,
      stock: product.stock,
      quantity,
    })
    setState('added')
    toast.success(`${product.name} added to cart`)
    setTimeout(() => setState('idle'), 2000)
  }

  const isDisabled = disabled || product.stock <= 0 || state === 'loading'

  return (
    <Button
      size={size}
      className={cn('gap-2', className)}
      disabled={isDisabled}
      onClick={handleAdd}
    >
      {state === 'loading' ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === 'added' ? (
        <Check className="h-4 w-4" />
      ) : (
        <ShoppingCart className="h-4 w-4" />
      )}
      {state === 'added' ? 'Added!' : product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
    </Button>
  )
}
