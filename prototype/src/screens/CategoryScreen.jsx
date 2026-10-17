import React, { useState } from 'react'
import { sections, listings, priceHistogram, ageMinutes, city, fmt, visible } from '../data.js'
import { Icon, ListingCard, Sheet, PeaceSign } from '../ui.jsx'
import { matches } from '../search.js'

// (b) Category → list. Filters live in plain sight as chips; price uses the
// fair-price histogram; repeat dealer posts collapse; save search = alerts on.
const SORTS = [
  ['newest', 'newest first'], ['low', 'price: low to high'], ['high', 'price: high to low'], ['near', 'nearest first'],
]
const PRESETS = [['under $100', null, 100], ['under $250', null, 250], ['under $500', null, 500], ['$500+', 500, null]]

function applyFilters(all, f) {
  return all.filter(l =>
    (f.sub === 'all' || l.sub === f.sub) &&
    (!f.ownerOnly || !l.dealer) &&
    (!f.photosOnly || l.photo) &&
    (f.min == null || (l.price ?? 0) >= f.min) &&
    (f.max == null || (l.price ?? 0) <= f.max))
}

// One card per dealer; the rest show as "+N similar".
function groupDealers(items) {
  const seen = new Map()
  const out = []
  for (const l of items) {
    if (!l.dealer) { out.push({ l, similar: 0 }); continue }
    if (seen.has(l.seller)) { seen.get(l.seller).similar++; continue }
    const row = { l, similar: 0 }
    seen.set(l.seller, row)
    out.push(row)
  }
  return out
}

function sortItems(rows, sort) {
  const r = [...rows]
  if (sort === 'newest') r.sort((a, b) => ageMinutes(a.l.age) - ageMinutes(b.l.age))
  if (sort === 'low') r.sort((a, b) => (a.l.price ?? 0) - (b.l.price ?? 0))
  if (sort === 'high') r.sort((a, b) => (b.l.price ?? 0) - (a.l.price ?? 0))
  if (sort === 'near') r.sort((a, b) => a.l.mi - b.l.mi)
  return r
}

const money = n => '$' + fmt(n)
const priceChipLabel = (min, max) =>
  min == null && max == null ? 'price' : min == null ? `under ${money(max)}` : max == null ? `${money(min)}+` : `${money(min)}–${money(max)}`

