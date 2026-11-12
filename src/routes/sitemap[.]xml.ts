import { createFileRoute } from '@tanstack/react-router'
import { sitemapXml } from '#/lib/feeds'
import { sitemapPages } from '#/lib/site-index'

// Prerendered to dist/client/sitemap.xml (see `pages` in vite.config.ts).
export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(sitemapXml(sitemapPages()), {
          headers: { 'Content-Type': 'application/xml; charset=utf-8' },
        }),
    },
  },
})
