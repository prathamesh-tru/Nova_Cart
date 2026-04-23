export const dynamic = 'force-dynamic'

import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { CartContent } from './CartContent'
import { getPayload } from '@/lib/payload'

function mediaUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media?.url ?? null
}

async function getCartPageData() {
  try {
    const payload = await getPayload()
    const data = await payload.findGlobal({ slug: 'cart-page', depth: 2 }) as any
    const upsellHeading: string = data?.upsellHeading ?? 'You Might Also Like'
    const upsellProducts = (data?.upsellProducts ?? [])
      .filter((p: any) => p && typeof p === 'object' && p.status === 'active')
      .map((p: any) => ({
        id: String(p.id),
        name: p.name,
        slug: p.slug,
        price: p.pricing?.price ?? 0,
        comparePrice: p.pricing?.comparePrice,
        image: mediaUrl(p.images?.[0]?.image) ?? `https://picsum.photos/seed/${p.id}/600/600`,
        stock: p.inventory?.stock ?? 0,
        rating: p.ratings?.average ?? 0,
        reviewCount: p.ratings?.count ?? 0,
      }))
    return { upsellProducts, upsellHeading }
  } catch {
    return { upsellProducts: [], upsellHeading: 'You Might Also Like' }
  }
}

export default async function CartPage() {
  const { upsellProducts, upsellHeading } = await getCartPageData()

  return (
    <div>
      <div className="container pt-8">
        <Breadcrumb items={[{ label: 'Cart' }]} className="mb-6" />
      </div>
      <CartContent upsellProducts={upsellProducts} upsellHeading={upsellHeading} />
    </div>
  )
}
