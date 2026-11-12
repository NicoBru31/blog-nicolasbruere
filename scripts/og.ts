// Generates the share images (Open Graph / Twitter card), 1200×630, in the site's dark palette:
// - public/og.png: the default, with the book icon and the site tagline;
// - public/posts/<slug>/og-<locale>.png: one per post and locale, with the post title.
// Run: bun run gen:og (the output is committed; content-files.test.ts fails when one is missing).
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import sharp from 'sharp'
import { LOCALES, MESSAGES } from '../src/lib/i18n'
import { slugFromDirectory } from '../src/lib/posts'
import { postOgImagePath } from '../src/lib/seo'
import { SITE } from '../src/lib/site'

const INK = '#1b1916'
const PAPER = '#f4efe6'
const MUTED = '#a8a29e'
const COVER = '#fb923c'
const SPINE = '#c2410c'
const MONO = 'JetBrains Mono, Menlo, monospace'
const SANS = 'IBM Plex Sans, Helvetica Neue, Arial, sans-serif'
const { width, height } = SITE.ogImage

const ROOT = join(import.meta.dir, '..')
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const book = (
  x: number,
  y: number,
  scale: number,
) => `<g transform="translate(${x} ${y}) scale(${scale})">
    <rect x="0" y="0" width="17" height="21" rx="2" fill="${COVER}"/>
    <rect x="0" y="0" width="3.2" height="21" rx="1.2" fill="${SPINE}"/>
    <path d="M8.2 6c-1.3 0-1.6.6-1.6 1.6v1.2c0 .8-.4 1.2-1.1 1.2.7 0 1.1.4 1.1 1.2v1.2c0 1 .3 1.6 1.6 1.6M11.8 6c1.3 0 1.6.6 1.6 1.6v1.2c0 .8.4 1.2 1.1 1.2-.7 0-1.1.4-1.1 1.2v1.2c0 1-.3 1.6-1.6 1.6" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>
  </g>`

const frame = (
  body: string,
) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${INK}"/>
  <rect x="0" y="${height - 12}" width="${width}" height="12" fill="${COVER}"/>
  ${body}
</svg>
`

const handle = (x: number, y: number, size: number) =>
  `<text x="${x}" y="${y}" font-family="${MONO}" font-size="${size}" fill="${MUTED}">~/nicolas<tspan fill="${COVER}">.bruere</tspan></text>`

/** Greedy word wrap. French spacing before ?, !, : is non-breaking so the sign never ends up alone. */
function wrap(text: string, maxChars: number): string[] {
  const words = text.replace(/ ([?!:;])/g, ' $1').split(' ')
  const lines: string[] = []
  for (const word of words) {
    const last = lines.at(-1)
    if (last !== undefined && `${last} ${word}`.length <= maxChars)
      lines[lines.length - 1] = `${last} ${word}`
    else lines.push(word)
  }
  return lines
}

const defaultImage = frame(`${book(96, 150, 7)}
  ${handle(340, 250, 40)}
  <text x="340" y="340" font-family="${SANS}" font-size="64" font-weight="600" fill="${PAPER}">${escape(MESSAGES.en.home.title)}</text>
  <text x="340" y="410" font-family="${SANS}" font-size="34" fill="${MUTED}">React · Rust · Java · CI/CD · Expo</text>`)

function postImage(title: string, tags: string[]) {
  const lines = wrap(title, 26)
  const size = lines.length > 3 ? 58 : 68
  const lineHeight = Math.round(size * 1.18)
  const top = 300 - ((lines.length - 1) * lineHeight) / 2
  const titleLines = lines
    .map((line, i) => `<tspan x="96" y="${top + i * lineHeight}">${escape(line)}</tspan>`)
    .join('')
  return frame(`${book(96, 72, 3)}
  ${handle(164, 124, 32)}
  <text font-family="${SANS}" font-size="${size}" font-weight="600" fill="${PAPER}">${titleLines}</text>
  <text x="96" y="548" font-family="${MONO}" font-size="30" fill="${COVER}">${tags.map((tag) => `#${escape(tag)}`).join('  ')}</text>`)
}

async function write(path: string, svg: string) {
  await Bun.write(join(ROOT, 'public', path), await sharp(Buffer.from(svg)).png().toBuffer())
  console.log(`wrote public${path} (${width}×${height})`)
}

function frontmatter(path: string) {
  const match = /^---\n([\s\S]*?)\n---/.exec(readFileSync(path, 'utf8'))
  if (!match?.[1]) throw new Error(`${path}: no frontmatter`)
  return Bun.YAML.parse(match[1]) as { title: string; tags: string[] }
}

await write(SITE.ogImage.path, defaultImage)

const postsDir = join(ROOT, 'content/posts')
for (const entry of readdirSync(postsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue
  for (const locale of LOCALES) {
    const { title, tags } = frontmatter(join(postsDir, entry.name, `${locale}.md`))
    await write(postOgImagePath(slugFromDirectory(entry.name), locale), postImage(title, tags))
  }
}
