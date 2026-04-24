'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Search, X, TrendingUp, Clock, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUiStore } from '@/store/ui'
import { Input } from '@/components/ui/input'
import { TRENDING_SEARCHES } from '@/lib/constants'
import { formatPrice } from '@/lib/utils'

declare global {
  interface Window {
    TruSearchWidgets?: {
      mount: (
        type: 'autocomplete' | 'search-page',
        el: Element,
        opts: Record<string, unknown>,
      ) => { update: (opts: Record<string, unknown>) => void; unmount: () => void } | undefined
    }
  }
}

const PANEL_ID = process.env.NEXT_PUBLIC_TRUSEARCH_AUTOCOMPLETE_PANEL_ID ?? ''
const TS_API_URL = `${process.env.NEXT_PUBLIC_TRUSEARCH_ENGINE_URL ?? 'https://dev-trusearch-engine.specbee.site'}/api/v1/engine`
const TS_API_KEY = process.env.NEXT_PUBLIC_TRUSEARCH_API_KEY ?? ''

function stripHtml(str: string) {
  return str.replace(/<[^>]*>/g, '').trim()
}

// Cache section entityTypes from the panel config so federated_suggest
// filtering doesn't depend on the widget re-sending them in the request.
const panelSectionEntityTypes: Record<string, string> = {}

async function tsFetch(command: string, payload: Record<string, unknown>) {
  // Force correct indexId — panel config may point to a different index
  const patchedPayload = { ...payload, indexId: 'novacart' }
  const res = await fetch(TS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': TS_API_KEY },
    body: JSON.stringify({ command, contractVersion: '1.0.0', payload: patchedPayload }),
  })
  if (!res.ok) throw new Error(`TruSearch API error: ${res.status}`)
  const json = await res.json()
  if (json.status === 'error') throw new Error(json.error?.message ?? 'Unknown error')
  const data = json.data

  if (command === 'autocomplete_panel_get') {
    // Cache entityType per section key from the panel config
    const sections = (data?.sections as Array<{ key: string; entityType?: string }> | undefined) ?? []
    for (const s of sections) {
      if (s.key && s.entityType) panelSectionEntityTypes[s.key] = s.entityType
    }
  }

  if (command === 'federated_suggest') {
    // Clean popular searches: strip HTML tags, filter URL fragments
    if (data?.popularSearches) {
      data.popularSearches = (data.popularSearches as Array<{ text: string }>)
        .map((s) => ({ ...s, text: stripHtml(s.text) }))
        .filter((s) => {
          const t = s.text
          return t.length > 1 && !t.includes('=') && !t.includes('/') && !t.includes('...')
        })
    }

    // Build section→entityType map: prefer cached panel config, fall back to request payload
    const reqSections = (payload.sections as Array<{ key: string; entityType?: string }> | undefined) ?? []
    const sectionEntityTypes: Record<string, string> = { ...panelSectionEntityTypes }
    for (const s of reqSections) {
      if (s.key && s.entityType) sectionEntityTypes[s.key] = s.entityType
    }

    // Enforce correct entity type per section to prevent cross-contamination
    if (data?.sections && Object.keys(sectionEntityTypes).length > 0) {
      for (const [key, sec] of Object.entries(data.sections as Record<string, { items?: any[] }>)) {
        const expectedType = sectionEntityTypes[key]
        if (expectedType && Array.isArray(sec.items)) {
          sec.items = sec.items.filter((item: any) => item.entityType === expectedType)
        }
      }
    }
  }

  return data
}

// ── TruSearch panel — mounted ONCE on page load, never torn down ──────────────
// This pre-warms the panel config + popular-searches fetch so the overlay is
// instant when the user actually opens it.

function TruSearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<{ update: (o: Record<string, unknown>) => void; unmount: () => void } | undefined>(undefined)
  // Keep latest callbacks in refs so the widget doesn't need to remount when they change
  const onCloseRef = useRef(onClose)
  const routerRef = useRef(router)
  useEffect(() => { onCloseRef.current = onClose }, [onClose])
  useEffect(() => { routerRef.current = router }, [router])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function doMount() {
      if (!el || !window.TruSearchWidgets) return
      widgetRef.current = window.TruSearchWidgets.mount('autocomplete', el, {
        id: PANEL_ID,
        apiUrl: TS_API_URL,
        apiKey: TS_API_KEY,
        indexId: 'novacart',
        showSearchInput: true,
        inline: true,
        fetchFn: tsFetch,
        onSubmit: (q: string) => {
          onCloseRef.current()
          routerRef.current.push(`/search?q=${encodeURIComponent(q)}`)
        },
        onResultClick: (_id: string, url?: string) => {
          if (url) { onCloseRef.current(); routerRef.current.push(url) }
        },
        onClose: () => onCloseRef.current(),
      }) as typeof widgetRef.current
    }

    if (window.TruSearchWidgets) {
      doMount()
    } else {
      const t = setInterval(() => {
        if (window.TruSearchWidgets) { clearInterval(t); doMount() }
      }, 50)
      return () => clearInterval(t)
    }
    // No cleanup — we keep the widget mounted permanently for instant re-open
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '200px',
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        colorScheme: 'light',
        '--tws-bg': '#ffffff',
        '--tws-bg-accent': '#f3f4f6',
        '--tws-bg-hover': '#f9fafb',
        '--tws-text': '#111827',
        '--tws-text-muted': '#6b7280',
        '--tws-border': '#e5e7eb',
        '--tws-primary': '#2563eb',
        '--tws-primary-fg': '#ffffff',
      } as React.CSSProperties}
    />
  )
}

