import { describe, expect, test } from 'bun:test'
import { CODE_BLOCK_TAG, compileMarkdown } from './compile'
import { highlightCode } from './highlighter'

const findAll = (value: unknown, predicate: (node: Record<string, unknown>) => boolean) => {
  const found: Record<string, unknown>[] = []
  const walk = (current: unknown) => {
    if (Array.isArray(current)) return current.forEach(walk)
    if (current === null || typeof current !== 'object') return
    const node = current as Record<string, unknown>
    if (predicate(node)) found.push(node)
    Object.values(node).forEach(walk)
  }
  walk(value)
  return found
}

describe('compileMarkdown', () => {
  test('replaces code fences with pre-highlighted component nodes', () => {
    const doc = compileMarkdown('```ts title="a.ts"\nconst x: number = 1\n```', highlightCode)
    const [block] = findAll(doc, (n) => n.tagName === CODE_BLOCK_TAG)
    const props = block?.properties as Record<string, string>

    expect(findAll(doc, (n) => n.type === 'code')).toHaveLength(0)
    expect(props.lang).toBe('ts')
    expect(props.code).toBe('const x: number = 1')
    expect(props.html).toContain('<span')
  })

  test('escapes source code inside highlighted markup', () => {
    const doc = compileMarkdown('```html\n<img src=x onerror=alert(1)>\n```', highlightCode)
    const [block] = findAll(doc, (n) => n.tagName === CODE_BLOCK_TAG)
    const html = (block?.properties as Record<string, string>).html

    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;')
  })

  test('highlights code nested inside lists', () => {
    const doc = compileMarkdown('- item\n\n  ```rust\n  fn main() {}\n  ```', highlightCode)
    expect(findAll(doc, (n) => n.type === 'code')).toHaveLength(0)
    expect(findAll(doc, (n) => n.tagName === CODE_BLOCK_TAG)).toHaveLength(1)
  })

  test('maps comment components to blog-* tags', () => {
    const doc = compileMarkdown('<!-- ::counter start="3" -->', highlightCode)
    const [component] = findAll(doc, (n) => n.type === 'component')

    expect(component?.tagName).toBe('blog-counter')
    expect(component?.properties).toEqual({ start: '3' })
  })

  test('keeps headings with ids for a table of contents', () => {
    const doc = compileMarkdown('## Getting started', highlightCode)
    expect(findAll(doc, (n) => n.type === 'heading')[0]?.id).toBe('getting-started')
  })

  test('produces serializable output', () => {
    const doc = compileMarkdown('# Title\n\n```ts\nlet a = 1\n```', highlightCode)
    expect(JSON.parse(JSON.stringify(doc))).toEqual(doc)
  })
})
