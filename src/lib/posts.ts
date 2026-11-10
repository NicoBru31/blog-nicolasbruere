// Pure helpers over post metadata: no content-collections import, so bun test can load them.

export type PostMeta = {
  slug: string
  pubDate: Date
  draft: boolean
  tags: string[]
}

export function selectPublished<T extends PostMeta>(
  posts: T[],
  { includeDrafts = false } = {},
): T[] {
  return posts
    .filter((post) => includeDrafts || !post.draft)
    .toSorted((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
}

export function groupByTag<T extends PostMeta>(posts: T[]): Map<string, T[]> {
  const groups = new Map<string, T[]>()
  for (const post of posts) {
    for (const tag of post.tags) groups.set(tag, [...(groups.get(tag) ?? []), post])
  }
  return groups
}

const WORDS_PER_MINUTE = 220

export function readingTime(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function slugFromDirectory(directory: string): string {
  // "2026-11-hello-world" → "hello-world": the date prefix only orders folders.
  return directory.replace(/^\d{4}-\d{2}(-\d{2})?-/, '')
}
