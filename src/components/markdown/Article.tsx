import type { MarkdownDocument } from '@tanstack/markdown'
import { Markdown, type MarkdownComponents } from '@tanstack/markdown/react'
import { CodeBlock } from './CodeBlock'
import { Counter } from './Counter'

// Keys must match the tags emitted by src/lib/markdown/compile.ts.
const components = {
  'blog-code': CodeBlock,
  'blog-counter': Counter,
  a(props) {
    const external = /^https?:\/\//i.test(props.href ?? '')
    return <a {...props} {...(external && { target: '_blank', rel: 'noopener noreferrer' })} />
  },
} satisfies MarkdownComponents

/** Renders a pre-compiled document: no parsing or highlighting happens in the browser. */
export function Article({ document }: { document: MarkdownDocument }) {
  return (
    <div className="markdown-renderer prose prose-zinc dark:prose-invert max-w-none">
      <Markdown components={components}>{document}</Markdown>
    </div>
  )
}
