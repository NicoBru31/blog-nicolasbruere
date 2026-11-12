// Generates the default share image (Open Graph / Twitter card), 1200×630, in the site's dark
// palette with the book icon. Run: bun run gen:og (the output is committed).
import sharp from 'sharp'
import { MESSAGES } from '../src/lib/i18n'
import { SITE } from '../src/lib/site'

const INK = '#1b1916'
const PAPER = '#f4efe6'
const MUTED = '#a8a29e'
const COVER = '#fb923c'
const SPINE = '#c2410c'
const { width, height } = SITE.ogImage

const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${INK}"/>
  <rect x="0" y="${height - 12}" width="${width}" height="12" fill="${COVER}"/>
  <g transform="translate(96 150) scale(7)">
    <rect x="0" y="0" width="17" height="21" rx="2" fill="${COVER}"/>
    <rect x="0" y="0" width="3.2" height="21" rx="1.2" fill="${SPINE}"/>
    <path d="M8.2 6c-1.3 0-1.6.6-1.6 1.6v1.2c0 .8-.4 1.2-1.1 1.2.7 0 1.1.4 1.1 1.2v1.2c0 1 .3 1.6 1.6 1.6M11.8 6c1.3 0 1.6.6 1.6 1.6v1.2c0 .8.4 1.2 1.1 1.2-.7 0-1.1.4-1.1 1.2v1.2c0 1-.3 1.6-1.6 1.6" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>
  </g>
  <text x="340" y="250" font-family="JetBrains Mono, Menlo, monospace" font-size="40" fill="${MUTED}">~/nicolas<tspan fill="${COVER}">.bruere</tspan></text>
  <text x="340" y="340" font-family="IBM Plex Sans, Helvetica Neue, Arial, sans-serif" font-size="64" font-weight="600" fill="${PAPER}">${escape(MESSAGES.en.home.title)}</text>
  <text x="340" y="410" font-family="IBM Plex Sans, Helvetica Neue, Arial, sans-serif" font-size="34" fill="${MUTED}">React · Rust · Java · CI/CD · Expo</text>
</svg>
`

const out = new URL('../public/og.png', import.meta.url).pathname
await Bun.write(out, await sharp(Buffer.from(svg)).png().toBuffer())
console.log(`wrote public/og.png (${width}×${height})`)
