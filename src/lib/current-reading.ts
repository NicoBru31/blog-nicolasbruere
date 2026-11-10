import { createServerFn } from '@tanstack/react-start'
import { allReadings } from 'content-collections'
import { shelve } from './readings'

export type CurrentReading = {
  title: string
  author: string | null
  source: 'glossema' | 'blog'
  /** Fiche on this blog, when there is one for that book. */
  slug?: string
}

const CACHE_MS = 10 * 60 * 1000
let cache: { at: number; value: CurrentReading | null } | undefined

/**
 * The book being read right now, for the header.
 *
 * Source of truth is Glossema (the reading app): its Supabase exposes the owner's active reading
 * through the `blog_current_reading` RPC. Without that configuration — or if Supabase is slow or
 * down — it falls back to the newest "en cours" fiche in content/readings.
 *
 * Env (Cloudflare secrets / .dev.vars locally): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY.
 */
export const getCurrentReading = createServerFn({ method: 'GET' }).handler(async () => {
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.value
  const value = (await fromGlossema()) ?? fromBlog()
  cache = { at: Date.now(), value }
  return value
})

async function fromGlossema(): Promise<CurrentReading | null> {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  try {
    const response = await fetch(`${url}/rest/v1/rpc/blog_current_reading`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(2000),
    })
    if (!response.ok) return null
    const rows = (await response.json()) as { title: string; author: string | null }[]
    const row = rows[0]
    if (!row) return null
    return { title: row.title, author: row.author, source: 'glossema', slug: findFiche(row.title) }
  } catch {
    return null
  }
}

function fromBlog(): CurrentReading | null {
  const [reading] = shelve(allReadings, { includeDrafts: import.meta.env.DEV }).current
  if (!reading) return null
  return {
    title: reading.title,
    author: reading.author,
    source: 'blog',
    slug: reading.hasNotes ? reading.slug : undefined,
  }
}

function findFiche(title: string): string | undefined {
  const normalized = title.trim().toLowerCase()
  return allReadings.find(
    (reading) =>
      !reading.draft && reading.hasNotes && reading.title.trim().toLowerCase() === normalized,
  )?.slug
}
