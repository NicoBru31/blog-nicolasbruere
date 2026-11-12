import { cloudflare } from '@cloudflare/vite-plugin'
import contentCollections from '@content-collections/vite'
import tailwindcss from '@tailwindcss/vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { redact } from '@tanstack/redact/vite'
import viteReact from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: { tsconfigPaths: true },
  // Redact: bundle server deps so their React imports are redirected too.
  ssr: { noExternal: true },
  plugins: [
    contentCollections(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart({
      prerender: { enabled: true, crawlLinks: true, failOnError: true },
      // Not linked from any page, so the crawler can't find them: listed explicitly.
      pages: ['/sitemap.xml', '/robots.txt', '/llms.txt', '/rss.xml', '/fr/rss.xml'].map(
        (path) => ({ path }),
      ),
    }),
    viteReact({ compiler: true }),
    redact(),
  ],
})
