import { describe, expect, test } from 'bun:test'
import { blogPostingLd, jsonLd, websiteLd } from './seo'
import { SITE } from './site'

const post = {
  slug: 'all-in-on-bun',
  title: 'Bun',
  description: 'Why Bun',
  pubDate: new Date('2026-11-12'),
  tags: ['tooling', 'react'],
  readingTime: 4,
}

describe('jsonLd', () => {
  test('escapes < so a value cannot close the script tag', () => {
    expect(jsonLd({ headline: '</script><script>' })).not.toContain('</script>')
  })
})

describe('blogPostingLd', () => {
  test('points to the localized URL and falls back to pubDate for dateModified', () => {
    const ld = blogPostingLd(post, 'fr')
    expect(ld.url).toBe(`${SITE.url}/fr/posts/all-in-on-bun`)
    expect(ld.inLanguage).toBe('fr')
    expect(ld.dateModified).toBe(ld.datePublished)
    expect(ld.keywords).toBe('tooling, react')
    expect(ld.author.sameAs.length).toBeGreaterThan(0)
  })

  test('uses updatedDate when present', () => {
    const ld = blogPostingLd({ ...post, updatedDate: new Date('2026-12-01') }, 'en')
    expect(ld.dateModified).toBe('2026-12-01T00:00:00.000Z')
  })
})

describe('websiteLd', () => {
  test('links the site to its author', () => {
    const [site, person] = websiteLd('en', 'Blog')['@graph']
    expect(site).toMatchObject({ author: { '@id': person?.['@id'] } })
  })
})
