import { NextRequest, NextResponse } from 'next/server'

function traceId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim() ?? ''
  const limit = parseInt(searchParams.get('limit') ?? '10')
  const indexId = searchParams.get('index') ?? process.env.TRUSEARCH_INDEX_ID ?? 'novacart'

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
        payload: { indexId, query: q, limit },
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return NextResponse.json({ error: data?.error ?? 'Search failed' }, { status: res.status })
    }

    const hits = data?.data?.hits ?? data?.hits ?? []
    const total = data?.data?.total ?? data?.total ?? hits.length

    return NextResponse.json({ hits, total })
  } catch (err) {
    console.error('TruSearch search error:', err)
    return NextResponse.json({ error: 'Search unavailable' }, { status: 503 })
  }
}
