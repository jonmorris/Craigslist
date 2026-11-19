// Helpers for docs/DECISION-LOG.md and its pending entries in docs/decision-log/.
// Each pending entry is one file holding one table row; `--fold` moves them into the log on main.

// The one list of decision kinds. docs/DECISION-LOG.md describes each.
export const KINDS = ['Product', 'Design', 'Content', 'Kept', 'Engineering', 'Process', 'Deferred', 'Reversed']

const NAME = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(-[a-z0-9]+)*\.md$/

export const isEntryName = name => NAME.test(name)

// Split a markdown table row into trimmed cells. Assumes no escaped pipes.
const cells = line => line.trim().slice(1, -1).split('|').map(c => c.trim())

// Returns { date, kind, decision, ref, row }, or throws an Error naming the file and the problem.
export function parseEntry(name, text) {
  const fail = problem => { throw new Error(`${name}: ${problem}`) }
  if (!isEntryName(name)) fail('file name must look like YYYY-MM-DD-short-name.md (lowercase, hyphenated)')
  const lines = text.split(/\r?\n/).filter(l => l.trim() !== '')
  if (lines.length !== 1) fail(`must hold exactly one non-blank line, found ${lines.length}`)
  const row = lines[0].trim()
  if (!row.startsWith('|') || !row.endsWith('|')) fail('the row must start and end with |')
  const parts = cells(row)
  if (parts.length !== 4) fail(`the row must have exactly 4 cells (Date | Kind | Decision | Ref), found ${parts.length}`)
  const [date, kind, decision, ref] = parts
  if (date !== name.slice(0, 10)) fail(`Date cell "${date}" does not match the file name date ${name.slice(0, 10)}`)
  if (!KINDS.includes(kind)) fail(`Kind "${kind}" is not one of: ${KINDS.join(', ')}`)
  if (!decision) fail('Decision cell is empty')
  if (!ref) fail('Ref cell is empty')
  return { date, kind, decision, ref, row }
}

// Filename order: date, then name.
export const sortEntries = names => [...names].sort()

// Append rows after the last row of the table under `## Log`.
export function appendRows(doc, rows) {
  if (!rows.length) return doc
  const lines = doc.split('\n')
  const head = lines.findIndex(l => l.trim() === '## Log')
  if (head < 0) throw new Error('DECISION-LOG.md has no "## Log" heading')
  const isRow = l => l.trim().startsWith('|')
  const first = lines.findIndex((l, i) => i > head && isRow(l))
  if (first < 0) throw new Error('DECISION-LOG.md has no table under "## Log"')
  let last = first
  while (last + 1 < lines.length && isRow(lines[last + 1])) last++
  lines.splice(last + 1, 0, ...rows)
  return lines.join('\n')
}
