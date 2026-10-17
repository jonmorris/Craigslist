// Builds the brand SVGs in /brand: peace-sign mark, wordmark (Young Serif,
// converted to outlines so it renders without the font), lockups and app icon.
// Run: node scripts/logo.mjs
import { mkdirSync, writeFileSync } from 'node:fs'
import opentype from 'opentype.js'

const OUT = '../brand'
mkdirSync(OUT, { recursive: true })
const font = opentype.loadSync('node_modules/@fontsource/young-serif/files/young-serif-latin-400-normal.woff')

const PURPLE = '#6a2bb8'      // brand primary (light)
const PURPLE_ON_DARK = '#caa4ff'
const GRAD = ['#c665f2', '#6a1fc2'] // peace sign gradient, top → bottom

// Peace mark on a 100×100 grid: ring + vertical stem + two lower spokes.
// Strokes are clipped to the outer circle so every edge meets the ring cleanly.
function mark({ x = 0, y = 0, size = 100, paint, id }) {
  const s = size / 100
  const r = 44, w = 12, d = r * Math.SQRT1_2
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <clipPath id="${id}-clip"><circle cx="50" cy="50" r="50"/></clipPath>
    <g fill="none" stroke="${paint}" stroke-width="${w}" clip-path="url(#${id}-clip)">
      <circle cx="50" cy="50" r="${r}"/>
      <path d="M50 0V100M50 50L${(50 - d - 6).toFixed(2)} ${(50 + d + 6).toFixed(2)}M50 50L${(50 + d + 6).toFixed(2)} ${(50 + d + 6).toFixed(2)}" stroke-linecap="butt"/>
    </g>
  </g>`
}
const gradDef = id => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${GRAD[0]}"/><stop offset="1" stop-color="${GRAD[1]}"/></linearGradient>`

// Wordmark as outlines. Font size 100 → x-height ≈ 52, ascender ≈ 80.
function wordmark(fontSize = 100) {
  const path = font.getPath('craigslist', 0, 0, fontSize, { letterSpacing: -0.01 })
  const b = path.getBoundingBox()
  return { d: path.toPathData(2), x1: b.x1, y1: b.y1, x2: b.x2, y2: b.y2 }
}

const svg = (w, h, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(1)} ${h.toFixed(1)}" width="${Math.round(w)}" height="${Math.round(h)}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`

// 1. Peace sign — gradient, solid purple, and single-color (currentColor)
writeFileSync(`${OUT}/peace-sign.svg`, svg(100, 100, `<defs>${gradDef('g')}</defs>${mark({ paint: 'url(#g)', id: 'm' })}`, 'craigslist peace sign'))
writeFileSync(`${OUT}/peace-sign-purple.svg`, svg(100, 100, mark({ paint: PURPLE, id: 'm' }), 'craigslist peace sign'))
writeFileSync(`${OUT}/peace-sign-mono.svg`, svg(100, 100, mark({ paint: 'currentColor', id: 'm' }), 'craigslist peace sign'))

// 2. Wordmark alone
const wm = wordmark()
const pad = 4
const wmW = wm.x2 - wm.x1 + pad * 2, wmH = wm.y2 - wm.y1 + pad * 2
const wmBody = color => `<path fill="${color}" transform="translate(${(pad - wm.x1).toFixed(2)} ${(pad - wm.y1).toFixed(2)})" d="${wm.d}"/>`
writeFileSync(`${OUT}/craigslist-wordmark.svg`, svg(wmW, wmH, wmBody(PURPLE), 'craigslist'))
writeFileSync(`${OUT}/craigslist-wordmark-on-dark.svg`, svg(wmW, wmH, wmBody(PURPLE_ON_DARK), 'craigslist'))

// 3. Horizontal lockup: mark sized to the ascender height, centered on the x-height band.
function lockup(textColor, gradId) {
  const markSize = 88, gap = 24
  const baseline = 80 + pad                       // ascender top sits at y = pad
  const xMid = baseline - 26                      // middle of the x-height band
  const markY = xMid - markSize / 2
  const textX = markSize + gap - wm.x1
  const w = markSize + gap + (wm.x2 - wm.x1) + pad
  const h = Math.max(markY + markSize, baseline + wm.y2) + pad
  const body = `<defs>${gradDef(gradId)}</defs>${mark({ x: 0, y: markY, size: markSize, paint: `url(#${gradId})`, id: 'lk' })}<path fill="${textColor}" transform="translate(${textX.toFixed(2)} ${baseline})" d="${wm.d}"/>`
  return svg(w, h, body, 'craigslist')
}
writeFileSync(`${OUT}/craigslist-logo.svg`, lockup(PURPLE, 'g'))
writeFileSync(`${OUT}/craigslist-logo-on-dark.svg`, lockup(PURPLE_ON_DARK, 'g'))

// 4. Android adaptive app icon (108dp canvas, mark inside the 66dp safe zone)
writeFileSync(`${OUT}/app-icon.svg`, svg(108, 108,
  `<rect width="108" height="108" fill="${PURPLE}"/>${mark({ x: 27, y: 27, size: 54, paint: '#ffffff', id: 'ic' })}`, 'craigslist app icon'))

console.log('wrote brand/: peace-sign(.svg, -purple, -mono), craigslist-wordmark(+on-dark), craigslist-logo(+on-dark), app-icon')
