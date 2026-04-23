'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface WishlistButtonProps {
  productId: string
  className?: string
  iconOnly?: boolean
}

export function WishlistButton({ productId, className, iconOnly }: WishlistButtonProps) {
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const wl = JSON.parse(localStorage.getItem('wishlist') ?? '[]') as string[]
    setIsWishlisted(wl.includes(productId))
  }, [productId])

  function toggle() {
    const wl = JSON.parse(localStorage.getItem('wishlist') ?? '[]') as string[]
    const updated = wl.includes(productId) ? wl.filter((id) => id !== productId) : [...wl, productId]
    localStorage.setItem('wishlist', JSON.stringify(updated))
    setIsWishlisted(updated.includes(productId))
    toast(updated.includes(productId) ? 'Added to wishlist' : 'Removed from wishlist')
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-1.5 transition-all duration-200',
        iconOnly
          ? 'p-2 rounded-full hover:bg-red-50'
          : 'text-sm text-muted-foreground hover:text-red-500',
        className,
      )}
      aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={cn(
          'h-5 w-5 transition-all duration-200',
          isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-muted-foreground',
        )}
      />
      {!iconOnly && <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>}
    </button>
  )
}
