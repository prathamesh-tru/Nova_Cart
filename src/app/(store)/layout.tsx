import type { Metadata } from 'next'
import Script from 'next/script'
import '@/styles/globals.css'
import { Toaster } from 'sonner'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { SearchOverlay } from '@/components/layout/SearchOverlay'
import { AnnouncementBar } from '@/components/layout/AnnouncementBar'
import { getPayload } from '@/lib/payload'

export async function generateMetadata() {
  try {
    const payload = await getPayload()
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 }) as any
    const siteName = settings?.siteName ?? 'NovaCart'
    const tagline = settings?.tagline ?? 'Discover Your Style'
    return {
      title: { default: siteName, template: `%s | ${siteName}` },
      description: `${tagline} — Premium products curated for discerning shoppers.`,
    }
  } catch {
    return {
      title: { default: 'NovaCart', template: '%s | NovaCart' },
      description: 'Discover Your Style — Premium products curated for discerning shoppers.',
    }
  }
}

export default async function StoreLayout({ children }: { children: React.ReactNode }) {
  let announcement: string | null = null
  let siteName = 'NovaCart'
  let tagline = 'Discover Your Style'
  let navItems: { label: string; link: string }[] = []
  let footerLinks: { heading: string; links: { label: string; href: string }[] }[] = []
  let socialLinks: Record<string, string> = {}

  try {
    const payload = await getPayload()
    const [settings, nav] = await Promise.all([
      payload.findGlobal({ slug: 'site-settings', depth: 0 }).catch(() => null) as any,
      payload.findGlobal({ slug: 'navigation', depth: 0 }).catch(() => null) as any,
    ])
    announcement = settings?.announcement ?? null
    siteName = settings?.siteName ?? siteName
    tagline = settings?.tagline ?? tagline
    socialLinks = {
      instagram: settings?.socialLinks?.instagram ?? '',
      twitter: settings?.socialLinks?.twitter ?? '',
      facebook: settings?.socialLinks?.facebook ?? '',
      youtube: settings?.socialLinks?.youtube ?? '',
    }
    navItems = (nav?.navItems ?? []) as typeof navItems
    footerLinks = (nav?.footerLinks ?? []) as typeof footerLinks
  } catch {
    // use defaults if CMS not ready
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://dev-trusearch-engine.specbee.site" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://dev-trusearch-engine.specbee.site" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/trusearch/trusearch-widgets.css" />
        {/* process shim required by the TruSearch IIFE bundle (React bundle pattern) */}
        <script dangerouslySetInnerHTML={{ __html: "window.process=window.process||{env:{NODE_ENV:'production'}}" }} />
      </head>
      <body className="font-sans antialiased min-h-screen">
        {announcement && <AnnouncementBar message={announcement} />}
        <Navbar navItems={navItems} siteName={siteName} />
        <CartDrawer />
        <SearchOverlay />
        <main className="min-h-screen">{children}</main>
        <Footer siteName={siteName} tagline={tagline} footerLinks={footerLinks} socialLinks={socialLinks} />
        <Toaster position="top-right" richColors closeButton />
        <Script src="/trusearch/trusearch-widgets.iife.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
