import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import path from 'node:path'

const out = 'public/scenes'
mkdirSync(out, { recursive: true })

const W = 1440
const H = 3840

async function gradient(filename, stops) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
          ${stops.map((s, i) => `<stop offset="${(i / (stops.length - 1)) * 100}%" stop-color="${s}" />`).join('')}
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)" />
    </svg>
  `
  await sharp(Buffer.from(svg)).webp({ quality: 70 }).toFile(path.join(out, filename))
}

async function transparent(filename, color, alpha) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
      <rect width="100%" height="100%" fill="${color}" fill-opacity="${alpha}" />
    </svg>
  `
  await sharp(Buffer.from(svg)).webp({ quality: 70, alphaQuality: 70 }).toFile(path.join(out, filename))
}

await gradient('main-street-before.webp', ['#5a6f7d', '#3a4e5c', '#1f2d35', '#15110d'])
await gradient('main-street-after.webp',  ['#3a3530', '#2b2622', '#1f1a15', '#15110d'])
await transparent('parallax-haze.webp',  '#9aa8b3', 0.18)
await transparent('parallax-dust.webp',  '#cdb98c', 0.22)
await transparent('parallax-smoke.webp', '#3a3a3a', 0.18)

console.log('Generated placeholder scenes')
