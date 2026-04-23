'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    shortDesc?: string
    price: number
    comparePrice?: number
    image: string
    stock: number
    rating?: number
    reviewCount?: number
    isNew?: boolean
    currency?: string
    category?: string
  }
  className?: string
  index?: number
  category?: string
}

export function ProductCard({ product, className, category }: ProductCardProps) {
  const { id, name, slug, price, image, stock, currency = 'USD' } = product
  const categoryLabel = category ?? product.category ?? ''
  const isOutOfStock = stock <= 0

  const addItem = useCartStore((s) => s.addItem)

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    if (!isOutOfStock) {
      addItem({ id, productId: id, slug, name, price, image, stock })
    }
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)

  return (
    <div
      className={cn(
        'group flex flex-col bg-white rounded-2xl shadow-md overflow-hidden min-w-[220px]',
        className,
      )}
    >
      {/* Image */}
      <Link href={`/shop/${slug}`} className="block relative overflow-hidden bg-gray-100 aspect-square">
        <Image
          src={image}
          alt={name}
          fill
          quality={90}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </Link>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-1">
        {categoryLabel && (
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {categoryLabel}
          </p>
        )}
        <Link href={`/shop/${slug}`} className="block">
          <h3 className="text-lg font-black uppercase tracking-wide leading-tight truncate hover:text-primary-700 transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-xl font-bold text-primary-800 mt-0.5">{formattedPrice}</p>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="mt-3 w-full bg-primary-800 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl py-3 font-semibold text-base transition-colors"
        >
          {isOutOfStock ? 'Out of Stock' : 'Shop Now'}
        </button>
      </div>
    </div>
  )
}
