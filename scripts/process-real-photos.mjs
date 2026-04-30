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

async function processBefore() {
  // AlQassam Street (2268 × 4032, 9:16 portrait). Target 4:5 (1440 × 1800).
  // Scale to 1440 wide → 1440 × 2560, then crop equally from top + bottom to
  // 1800 tall (~70% of vertical content preserved, centered).
  const scaled = await sharp('tmp/source-photos/before-alqassam.jpg')
    .resize({ width: TARGET_W, fit: 'cover' })
    .toBuffer()
  const { height: scaledH } = await sharp(scaled).metadata()
  const cropTop = Math.round((scaledH - TARGET_H) / 2)
  await sharp(scaled)
    .extract({ left: 0, top: cropTop, width: TARGET_W, height: TARGET_H })
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
  // IMG_5923 (4032 × 2268 landscape). Target 4:5 (1440 × 1800). To keep more
  // horizontal context: scale-fit to 1800 tall (gives ~3199 × 1800), then
  // center-crop 1440 wide (~45% horizontal preserved vs ~21% on the previous
  // tight 9:24 crop).
  const buf = await sharp('tmp/source-photos/after-rubble.jpg')
    .resize({ height: TARGET_H, fit: 'cover' })
    .toBuffer()
  const { width: scaledW } = await sharp(buf).metadata()
  const cropLeft = Math.round((scaledW - TARGET_W) / 2)
  await sharp(buf)
    .extract({ left: cropLeft, top: 0, width: TARGET_W, height: TARGET_H })
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
