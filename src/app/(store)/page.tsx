export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Truck, RefreshCw, ShieldCheck, HeadphonesIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ProductCarousel } from '@/components/shop/ProductCarousel'
import { getPayload } from '@/lib/payload'

const ICON_MAP: Record<string, React.ElementType> = {
  truck: Truck,
  refresh: RefreshCw,
  shield: ShieldCheck,
  headphones: HeadphonesIcon,
}

function mediaUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media?.url ?? null
}

async function getHomeData() {
  const payload = await getPayload()

  // Fetch globals and collections independently so one failure doesn't block others
  const [homepageRaw, siteSettingsRaw, productsResult, categoriesResult, genderCatsResult] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', depth: 1 }).catch(() => null),
    payload.findGlobal({ slug: 'site-settings', depth: 1 }).catch(() => null),
    payload.find({ collection: 'products', where: { status: { equals: 'active' } }, sort: '-createdAt', limit: 12, depth: 2 }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'categories', limit: 6, depth: 1 }).catch(() => ({ docs: [] })),
    payload.find({ collection: 'categories', where: { slug: { in: ['women', 'men'] } }, limit: 2, depth: 1 }).catch(() => ({ docs: [] })),
  ])

  const homepage = homepageRaw as any
  const siteSettings = siteSettingsRaw as any

  // If admin hand-picked featured products in the global, use those IDs to re-fetch
  let products: any[] = []
  const pickedIds: string[] = (homepage?.featuredProducts ?? [])
    .filter((p: any) => p && (typeof p === 'string' || typeof p === 'number'))
    .map(String)

  if (pickedIds.length > 0) {
    const picked = await payload.find({
      collection: 'products',
      where: { id: { in: pickedIds }, status: { equals: 'active' } },
      limit: 12,
      depth: 2,
    }).catch(() => ({ docs: [] }))
    products = picked.docs
  } else {
    products = productsResult.docs
  }

  const mappedProducts = products.map((p: any) => ({
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    price: p.pricing?.price ?? 0,
    comparePrice: p.pricing?.comparePrice,
    image: mediaUrl(p.images?.[0]?.image) ?? `https://picsum.photos/seed/${p.id}/600/600`,
    stock: p.inventory?.stock ?? 0,
    rating: p.ratings?.average ?? 0,
    reviewCount: p.ratings?.count ?? 0,
    currency: p.pricing?.currency ?? 'USD',
    category: (p.categories?.[0] as any)?.name ?? '',
  }))

  // If admin selected featured categories, fetch those; otherwise use first 6
  let categories: any[] = []
  const pickedCatIds: string[] = (homepage?.featuredCategories ?? [])
    .filter((c: any) => c && (typeof c === 'string' || typeof c === 'number'))
    .map(String)

  if (pickedCatIds.length > 0) {
    const picked = await payload.find({
      collection: 'categories',
      where: { id: { in: pickedCatIds } },
      limit: 6,
      depth: 1,
    }).catch(() => ({ docs: [] }))
    categories = picked.docs
  } else {
    categories = categoriesResult.docs
  }

  // Sort gender cats so Women comes first
  const genderCats = [...genderCatsResult.docs].sort((a: any, b: any) =>
    a.slug === 'women' ? -1 : b.slug === 'women' ? 1 : 0
  )

  return { homepage, siteSettings, products: mappedProducts, categories, genderCats }
}

