import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { type CurrentReading as Reading, getCurrentReading } from '#/lib/current-reading'

/**
 * "En train de lire" line under the header. Fetched after hydration rather than prerendered,
 * so it follows the reading app without rebuilding the site. Renders nothing until known.
 */
export function CurrentReading() {
  const [reading, setReading] = useState<Reading | null>(null)

  useEffect(() => {
    let cancelled = false
    getCurrentReading()
      .then((value) => {
        if (!cancelled) setReading(value)
      })
      .catch(() => {
        // Decorative: a failure just leaves the line out.
      })
    return () => {
      cancelled = true
    }
  }, [])

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
      en train de lire :{' '}
      {reading.slug ? (
        <Link
          to="/lectures/$slug"
          params={{ slug: reading.slug }}
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
