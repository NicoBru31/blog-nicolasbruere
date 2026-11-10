import { describe, expect, test } from 'bun:test'
import { groupByTag, readingTime, selectPublished, slugFromDirectory } from './posts'

const post = (slug: string, date: string, { draft = false, tags = ['react'] } = {}) => ({
  slug,
  pubDate: new Date(date),
  draft,
  tags,
})

describe('selectPublished', () => {
  test('excludes drafts by default', () => {
    const result = selectPublished([
      post('a', '2026-01-01'),
      post('b', '2026-02-01', { draft: true }),
    ])
    expect(result.map((p) => p.slug)).toEqual(['a'])
  })

  test('sorts newest first', () => {
    const result = selectPublished([post('old', '2026-01-01'), post('new', '2026-03-01')])
    expect(result.map((p) => p.slug)).toEqual(['new', 'old'])
  })

  test('includes drafts on demand', () => {
    const result = selectPublished([post('d', '2026-02-01', { draft: true })], {
      includeDrafts: true,
    })
    expect(result).toHaveLength(1)
  })
})

describe('groupByTag', () => {
  test('puts a multi-tag post in every group', () => {
    const groups = groupByTag([post('a', '2026-01-01', { tags: ['react', 'expo'] })])
    expect(groups.get('react')).toHaveLength(1)
    expect(groups.get('expo')).toHaveLength(1)
  })
})

describe('readingTime', () => {
  test('never returns less than one minute', () => {
    expect(readingTime('short')).toBe(1)
  })

  test('ignores code fences', () => {
    const code = `\`\`\`ts\n${'token '.repeat(2000)}\n\`\`\``
    expect(readingTime(`${'word '.repeat(440)}\n\n${code}`)).toBe(2)
  })
})

describe('slugFromDirectory', () => {
  test('strips the date prefix', () => {
    expect(slugFromDirectory('2026-11-hello-world')).toBe('hello-world')
    expect(slugFromDirectory('2026-11-10-hello-world')).toBe('hello-world')
  })

  test('keeps directories without a date', () => {
    expect(slugFromDirectory('about-this-blog')).toBe('about-this-blog')
  })
})
