import { createFileRoute, Link } from '@tanstack/react-router'
import { Article } from '#/components/markdown/Article'
import { isoDay } from '#/components/PostList'
import { getReading } from '#/lib/content'
import { SITE } from '#/lib/site'

export const Route = createFileRoute('/lectures/$slug')({
  loader: ({ params }) => getReading({ data: params.slug }),
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

  return (
    <article>
      <Link
        to="/lectures"
        className="font-mono text-xs text-faint transition-colors hover:text-accent"
      >
        ← cd ../lectures
      </Link>
      <header className="mt-6 mb-10 border-b border-line pb-8">
        <h1 className="text-3xl leading-tight font-medium tracking-tight text-heading sm:text-4xl">
          {reading.title}
        </h1>
        <p className="mt-2 text-lg text-muted">
          {reading.author}
          {reading.year && <span className="text-faint"> · {reading.year}</span>}
        </p>
        {reading.verdict && <p className="mt-4 leading-relaxed text-ink">{reading.verdict}</p>}
        <p className="mt-4 font-mono text-xs text-faint">
          commencé le {isoDay(reading.startedOn)}
          {reading.finishedOn ? ` · fini le ${isoDay(reading.finishedOn)}` : ' · en cours'}
        </p>
      </header>
      <Article document={reading.document} />
    </article>
  )
}
