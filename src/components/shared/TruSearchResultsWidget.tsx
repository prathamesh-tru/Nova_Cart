'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

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

const TS_API_URL = process.env.NEXT_PUBLIC_TRUSEARCH_ENGINE_URL ?? 'https://dev-trusearch-engine.specbee.site'
const TS_API_KEY = process.env.NEXT_PUBLIC_TRUSEARCH_API_KEY ?? ''

interface Props {
  widgetId: string
  query?: string
}

export function TruSearchResultsWidget({ widgetId, query }: Props) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<{ update: (o: Record<string, unknown>) => void; unmount: () => void } | undefined>(undefined)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function doMount() {
      if (!el || !window.TruSearchWidgets) return
      widgetRef.current = window.TruSearchWidgets.mount('search-page', el, {
        id: widgetId,
        apiUrl: TS_API_URL,
        apiKey: TS_API_KEY,
        query: query ?? '',
        onSearch: (q: string) => {
          router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
        },
        onResultClick: (_id: string, _entityType?: string) => {},
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

    return () => { widgetRef.current?.unmount() }
  }, [widgetId, query, router])

  // Update query when URL changes without remounting
  useEffect(() => {
    widgetRef.current?.update({ query: query ?? '' })
  }, [query])

  return <div ref={containerRef} className="min-h-[400px]" />
}
