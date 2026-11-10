import { createFileRoute, Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { GitGraph } from '#/components/GitGraph'
import { careerIn, LINKS } from '#/lib/about'
import { MESSAGES, toLocale, useI18n } from '#/lib/i18n'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/{-$locale}/about')({
  head: ({ params }) => {
    const t = MESSAGES[toLocale(params.locale)]
    return {
      meta: [
        { title: `${t.about.title} — ${SITE.title}` },
        { name: 'description', content: t.about.metaDescription },
      ],
    }
  },
  component: AboutPage,
})

function AboutPage() {
  const { locale, t, param } = useI18n()
  const linkClass = 'text-accent underline-offset-3 hover:underline'

  return (
    <>
      <section className="mb-14">
        <h1 className="text-2xl font-medium tracking-tight text-heading sm:text-[28px]">
          Nicolas Bruère
        </h1>
        <p className="mt-2 font-mono text-xs text-faint">{t.about.tagline}</p>
        <div className="mt-5 max-w-2xl space-y-3 leading-relaxed text-muted">
          {t.about.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
          {LINKS.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="text-muted transition-colors hover:text-accent">
                <span className="text-faint">{link.label}/</span>
                {link.handle}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-14">
        <h2 className="mb-1 text-lg font-medium text-heading">{t.about.career}</h2>
        <p className="mb-6 font-mono text-xs text-faint">$ git log --graph --all</p>
        <GitGraph commits={careerIn(locale)} />
      </section>

      <section>
        <h2 className="mb-1 text-lg font-medium text-heading">{t.about.outside}</h2>
        <p className="mb-6 font-mono text-xs text-faint">{t.about.outsideSubtitle}</p>
        <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-[110px_minmax(0,1fr)]">
          <Hobby term={t.about.terms.family}>{t.about.family}</Hobby>
          <Hobby term={t.about.terms.reading}>
            {t.about.reading}{' '}
            <Link to="/{-$locale}/readings" params={{ locale: param }} className={linkClass}>
              {t.about.readingLink}
            </Link>
            .
          </Hobby>
          <Hobby term={t.about.terms.rugby}>
            {t.about.rugbyBefore} <span className="text-heading">Stade Toulousain</span>
            {locale === 'en' ? ` ${t.about.rugbyAfter}` : t.about.rugbyAfter}
          </Hobby>
          <Hobby term={t.about.terms.basket}>{t.about.basket}</Hobby>
        </dl>
      </section>
    </>
  )
}

function Hobby({ term, children }: { term: string; children: ReactNode }) {
  return (
    <>
      <dt className="font-mono text-sm text-faint">{term}</dt>
      <dd className="text-muted">{children}</dd>
    </>
  )
}
