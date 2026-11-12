import { createFileRoute } from '@tanstack/react-router'
import { robotsTxt } from '#/lib/feeds'

// Prerendered to dist/client/robots.txt (see `pages` in vite.config.ts).
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(robotsTxt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } }),
    },
  },
})
