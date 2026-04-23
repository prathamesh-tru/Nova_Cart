import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'

function traceId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function resolveMediaUrls(mediaIds: number[]): Promise<Record<number, string>> {
  if (!mediaIds.length) return {}
  try {
    const payload = await getPayload()
    const result = await payload.find({
      collection: 'media',
      where: { id: { in: mediaIds } },
      limit: mediaIds.length,
      depth: 0,
    })
    return Object.fromEntries(result.docs.map((m: any) => [m.id, m.url ?? '']))
  } catch {
    return {}
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim() ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const indexId = searchParams.get('index') ?? process.env.TRUSEARCH_INDEX_ID ?? 'novacart'
  const entityType = searchParams.get('type') ?? ''

  if (!q) return NextResponse.json({ hits: [], total: 0 })

  const engineUrl = process.env.TRUSEARCH_ENGINE_URL
  const apiKey = process.env.TRUSEARCH_API_KEY

  if (!engineUrl || !apiKey) {
    return NextResponse.json({ error: 'TruSearch not configured' }, { status: 503 })
  }

  try {
    const res = await fetch(`${engineUrl}/api/v1/engine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-Api-Key': apiKey,
        'X-Trace-Id': traceId(),
        'X-Api-Version': '1.0',
        'User-Agent': 'TruSearch-Payload/0.2',
      },
      body: JSON.stringify({
        command: 'search',
        contract_version: '1.0.0',
        trace_id: traceId(),
        // Fetch more when filtering by entityType so we have enough after client-side filter
        payload: { indexId, query: q, limit: entityType ? limit * 5 : limit },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data?.error ?? 'Search failed' }, { status: res.status })
    }

    const allItems: any[] = data?.data?.items ?? data?.items ?? []
    const total: number = data?.data?.queryAnalysis?.pagination?.totalHits ?? data?.data?.total ?? allItems.length

    const items = entityType
      ? allItems.filter((item: any) => (item.entityType ?? item.attributes?.entity_type) === entityType).slice(0, limit)
      : allItems

    // Collect all image media IDs from product results so we can resolve URLs in one query
    const mediaIds = new Set<number>()
    items.forEach((item: any) => {
      const images: any[] = item.attributes?.fields?.images ?? []
      images.forEach((img: any) => {
        if (typeof img.image === 'number') mediaIds.add(img.image)
      })
    })
    const mediaUrls = await resolveMediaUrls(Array.from(mediaIds))

    const hits = items.map((item: any) => {
      const images: any[] = item.attributes?.fields?.images ?? []
      const firstImageId = images[0]?.image
      const imageUrl = typeof firstImageId === 'number'
        ? (mediaUrls[firstImageId] ?? '/placeholder.jpg')
        : typeof firstImageId === 'object'
          ? (firstImageId?.url ?? '/placeholder.jpg')
          : '/placeholder.jpg'

      return {
        id: item.entityId ?? item.id,
        entityType: item.entityType ?? item.attributes?.entity_type,
        title: item.attributes?.title ?? '',
        url: item.attributes?.url ?? '',
        slug: item.attributes?.fields?.slug ?? '',
        imageUrl,
        fields: item.attributes?.fields ?? {},
        score: item.score ?? 0,
      }
    })

    return NextResponse.json({ hits, total })
  } catch (err) {
    console.error('TruSearch search error:', err)
    return NextResponse.json({ error: 'Search unavailable' }, { status: 503 })
  }
}
