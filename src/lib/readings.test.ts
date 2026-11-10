import { describe, expect, test } from 'bun:test'
import { shelve } from './readings'

const reading = (slug: string, startedOn: string, finishedOn?: string, draft = false) => ({
  slug,
  startedOn: new Date(startedOn),
  finishedOn: finishedOn ? new Date(finishedOn) : undefined,
  draft,
})

describe('shelve', () => {
  test('splits current and finished readings', () => {
    const shelf = shelve([reading('a', '2026-01-01'), reading('b', '2025-12-01', '2025-12-20')])
    expect(shelf.current.map((r) => r.slug)).toEqual(['a'])
    expect(shelf.finished.map((r) => r.slug)).toEqual(['b'])
  })

  test('sorts current by start date and finished by end date, newest first', () => {
    const shelf = shelve([
      reading('old-current', '2026-01-01'),
      reading('new-current', '2026-02-01'),
      reading('finished-first', '2025-01-01', '2025-03-01'),
      reading('finished-last', '2024-01-01', '2025-06-01'),
    ])
    expect(shelf.current.map((r) => r.slug)).toEqual(['new-current', 'old-current'])
    expect(shelf.finished.map((r) => r.slug)).toEqual(['finished-last', 'finished-first'])
  })

  test('hides drafts unless asked', () => {
    const readings = [reading('d', '2026-01-01', undefined, true)]
    expect(shelve(readings).current).toHaveLength(0)
    expect(shelve(readings, { includeDrafts: true }).current).toHaveLength(1)
  })
})
