import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { ProductDetailClient } from './ProductDetailClient'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

function mediaUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media?.url ?? null
}

async function getProduct(slug: string) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'products',
      where: { slug: { equals: slug }, status: { equals: 'active' } },
      limit: 1,
      depth: 2,
    })
    return result.docs[0] ?? null
  } catch {
    return null
  }
}

async function getRelatedProducts(categoryIds: number[], excludeId: string | number) {
  if (!categoryIds.length) return []
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'products',
      where: {
        status: { equals: 'active' },
        categories: { in: categoryIds },
        id: { not_equals: excludeId },
      },
      limit: 4,
      depth: 2,
    })
    return result.docs
  } catch {
    return []
  }
}

async function getReviews(productId: string | number) {
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'reviews',
      where: { product: { equals: productId }, isApproved: { equals: true } },
      limit: 20,
      depth: 1,
    })
    return result.docs.map((r: any) => ({
      id: String(r.id),
      rating: r.rating as number,
      title: r.title as string,
      body: r.body as string,
      isVerified: r.isVerified as boolean,
      createdAt: r.createdAt as string,
      author: r.user
        ? `${(r.user as any).firstName ?? ''} ${(r.user as any).lastName ?? ''}`.trim()
        : 'Anonymous',
    }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: (product as any).seo?.metaTitle ?? (product as any).name,
    description: (product as any).seo?.metaDesc ?? (product as any).shortDesc,
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const raw = await getProduct(slug)
  if (!raw) notFound()

  const p = raw as any
  const categoryIds = (p.categories ?? []).map((c: any) => (typeof c === 'object' ? c.id : c)).filter(Boolean)
  const [relatedRaw, reviews] = await Promise.all([
    getRelatedProducts(categoryIds, p.id),
    getReviews(p.id),
  ])

  const product = {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    price: p.pricing?.price ?? 0,
    comparePrice: p.pricing?.comparePrice,
    currency: p.pricing?.currency ?? 'USD',
    stock: p.inventory?.stock ?? 0,
    sku: p.inventory?.sku,
    rating: p.ratings?.average ?? 0,
    reviewCount: p.ratings?.count ?? 0,
    shortDesc: p.shortDesc,
    description: (() => {
      const children = p.description?.root?.children ?? []
      return children
        .map((node: any) => node.children?.map((c: any) => c.text ?? '').join('') ?? '')
        .filter(Boolean)
        .join('\n')
    })() || p.shortDesc || '',
    images: (p.images ?? []).map((img: any) => mediaUrl(img.image)).filter(Boolean) as string[],
    variants: (p.variants ?? []).map((v: any) => ({
      name: v.name,
      options: (v.options ?? []).map((o: any) => ({ label: o.label ?? String(o) })),
    })),
    specs: (p.specs ?? []).map((s: any) => ({ label: s.label, value: s.value })),
    trustBadges: [
      { icon: 'truck' as const, text: 'Free shipping $50+' },
      { icon: 'refresh' as const, text: '30-day returns' },
      { icon: 'shield' as const, text: 'Secure checkout' },
    ],
  }

  const relatedProducts = relatedRaw.map((r: any) => ({
    id: String(r.id),
    name: r.name,
    slug: r.slug,
    price: r.pricing?.price ?? 0,
    comparePrice: r.pricing?.comparePrice,
    image: mediaUrl(r.images?.[0]?.image) ?? '',
    stock: r.inventory?.stock ?? 0,
    rating: r.ratings?.average ?? 0,
    reviewCount: r.ratings?.count ?? 0,
  }))

  return (
    <div className="container py-8">
      <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: product.name }]} className="mb-6" />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} reviews={reviews} />
    </div>
  )
}
