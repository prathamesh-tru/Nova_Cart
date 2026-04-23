import { Suspense } from 'react'
import Link from 'next/link'
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react'
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
  brand?: string
  color?: string
}

function getImageUrl(image: any): string {
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
  if (searchParams.brand) {
    where['brand.slug'] = { equals: searchParams.brand }
  }
  if (searchParams.color) {
    where['colors.slug'] = { equals: searchParams.color }
  }

  const [productsResult, categoriesResult, brandsResult, colorsResult] = await Promise.all([
    payload.find({ collection: 'products', where, sort, page, limit, depth: 2 }).catch(() => ({ docs: [], totalDocs: 0, totalPages: 1, page: 1 })),
    payload.find({ collection: 'categories', limit: 50, depth: 0 }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'brands', limit: 100, depth: 0 }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'colors', limit: 100, depth: 0 }).catch(() => ({ docs: [] })),
  ])

  return {
    productsResult,
    categories: categoriesResult.docs,
    brands: brandsResult.docs,
    colors: colorsResult.docs,
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  const { productsResult, categories, brands, colors } = await getShopData(params)

  const products = productsResult.docs.map((p: any) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.pricing?.price ?? 0,
    comparePrice: p.pricing?.comparePrice,
    image: getImageUrl(p.images?.[0]?.image),
    stock: p.inventory?.stock ?? 0,
    rating: p.ratings?.average ?? 0,
    reviewCount: p.ratings?.count ?? 0,
    currency: p.pricing?.currency ?? 'USD',
  }))

  const activeCategory = params.category ?? ''
  const activeSort = params.sort ?? 'newest'
  const activeBrand = params.brand ?? ''
  const activeColor = params.color ?? ''
  const totalDocs = productsResult.totalDocs ?? 0
  const currentPage = productsResult.page ?? 1
  const totalPages = productsResult.totalPages ?? 1

  const categoryTabs = [
    { label: 'All', value: '' },
    ...categories.map((c: any) => ({ label: c.name, value: c.slug })),
  ]

  const activeFilterCount = [activeCategory, activeBrand, activeColor, params.in_stock].filter(Boolean).length

  function buildUrl(updates: Partial<SearchParams>) {
    const next = { ...params, ...updates }
    const qs = Object.entries(next)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${encodeURIComponent(v as string)}`)
      .join('&')
    return `/shop${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="container py-6">
      <Breadcrumb items={[{ label: 'Shop' }]} className="mb-4" />

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {activeCategory ? activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) : 'All Products'}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">{totalDocs} product{totalDocs !== 1 ? 's' : ''}</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <Link key={opt.value} href={buildUrl({ sort: opt.value, page: '1' })}>
              <Badge variant={activeSort === opt.value ? 'default' : 'outline'} className="cursor-pointer">
                {opt.label}
              </Badge>
            </Link>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── LEFT FILTER SIDEBAR ── */}
        <aside className="hidden md:block w-56 shrink-0">
          <div className="sticky top-4 space-y-1 bg-card border rounded-2xl overflow-hidden">
            {/* Sidebar header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <span className="font-semibold text-sm flex items-center gap-1.5">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </span>
              {activeFilterCount > 0 && (
                <Link href="/shop">
                  <span className="text-xs text-primary hover:underline cursor-pointer">Clear all</span>
                </Link>
              )}
            </div>

            {/* Category */}
            <div className="px-4 py-3 border-b">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Category</p>
              <ul className="space-y-0.5">
                {categoryTabs.map((cat) => (
                  <li key={cat.value}>
                    <Link
                      href={buildUrl({ category: cat.value, page: '1' })}
                      className={`flex items-center justify-between w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${
                        activeCategory === cat.value
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'hover:bg-muted text-foreground'
                      }`}
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand */}
            {brands.length > 0 && (
              <div className="px-4 py-3 border-b">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Brand</p>
                <ul className="space-y-0.5">
                  {brands.map((b: any) => (
                    <li key={b.id}>
                      <Link
                        href={buildUrl({ brand: activeBrand === b.slug ? '' : b.slug, page: '1' })}
                        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${
                          activeBrand === b.slug
                            ? 'bg-primary text-primary-foreground font-medium'
                            : 'hover:bg-muted text-foreground'
                        }`}
                      >
                        <span
                          className={`h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center ${
                            activeBrand === b.slug ? 'bg-primary-foreground/20 border-primary-foreground/40' : 'border-muted-foreground/30'
                          }`}
                        >
                          {activeBrand === b.slug && (
                            <span className="block h-2 w-2 rounded-sm bg-current" />
                          )}
                        </span>
                        {b.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Colour */}
            {colors.length > 0 && (
              <div className="px-4 py-3 border-b">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Colour</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c: any) => (
                    <Link key={c.id} href={buildUrl({ color: activeColor === c.slug ? '' : c.slug, page: '1' })}>
                      <div
                        title={c.name}
                        className={`h-7 w-7 rounded-full border-2 transition-all cursor-pointer ${
                          activeColor === c.slug
                            ? 'border-primary ring-2 ring-primary ring-offset-1 scale-110'
                            : 'border-border hover:scale-110'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* In Stock */}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Availability</p>
              <Link
                href={buildUrl({ in_stock: params.in_stock === 'true' ? '' : 'true', page: '1' })}
                className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-colors ${
                  params.in_stock === 'true'
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'hover:bg-muted text-foreground'
                }`}
              >
                <span
                  className={`h-4 w-4 rounded border flex-shrink-0 flex items-center justify-center ${
                    params.in_stock === 'true' ? 'bg-primary-foreground/20 border-primary-foreground/40' : 'border-muted-foreground/30'
                  }`}
                >
                  {params.in_stock === 'true' && (
                    <span className="block h-2 w-2 rounded-sm bg-current" />
                  )}
                </span>
                In Stock Only
              </Link>
            </div>
          </div>
        </aside>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex-1 min-w-0">
          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {activeCategory && (
                <Link href={buildUrl({ category: '', page: '1' })}>
                  <Badge variant="secondary" className="gap-1 cursor-pointer">
                    Category: {activeCategory} <X className="h-3 w-3" />
                  </Badge>
                </Link>
              )}
              {activeBrand && (
                <Link href={buildUrl({ brand: '', page: '1' })}>
                  <Badge variant="secondary" className="gap-1 cursor-pointer">
                    Brand: {brands.find((b: any) => b.slug === activeBrand)?.name ?? activeBrand} <X className="h-3 w-3" />
                  </Badge>
                </Link>
              )}
              {activeColor && (
                <Link href={buildUrl({ color: '', page: '1' })}>
                  <Badge variant="secondary" className="gap-1 cursor-pointer">
                    Colour: {colors.find((c: any) => c.slug === activeColor)?.name ?? activeColor} <X className="h-3 w-3" />
                  </Badge>
                </Link>
              )}
              {params.in_stock && (
                <Link href={buildUrl({ in_stock: '', page: '1' })}>
                  <Badge variant="secondary" className="gap-1 cursor-pointer">
                    In Stock <X className="h-3 w-3" />
                  </Badge>
                </Link>
              )}
            </div>
          )}

          {/* Products Grid */}
          <Suspense fallback={
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />)}
            </div>
          }>
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
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
            <div className="flex justify-center gap-2 mt-10">
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
      </div>
    </div>
  )
}
