// Generates the site icons from one drawing: a closed orange book with { } on its cover.
// Run: bun run gen:icons (outputs are committed; rerun only when the drawing changes).
import sharp from 'sharp'

const INK = '#1b1916'
const COVER = '#fb923c'
const SPINE = '#c2410c'

/** The icon on a 32×32 grid. `rounded` false for apple-touch-icon: iOS applies its own mask. */
const svg = ({
  rounded,
}: {
  rounded: boolean
}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="${rounded ? 7 : 0}" fill="${INK}"/>
  <rect x="8" y="5.5" width="17" height="21" rx="2" fill="${COVER}"/>
  <rect x="8" y="5.5" width="3.2" height="21" rx="1.2" fill="${SPINE}"/>
  <path d="M16.2 11.5c-1.3 0-1.6.6-1.6 1.6v1.2c0 .8-.4 1.2-1.1 1.2.7 0 1.1.4 1.1 1.2v1.2c0 1 .3 1.6 1.6 1.6M19.8 11.5c1.3 0 1.6.6 1.6 1.6v1.2c0 .8.4 1.2 1.1 1.2-.7 0-1.1.4-1.1 1.2v1.2c0 1-.3 1.6-1.6 1.6" fill="none" stroke="${INK}" stroke-width="1.7" stroke-linecap="round"/>
</svg>
`

const out = (name: string) => new URL(`../public/${name}`, import.meta.url).pathname

const png = (source: string, size: number) =>
  sharp(Buffer.from(source), { density: (72 * size) / 32 })
    .resize(size, size)
    .png()
    .toBuffer()

/** ICO container holding PNG images (supported by every browser that still asks for .ico). */
function ico(images: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6 + images.length * 16)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(images.length, 4)
  let offset = header.length
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16
    header.writeUInt8(size >= 256 ? 0 : size, entry) // width
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1) // height
    header.writeUInt16LE(1, entry + 4) // color planes
    header.writeUInt16LE(32, entry + 6) // bits per pixel
    header.writeUInt32LE(data.length, entry + 8)
    header.writeUInt32LE(offset, entry + 12)
    offset += data.length
  })
  return Buffer.concat([header, ...images.map((image) => image.data)])
}

const rounded = svg({ rounded: true })
await Bun.write(out('favicon.svg'), rounded)
await Bun.write(out('apple-touch-icon.png'), await png(svg({ rounded: false }), 180))
await Bun.write(out('icon-512.png'), await png(rounded, 512))
await Bun.write(
  out('favicon.ico'),
  ico(
    await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(rounded, size) }))),
  ),
)
console.log('wrote public/favicon.svg, favicon.ico, apple-touch-icon.png, icon-512.png')
