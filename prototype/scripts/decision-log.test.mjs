import test from 'node:test'
import assert from 'node:assert/strict'
import { KINDS, isEntryName, parseEntry, sortEntries, appendRows } from './decision-log-lib.mjs'
import { readEntries } from './decision-log.mjs'

const ok = '| 2026-11-19 | Process | Decisions get a dated index | docs/DECISION-LOG.md → How to keep this file |'

test('file names', () => {
  assert.ok(isEntryName('2026-11-19-adopt-decision-log.md'))
  assert.ok(isEntryName('2026-11-19-x.md'))
  for (const bad of ['2026-11-19.md', '2026-11-19-Adopt.md', '2026-11-19-two--hyphens.md', '2026-11-19-trailing-.md', '26-11-19-x.md', '2026-11-19-x.txt', 'README.md'])
    assert.equal(isEntryName(bad), false, bad)
})

test('parses a valid entry', () => {
  const e = parseEntry('2026-11-19-adopt.md', `\n${ok}\n\n`)
  assert.deepEqual([e.date, e.kind, e.decision], ['2026-11-19', 'Process', 'Decisions get a dated index'])
  assert.equal(e.row, ok)
})

test('rejects malformed entries, naming the file', () => {
  const cases = [
    ['bad name', 'Adopt.md', ok, /file name/],
    ['no line', '2026-11-19-a.md', '\n \n', /exactly one non-blank line, found 0/],
    ['two lines', '2026-11-19-a.md', `${ok}\n${ok}`, /found 2/],
    ['no leading pipe', '2026-11-19-a.md', ok.slice(1), /start and end with \|/],
    ['no trailing pipe', '2026-11-19-a.md', ok.slice(0, -1), /start and end with \|/],
    ['three cells', '2026-11-19-a.md', '| 2026-11-19 | Process | x |', /exactly 4 cells/],
    ['five cells', '2026-11-19-a.md', '| 2026-11-19 | Process | x | y | z |', /exactly 4 cells/],
    ['date mismatch', '2026-11-18-a.md', ok, /does not match the file name date 2026-11-18/],
    ['unknown kind', '2026-11-19-a.md', '| 2026-11-19 | Misc | x | y |', /Kind "Misc"/],
    ['empty decision', '2026-11-19-a.md', '| 2026-11-19 | Process |  | y |', /Decision cell is empty/],
    ['empty ref', '2026-11-19-a.md', '| 2026-11-19 | Process | x |  |', /Ref cell is empty/],
  ]
  for (const [label, name, text, msg] of cases) {
    assert.throws(() => parseEntry(name, text), err => err.message.startsWith(name + ':') && msg.test(err.message), label)
  }
})

test('every kind is accepted', () => {
  for (const kind of KINDS) parseEntry('2026-11-19-a.md', `| 2026-11-19 | ${kind} | x | y |`)
})

test('sorts by file name: date, then name', () => {
  assert.deepEqual(sortEntries(['2026-11-20-a.md', '2026-11-19-b.md', '2026-11-19-a.md']),
    ['2026-11-19-a.md', '2026-11-19-b.md', '2026-11-20-a.md'])
})

test('appends rows to the end of the Log table only', () => {
  const doc = '# Log\n\n| x |\n\n## Log\n\n| Date | Kind |\n|---|---|\n| a | b |\n\n## After\n\n| other |\n'
  const out = appendRows(doc, ['| c | d |', '| e | f |'])
  assert.equal(out, '# Log\n\n| x |\n\n## Log\n\n| Date | Kind |\n|---|---|\n| a | b |\n| c | d |\n| e | f |\n\n## After\n\n| other |\n')
  assert.equal(appendRows(doc, []), doc)
  assert.equal(appendRows('## Log\n| a |', ['| b |']), '## Log\n| a |\n| b |')
  assert.throws(() => appendRows('# none\n', ['| b |']), /no "## Log"/)
  assert.throws(() => appendRows('## Log\n\ntext\n', ['| b |']), /no table/)
})

test('every real pending entry in docs/decision-log/ is valid', () => {
  readEntries()
})
