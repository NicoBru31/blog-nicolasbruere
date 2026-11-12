// Text builders for sitemap.xml, rss.xml, robots.txt and llms.txt. Pure: the routes in
// src/routes feed them from content-collections, and bun test can load them.

import { LOCALES, type Locale, localizedPath } from './i18n'
import { absoluteUrl, SITE } from './site'

const escapeXml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')

const isoDay = (date: Date) => date.toISOString().slice(0, 10)

/** One page, present in every locale. `path` is the English (unprefixed) path. */
export type SitemapPage = { path: string; lastmod?: Date }

export function sitemapXml(pages: SitemapPage[]): string {
  const urls = pages.flatMap(({ path, lastmod }) =>
    LOCALES.map((locale) => {
      const alternates = [
        ...LOCALES.map((alt) => ({ hreflang: alt, href: absoluteUrl(localizedPath(path, alt)) })),
        { hreflang: 'x-default', href: absoluteUrl(path) },
      ]
      return [
        '  <url>',
        `    <loc>${escapeXml(absoluteUrl(localizedPath(path, locale)))}</loc>`,
        ...(lastmod ? [`    <lastmod>${isoDay(lastmod)}</lastmod>`] : []),
        ...alternates.map(
          ({ hreflang, href }) =>
            `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`,
        ),
        '  </url>',
      ].join('\n')
    }),
  )
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

export type FeedPost = {
  slug: string
  title: string
  description: string
  pubDate: Date
  tags: readonly string[]
}

export const rssPath = (locale: Locale) => localizedPath('/rss.xml', locale)

export function rssXml(locale: Locale, description: string, posts: FeedPost[]): string {
  const home = absoluteUrl(localizedPath('/', locale))
  const items = posts.map((post) => {
    const link = absoluteUrl(localizedPath(`/posts/${post.slug}`, locale))
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
      `      <description>${escapeXml(post.description)}</description>`,
      `      <pubDate>${post.pubDate.toUTCString()}</pubDate>`,
      ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
      '    </item>',
    ].join('\n')
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${escapeXml(SITE.title)}</title>`,
    `    <link>${escapeXml(home)}</link>`,
    `    <description>${escapeXml(description)}</description>`,
    `    <language>${locale}</language>`,
    `    <atom:link href="${escapeXml(absoluteUrl(rssPath(locale)))}" rel="self" type="application/rss+xml"/>`,
    ...(posts[0] ? [`    <lastBuildDate>${posts[0].pubDate.toUTCString()}</lastBuildDate>`] : []),
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}

export function robotsTxt(): string {
  // Everyone, AI crawlers included, may read everything: the point of GEO is to be cited.
  return ['User-agent: *', 'Allow: /', '', `Sitemap: ${absoluteUrl('/sitemap.xml')}`, ''].join('\n')
}

export type LlmsSection = { locale: Locale; heading: string; posts: FeedPost[] }

/** https://llmstxt.org: a Markdown index that tells language models what the site holds. */
export function llmsTxt(summary: string, sections: LlmsSection[]): string {
  const lines = [`# ${SITE.title}`, '', `> ${summary}`, '']
  for (const { locale, heading, posts } of sections) {
    lines.push(`## ${heading}`, '')
    for (const post of posts) {
      const url = absoluteUrl(localizedPath(`/posts/${post.slug}`, locale))
      lines.push(`- [${post.title}](${url}): ${post.description}`)
    }
    lines.push('')
  }
  lines.push(
    '## Optional',
    '',
    `- [About the author](${absoluteUrl('/about')}): ${SITE.author.name}, ${SITE.author.jobTitle} at ${SITE.author.worksFor}.`,
    `- [RSS (English)](${absoluteUrl(rssPath('en'))})`,
    `- [RSS (français)](${absoluteUrl(rssPath('fr'))})`,
    '',
  )
  return lines.join('\n')
}
