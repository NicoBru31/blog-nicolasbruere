import { createFileRoute } from '@tanstack/react-router'
import { rssXml } from '#/lib/feeds'
import { isLocaleParam, MESSAGES, toLocale } from '#/lib/i18n'
import { publishedPosts } from '#/lib/site-index'

// `/rss.xml` (English) and `/fr/rss.xml`, prerendered (see `pages` in vite.config.ts).
export const Route = createFileRoute('/{-$locale}/rss.xml')({
  server: {
    handlers: {
      GET: ({ params }) => {
        if (!isLocaleParam(params.locale)) return new Response('Not found', { status: 404 })
        const locale = toLocale(params.locale)
        return new Response(
          rssXml(locale, MESSAGES[locale].siteDescription, publishedPosts(locale)),
          { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
        )
      },
    },
  },
})
