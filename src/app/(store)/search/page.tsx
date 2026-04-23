import { ProductCard } from '@/components/shop/ProductCard'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { TruSearchResultsWidget } from '@/components/shared/TruSearchResultsWidget'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }): Promise<Metadata> {
  const p = await searchParams
  return { title: p.q ? `Search: ${p.q}` : 'Search' }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const searchPageId = process.env.NEXT_PUBLIC_TRUSEARCH_SEARCH_PAGE_ID ?? ''

  // If a TruSearch search page widget is configured, render it (handles its own analytics)
  if (searchPageId) {
    return (
      <div className="container py-8">
        <Breadcrumb items={[{ label: 'Search' }]} className="mb-6" />
        <TruSearchResultsWidget widgetId={searchPageId} query={q} />
      </div>
    )
  }

  // Fallback: Payload-based search with fire-and-forget TruSearch analytics tracking
  let products: any[] = []
  let total = 0

  if (q.trim()) {
    const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
    fetch(`${base}/api/search?q=${encodeURIComponent(q)}&limit=1`).catch(() => {})

    try {
      const payload = await getPayload()
      const [pr, po] = await Promise.all([
        payload.find({ collection: 'products', where: { and: [{ status: { equals: 'active' } }, { name: { contains: q } }] }, limit: 12, depth: 2 }),
        payload.find({ collection: 'posts', where: { and: [{ status: { equals: 'published' } }, { title: { contains: q } }] }, limit: 6, depth: 1 }),
      ])
      products = pr.docs
      total = pr.totalDocs + po.totalDocs
    } catch {}
  }

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
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p: any, i: number) => (
              <ProductCard key={p.id} index={i} product={{
                id: p.id, name: p.name, slug: p.slug,
                price: p.pricing?.price ?? 0, comparePrice: p.pricing?.comparePrice,
                image: p.images?.[0]?.image?.url ?? `https://picsum.photos/seed/${p.id}/600/600`,
                stock: p.inventory?.stock ?? 0,
              }} />
            ))}
          </div>
        </section>
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
