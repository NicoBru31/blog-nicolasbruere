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
    // Prose colors are mapped to the theme tokens in styles.css (.markdown-renderer).
    <div className="markdown-renderer prose max-w-none leading-[1.75] prose-headings:font-medium prose-headings:tracking-tight prose-h2:mt-12">
      <Markdown components={components}>{document}</Markdown>
    </div>
  )
}
