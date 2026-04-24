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

const TS_API_URL = `${process.env.NEXT_PUBLIC_TRUSEARCH_ENGINE_URL ?? 'https://dev-trusearch-engine.specbee.site'}/api/v1/engine`
const TS_API_KEY = process.env.NEXT_PUBLIC_TRUSEARCH_API_KEY ?? ''

async function fetchFn(command: string, payload: Record<string, unknown>) {
  // Force correct indexId — widget config may point to a different index
  const patchedPayload = { ...payload, indexId: 'novacart' }
  const res = await fetch(TS_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Api-Key': TS_API_KEY },
    body: JSON.stringify({ command, contractVersion: '1.0.0', payload: patchedPayload }),
  })
  if (!res.ok) throw new Error(`TruSearch error: ${res.status}`)
  const json = await res.json()
  if (json.status === 'error') throw new Error(json.error?.message ?? 'Unknown error')
  const data = json.data

  // Filter search results to products only — remove media/reviews/categories etc.
  if (command === 'search' && Array.isArray(data?.items)) {
    const seen = new Set<string>()
    data.items = data.items.filter((item: any) => {
      if (item.entityType !== 'products') return false
      // Deduplicate by entityId
      if (seen.has(item.entityId)) return false
      seen.add(item.entityId)
      return true
    })
    data.total = data.items.length
  }

  return data
}

interface Props {
  widgetId: string
  query?: string
}

export function TruSearchResultsWidget({ widgetId, query }: Props) {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<{ update: (o: Record<string, unknown>) => void; unmount: () => void } | undefined>(undefined)
  const routerRef = useRef(router)
  useEffect(() => { routerRef.current = router }, [router])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function doMount() {
      if (!el || !window.TruSearchWidgets) return
      widgetRef.current = window.TruSearchWidgets.mount('search-page', el, {
        id: widgetId,
        apiUrl: TS_API_URL,
        apiKey: TS_API_KEY,
        indexId: 'novacart',
        query: query ?? '',
        fetchFn,
        onSearch: (q: string) => {
          routerRef.current.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
        },
        onResultClick: (_id: string, url?: string) => {
          if (url) routerRef.current.push(url)
        },
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
  }, [widgetId, query]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    widgetRef.current?.update({ query: query ?? '' })
  }, [query])

  return <div ref={containerRef} className="min-h-[400px]" />
}
