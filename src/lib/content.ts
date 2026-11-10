import type { MarkdownDocument } from '@tanstack/markdown'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allPosts, allReadings } from 'content-collections'
import { type Locale, toLocale } from './i18n'
import { selectPublished } from './posts'
import { shelve } from './readings'

// Server functions keep the collections (and every document's AST) out of the client bundle:
// prerendered pages embed their own data, client navigations fetch only what they need.

const includeDrafts = import.meta.env.DEV

const validateLocale = (locale: string | undefined): Locale => toLocale(locale)
const validateSlug = (input: { slug: string; locale?: string }) => ({
  slug: input.slug,
  locale: toLocale(input.locale),
})

const postsIn = (locale: Locale) =>
  selectPublished(
    allPosts.filter((post) => post.locale === locale),
    { includeDrafts },
  )

export const listPosts = createServerFn({ method: 'GET' })
  .validator(validateLocale)
  .handler(({ data: locale }) =>
    postsIn(locale).map(({ documentJson: _json, headings: _headings, ...meta }) => meta),
  )

export const getPost = createServerFn({ method: 'GET' })
  .validator(validateSlug)
  .handler(({ data: { slug, locale } }) => {
    const post = postsIn(locale).find((p) => p.slug === slug)
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router idiom
    if (!post) throw notFound()
    const { documentJson, ...meta } = post
    return { ...meta, document: JSON.parse(documentJson) as MarkdownDocument }
  })

export const readingsIn = (locale: Locale) =>
  allReadings.filter((reading) => reading.locale === locale)

export const listReadings = createServerFn({ method: 'GET' })
  .validator(validateLocale)
  .handler(({ data: locale }) =>
    shelve(
      readingsIn(locale).map(({ documentJson: _json, ...meta }) => meta),
      { includeDrafts },
    ),
  )

export const getReading = createServerFn({ method: 'GET' })
  .validator(validateSlug)
  .handler(({ data: { slug, locale } }) => {
    const reading = readingsIn(locale).find((r) => r.slug === slug && (includeDrafts || !r.draft))
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router idiom
    if (!reading) throw notFound()
    const { documentJson, ...meta } = reading
    return { ...meta, document: JSON.parse(documentJson) as MarkdownDocument }
  })
