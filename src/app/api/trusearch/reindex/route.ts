import { NextResponse } from 'next/server'
import { getPayload } from '@/lib/payload'
import { EngineClient, reindexCollection, reindexAll } from '@trusearch/payload'
import { trusearchOptions } from '@/payload.config'

const TS_ENGINE_URL = process.env.TRUSEARCH_ENGINE_URL ?? 'https://dev-trusearch-engine.specbee.site'
const TS_API_KEY = process.env.TRUSEARCH_API_KEY ?? ''
const INDEX_ID = trusearchOptions.defaultIndexId

function makeClient() {
  return new EngineClient({ engine: { baseUrl: TS_ENGINE_URL, apiKey: TS_API_KEY } } as any)
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const slug: string | undefined = (body as any).collection

    const payload = await getPayload()
    const client = makeClient()

    if (slug) {
      // Reindex a single collection
      const collectionCfg = trusearchOptions.collections.find((c) => c.slug === slug)
      if (!collectionCfg) {
        return NextResponse.json({ error: `No TruSearch config for collection: ${slug}` }, { status: 400 })
      }
      const result = await reindexCollection({
        payload: payload as any,
        client,
        collectionCfg: collectionCfg as any,
        indexId: INDEX_ID,
        pageSize: 50,
      })
      return NextResponse.json({ ok: true, result })
    }

    // Reindex ALL collections
    const results = await reindexAll({
      payload: payload as any,
      client,
      collections: trusearchOptions.collections as any[],
      resolveIndexId: () => INDEX_ID,
      pageSize: 50,
    })

    const summary = results.map((r) => `${r.collection}: ${r.indexed} indexed, ${r.errors} errors`)
    console.log('[trusearch/reindex-all] done:', summary)
    return NextResponse.json({ ok: true, results })
  } catch (err: any) {
    console.error('[trusearch/reindex]', err)
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) }, { status: 500 })
  }
}
