// Turns dist/index.html into an Artifact page body: the Artifact host adds its
// own doctype/html/head/body skeleton, so strip ours and keep <title> first.
import { readFileSync, writeFileSync } from 'node:fs'

let html = readFileSync('dist/index.html', 'utf8')
html = html
  .replace(/<!doctype html>/i, '')
  .replace(/<\/?html[^>]*>/gi, '')
  .replace(/<\/?head>/gi, '')
  .replace(/<\/?body>/gi, '')
  .replace(/<meta charset[^>]*>/i, '')
  .replace(/<meta name="viewport"[^>]*>/i, '')
writeFileSync('dist/artifact.html', html.trim() + '\n')
console.log('wrote dist/artifact.html', (html.length / 1024).toFixed(0) + ' KB')
