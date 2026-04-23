'use client'

import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  image: string
  stock: number
  rating?: number
  reviewCount?: number
  category?: string
  currency?: string
}

const CARD_WIDTH = 236

export function ProductCarousel({ products }: { products: Product[] }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function scrollLeft() {
    scrollRef.current?.scrollBy({ left: -CARD_WIDTH * 2, behavior: 'smooth' })
  }

  function scrollRight() {
    scrollRef.current?.scrollBy({ left: CARD_WIDTH * 2, behavior: 'smooth' })
  }

  function handleScroll() {
    if (!scrollRef.current) return
    const idx = Math.round(scrollRef.current.scrollLeft / CARD_WIDTH)
    setActiveIndex(Math.min(idx, products.length - 1))
  }

  if (products.length === 0) return null

  return (
    <div>
      <div className="relative">
        <button
          onClick={scrollLeft}
          aria-label="Scroll left"
          className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        >
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              category={product.category}
              className="w-[220px] shrink-0"
              index={i}
            />
          ))}
        </div>

        <button
          onClick={scrollRight}
          aria-label="Scroll right"
          className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full bg-black text-white shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-5">
        {products.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to product ${i + 1}`}
            onClick={() => {
              scrollRef.current?.scrollTo({ left: i * CARD_WIDTH, behavior: 'smooth' })
              setActiveIndex(i)
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-black' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
