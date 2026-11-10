import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { SITE } from '#/lib/site'
import appCss from '../styles.css?url'

// Applies the OS color scheme before first paint (avoids a light flash in dark mode).
const themeScript = `document.documentElement.classList.toggle('dark', matchMedia('(prefers-color-scheme: dark)').matches)`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE.title },
      { name: 'description', content: SITE.description },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <p>Page introuvable.</p>,
})

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, author-controlled script */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <HeadContent />
      </head>
      <body className="bg-white text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <header className="mb-14 flex items-center justify-between">
            <Link to="/" className="font-semibold">
              {SITE.title}
            </Link>
          </header>
          <main>{children}</main>
          <footer className="mt-20 border-t border-zinc-200 pt-6 text-sm text-zinc-500 dark:border-zinc-800">
            Prérendu avec TanStack Start · runtime Redact
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  )
}
