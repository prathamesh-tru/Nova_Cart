export const dynamic = 'force-dynamic'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import { getPayload } from '@/lib/payload'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

function mediaUrl(media: any): string | null {
  if (!media) return null
  if (typeof media === 'string') return media
  return media?.url ?? null
}

async function getAboutData() {
  try {
    const payload = await getPayload()
    return await payload.findGlobal({ slug: 'about-page', depth: 1 }) as any
  } catch {
    return null
  }
}

export default async function AboutPage() {
  const data = await getAboutData()

  const heroTitle = data?.heroTitle ?? 'Our Story'
  const heroImage = mediaUrl(data?.heroImage) ?? 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1400&q=80'
  const missionTitle = data?.missionTitle ?? 'Fashion That Empowers'
  const missionText = data?.missionText ?? 'Founded in 2020, NovaCart was born from a simple belief: everyone deserves to feel confident in what they wear. We curate premium fashion from around the world, making style accessible without compromising quality.'
  const missionText2 = data?.missionText2 ?? 'Today, we serve over 50,000 customers across 50+ countries, offering everything from everyday essentials to luxury statement pieces — all carefully selected by our team of fashion experts.'
  const missionImage = mediaUrl(data?.missionImage) ?? 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80'
  const stats: { value: string; label: string }[] = data?.stats ?? [
    { value: '50K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Premium Products' },
    { value: '4.9★', label: 'Average Rating' },
    { value: '50+', label: 'Countries Served' },
  ]
  const teamHeading = data?.teamHeading ?? 'Meet Our Team'
  const team: { name: string; role: string; image: any }[] = data?.team ?? []
  const ctaTitle = data?.ctaTitle ?? 'Ready to Elevate Your Style?'
  const ctaText = data?.ctaText ?? 'Join thousands of fashion-forward shoppers discovering their perfect look.'
  const ctaLink = data?.ctaLink ?? '/shop'
  const ctaButtonText = data?.ctaButtonText ?? 'Shop Now'

  return (
    <div>
      {/* Hero */}
      <section className="relative h-64 overflow-hidden">
        <Image src={heroImage} alt={heroTitle} fill className="object-cover" />
        <div className="absolute inset-0 bg-black/60 flex items-center">
          <div className="container text-white">
            <Breadcrumb items={[{ label: 'About' }]} className="mb-3 text-white/70" />
            <h1 className="text-4xl font-sans font-bold">{heroTitle}</h1>
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-20">
        {/* Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-sans font-bold mb-4">{missionTitle}</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{missionText}</p>
            {missionText2 && <p className="text-muted-foreground leading-relaxed">{missionText2}</p>}
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden">
            <Image src={missionImage} alt="Our Story" fill className="object-cover" />
          </div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center p-6 rounded-2xl bg-gray-50 border">
                <p className="text-4xl font-sans font-bold text-black mb-1">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Team */}
        {team.length > 0 && (
          <div>
            <h2 className="text-3xl font-sans font-bold mb-8 text-center">{teamHeading}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {team.map((member) => {
                const img = mediaUrl(member.image)
                return (
                  <div key={member.name} className="text-center">
                    <div className="relative h-48 w-48 rounded-full overflow-hidden mx-auto mb-4 border-4 border-gray-100">
                      {img ? (
                        <Image src={img} alt={member.name} fill className="object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                          {member.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-muted-foreground text-sm">{member.role}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center bg-black rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-sans font-bold mb-3">{ctaTitle}</h2>
          {ctaText && <p className="text-white/80 mb-6">{ctaText}</p>}
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
            <Link href={ctaLink}>{ctaButtonText}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
