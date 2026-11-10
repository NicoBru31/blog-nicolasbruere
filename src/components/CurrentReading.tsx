import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { type CurrentReading as Reading, getCurrentReading } from '#/lib/current-reading'
import { useI18n } from '#/lib/i18n'

/**
 * "Reading now" line under the header. Fetched after hydration rather than prerendered,
 * so it follows the reading app without rebuilding the site. Renders nothing until known.
 */
export function CurrentReading() {
  const { locale, t, param } = useI18n()
  const [reading, setReading] = useState<Reading | null>(null)

  useEffect(() => {
    let cancelled = false
    getCurrentReading({ data: locale })
      .then((value) => {
        if (!cancelled) setReading(value)
      })
      .catch(() => {
        // Decorative: a failure just leaves the line out.
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  if (!reading) return null

  const label = (
    <>
      <span className="text-heading">{reading.title}</span>
      {reading.author && <span>, {reading.author}</span>}
    </>
  )

  return (
    <p className="-mt-10 mb-10 truncate font-mono text-xs text-faint">
      <span aria-hidden="true">▸ </span>
      {t.readingNow}{' '}
      {reading.slug ? (
        <Link
          to="/{-$locale}/readings/$slug"
          params={{ locale: param, slug: reading.slug }}
          className="transition-colors hover:text-accent"
        >
          {label}
        </Link>
      ) : (
        label
      )}
    </p>
  )
}
