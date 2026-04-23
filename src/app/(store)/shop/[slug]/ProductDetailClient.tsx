'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Truck, RefreshCw, ShieldCheck, Share2, ChevronLeft, ChevronRight, Zap, CheckCircle2, ThumbsUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/shared/StarRating'
import { PriceDisplay } from '@/components/shared/PriceDisplay'
import { WishlistButton } from '@/components/shared/WishlistButton'
import { QuantityStepper } from '@/components/shared/QuantityStepper'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ProductCard } from '@/components/shop/ProductCard'
import { useCartStore } from '@/store/cart'
import { toast } from 'sonner'

interface TrustBadge { icon: 'truck' | 'refresh' | 'shield'; text: string }

interface Review {
  id: string
  rating: number
  title: string
  body: string
  isVerified: boolean
  createdAt: string
  author: string
}

interface ProductDetailClientProps {
  product: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    currency: string
    stock: number
    sku?: string
    rating: number
    reviewCount: number
    shortDesc?: string
    description?: string
    images: string[]
    variants: { name: string; options: { label: string }[] }[]
    specs: { label: string; value: string }[]
    trustBadges: TrustBadge[]
  }
  relatedProducts: {
    id: string
    name: string
    slug: string
    price: number
    comparePrice?: number
    image: string
    stock: number
    rating: number
    reviewCount: number
  }[]
  reviews: Review[]
}

const ICON_MAP = { truck: Truck, refresh: RefreshCw, shield: ShieldCheck }

