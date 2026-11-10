import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'
import { compileMarkdown } from './src/lib/markdown/compile'
import { highlightCode } from './src/lib/markdown/highlighter'
import { readingTime, slugFromDirectory } from './src/lib/posts'

export const TAGS = ['react', 'rust', 'java', 'expo', 'ci-cd', 'archi', 'tooling'] as const

const posts = defineCollection({
  name: 'posts',
  directory: 'content/posts',
  include: '*/index.md',
  schema: z.object({
    title: z.string().max(80),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.enum(TAGS)).min(1),
    draft: z.boolean().default(false),
    content: z.string(),
  }),
  // Runs at build time: the highlighter never reaches the client bundle.
  transform: ({ content, _meta, ...data }) => {
    const document = compileMarkdown(content, highlightCode)
    return {
      ...data,
      slug: slugFromDirectory(_meta.directory),
      readingTime: readingTime(content),
      headings: (document.headings ?? []).map(({ id, text, level }) => ({ id, text, level })),
      // Stored as a string: MarkdownDocument's TS interfaces don't satisfy content-collections'
      // Serializable constraint. Parsed back in src/lib/content.ts (server side).
      documentJson: JSON.stringify(document),
    }
  },
})

export default defineConfig({ content: [posts] })
