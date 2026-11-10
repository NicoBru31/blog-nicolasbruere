import { createRootRoute, HeadContent, Link, Scripts } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ThemeToggle, themeInitScript } from '#/components/ThemeToggle'
import { SITE } from '#/lib/site'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: SITE.title },
      { name: 'description', content: SITE.description },
      { name: 'theme-color', content: '#faf8f3', media: '(prefers-color-scheme: light)' },
      { name: 'theme-color', content: '#1b1916', media: '(prefers-color-scheme: dark)' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFound,
})

const navLink = 'transition-colors hover:text-accent'
const navActive = { className: 'text-ink' }

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <HeadContent />
      </head>
      <body className="bg-paper font-sans text-ink antialiased">
        <div className="mx-auto max-w-3xl px-5 py-8 sm:py-10">
          <header className="mb-14 flex flex-wrap items-center justify-between gap-3 text-sm">
            <Link to="/" className="font-mono text-[15px] text-heading">
              ~/nicolas<span className="text-accent">.bruere</span>
            </Link>
            <nav className="flex items-center gap-4 font-mono text-muted">
              <Link
                to="/"
                className={navLink}
                activeProps={navActive}
                activeOptions={{ exact: true }}
              >
                /articles
              </Link>
              <Link to="/tags" className={navLink} activeProps={navActive}>
                /tags
              </Link>
              <ThemeToggle />
            </nav>
          </header>
          <main>{children}</main>
          <footer className="mt-24 flex flex-wrap justify-between gap-2 border-t border-line pt-6 font-mono text-xs text-faint">
            <span>© {new Date().getFullYear()} Nicolas Bruère</span>
            <span>// TanStack Start · Redact · Bun</span>
          </footer>
        </div>
        <Scripts />
      </body>
    </html>
  )
}

function NotFound() {
  return (
    <div className="py-10">
      <p className="font-mono text-sm text-faint">// 404</p>
      <h1 className="mt-2 text-2xl font-medium text-heading">Page introuvable</h1>
      <Link to="/" className="mt-6 inline-block font-mono text-sm text-accent hover:underline">
        cd ~/articles
      </Link>
    </div>
  )
}
