import type { MarkdownDocument } from '@tanstack/markdown'
import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { allPosts } from 'content-collections'
import { selectPublished } from './posts'

// Server functions keep `allPosts` (and every post's AST) out of the client bundle:
// prerendered pages embed their own data, client navigations fetch only what they need.

const published = () => selectPublished(allPosts, { includeDrafts: import.meta.env.DEV })

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