export function ProductDetailClient({ product, relatedProducts, reviews }: ProductDetailClientProps) {
  const [activeImage, setActiveImage] = useState(0)
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')
  const liveRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
    : product.rating
  const liveCount = reviews.length || product.reviewCount
  const addItem = useCartStore((s) => s.addItem)

  const router = useRouter()
  const isOutOfStock = product.stock <= 0
  const isLowStock = !isOutOfStock && product.stock <= 5
  const variantLabel = Object.entries(selectedVariants).map(([, v]) => v).join(' / ') || undefined

  function cartItem() {
    return {
      productId: product.id,
      id: `${product.id}-${variantLabel ?? 'default'}`,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? '',
      stock: product.stock,
      variant: variantLabel,
      quantity,
    }
  }

  function handleAddToCart() {
    addItem(cartItem())
    toast.success(`${product.name} added to cart`)
  }

  function handleBuyNow() {
    addItem(cartItem())
    router.push('/checkout')
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted group">
            <AnimatePresence mode="wait">
              <motion.div key={activeImage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                {product.images[activeImage] ? (
                  <Image src={product.images[activeImage]} alt={product.name} fill quality={95} className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                ) : (
                  <div className="absolute inset-0 bg-gray-100" />
                )}
              </motion.div>
            </AnimatePresence>
            {product.images.length > 1 && (
              <>
                <button onClick={() => setActiveImage((i) => (i - 1 + product.images.length) % product.images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setActiveImage((i) => (i + 1) % product.images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-2 shadow-md hover:bg-white transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}
                  className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? 'border-black shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            {product.sku && <p className="text-xs text-muted-foreground mb-1">SKU: {product.sku}</p>}
            <h1 className="text-3xl font-sans font-bold leading-tight mb-3">{product.name}</h1>
            <div className="flex items-center gap-3 mb-3">
              {liveRating > 0 && <StarRating rating={liveRating} showValue />}
              {liveCount > 0 && (
                <button onClick={() => setTab('reviews')} className="text-sm text-muted-foreground hover:underline">
                  ({liveCount} review{liveCount !== 1 ? 's' : ''})
                </button>
              )}
              {isLowStock && <Badge variant="warning">Only {product.stock} left!</Badge>}
              {isOutOfStock && <Badge variant="secondary">Out of Stock</Badge>}
            </div>
            {product.shortDesc && <p className="text-muted-foreground leading-relaxed">{product.shortDesc}</p>}
          </div>

          <PriceDisplay price={product.price} comparePrice={product.comparePrice} currency={product.currency} size="xl" />

          {/* Variants */}
          {product.variants.map((v) => (
            <div key={v.name} className="space-y-2">
              <p className="text-sm font-medium">{v.name}: <span className="text-black font-semibold">{selectedVariants[v.name] ?? 'Select'}</span></p>
              <div className="flex flex-wrap gap-2">
                {v.options.map((opt) => (
                  <button key={opt.label} onClick={() => setSelectedVariants((s) => ({ ...s, [v.name]: opt.label }))}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${selectedVariants[v.name] === opt.label ? 'border-black bg-black text-white' : 'border-border hover:border-black/50'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Qty + Cart + Buy Now */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <QuantityStepper value={quantity} max={product.stock} onChange={setQuantity} />
              <Button size="lg" className="flex-1" variant="outline" onClick={handleAddToCart} disabled={isOutOfStock}>
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <WishlistButton productId={product.id} iconOnly className="border rounded-xl p-2.5 hover:bg-red-50" />
            </div>
            <Button size="lg" className="w-full bg-black hover:bg-black/90 text-white gap-2" onClick={handleBuyNow} disabled={isOutOfStock}>
              <Zap className="h-4 w-4" />
              Buy Now
            </Button>
          </div>

          {/* Trust Badges */}
          {product.trustBadges.length > 0 && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              {product.trustBadges.map(({ icon, text }) => {
                const Icon = ICON_MAP[icon] ?? ShieldCheck
                return (
                  <div key={text} className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted/50 text-center">
                    <Icon className="h-4 w-4 text-black" />
                    <p className="text-xs text-muted-foreground leading-tight">{text}</p>
                  </div>
                )
              })}
            </div>
          )}

          <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('Link copied!') }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-4 w-4" /> Share this product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mb-16">
        <TabsList className="h-auto p-1 gap-1">
          {['description', 'specs', 'reviews'].map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize px-5 py-2">{t === 'specs' ? 'Specifications' : t}</TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="description" className="mt-6">
          <div className="space-y-4 max-w-2xl">
            {product.description
              ? product.description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed">{para}</p>
                ))
              : <p className="text-muted-foreground leading-relaxed">No description available.</p>
            }
          </div>
        </TabsContent>
        <TabsContent value="specs" className="mt-6">
          {product.specs.length > 0 ? (
            <div className="max-w-2xl divide-y rounded-xl border overflow-hidden">
              {product.specs.map(({ label, value }, i) => (
                <div key={label} className={`flex justify-between px-5 py-3.5 text-sm ${i % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}>
                  <span className="font-medium text-foreground w-40 shrink-0">{label}</span>
                  <span className="text-muted-foreground text-right">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No specifications available.</p>
          )}
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          {reviews.length > 0 ? (
            <div className="space-y-8 max-w-3xl">
              {/* Summary bar */}
              <div className="flex items-center gap-6 p-5 bg-muted/30 rounded-2xl border">
                <div className="text-center">
                  <div className="text-5xl font-black text-foreground leading-none">
                    {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                  </div>
                  <StarRating rating={reviews.reduce((s, r) => s + r.rating, 0) / reviews.length} size="lg" className="mt-2 justify-center" />
                  <p className="text-xs text-muted-foreground mt-1">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviews.filter((r) => r.rating === star).length
                    const pct = reviews.length ? (count / reviews.length) * 100 : 0
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-3 text-right shrink-0">{star}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-4 text-muted-foreground shrink-0">{count}</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Individual reviews */}
              <div className="space-y-5">
                {reviews.map((review) => (
                  <motion.div key={review.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border bg-card space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {review.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{review.author}</span>
                            {review.isVerified && (
                              <span className="flex items-center gap-1 text-[10px] text-green-700 font-medium bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                                <CheckCircle2 className="h-2.5 w-2.5" />Verified Purchase
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1.5">{review.title}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{review.body}</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                      <ThumbsUp className="h-3 w-3" />
                      <span>Helpful</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="font-medium">No reviews yet</p>
              <p className="text-sm mt-1">Be the first to review this product.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-sans font-bold mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {relatedProducts.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </div>
      )}
    </>
  )
}
