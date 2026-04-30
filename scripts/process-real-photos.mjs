// Process Wikimedia Commons photos by Jaber Jehad Badwan (CC BY-SA 4.0) into
// 9:24 portrait master images for the scene engine demo.
//
// Source attributions live in the seed migration; this script just handles the
// pixel crop / resize.
//
// Run from repo root: node scripts/process-real-photos.mjs

import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const out = 'public/scenes'
mkdirSync(out, { recursive: true })

const TARGET_W = 1440
const TARGET_H = 3840 // 9:24 ratio

async function processBefore() {
  // AlQassam Street (2268 × 4032, 9:16 portrait) — needs a tiny vertical extension
  // to reach 9:24. Solution: scale to 1440 wide (gives 1440 × 2560), then extend
  // the canvas to 1440 × 3840 with a darker pad on top.
  const buf = await sharp('tmp/source-photos/before-alqassam.jpg')
    .resize({ width: TARGET_W, fit: 'cover' })
    .toBuffer()
  const { height: h } = await sharp(buf).metadata()
  const padTop = TARGET_H - h
  await sharp({
    create: {
      width: TARGET_W,
      height: TARGET_H,
      channels: 3,
      background: { r: 30, g: 38, b: 48 }, // tonal extension at top
    },
  })
    .composite([{ input: buf, top: padTop, left: 0 }])
    .webp({ quality: 80 })
    .toFile(`${out}/main-street-before.webp`)

  // Generate a tiny LQIP for blur placeholder (~30 bytes encoded)
  const lqipBuf = await sharp(buf).resize(8, 22).webp({ quality: 30 }).toBuffer()
  const lqipDataUrl = `data:image/webp;base64,${lqipBuf.toString('base64')}`
  return { width: TARGET_W, height: TARGET_H, blurDataUrl: lqipDataUrl }
}

async function processAfter() {
  // IMG_5923 (4032 × 2268 landscape) — crop a 9:24 vertical slice from the
  // visually-dense center, then scale to 1440 × 3840.
  const cropW = Math.round(2268 * (9 / 24)) // ~851 wide for 2268 tall
  const cropX = Math.round((4032 - cropW) / 2) // center horizontally
  const buf = await sharp('tmp/source-photos/after-rubble.jpg')
    .extract({ left: cropX, top: 0, width: cropW, height: 2268 })
    .resize({ width: TARGET_W, height: TARGET_H, fit: 'cover' })
    .toBuffer()
  await sharp(buf).webp({ quality: 80 }).toFile(`${out}/main-street-after.webp`)
  const lqipBuf = await sharp(buf).resize(8, 22).webp({ quality: 30 }).toBuffer()
  const lqipDataUrl = `data:image/webp;base64,${lqipBuf.toString('base64')}`
  return { width: TARGET_W, height: TARGET_H, blurDataUrl: lqipDataUrl }
}

const before = await processBefore()
const after = await processAfter()

console.log('Before:', before)
console.log('After:', after)
console.log('Wrote main-street-before.webp and main-street-after.webp')