// ── Fallback: Payload-based inner panel ──────────────────────────────────────

interface SearchResult {
  id: string
  name: string
  slug: string
  price: number
  image: string
}

function FallbackPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100)
    setRecentSearches(JSON.parse(localStorage.getItem('recentSearches') ?? '[]'))
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }
    const t = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=20&type=products`)
        if (res.ok) {
          const data = await res.json()
          setResults(
            (data.hits ?? []).slice(0, 5).map((h: any) => ({
              id: h.id,
              name: h.title,
              slug: h.slug ?? h.fields?.slug ?? '',
              price: h.fields?.pricing?.price ?? 0,
              image: h.imageUrl ?? '/placeholder.jpg',
            }))
          )
        }
      } finally { setLoading(false) }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  function handleSearch(q: string) {
    if (!q.trim()) return
    const recent = [q, ...recentSearches.filter((s) => s !== q)].slice(0, 5)
    localStorage.setItem('recentSearches', JSON.stringify(recent))
    onClose()
    router.push(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 border-b">
        <Search className="h-5 w-5 text-muted-foreground shrink-0" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(query); if (e.key === 'Escape') onClose() }}
          placeholder="Search products, categories..."
          className="border-0 p-0 text-base focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground font-medium text-sm">
          Cancel
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-4">
        {query && results.length > 0 ? (
          <div>
            <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">Products</p>
            {results.map((r) => (
              <Link key={r.id} href={`/shop/${r.slug}`} onClick={onClose}
                className="flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-colors">
                <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted shrink-0">
                  <Image src={r.image} alt={r.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.name}</p>
                  <p className="text-sm text-accent font-semibold">{formatPrice(r.price)}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
            <button
              onClick={() => handleSearch(query)}
              className="w-full mt-3 py-2 text-sm text-accent font-medium hover:bg-accent/5 rounded-xl transition-colors"
            >
              See all results for &quot;{query}&quot; →
            </button>
          </div>
        ) : query && !loading ? (
          <p className="text-center text-muted-foreground py-8">No results for &quot;{query}&quot;</p>
        ) : !query ? (
          <div className="space-y-4">
            {recentSearches.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide flex items-center gap-1">
                  <Clock className="h-3 w-3" />Recent
                </p>
                {recentSearches.map((s) => (
                  <button key={s} onClick={() => handleSearch(s)}
                    className="flex items-center gap-2 w-full text-sm py-1.5 px-2 rounded-lg hover:bg-muted/50 text-left">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />{s}
                  </button>
                ))}
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />Trending
              </p>
              {TRENDING_SEARCHES.map((s) => (
                <button key={s} onClick={() => handleSearch(s)}
                  className="flex items-center gap-2 w-full text-sm py-1.5 px-2 rounded-lg hover:bg-muted/50 text-left">
                  <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />{s}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}

// ── Shell ─────────────────────────────────────────────────────────────────────
// The TruSearch widget container lives OUTSIDE AnimatePresence so it is never
// unmounted. Only the backdrop fades in/out. The widget panel slides and fades
// via `animate` (not conditional rendering), keeping its internal state warm.

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUiStore()

  if (!PANEL_ID) {
    // Fallback: simple conditional render is fine (no pre-warming needed)
    return (
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeSearch}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="container mx-auto pt-16 max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-background rounded-2xl shadow-2xl border overflow-hidden">
                <FallbackPanel onClose={closeSearch} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <>
      {/* Backdrop — animates in/out independently */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={closeSearch}
          />
        )}
      </AnimatePresence>

      {/* Widget container — always in the DOM, slides/fades via `animate` */}
      <div
        className="fixed inset-0 z-50"
        style={{ pointerEvents: searchOpen ? 'auto' : 'none' }}
        aria-hidden={!searchOpen}
      >
        <motion.div
          initial={false}
          animate={{ opacity: searchOpen ? 1 : 0, y: searchOpen ? 0 : -20 }}
          transition={{ duration: 0.2 }}
          className="container mx-auto pt-16 pb-8 max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <TruSearchPanel onClose={closeSearch} />
        </motion.div>
      </div>
    </>
  )
}
