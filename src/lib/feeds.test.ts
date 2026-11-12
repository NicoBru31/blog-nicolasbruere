import { describe, expect, test } from 'bun:test'
import { llmsTxt, robotsTxt, rssXml, sitemapXml } from './feeds'
import { SITE } from './site'

const post = {
  slug: 'all-in-on-bun',
  title: 'Bun & <friends>',
  description: 'Fast "installs"',
  pubDate: new Date('2026-11-12'),
  tags: ['tooling'],
}

describe('sitemapXml', () => {
  const xml = sitemapXml([{ path: '/posts/x', lastmod: new Date('2026-11-12') }])

  test('lists the page once per locale', () => {
    expect(xml).toContain(`<loc>${SITE.url}/posts/x</loc>`)
    expect(xml).toContain(`<loc>${SITE.url}/fr/posts/x</loc>`)
    expect(xml.match(/<url>/g)).toHaveLength(2)
  })

  test('links every locale and x-default as alternates', () => {
    expect(xml).toContain(`hreflang="fr" href="${SITE.url}/fr/posts/x"`)
    expect(xml).toContain(`hreflang="x-default" href="${SITE.url}/posts/x"`)
    expect(xml).toContain('<lastmod>2026-11-12</lastmod>')
  })

  test('keeps the trailing slash on the home page only', () => {
    const home = sitemapXml([{ path: '/' }])
    expect(home).toContain(`<loc>${SITE.url}/</loc>`)
    expect(home).toContain(`<loc>${SITE.url}/fr</loc>`)
  })
})

describe('rssXml', () => {
  test('escapes titles and links posts in the feed locale', () => {
    const xml = rssXml('fr', 'Blog', [post])
    expect(xml).toContain('<title>Bun &amp; &lt;friends&gt;</title>')
    expect(xml).toContain(`<link>${SITE.url}/fr/posts/all-in-on-bun</link>`)
    expect(xml).toContain('<language>fr</language>')
    expect(xml).toContain(`href="${SITE.url}/fr/rss.xml" rel="self"`)
  })
})

describe('robotsTxt', () => {
  test('allows everything and points to the sitemap', () => {
    expect(robotsTxt()).toContain('Allow: /')
    expect(robotsTxt()).toContain(`Sitemap: ${SITE.url}/sitemap.xml`)
  })
})

describe('llmsTxt', () => {
  test('lists posts as Markdown links under their section', () => {
    const txt = llmsTxt('Summary', [{ locale: 'en', heading: 'Posts', posts: [post] }])
    expect(txt.startsWith(`# ${SITE.title}\n\n> Summary`)).toBe(true)
    expect(txt).toContain(`- [Bun & <friends>](${SITE.url}/posts/all-in-on-bun): Fast "installs"`)
  })
})
