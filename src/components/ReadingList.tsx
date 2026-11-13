import { Link } from '@tanstack/react-router'
import { useI18n } from '#/lib/i18n'
import { titleTransition } from '#/lib/transitions'
import { isoDay } from './PostList'

type ReadingSummary = {
  slug: string
  title: string
  author: string
  year?: number
  startedOn: Date
  finishedOn?: Date
  verdict?: string
  hasNotes: boolean
}

export function ReadingList({ readings }: { readings: ReadingSummary[] }) {
  const { t, param } = useI18n()
  return (
    <ul className="divide-y divide-line border-y border-line">
      {readings.map((reading) => (
        <li key={reading.slug} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-3.5">
          <div className="min-w-0 flex-1">
            <p className="text-heading">
              {reading.hasNotes ? (
                <Link
                  to="/{-$locale}/readings/$slug"
                  params={{ locale: param, slug: reading.slug }}
                  // inline-block: a view transition can't snapshot an inline box split over lines.
                  className="inline-block font-medium hover:text-accent"
                  style={titleTransition('reading', reading.slug)}
                >
                  {reading.title}
                </Link>
              ) : (
                <span className="font-medium">{reading.title}</span>
              )}
              <span className="text-muted">
                {' — '}
                {reading.author}
                {reading.year && <span className="text-faint"> ({reading.year})</span>}
              </span>
            </p>
            {reading.verdict && <p className="mt-0.5 text-sm text-muted">{reading.verdict}</p>}
          </div>
          <p className="font-mono text-[11px] text-faint">
            {reading.finishedOn
              ? t.readings.finishedOn(isoDay(reading.finishedOn))
              : t.readings.since(isoDay(reading.startedOn))}
          </p>
        </li>
      ))}
    </ul>
  )
}
