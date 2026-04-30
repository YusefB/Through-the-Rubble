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
const TARGET_H = 1800 // 4:5 portrait — keeps more image content visible than 9:24

// Letterbox both photos at native aspect inside the 4:5 frame (1440 × 1800)
// using a `contain` fit — no content is cropped. Padding is pure black to
// match the Palestine flag stripe on the page background. This trades some
// dead space at top/bottom or sides for full photographic fidelity.

async function processBefore() {
  // AlQassam Street (2268 × 4032, 9:16 portrait). With a 4:5 target, this is
  // taller-than-target → fit by height and pad sides. Scale to 1800 tall:
  // 1013 × 1800, pad ~213 px black on each side.
  await sharp('tmp/source-photos/before-alqassam.jpg')
    .resize({
      width: TARGET_W,
      height: TARGET_H,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0 },
    })
    .webp({ quality: 82 })
    .toFile(`${out}/main-street-before.webp`)

  const lqipBuf = await sharp(`${out}/main-street-before.webp`)
    .resize(8, 10)
    .webp({ quality: 30 })
    .toBuffer()
  return {
    width: TARGET_W,
    height: TARGET_H,
    blurDataUrl: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
  }
}

async function processAfter() {
  // IMG_5923 (4032 × 2268 landscape, 16:9). With a 4:5 target, this is wider-
  // than-target → fit by width and pad top/bottom. Scale to 1440 wide:
  // 1440 × 810, pad ~495 px black above and below. The full original frame is
  // visible — no crop, no zoom.
  await sharp('tmp/source-photos/after-rubble.jpg')
    .resize({
      width: TARGET_W,
      height: TARGET_H,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0 },
    })
    .webp({ quality: 82 })
    .toFile(`${out}/main-street-after.webp`)

  const lqipBuf = await sharp(`${out}/main-street-after.webp`)
    .resize(8, 10)
    .webp({ quality: 30 })
    .toBuffer()
  return {
    width: TARGET_W,
    height: TARGET_H,
    blurDataUrl: `data:image/webp;base64,${lqipBuf.toString('base64')}`,
  }
}

const before = await processBefore()
const after = await processAfter()

console.log('Before:', before)
console.log('After:', after)
console.log('Wrote main-street-before.webp and main-street-after.webp')