// Also renders search results: pass `query` (and optionally no sectionId = all sections).
export default function CategoryScreen({ sectionId, initialSub = 'all', query = null, onBack, onSearch, onOpenListing, toast, onSaveSearch }) {
  const section = sectionId ? sections.find(s => s.id === sectionId) : null
  // not memoized: hiding or un-hiding a listing must show up immediately
  const all = visible(listings).filter(l => (!sectionId || l.section === sectionId) && (!query || matches(l, query)))
  // Category: subcategories in demand order. Search: the subcategories the results fall in, most first.
  // counted after grouping dealer reposts, so tab counts match the results line
  const subCounts = groupDealers(all).reduce((m, { l }) => m.set(l.sub, (m.get(l.sub) || 0) + 1), new Map())
  const subs = query ? [...subCounts].sort((a, b) => b[1] - a[1]).map(([k]) => k) : section.subs.filter(s => subCounts.has(s))
  const sectionName = section ? section.name : 'everything'

  const [f, setF] = useState({ sub: initialSub, ownerOnly: false, photosOnly: false, min: null, max: null })
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState('grid')
  const [sheet, setSheet] = useState(null)
  const [saved, setSaved] = useState(false)
  const set = patch => { setF(prev => ({ ...prev, ...patch })); setSaved(false) }

  const rows = sortItems(groupDealers(applyFilters(all, f)), sort)
  const subName = f.sub === 'all' ? sectionName : f.sub
  const heading = query ? `“${query}”` : subName
  const filtered = f.ownerOnly || f.photosOnly || f.min != null || f.max != null

  // Each way to widen an empty result, with how many it would bring back.
  const relaxers = [
    (f.min != null || f.max != null) && ['clear the price filter', { min: null, max: null }],
    f.ownerOnly && ['include dealers', { ownerOnly: false }],
    f.photosOnly && ['include posts without photos', { photosOnly: false }],
    f.sub !== 'all' && [`all of ${sectionName}`, { sub: 'all' }],
  ].filter(Boolean).map(([label, patch]) => [label, patch, groupDealers(applyFilters(all, { ...f, ...patch })).length])

  return (
    <div className="cat">
      <div className="sticky-top">
        <header className="cat-bar">
          <button type="button" className="icon-btn" aria-label="back" onClick={onBack}><Icon name="back" /></button>
          <div className="cat-title">
            <h1>{heading}</h1>
            <span>{query ? `in ${subName} · ` : f.sub === 'all' ? '' : sectionName + ' · '}{city.name}, {city.area}</span>
          </div>
          <button type="button" className="icon-btn" aria-label={'search ' + subName} onClick={() => onSearch(sectionId, query || '')}><Icon name="search" /></button>
          <button type="button" className="icon-btn" aria-label={view === 'grid' ? 'show as list' : 'show as grid'}
            onClick={() => setView(v => (v === 'grid' ? 'list' : 'grid'))}><Icon name={view === 'grid' ? 'list' : 'grid'} /></button>
        </header>

        <div className="hscroll subs-row" role="tablist" aria-label="subcategory">
          {['all', ...subs].map(s => (
            <button key={s} type="button" role="tab" aria-selected={f.sub === s}
              className={'subtab' + (f.sub === s ? ' subtab-on' : '')} onClick={() => set({ sub: s })}>
              {s === 'all' ? 'all' : s}{query && <span className="subtab-n">{s === 'all' ? groupDealers(all).length : subCounts.get(s)}</span>}
            </button>
          ))}
          {!query && <button type="button" className="subtab" onClick={() => toast(`all ${section.subs.length + section.more} subcategories`)}>+{section.more} more</button>}
        </div>

        <div className="hscroll chips filter-row" aria-label="filters">
          <button type="button" className="chip" onClick={() => setSheet('sort')}>
            <Icon name="sort" size={18} />{SORTS.find(s => s[0] === sort)[1]}<Icon name="chevron" size={16} />
          </button>
          <button type="button" className={'chip' + (f.min != null || f.max != null ? ' chip-on' : '')} onClick={() => setSheet('price')}>
            {priceChipLabel(f.min, f.max)}<Icon name="chevron" size={16} />
          </button>
          <button type="button" className="chip" onClick={() => toast('neighborhood sheet comes later')}>
            <Icon name="pin" size={18} />{city.area}<Icon name="chevron" size={16} />
          </button>
          <button type="button" className={'chip' + (f.ownerOnly ? ' chip-on' : '')} aria-pressed={f.ownerOnly} onClick={() => set({ ownerOnly: !f.ownerOnly })}>
            {f.ownerOnly && <Icon name="check" size={18} />}by owner
          </button>
          <button type="button" className={'chip' + (f.photosOnly ? ' chip-on' : '')} aria-pressed={f.photosOnly} onClick={() => set({ photosOnly: !f.photosOnly })}>
            {f.photosOnly && <Icon name="check" size={18} />}has photos
          </button>
        </div>
      </div>

      {rows.length > 0 ? (
        <>
          <p className="results-line pad">
            {query ? `${rows.length} result${rows.length === 1 ? '' : 's'}` : f.sub === 'all' && !filtered ? `${fmt(section.count)} listings · ${fmt(section.newToday)} new today` : `${rows.length} match`} · {SORTS.find(s => s[0] === sort)[1]}
          </p>
          <div className={'pad ' + (view === 'grid' ? 'grid' : 'rows')}>
            {rows.map(({ l, similar }) => <ListingCard key={l.id} listing={l} similar={similar} variant={view === 'grid' ? 'grid' : 'row'} onTap={() => onOpenListing(l.id)} />)}
          </div>
          <p className="feed-end pad">that's everything posted in the last day.</p>
        </>
      ) : all.length === 0 && query ? (
        <div className="empty-state pad">
          <PeaceSign size={44} />
          <h2>no “{query}” in {city.name} right now</h2>
          <p>new things are posted all day. save this search and we'll tell you the moment one shows up.</p>
          <button type="button" className="btn-primary empty-cta" onClick={() => setSheet('save')}><Icon name="bell" />alert me when it's posted</button>
          {sectionId && <button type="button" className="link" onClick={() => onSearch(null, query, true)}>search all sections instead</button>}
        </div>
      ) : (
        <div className="empty-state pad">
          <PeaceSign size={44} />
          <h2>nothing here with those filters</h2>
          <p>try widening your search:</p>
          <div className="relaxers">
            {relaxers.map(([label, patch, n]) => (
              <button key={label} type="button" className="relaxer" disabled={n === 0} onClick={() => set(patch)}>
                <span>{label}</span><span className="relaxer-n">{n} listing{n === 1 ? '' : 's'}</span><Icon name="arrow" size={18} />
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="button" className={'fab' + (saved ? ' fab-done' : '')} onClick={() => (saved ? toast('manage alerts in saved') : setSheet('save'))}>
        <Icon name={saved ? 'check' : 'bell'} />{saved ? 'alerts on' : 'save search'}
      </button>

      {sheet === 'sort' && (
        <Sheet title="sort by" onClose={() => setSheet(null)}>
          <div className="radio-list">
            {SORTS.map(([id, label]) => (
              <button key={id} type="button" role="radio" aria-checked={sort === id} className="radio-row"
                onClick={() => { setSort(id); setSheet(null) }}>
                <span className={'radio' + (sort === id ? ' radio-on' : '')} />{label}
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {sheet === 'price' && <PriceSheet all={all} f={f} onClose={() => setSheet(null)} onApply={p => { set(p); setSheet(null) }} />}

      {sheet === 'save' && (
        <SaveSheet name={query || subName} f={f} onClose={() => setSheet(null)} onSave={entry => {
          setSaved(true); setSheet(null); onSaveSearch({ ...entry, query, section: sectionId, sub: f.sub === 'all' ? null : f.sub })
          toast(entry.alerts ? `saved · we'll tell you when new ${query ? '“' + query + '”' : subName} listings post` : 'saved')
        }} />
      )}
    </div>
  )
}

function PriceSheet({ all, f, onClose, onApply }) {
  const [min, setMin] = useState(f.min ?? '')
  const [max, setMax] = useState(f.max ?? '')
  const num = v => (v === '' ? null : Math.max(0, Number(v)))
  const count = groupDealers(applyFilters(all, { ...f, min: num(min), max: num(max) })).length
  const h = priceHistogram
  const top = Math.max(...h.bins)
  const inRange = i => {
    const lo = i * h.step, hi = lo + h.step
    return (num(min) == null || hi > num(min)) && (num(max) == null || lo < num(max))
  }
  return (
    <Sheet title="price" onClose={onClose} footer={
      <button type="button" className="btn-primary" onClick={() => onApply({ min: num(min), max: num(max) })}>show {count} listing{count === 1 ? '' : 's'}</button>
    }>
      <p className="sheet-note">what things sell for in minneapolis · typical is <strong>{money(h.avg)}</strong></p>
      <div className="histo" aria-hidden="true">
        {h.bins.map((b, i) => <span key={i} className={'bar' + (inRange(i) ? ' bar-on' : '')} style={{ height: `${Math.max(4, (b / top) * 100)}%` }} />)}
        <span className="histo-avg" style={{ left: `${(h.avg / h.max) * 100}%` }}><span>typical</span></span>
      </div>
      <div className="histo-axis"><span>$0</span><span>$500</span><span>$1k</span><span>$1.5k</span><span>$2k+</span></div>
      <div className="price-inputs">
        <label className="tf" htmlFor="pmin"><input id="pmin" inputMode="numeric" placeholder="$0" value={min} onChange={e => setMin(e.target.value.replace(/\D/g, ''))} /><span className="tf-label">min</span></label>
        <span className="dash">–</span>
        <label className="tf" htmlFor="pmax"><input id="pmax" inputMode="numeric" placeholder="any" value={max} onChange={e => setMax(e.target.value.replace(/\D/g, ''))} /><span className="tf-label">max</span></label>
      </div>
      <div className="presets">
        {PRESETS.map(([label, lo, hi]) => (
          <button key={label} type="button" className={'chip' + (num(min) === lo && num(max) === hi ? ' chip-on' : '')}
            onClick={() => { setMin(lo ?? ''); setMax(hi ?? '') }}>{num(min) === lo && num(max) === hi && <Icon name="check" size={18} />}{label}</button>
        ))}
      </div>
    </Sheet>
  )
}

function SaveSheet({ name, f, onClose, onSave }) {
  const [label, setLabel] = useState(name)
  const [alerts, setAlerts] = useState(true)
  const [freq, setFreq] = useState('instantly')
  const parts = [priceChipLabel(f.min, f.max) !== 'price' && priceChipLabel(f.min, f.max), f.ownerOnly && 'by owner', f.photosOnly && 'has photos', city.area].filter(Boolean)
  return (
    <Sheet title="save this search" onClose={onClose} footer={
      <button type="button" className="btn-primary" onClick={() => onSave({ label, detail: parts.join(' · '), alerts })}>save search</button>
    }>
      <label className="tf" htmlFor="sname">
        <input id="sname" value={label} onChange={e => setLabel(e.target.value)} /><span className="tf-label">name</span>
      </label>
      <div className="save-summary">{[name, ...parts].map(p => <span key={p} className="sub">{p}</span>)}</div>
      <button type="button" className="switch-row" role="switch" aria-checked={alerts} onClick={() => setAlerts(a => !a)}>
        <Icon name="bell" />
        <span className="switch-text"><strong>tell me about new ones</strong><span>a notification when a match is posted</span></span>
        <span className={'switch' + (alerts ? ' switch-on' : '')}><span /></span>
      </button>
      {alerts && (
        <div className="segmented" role="radiogroup" aria-label="how often">
          {['instantly', 'once a day'].map(o => (
            <button key={o} type="button" role="radio" aria-checked={freq === o} className={freq === o ? 'seg-on' : ''} onClick={() => setFreq(o)}>{freq === o && <Icon name="check" size={18} />}{o}</button>
          ))}
        </div>
      )}
    </Sheet>
  )
}
