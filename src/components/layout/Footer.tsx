import Link from 'next/link'
import { ShoppingBag, Instagram, Twitter, Facebook, Youtube, Linkedin, Mail } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface FooterLink { label: string; href: string }
interface FooterSection { heading: string; links: FooterLink[] }

interface FooterProps {
  siteName?: string
  tagline?: string
  footerLinks?: FooterSection[]
  socialLinks?: Record<string, string>
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: Instagram,
  twitter: Twitter,
  facebook: Facebook,
  youtube: Youtube,
  linkedin: Linkedin,
}

const DEFAULT_FOOTER: FooterSection[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'All Products', href: '/shop' },
      { label: 'New Arrivals', href: '/shop?sort=newest' },
      { label: 'Sale', href: '/shop?sort=discount' },
      { label: 'Blog', href: '/blog' },
    ],
  },
  {
    heading: 'Support',
    links: [
      { label: 'Contact Us', href: '/contact' },
      { label: 'FAQ', href: '/about#faq' },
      { label: 'Shipping Info', href: '/about#shipping' },
      { label: 'Returns', href: '/about#returns' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Careers', href: '/about#careers' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
]

export function Footer({ siteName = 'NovaCart', tagline = 'Discover Your Style', footerLinks, socialLinks }: FooterProps) {
  const sections = footerLinks?.length ? footerLinks : DEFAULT_FOOTER

  return (
    <footer className="bg-primary-800 text-white/90 mt-16">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold text-white mb-3">
              <ShoppingBag className="h-6 w-6 text-blue-300" />
              {siteName}
            </Link>
            <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-xs">{tagline}</p>
            {/* Social */}
            {socialLinks && (
              <div className="flex gap-3">
                {Object.entries(socialLinks).map(([key, url]) => {
                  const Icon = ICON_MAP[key]
                  if (!Icon || !url) return null
                  return (
                    <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                      className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                      <Icon className="h-4 w-4" />
                    </a>
                  )
                })}
              </div>
            )}
            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm font-medium mb-2 text-white/90">Subscribe to our newsletter</p>
              <form className="flex gap-2" action="/api/newsletter" method="POST">
                <Input name="email" type="email" placeholder="you@email.com"
                  className="bg-white/10 border-white/20 placeholder:text-white/40 text-white focus-visible:ring-blue-400" />
                <Button variant="accent" size="sm" type="submit"><Mail className="h-4 w-4" /></Button>
              </form>
            </div>
          </div>

          {/* Links */}
          {sections.map((section) => (
            <div key={section.heading}>
              <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{section.heading}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
        <span>© {new Date().getFullYear()} {siteName}. All rights reserved.</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-white/80 transition-colors">Terms</Link>
          <Link href="/sitemap" className="hover:text-white/80 transition-colors">Sitemap</Link>
        </div>
      </div>
    </footer>
  )
}
