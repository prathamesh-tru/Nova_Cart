import { ProductCard } from '@/components/shop/ProductCard'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { TruSearchResultsWidget } from '@/components/shared/TruSearchResultsWidget'
import type { Metadata } from 'next'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const p = await searchParams
  return { title: p.q ? `Search: ${p.q}` : 'Search' }
}

async function getTruSearchResults(q: string) {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
  try {
    const res = await fetch(`${base}/api/search?q=${encodeURIComponent(q)}&limit=24`, { cache: 'no-store' })
    if (!res.ok) return { hits: [], total: 0 }
    const data = await res.json()
    return { hits: data.hits ?? [], total: data.total ?? 0 }
  } catch {
    return { hits: [], total: 0 }
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const searchPageId = process.env.NEXT_PUBLIC_TRUSEARCH_SEARCH_PAGE_ID ?? ''

  if (searchPageId) {
    return (
      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Search' }]} className="mb-6" />
        <TruSearchResultsWidget widgetId={searchPageId} query={q} />
      </div>
    )
  }

  const { hits, total } = q.trim() ? await getTruSearchResults(q) : { hits: [], total: 0 }

  const products = hits
    .filter((h: any) => h.entityType === 'products')
    .map((h: any) => ({
      id: h.id,
      name: h.title,
      slug: h.slug ?? h.fields?.slug ?? '',
      price: h.fields?.pricing?.price ?? 0,
      comparePrice: h.fields?.pricing?.comparePrice,
      image: h.imageUrl ?? '/placeholder.jpg',
      stock: h.fields?.inventory?.stock ?? 0,
      rating: h.fields?.ratings?.average ?? 0,
      reviewCount: h.fields?.ratings?.count ?? 0,
      currency: h.fields?.pricing?.currency ?? 'USD',
    }))

  return (
    <div className="container py-8">
      <Breadcrumb items={[{ label: 'Search' }]} className="mb-6" />
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold">
          {q ? `Search results for "${q}"` : 'Search'}
        </h1>
        {q && <p className="text-muted-foreground mt-1">{total} result{total !== 1 ? 's' : ''} found</p>}
      </div>

      {products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p: any, i: number) => (
            <ProductCard key={p.id} index={i} product={p} />
          ))}
        </div>
      )}

      {!q && (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg">Enter a search term to find products</p>
        </div>
      )}

      {q && total === 0 && (
        <div className="text-center py-20">
          <p className="text-2xl font-semibold mb-2">No results found</p>
          <p className="text-muted-foreground mb-6">Try a different search term or browse all products</p>
        </div>
      )}
    </div>
  )
}
