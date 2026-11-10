// Pure helpers over reading notes: no content-collections import, so bun test can load them.

export type ReadingMeta = {
  slug: string
  startedOn: Date
  finishedOn?: Date
  draft: boolean
}

export type ReadingShelf<T> = { current: T[]; finished: T[] }

/** Split into "en cours" (no end date) and "lues", each newest first. */
export function shelve<T extends ReadingMeta>(
  readings: T[],
  { includeDrafts = false } = {},
): ReadingShelf<T> {
  const visible = readings.filter((reading) => includeDrafts || !reading.draft)
  return {
    current: visible
      .filter((reading) => !reading.finishedOn)
      .toSorted((a, b) => b.startedOn.valueOf() - a.startedOn.valueOf()),
    finished: visible
      .filter((reading) => reading.finishedOn)
      .toSorted((a, b) => (b.finishedOn?.valueOf() ?? 0) - (a.finishedOn?.valueOf() ?? 0)),
  }
}
