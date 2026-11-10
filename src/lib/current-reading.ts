import { createServerFn } from '@tanstack/react-start'
import { allReadings } from 'content-collections'
import { type Locale, toLocale } from './i18n'
import { shelve } from './readings'

export type CurrentReading = {
  title: string
  author: string | null
  source: 'glossema' | 'blog'
  /** Fiche on this blog, when there is one for that book. */
  slug?: string
}

const CACHE_MS = 10 * 60 * 1000
let glossemaCache:
  { at: number; value: { title: string; author: string | null } | null } | undefined

/**
 * The book being read right now, for the header.
 *
 * Source of truth is Glossema (the reading app): its Supabase exposes the owner's active reading
 * through the `blog_current_reading` RPC. Without that configuration — or if Supabase is slow or
 * down — it falls back to the newest "en cours" fiche in content/readings.
 *
 * Env (Cloudflare secrets / .dev.vars locally): SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY.
 */
export const getCurrentReading = createServerFn({ method: 'GET' })
  .validator((locale: string | undefined) => toLocale(locale))
  .handler(async ({ data: locale }): Promise<CurrentReading | null> => {
    const fromApp = await fromGlossema()
    if (fromApp) return { ...fromApp, source: 'glossema', slug: findFiche(fromApp.title, locale) }
    return fromBlog(locale)
  })

async function fromGlossema() {
  if (glossemaCache && Date.now() - glossemaCache.at < CACHE_MS) return glossemaCache.value
  const value = await fetchGlossema()
  glossemaCache = { at: Date.now(), value }
  return value
}

async function fetchGlossema(): Promise<{ title: string; author: string | null } | null> {
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
    const [row] = (await response.json()) as { title: string; author: string | null }[]
    return row ? { title: row.title, author: row.author } : null
  } catch {
    return null
  }
}

const readingsIn = (locale: Locale) => allReadings.filter((reading) => reading.locale === locale)

function fromBlog(locale: Locale): CurrentReading | null {
  const [reading] = shelve(readingsIn(locale), { includeDrafts: import.meta.env.DEV }).current
  if (!reading) return null
  return {
    title: reading.title,
    author: reading.author,
    source: 'blog',
    slug: reading.hasNotes ? reading.slug : undefined,
  }
}

/** A fiche for the book Glossema reports, matched on its title in either language. */
function findFiche(title: string, locale: Locale): string | undefined {
  const normalized = title.trim().toLowerCase()
  const match = allReadings.find(
    (reading) => !reading.draft && reading.title.trim().toLowerCase() === normalized,
  )
  if (!match) return undefined
  // Link to the fiche in the reader's language, if it has notes there.
  const local = readingsIn(locale).find((reading) => reading.slug === match.slug)
  return local?.hasNotes ? local.slug : undefined
}
