import type { MarkdownDocument } from '@tanstack/markdown'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allPosts, allReadings } from 'content-collections'
import { selectPublished } from './posts'
import { shelve } from './readings'

// Server functions keep the collections (and every document's AST) out of the client bundle:
// prerendered pages embed their own data, client navigations fetch only what they need.

const includeDrafts = import.meta.env.DEV
const published = () => selectPublished(allPosts, { includeDrafts })

export const listPosts = createServerFn({ method: 'GET' }).handler(() =>
  published().map(({ documentJson: _json, headings: _headings, ...meta }) => meta),
)

export const getPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const post = published().find((p) => p.slug === slug)
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router idiom
    if (!post) throw notFound()
    const { documentJson, ...meta } = post
    return { ...meta, document: JSON.parse(documentJson) as MarkdownDocument }
  })

export const listReadings = createServerFn({ method: 'GET' }).handler(() => {
  const shelf = shelve(
    allReadings.map(({ documentJson: _json, ...meta }) => meta),
    { includeDrafts },
  )
  return shelf
})

export const getReading = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(({ data: slug }) => {
    const reading = allReadings.find((r) => r.slug === slug && (includeDrafts || !r.draft))
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- TanStack Router idiom
    if (!reading) throw notFound()
    const { documentJson, ...meta } = reading
    return { ...meta, document: JSON.parse(documentJson) as MarkdownDocument }
  })
