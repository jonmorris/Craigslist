// Builds the shareable decision-tracker page from docs/decisions.md (the source of truth).
// Run: node scripts/decisions-page.mjs <out.html>   (then republish the artifact)
import { readFileSync, writeFileSync } from 'node:fs'

const SRC = new URL('../../docs/decisions.md', import.meta.url)
const SHOTS = 'https://github.com/jonmorris/craigslist/blob/ccr-a766eefe-yp40gn/docs/'
const md = readFileSync(SRC, 'utf8')

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// inline markdown → html: links (screenshots get a small numbered chip), bold, italics, code
const inline = s => esc(s)
  .replace(/\[(\d+)\]\((audit-screens\/[^)]+)\)/g, (_, n, p) => `<a class="shot" href="${SHOTS}${p}" title="screenshot ${n} of today's app">${n}</a>`)
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, p) => `<a href="${/^https?:/.test(p) ? p : SHOTS + p}">${t}</a>`)
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[\s(])\*([^*]+)\*/g, '$1<em>$2</em>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
const cells = line => line.trim().replace(/^\||\|$/g, '').split(' | ').map(c => c.trim())

// sections: ## heading, an optional intro paragraph, then a table
const sections = []
let cur = null
for (const line of md.split('\n')) {
  if (line.startsWith('## ')) { cur = { title: line.slice(3).trim(), intro: [], rows: [], head: null }; sections.push(cur); continue }
  if (!cur) continue
  if (line.startsWith('|')) {
    if (/^\|\s*-/.test(line)) continue
    const c = cells(line)
    if (!cur.head) cur.head = c
    else cur.rows.push(c)
  } else if (line.trim() && !cur.head) cur.intro.push(line.trim())
}

const decisions = [], open = [], native = []
for (const s of sections) {
  if (s.title === 'Still open') s.rows.forEach(([id, q, notes]) => open.push({ id, q: inline(q), notes: inline(notes) }))
  else if (s.title === 'Native feasibility') s.rows.forEach(([p, n, flag]) => native.push({ p: inline(p), n: inline(n), flag: flag === '—' ? '' : inline(flag), proto: /prototype-only/i.test(flag) }))
  else s.rows.forEach(([id, today, redesign, why, source]) => decisions.push({
    id, area: s.title, today: today === '—' ? '' : inline(today.replace(/^Kept:\s*/, '')), redesign: inline(redesign), why: inline(why),
    sources: source.split(',').map(x => x.trim()).filter(Boolean),
    kept: /^Kept:/i.test(today) || /^Kept:/i.test(redesign), considered: /Considered, not built/i.test(redesign),
  }))
}
const areas = [...new Set(decisions.map(d => d.area))]
const intros = Object.fromEntries(sections.filter(s => s.intro.length).map(s => [s.title, inline(s.intro.join(' '))]))
const data = { decisions, open, native, areas, intros }

