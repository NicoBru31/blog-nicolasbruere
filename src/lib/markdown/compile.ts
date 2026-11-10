import type {
  BlockNode,
  CodeBlockNode,
  CodeHighlighter,
  ComponentNode,
  MarkdownDocument,
} from '@tanstack/markdown'
import { calloutsExtension } from '@tanstack/markdown/extensions/callouts'
import { commentComponentsExtension } from '@tanstack/markdown/extensions/comment-components'
import { parseMarkdown } from '@tanstack/markdown/parser'

/** Tag emitted for pre-highlighted code blocks; mapped to <CodeBlock> by the React renderer. */
export const CODE_BLOCK_TAG = 'blog-code'
/** Prefix for comment components (`<!-- ::counter -->` → `blog-counter`). */
const COMPONENT_TAG_PREFIX = 'blog-'

const markdownExtensions = [
  calloutsExtension(),
  commentComponentsExtension({
    // The React renderer passes `properties` (not `attributes`) as props.
    transformComponent: (node) => ({
      ...node,
      tagName: `${COMPONENT_TAG_PREFIX}${node.name}`,
      properties: { ...node.attributes },
    }),
  }),
]

/**
 * Parse Markdown once at build time and replace every code fence with a component node
 * carrying already-highlighted markup. The resulting AST is plain JSON: the client renders it
 * without shipping the highlighter or its grammars.
 */
export function compileMarkdown(source: string, highlight: CodeHighlighter): MarkdownDocument {
  const document = parseMarkdown(source, { headingIds: true, extensions: markdownExtensions })
  return { ...document, children: replaceCodeBlocks(document.children, highlight) }
}

function replaceCodeBlocks(nodes: BlockNode[], highlight: CodeHighlighter): BlockNode[] {
  return nodes.map((node) => replaceDeep(node, highlight) as BlockNode)
}

// Code fences can sit inside lists, quotes, callouts or components: walk the whole tree.
function replaceDeep(value: unknown, highlight: CodeHighlighter): unknown {
  if (Array.isArray(value)) return value.map((item) => replaceDeep(item, highlight))
  if (value === null || typeof value !== 'object') return value
  const node = value as { type?: string }
  if (node.type === 'code') return toCodeComponent(node as CodeBlockNode, highlight)
  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, replaceDeep(child, highlight)]),
  )
}

function toCodeComponent(node: CodeBlockNode, highlight: CodeHighlighter): ComponentNode {
  const lang = node.lang ?? 'plaintext'
  const properties: Record<string, string> = {
    lang,
    code: node.value,
    html: highlight(node.value, node.lang, {
      meta: node.meta,
      highlightLines: node.highlightLines,
    }),
  }
  if (node.title) properties.title = node.title
  return {
    type: 'component',
    name: 'code',
    tagName: CODE_BLOCK_TAG,
    attributes: {},
    properties,
    children: [],
  }
}
