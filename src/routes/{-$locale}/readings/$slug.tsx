import { createFileRoute, Link } from '@tanstack/react-router'
import { Article } from '#/components/markdown/Article'
import { isoDay } from '#/components/PostList'
import { getReading } from '#/lib/content'
import { useI18n } from '#/lib/i18n'
import { SITE } from '#/lib/site'
import { titleTransition } from '#/lib/transitions'

export const Route = createFileRoute('/{-$locale}/readings/$slug')({
  loader: ({ params }) => getReading({ data: { slug: params.slug, locale: params.locale } }),
  head: ({ loaderData: reading }) => ({
    meta: reading
      ? [
          { title: `${reading.title}, ${reading.author} — ${SITE.title}` },
          ...(reading.verdict ? [{ name: 'description', content: reading.verdict }] : []),
        ]
      : [],
  }),
  component: ReadingPage,
})

function ReadingPage() {
  const reading = Route.useLoaderData()
  const { t, param } = useI18n()

  return (
    <article>
      <Link
        to="/{-$locale}/readings"
        params={{ locale: param }}
        className="font-mono text-xs text-faint transition-colors hover:text-accent"
      >
        {t.readings.back}
      </Link>
      <header className="mt-6 mb-10 border-b border-line pb-8">
        <h1
          className="w-fit text-3xl leading-tight font-medium tracking-tight text-heading sm:text-4xl"
          style={titleTransition('reading', reading.slug)}
        >
          {reading.title}
        </h1>
        <p className="mt-2 text-lg text-muted">
          {reading.author}
          {reading.year && <span className="text-faint"> · {reading.year}</span>}
        </p>
        {reading.verdict && <p className="mt-4 leading-relaxed text-ink">{reading.verdict}</p>}
        <p className="mt-4 font-mono text-xs text-faint">
          {t.readings.started(isoDay(reading.startedOn))} ·{' '}
          {reading.finishedOn
            ? t.readings.finishedOn(isoDay(reading.finishedOn))
            : t.readings.ongoing}
        </p>
      </header>
      <Article document={reading.document} />
    </article>
  )
}
