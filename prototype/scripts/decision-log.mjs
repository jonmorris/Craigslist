// Pending decision-log entries: validate and print them (default), or fold them into
// docs/DECISION-LOG.md and delete their files (--fold, on main, in a commit of its own).
//   npm run decision-log            (from prototype/)
//   npm run decision-log -- --fold
import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'node:fs'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseEntry, sortEntries, appendRows } from './decision-log-lib.mjs'

const docs = fileURLToPath(new URL('../../docs/', import.meta.url))
const dir = docs + 'decision-log/'
const log = docs + 'DECISION-LOG.md'

export function readEntries() {
  const names = sortEntries(readdirSync(dir).filter(n => n !== 'README.md'))
  return names.map(name => ({ name, ...parseEntry(name, readFileSync(dir + name, 'utf8')) }))
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  let entries
  try { entries = readEntries() } catch (e) { console.error(e.message); process.exit(1) }
  if (process.argv.includes('--fold')) {
    writeFileSync(log, appendRows(readFileSync(log, 'utf8'), entries.map(e => e.row)))
    for (const e of entries) unlinkSync(dir + e.name)
    console.log(`folded ${entries.length} entr${entries.length === 1 ? 'y' : 'ies'} into docs/DECISION-LOG.md`)
  } else {
    for (const e of entries) console.log(e.row)
    console.log(`${entries.length} pending entr${entries.length === 1 ? 'y' : 'ies'}`)
  }
}
