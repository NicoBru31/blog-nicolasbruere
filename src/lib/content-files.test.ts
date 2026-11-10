// Every post and reading note exists in English AND French, with the same metadata where the
// languages must agree (dates, tags, draft state…). Runs in `bun test`, so a missing translation
// fails CI before it reaches the site.
import { describe, expect, test } from 'bun:test'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const CONTENT = join(import.meta.dir, '../../content')

const collections = {
  posts: ['pubDate', 'updatedDate', 'tags', 'draft'],
  readings: ['author', 'year', 'startedOn', 'finishedOn', 'draft'],
} as const

function frontmatter(path: string): Record<string, unknown> {
  const match = /^---\n([\s\S]*?)\n---/.exec(readFileSync(path, 'utf8'))
  if (!match?.[1]) throw new Error(`${path}: no frontmatter`)
  return Bun.YAML.parse(match[1]) as Record<string, unknown>
}

for (const [collection, sharedKeys] of Object.entries(collections)) {
  const dir = join(CONTENT, collection)
  const entries = readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory())

  describe(`content/${collection}`, () => {
    for (const { name } of entries) {
      test(`${name} has en.md and fr.md with matching metadata`, () => {
        const files = readdirSync(join(dir, name)).filter((file) => file.endsWith('.md'))
        expect(files.toSorted()).toEqual(['en.md', 'fr.md'])

        const en = frontmatter(join(dir, name, 'en.md'))
        const fr = frontmatter(join(dir, name, 'fr.md'))
        for (const key of sharedKeys) {
          expect({ key, value: fr[key] }).toEqual({ key, value: en[key] })
        }
      })
    }
  })
}