const html = `<title>Craigslist Decision Log</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Young+Serif&display=swap">
<style>
/* layout: a working index. header with the summary, a sticky filter bar, then decisions grouped by area;
   each decision reads today → redesign, with the reason and its sources under it. */
:root {
  --bg: #fcfafe; --surface: #f3eef8; --raised: #ffffff; --line: #dcd2e6; --line-strong: #817a8d;
  --fg: #1e1a24; --muted: #5f576b; --accent: #6b2fa8; --accent-soft: #efe2fb; --on-accent: #ffffff;
  --kept: #1c6b3e; --kept-soft: #dcf2e3; --flag: #8a3d12; --flag-soft: #fbe6d8;
  --display: 'Young Serif', Georgia, 'Times New Roman', serif;
  --body: 'Figtree', system-ui, -apple-system, 'Segoe UI', sans-serif;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {
  --bg: #15121a; --surface: #1e1a24; --raised: #241f2b; --line: #342d3e; --line-strong: #7b7386;
  --fg: #ede7f4; --muted: #aaa1b7; --accent: #dcb8ff; --accent-soft: #3a2550; --on-accent: #2a0c4a;
  --kept: #8ee0ae; --kept-soft: #173b26; --flag: #f3b48e; --flag-soft: #42261a; color-scheme: dark } }
:root[data-theme="dark"] {
  --bg: #15121a; --surface: #1e1a24; --raised: #241f2b; --line: #342d3e; --line-strong: #7b7386;
  --fg: #ede7f4; --muted: #aaa1b7; --accent: #dcb8ff; --accent-soft: #3a2550; --on-accent: #2a0c4a;
  --kept: #8ee0ae; --kept-soft: #173b26; --flag: #f3b48e; --flag-soft: #42261a; color-scheme: dark }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--fg); font: 400 15px/1.55 var(--body); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
.wrap { max-width: 1040px; margin: 0 auto; }
header { padding-block: 40px 20px; display: grid; gap: 10px; }
.eyebrow { font: 600 12px/1 var(--body); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
h1 { font: 400 clamp(32px, 6vw, 48px)/1.05 var(--display); margin: 0; text-wrap: balance; }
.lede { margin: 0; max-width: 62ch; color: var(--muted); }
.tally { display: flex; flex-wrap: wrap; gap: 8px 20px; margin-top: 6px; font-variant-numeric: tabular-nums; }
.tally b { font: 400 22px/1 var(--display); color: var(--fg); margin-right: 6px; }
.tally span { color: var(--muted); font-size: 14px; }
.legend { display: flex; flex-wrap: wrap; gap: 6px 16px; color: var(--muted); font-size: 13px; }
.legend strong { color: var(--fg); font-weight: 600; }
body::before { content: ""; position: fixed; inset: 0 0 auto; height: env(safe-area-inset-top, 0px); z-index: 10; background: var(--bg); }
.bar { position: sticky; top: env(safe-area-inset-top, 0px); z-index: 5; background: var(--bg); border-bottom: 1px solid var(--line); padding-block: 12px; display: grid; gap: 10px; }
.search { display: flex; align-items: center; gap: 10px; height: 44px; padding: 0 14px; border-radius: 22px; background: var(--surface); }
.search input { flex: 1; min-width: 0; border: 0; background: none; color: var(--fg); font: inherit; outline: none; }
.search:focus-within { outline: 2px solid var(--accent); }
.search svg { flex: none; color: var(--muted); }
.chips { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
.chips::-webkit-scrollbar { display: none; }
.chip { flex: none; height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid var(--line-strong); background: none; color: var(--muted); font: 500 13px/1 var(--body); cursor: pointer; white-space: nowrap; }
.chip[aria-pressed="true"] { background: var(--accent-soft); border-color: transparent; color: var(--fg); font-weight: 600; }
.chip:focus-visible, a:focus-visible, button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
main { padding-block: 8px 64px; display: grid; gap: 36px; }
.area h2 { font: 400 24px/1.2 var(--display); margin: 0 0 4px; display: flex; align-items: baseline; gap: 10px; }
.area h2 small { font: 500 13px var(--body); color: var(--muted); }
.intro { margin: 0 0 12px; max-width: 70ch; color: var(--muted); font-size: 14px; }
.list { display: grid; gap: 10px; }
.d { background: var(--raised); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; display: grid; gap: 10px; }
.d-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.id { font: 600 12px/1 var(--body); letter-spacing: .04em; color: var(--accent); background: var(--accent-soft); padding: 5px 7px; border-radius: 6px; font-variant-numeric: tabular-nums; }
.tag { font: 600 11px/1 var(--body); letter-spacing: .06em; text-transform: uppercase; padding: 5px 7px; border-radius: 6px; }
.tag-kept { color: var(--kept); background: var(--kept-soft); }
.tag-considered { color: var(--flag); background: var(--flag-soft); }
.srcs { margin-left: auto; display: flex; gap: 4px; flex-wrap: wrap; }
.src { font: 500 12px/1 var(--body); color: var(--muted); border: 1px solid var(--line); padding: 4px 7px; border-radius: 6px; }
.cols { display: grid; grid-template-columns: minmax(0, 1fr) 24px minmax(0, 1.25fr); gap: 4px 8px; align-items: start; }
.lbl { font: 600 11px/1.4 var(--body); letter-spacing: .07em; text-transform: uppercase; color: var(--muted); margin-bottom: 2px; }
.today { color: var(--muted); }
.arrow { color: var(--line-strong); padding-top: 18px; text-align: center; }
.redesign { color: var(--fg); }
.why { border-top: 1px dashed var(--line); padding-top: 10px; font-size: 14px; }
.why .lbl { display: inline; margin-right: 6px; }
.d p { margin: 0; }
a { color: var(--accent); }
a.shot { display: inline-grid; place-items: center; min-width: 22px; height: 18px; padding: 0 4px; border-radius: 4px; background: var(--surface); color: var(--muted); font: 600 11px/1 var(--body); text-decoration: none; vertical-align: 1px; }
a.shot:hover { color: var(--fg); }
code { font: 13px ui-monospace, 'SF Mono', Menlo, monospace; background: var(--surface); padding: 1px 4px; border-radius: 4px; overflow-wrap: anywhere; }
.empty { padding: 32px 0; color: var(--muted); }
table { width: 100%; border-collapse: collapse; font-size: 14px; }
.scroll { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; background: var(--raised); }
th, td { text-align: left; vertical-align: top; padding: 10px 14px; border-top: 1px solid var(--line); }
th { border-top: 0; font: 600 11px/1.4 var(--body); letter-spacing: .07em; text-transform: uppercase; color: var(--muted); background: var(--surface); }
td:first-child { min-width: 14ch; }
tr.proto td:last-child { color: var(--flag); }
.open .d { border-left: 3px solid var(--flag); }
footer { color: var(--muted); font-size: 13px; padding-bottom: 40px; }
@media (max-width: 640px) {
  .cols { grid-template-columns: minmax(0, 1fr); }
  .arrow { display: none; }
  .srcs { margin-left: 0; width: 100%; }
}
@media (prefers-reduced-motion: no-preference) { .d { transition: border-color .15s; } }
</style>

<div class="wrap">
  <header>
    <span class="eyebrow">Craigslist Android redesign · Minneapolis</span>
    <h1>Decision log</h1>
    <p class="lede">Every change from today's Craigslist app (v1.29.1), what we did instead, and why. Things kept on purpose are here too. Numbered chips open the screenshot of today's app.</p>
    <div class="tally" id="tally"></div>
    <div class="legend"><span><strong>audit</strong> our UX audit</span><span><strong>users</strong> what people praise or complain about</span><span><strong>review</strong> testing on a phone</span><span><strong>platform</strong> Android / Material 3</span><span><strong>brief</strong> the challenge</span></div>
  </header>
  <div class="bar">
    <label class="search" for="q"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
      <input id="q" type="search" placeholder="search decisions (e.g. filters, map, save)" autocomplete="off"></label>
    <div class="chips" id="areas" role="group" aria-label="area"></div>
    <div class="chips" id="kinds" role="group" aria-label="show"></div>
  </div>
  <main id="main"></main>
  <footer>Built from <code>docs/decisions.md</code> in the prototype repo, which is updated with every change.</footer>
</div>

<script>
const DATA = ${JSON.stringify(data)};
const $ = s => document.querySelector(s)
const state = { q: '', area: 'all', kind: 'all' }
try { Object.assign(state, JSON.parse(localStorage.getItem('dl-filters') || '{}'), { q: '' }) } catch (e) {}
const save = () => { try { localStorage.setItem('dl-filters', JSON.stringify({ area: state.area, kind: state.kind })) } catch (e) {} }
const strip = h => h.replace(/<[^>]+>/g, '')
const kept = DATA.decisions.filter(d => d.kept).length
$('#tally').innerHTML = '<div><b>' + DATA.decisions.length + '</b><span>decisions</span></div><div><b>' + kept + '</b><span>kept on purpose</span></div><div><b>' + DATA.open.length + '</b><span>still open</span></div><div><b>' + DATA.native.filter(n => n.proto).length + '</b><span>prototype-only flags</span></div>'
const chip = (group, val, label, n) => '<button type="button" class="chip" data-g="' + group + '" data-v="' + val + '" aria-pressed="' + (state[group] === val) + '">' + label + (n != null ? ' · ' + n : '') + '</button>'
function chips() {
  $('#areas').innerHTML = chip('area', 'all', 'all areas', DATA.decisions.length) + DATA.areas.map(a => chip('area', a, a, DATA.decisions.filter(d => d.area === a).length)).join('') + chip('area', 'open', 'still open', DATA.open.length) + chip('area', 'native', 'native feasibility', DATA.native.length)
  $('#kinds').innerHTML = [['all', 'everything'], ['changed', 'changes'], ['kept', 'kept on purpose'], ['users', 'from user complaints'], ['audit', 'from the audit'], ['review', 'from phone review'], ['platform', 'platform']].map(([v, l]) => chip('kind', v, l)).join('')
}
function matches(d) {
  const k = state.kind
  if (k === 'kept' && !d.kept) return false
  if (k === 'changed' && d.kept) return false
  if (['users', 'audit', 'review', 'platform'].includes(k) && !d.sources.includes(k)) return false
  if (!state.q) return true
  return (d.id + ' ' + d.area + ' ' + strip(d.today + ' ' + d.redesign + ' ' + d.why) + ' ' + d.sources.join(' ')).toLowerCase().includes(state.q)
}
function card(d) {
  return '<article class="d" id="' + d.id + '"><div class="d-top"><span class="id">' + d.id + '</span>' + (d.kept ? '<span class="tag tag-kept">kept</span>' : '') + (d.considered ? '<span class="tag tag-considered">considered, not built</span>' : '') + '<span class="srcs">' + d.sources.map(s => '<span class="src">' + s + '</span>').join('') + '</span></div>'
    + '<div class="cols"><div class="today"><div class="lbl">today</div><p>' + (d.today || 'nothing like this') + '</p></div><div class="arrow" aria-hidden="true">→</div><div class="redesign"><div class="lbl">redesign</div><p>' + d.redesign + '</p></div></div>'
    + '<p class="why"><span class="lbl">why</span>' + d.why + '</p></article>'
}
function render() {
  document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', String(state[c.dataset.g] === c.dataset.v)))
  $('#kinds').hidden = state.area === 'open' || state.area === 'native'
  let out = ''
  if (state.area === 'open') {
    const rows = DATA.open.filter(o => !state.q || strip(o.q + ' ' + o.notes).toLowerCase().includes(state.q))
    out = '<section class="area open"><h2>Still open <small>' + rows.length + '</small></h2><div class="list">' + rows.map(o => '<article class="d"><div class="d-top"><span class="id">' + o.id + '</span></div><p><strong>' + o.q + '</strong></p><p class="why">' + o.notes + '</p></article>').join('') + '</div></section>'
  } else if (state.area === 'native') {
    const rows = DATA.native.filter(n => !state.q || strip(n.p + ' ' + n.n + ' ' + n.flag).toLowerCase().includes(state.q))
    out = '<section class="area"><h2>Native feasibility <small>' + rows.length + '</small></h2><p class="intro">The prototype is a web app standing in for a native Android app (Jetpack Compose, Material 3). Each piece maps to native, or is flagged as prototype-only.</p><div class="scroll"><table><thead><tr><th>prototype</th><th>native equivalent</th><th>flag</th></tr></thead><tbody>' + rows.map(n => '<tr class="' + (n.proto ? 'proto' : '') + '"><td>' + n.p + '</td><td>' + n.n + '</td><td>' + (n.flag || '—') + '</td></tr>').join('') + '</tbody></table></div></section>'
  } else {
    const areas = state.area === 'all' ? DATA.areas : [state.area]
    for (const a of areas) {
      const rows = DATA.decisions.filter(d => d.area === a && matches(d))
      if (!rows.length) continue
      out += '<section class="area"><h2>' + a + ' <small>' + rows.length + '</small></h2>' + (DATA.intros[a] ? '<p class="intro">' + DATA.intros[a] + '</p>' : '') + '<div class="list">' + rows.map(card).join('') + '</div></section>'
    }
  }
  $('#main').innerHTML = out || '<p class="empty">No decisions match. Try a different word or clear the filters.</p>'
}
chips(); render()
document.addEventListener('click', e => { const c = e.target.closest('.chip'); if (!c) return; state[c.dataset.g] = c.dataset.v; save(); render() })
$('#q').addEventListener('input', e => { state.q = e.target.value.trim().toLowerCase(); render() })
if (location.hash) { const id = decodeURIComponent(location.hash.slice(1)); const hit = DATA.decisions.find(d => d.id === id); if (hit) { state.area = 'all'; state.kind = 'all'; render(); document.getElementById(id)?.scrollIntoView() } }
</script>
`
const out = process.argv[2]
if (!out) { console.error('usage: node scripts/decisions-page.mjs <out.html>'); process.exit(1) }
writeFileSync(out, html)
console.log(`wrote ${out}: ${decisions.length} decisions, ${open.length} open, ${native.length} native rows`)
