// Generates the PWA icons (no dependencies): indigo rounded square with a white circle.
// Run with: npm run icons
import { deflateSync } from 'node:zlib'
import { mkdirSync, writeFileSync } from 'node:fs'

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const td = Buffer.concat([Buffer.from(type), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(td))
  return Buffer.concat([len, td, crc])
}

function png(size, { maskable }) {
  const bg = [0x4f, 0x46, 0xe5]
  const radius = maskable ? 0 : size * 0.22
  const circleR = size * (maskable ? 0.22 : 0.26)
  const raw = Buffer.alloc((size * 4 + 1) * size)
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0
    for (let x = 0; x < size; x++) {
      const o = y * (size * 4 + 1) + 1 + x * 4
      // rounded-corner alpha
      const dx = Math.max(radius - x, x - (size - 1 - radius), 0)
      const dy = Math.max(radius - y, y - (size - 1 - radius), 0)
      const inside = dx * dx + dy * dy <= radius * radius
      const cx = x - size / 2 + 0.5
      const cy = y - size / 2 + 0.5
      const inCircle = cx * cx + cy * cy <= circleR * circleR
      const col = inCircle ? [255, 255, 255] : bg
      raw[o] = col[0]
      raw[o + 1] = col[1]
      raw[o + 2] = col[2]
      raw[o + 3] = inside ? 255 : 0
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

mkdirSync('public', { recursive: true })
writeFileSync('public/icon-192.png', png(192, { maskable: false }))
writeFileSync('public/icon-512.png', png(512, { maskable: false }))
writeFileSync('public/icon-maskable-512.png', png(512, { maskable: true }))
console.log('Icons written to public/')
