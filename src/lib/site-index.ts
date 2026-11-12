// What the site publishes, for sitemap.xml, rss.xml and llms.txt. Server only (imports
// content-collections): drafts never make it in, even in dev.

import { allPosts, allReadings } from 'content-collections'
import type { SitemapPage } from './feeds'
import type { Locale } from './i18n'
import { groupByTag, selectPublished } from './posts'

export const publishedPosts = (locale: Locale) =>
  selectPublished(allPosts.filter((post) => post.locale === locale))

export function sitemapPages(): SitemapPage[] {
  // Every entry exists in both locales (src/lib/content-files.test.ts), so English is the index.
  const posts = publishedPosts('en')
  const readings = allReadings.filter((reading) => reading.locale === 'en' && !reading.draft)
  const latest = posts[0]?.pubDate
  return [
    { path: '/', lastmod: latest },
    { path: '/about' },
    { path: '/readings' },
    { path: '/tags', lastmod: latest },
    ...[...groupByTag(posts)].map(([tag, tagged]) => ({
      path: `/tags/${tag}`,
      lastmod: tagged[0]?.pubDate,
    })),
    ...posts.map((post) => ({
      path: `/posts/${post.slug}`,
      lastmod: post.updatedDate ?? post.pubDate,
    })),
    ...readings.map((reading) => ({
      path: `/readings/${reading.slug}`,
      lastmod: reading.finishedOn ?? reading.startedOn,
    })),
  ]
}