export default async function HomePage() {
  const { homepage, siteSettings, products, categories, genderCats } = await getHomeData()

  const hero = homepage?.hero
  const heroImage = mediaUrl(hero?.bgImage) ?? 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&q=80'
  const heroStats: { value: string; label: string }[] = hero?.stats ?? []
  const trustBadges: { icon: string; title: string; description: string }[] = homepage?.trustBadges ?? []
  const promoBanners: { label: string; title: string; image: any; link: string }[] = homepage?.promoBanners ?? []
  const newsletter = homepage?.newsletter

  return (
    <main className="geo-bg min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        <Image src={heroImage} alt="Hero" fill className="object-cover object-center" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />
        <div className="relative container">
          <div className="max-w-xl text-white animate-fade-in">
            <Badge className="mb-4 bg-white/10 text-white/90 border-white/20 text-sm tracking-widest uppercase">
              {siteSettings?.tagline ?? 'New Season Collection'}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-sans font-black leading-tight mb-4">
              {hero?.heading ?? 'Discover Your Perfect Style'}
            </h1>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              {hero?.subheading ?? 'Curated fashion for the modern lifestyle.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 shadow-lg font-bold px-8 py-3">
                <Link href={hero?.ctaLink ?? '/shop'}>
                  {hero?.ctaText ?? 'Shop Now'} <ArrowRight className="h-5 w-5 ml-1" />
                </Link>
              </Button>
              {(hero?.secondaryCtaText || hero?.secondaryCtaLink) && (
                <Button asChild size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-bold px-8 py-3">
                  <Link href={hero?.secondaryCtaLink ?? '/about'}>
                    {hero?.secondaryCtaText ?? 'Our Story'}
                  </Link>
                </Button>
              )}
            </div>
            {heroStats.length > 0 && (
              <div className="mt-10 flex items-center gap-6 text-white/70 text-sm flex-wrap">
                {heroStats.map((stat, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-lg">{stat.value}</span> {stat.label}
                    {i < heroStats.length - 1 && <span className="ml-6 h-4 w-px bg-white/30" />}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Men / Women Split ────────────────────────────────── */}
      {genderCats.length >= 2 && (
        <section className="grid grid-cols-1 md:grid-cols-2 h-[70vh] min-h-[420px]">
          {genderCats.map((cat: any, i: number) => {
            const img = mediaUrl(cat.image)
            return (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group relative overflow-hidden block"
              >
                {img ? (
                  <Image
                    src={img}
                    alt={cat.name}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="50vw"
                  />
                ) : (
                  <div className={`absolute inset-0 ${i === 0 ? 'bg-gray-800' : 'bg-gray-600'}`} />
                )}
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                {/* hover tint */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* divider line between panels */}
                {i === 0 && (
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-px bg-white/20 z-10" />
                )}
                {/* content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
                  {cat.itemCount && (
                    <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                      {cat.itemCount}
                    </p>
                  )}
                  <h2 className="text-5xl md:text-6xl font-sans font-black text-white tracking-tight leading-none mb-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                    {cat.name.toUpperCase()}
                  </h2>
                  <span className="inline-flex items-center gap-2 text-white font-semibold text-sm border border-white/50 rounded-full px-5 py-2 w-fit opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white/10 backdrop-blur-sm">
                    Shop {cat.name} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )
          })}
        </section>
      )}

      {/* ── Categories ───────────────────────────────────────── */}
      {categories.length > 0 && (
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-3">Explore</p>
              <h2 className="text-4xl font-sans font-black">Shop by Category</h2>
            </div>

            <div className={`grid gap-3 mb-3 ${categories.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3'}`}>
              {categories.slice(0, 3).map((cat: any) => {
                const img = mediaUrl(cat.image)
                return (
                  <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[3/4] block bg-gray-100">
                    {img ? (
                      <Image src={img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-600" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {cat.itemCount && <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-1">{cat.itemCount}</p>}
                      <h3 className="text-white text-2xl font-black tracking-tight">{cat.name}</h3>
                      <span className="inline-flex items-center gap-1 text-white/80 text-xs font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Shop Now <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>

            {categories.length > 3 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.slice(3, 6).map((cat: any) => {
                  const img = mediaUrl(cat.image)
                  return (
                    <Link key={cat.id} href={`/shop?category=${cat.slug}`} className="group relative overflow-hidden rounded-2xl aspect-[4/3] block bg-gray-100">
                      {img ? (
                        <Image src={img} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-500" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        {cat.itemCount && <p className="text-white/70 text-xs font-medium tracking-widest uppercase mb-1">{cat.itemCount}</p>}
                        <h3 className="text-white text-xl font-black tracking-tight">{cat.name}</h3>
                        <span className="inline-flex items-center gap-1 text-white/80 text-xs font-medium mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Shop Now <ArrowRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Featured Products ─────────────────────────────────── */}
      {products.length > 0 && (
        <section className="py-16">
          <div className="container">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-semibold tracking-[0.25em] uppercase text-muted-foreground mb-2">Hand-picked</p>
                <h2 className="text-3xl font-sans font-black">Featured Products</h2>
              </div>
              <Button variant="outline" asChild className="border-black text-black hover:bg-black hover:text-white">
                <Link href="/shop">View All <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
            <ProductCarousel products={products} />
          </div>
        </section>
      )}

      {/* ── Promo Banners ─────────────────────────────────────── */}
      {promoBanners.length > 0 && (
        <section className="py-8">
          <div className={`container grid grid-cols-1 ${promoBanners.length > 1 ? 'md:grid-cols-2' : ''} gap-5`}>
            {promoBanners.map((banner, i) => {
              const img = mediaUrl(banner.image)
              return (
                <div key={i} className="relative overflow-hidden rounded-2xl h-56 group cursor-pointer">
                  {img ? (
                    <Image src={img} alt={banner.title ?? ''} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-700" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex flex-col justify-center px-8">
                    {banner.label && <p className="text-white/80 text-sm font-medium mb-1">{banner.label}</p>}
                    {banner.title && <h3 className="text-white text-2xl font-sans font-bold mb-3">{banner.title}</h3>}
                    {banner.link && (
                      <Button asChild size="sm" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black w-fit">
                        <Link href={banner.link}>Shop Now</Link>
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── Trust Badges ──────────────────────────────────────── */}
      {trustBadges.length > 0 && (
        <section className="py-12">
          <div className="container">
            <div className={`grid grid-cols-2 gap-6 ${trustBadges.length >= 4 ? 'md:grid-cols-4' : `md:grid-cols-${trustBadges.length}`}`}>
              {trustBadges.map((badge, i) => {
                const Icon = ICON_MAP[badge.icon] ?? ShieldCheck
                return (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border hover:shadow-sm transition-shadow">
                    <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{badge.title}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── Newsletter ────────────────────────────────────────── */}
      <section className="py-16 bg-black text-white">
        <div className="container text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-sans font-bold mb-3">
            {newsletter?.heading ?? 'Get 10% Off Your First Order'}
          </h2>
          <p className="text-white/70 mb-6">
            {newsletter?.subheading ?? 'Subscribe to our newsletter and unlock exclusive deals.'}
          </p>
          <form className="flex flex-col sm:flex-row gap-3 justify-center" action="/api/newsletter" method="POST">
            <input name="email" type="email" placeholder="Enter your email address" className="flex-1 max-w-sm rounded-xl px-4 py-3 text-black bg-white focus:outline-none focus:ring-2 focus:ring-white/50" />
            <Button type="submit" size="lg" className="bg-white text-black hover:bg-gray-100 font-bold">Subscribe</Button>
          </form>
          <p className="text-white/40 text-xs mt-3">No spam, unsubscribe anytime.</p>
        </div>
      </section>

    </main>
  )
}
