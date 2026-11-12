import { createFileRoute } from '@tanstack/react-router'
import { llmsTxt } from '#/lib/feeds'
import { MESSAGES } from '#/lib/i18n'
import { publishedPosts } from '#/lib/site-index'

// Prerendered to dist/client/llms.txt (see `pages` in vite.config.ts).
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        new Response(
          llmsTxt(`${MESSAGES.en.home.title}. ${MESSAGES.en.home.intro}`, [
            { locale: 'en', heading: 'Posts (English)', posts: publishedPosts('en') },
            { locale: 'fr', heading: 'Articles (français)', posts: publishedPosts('fr') },
          ]),
          { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } },
        ),
    },
  },
})
