import { Suspense } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/shop/ProductCard'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Shop' }

interface SearchParams {
  category?: string
  sort?: string
  price_min?: string
  price_max?: string
  in_stock?: string
  page?: string
  q?: string
}

function getImageUrl(image: any, seed = 'default'): string {
  if (!image) return `/api/media/file/placeholder.jpg`
  if (typeof image === 'string') return image
  return image?.url ?? `/api/media/file/placeholder.jpg`
}

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
]

async function getShopData(searchParams: SearchParams) {
  const payload = await getPayload()
  const page = parseInt(searchParams.page ?? '1')
  const limit = 12

  const sortMap: Record<string, string> = {
    newest: '-createdAt',
    price_asc: 'pricing.price',
    price_desc: '-pricing.price',
  }
  const sort = sortMap[searchParams.sort ?? 'newest'] ?? '-createdAt'

  const where: any = { status: { equals: 'active' } }
  if (searchParams.category) {
    where['categories.slug'] = { equals: searchParams.category }
  }
  if (searchParams.in_stock === 'true') {
    where['inventory.stock'] = { greater_than: 0 }
  }
  if (searchParams.q) {
    where.name = { contains: searchParams.q }
  }

  const [productsResult, categoriesResult] = await Promise.all([
    payload.find({ collection: 'products', where, sort, page, limit, depth: 2 }).catch(() => ({ docs: [], totalDocs: 0, totalPages: 1, page: 1 })),
    payload.find({ collection: 'categories', limit: 50, depth: 0 }).catch(() => ({ docs: [] })),
  ])

  return { productsResult, categories: categoriesResult.docs }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { productsResult, categories } = await getShopData(params)

  const products = productsResult.docs.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.pricing?.price ?? 0,
    comparePrice: p.pricing?.comparePrice,
    image: getImageUrl(p.images?.[0]?.image, p.id),
    stock: p.inventory?.stock ?? 0,
    rating: p.ratings?.average ?? 0,
    reviewCount: p.ratings?.count ?? 0,
    currency: p.pricing?.currency ?? 'USD',
  }))

  const activeCategory = params.category ?? ''
  const activeSort = params.sort ?? 'newest'
  const totalDocs = productsResult.totalDocs ?? 0
  const currentPage = productsResult.page ?? 1
  const totalPages = productsResult.totalPages ?? 1

  const categoryTabs = [
    { label: 'All', value: '', slug: '' },
    ...categories.map((c: any) => ({ label: c.name, value: c.slug, slug: c.slug })),
  ]

  function buildUrl(updates: Partial<SearchParams>) {
    const next = { ...params, ...updates }
    const qs = Object.entries(next)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&')
    return `/shop${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="container py-8">
      <Breadcrumb items={[{ label: 'Shop' }]} className="mb-6" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-sans font-bold">
            {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'All Products'}
          </h1>
          <p className="text-muted-foreground mt-1">{totalDocs} product{totalDocs !== 1 ? 's' : ''}</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
          {SORT_OPTIONS.map((opt) => (
            <Link key={opt.value} href={buildUrl({ sort: opt.value, page: '1' })}>
              <Badge variant={activeSort === opt.value ? 'default' : 'outline'} className="cursor-pointer hover:bg-primary/10 transition-colors">{opt.label}</Badge>
            </Link>
          ))}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-8 pb-4 border-b">
        {categoryTabs.map((cat) => (
          <Link key={cat.value} href={buildUrl({ category: cat.value, page: '1' })}>
            <Button size="sm" variant={activeCategory === cat.value ? 'default' : 'outline'} className="rounded-full">
              {cat.label}
            </Button>
          </Link>
        ))}
        {(params.in_stock || params.q) && (
          <Link href="/shop">
            <Badge variant="outline" className="cursor-pointer gap-1 h-8 px-3">
              <X className="h-3 w-3" />Clear filters
            </Badge>
          </Link>
        )}
      </div>

      {/* Products Grid */}
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-2xl" />)}
        </div>
      }>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl font-semibold mb-2">No products found</p>
            <p className="text-muted-foreground mb-6">Try adjusting your filters</p>
            <Button asChild><Link href="/shop">Clear Filters</Link></Button>
          </div>
        )}
      </Suspense>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {currentPage > 1 && (
            <Link href={buildUrl({ page: String(currentPage - 1) })}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={buildUrl({ page: String(p) })}>
              <Button variant={p === currentPage ? 'default' : 'outline'} size="icon">{p}</Button>
            </Link>
          ))}
          {currentPage < totalPages && (
            <Link href={buildUrl({ page: String(currentPage + 1) })}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
