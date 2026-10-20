import React, { useEffect, useRef, useState } from 'react'
import { sections, listings, priceHistogram, ageMinutes, city, fmt, visible } from '../data.js'
import { Icon, ListingCard, Sheet, PeaceSign } from '../ui.jsx'
import { matches } from '../search.js'
import { taxonomy, zeroLocal } from '../taxonomy.js'
import { ALL_AREAS, inArea, areaLabel, areaFull, widenOptions } from '../area.js'
import RealMap from '../RealMap.jsx'
import { facetsFor, matchesAttrs, attrCount, attrSummary } from '../facets.js'
import ResultsMap from '../ResultsMap.jsx'
import { scaledIn, newTodayIn, shareOf } from '../counts.js'

// (b) Category → list. Filters live in plain sight as chips; price uses the
// fair-price histogram; repeat dealer posts collapse; save search = alerts on.
const SORTS = [
  ['newest', 'newest first'], ['oldest', 'oldest first'], ['low', 'price: low to high'], ['high', 'price: high to low'], ['near', 'nearest first'],
]
const PRESETS = [['free', null, 0], ['under $100', null, 100], ['under $250', null, 250], ['under $500', null, 500], ['$500+', 500, null]]

function applyFilters(all, f, query) {
  return all.filter(l =>
    (f.sub === 'all' || l.sub === f.sub) &&
    (!f.ownerOnly || !l.dealer) &&
    (!f.dealerOnly || l.dealer) &&
    (!f.photosOnly || l.photo) &&
    (!f.today || ageMinutes(l.age) < 24 * 60) &&
    (!f.delivery || l.delivery) &&
    (!f.crypto || l.crypto) &&
    (!f.lang || (l.lang || 'english') === f.lang) &&
    (!f.titles || !query || query.toLowerCase().split(/\s+/).filter(Boolean).every(t => l.title.toLowerCase().includes(t))) &&
    (f.min == null || (l.price ?? 0) >= f.min) &&
    (f.max == null || (l.price ?? 0) <= f.max) &&
    matchesAttrs(l, f.attrs))
}

// listing options from the current app's filter screen, as chips
const FLAGS = [['photosOnly', 'has image'], ['today', 'posted today'], ['titles', 'search titles only'], ['delivery', 'delivery available'], ['crypto', 'cryptocurrency ok']]
const LANGS = ['english', 'español', 'français', 'deutsch', '中文', 'tiếng việt', 'soomaali', 'hmoob']
const SHEET_KEYS = ['attrs', 'ownerOnly', 'dealerOnly', 'photosOnly', 'today', 'titles', 'delivery', 'crypto', 'lang', 'bundle']
const extraCount = f => attrCount(f.attrs) + ['today', 'titles', 'delivery', 'crypto', 'lang'].filter(k => f[k]).length + (f.bundle === false ? 1 : 0)

// filter, then bundle dealer reposts unless "bundle duplicates" is off
const runFilters = (list, f, query) => {
  const hits = applyFilters(list, f, query)
  return f.bundle === false ? hits.map(l => ({ l, similar: 0 })) : groupDealers(hits)
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
  if (sort === 'oldest') r.sort((a, b) => ageMinutes(b.l.age) - ageMinutes(a.l.age))
  if (sort === 'low') r.sort((a, b) => (a.l.price ?? 0) - (b.l.price ?? 0))
  if (sort === 'high') r.sort((a, b) => (b.l.price ?? 0) - (a.l.price ?? 0))
  if (sort === 'near') r.sort((a, b) => a.l.mi - b.l.mi)
  return r
}

const money = n => '$' + fmt(n)
const priceChipLabel = (min, max) =>
  max === 0 ? 'free' : min == null && max == null ? 'price' : min == null ? `under ${money(max)}` : max == null ? `${money(min)}+` : `${money(min)}–${money(max)}`

// Also renders search results: pass `query` (and optionally no sectionId = all sections).
// layout menu: [key, icon, label]; the bar button always shows the current layout's icon
const VIEWS = [['grid', 'grid', 'grid'], ['large', 'single', 'large photos'], ['row', 'list', 'list'], ['text', 'text', 'no images'], ['map', 'map', 'map']]

// `memory` / `onRemember` keep filters and sort with the route, so coming back from a listing
// restores them (a top complaint about the current app). Layout is an app-wide preference.
export default function CategoryScreen({ sectionId, initialSub = 'all', query = null, area = ALL_AREAS, onAreaChange, onOpenLocation, onBack, onSearch, onOpenListing, toast, onSaveSearch, memory = {}, onRemember, view = 'grid', onViewChange, favorites = new Set(), onToggleFav }) {
  const section = sectionId ? sections.find(s => s.id === sectionId) : null
  // not memoized: hiding or un-hiding a listing must show up immediately
  const anyArea = visible(listings).filter(l => (!sectionId || l.section === sectionId) && (!query || matches(l, query)))
  const all = anyArea.filter(l => inArea(l, area))
  // Category: subcategories in demand order. Search: the subcategories the results fall in, most first.
  // counted after grouping dealer reposts, so tab counts match the results line
  const subCounts = groupDealers(all).reduce((m, { l }) => m.set(l.sub, (m.get(l.sub) || 0) + 1), new Map())
  const subs = query ? [...subCounts].sort((a, b) => b[1] - a[1]).map(([k]) => k) : section.subs.filter(s => subCounts.has(s))
  const sectionName = section ? section.name : 'everything'

  const [f, setF] = useState(() => memory.f || { sub: initialSub, ownerOnly: false, photosOnly: false, min: null, max: null })
  const [sort, setSort] = useState(memory.sort || 'newest')
  // counts as people see them: search results are real counts; category lists use the realistic totals (counts.js)
  const shown = (n, a = area) => (query || !sectionId ? n : scaledIn(sectionId, f.sub, a, n))
  const run = (list, ff) => runFilters(list, ff, query)
  const setView = v => onViewChange(v) // grid | large | row | text
  const [menu, setMenu] = useState(false)
  const [sheet, setSheet] = useState(null)
  const [saved, setSaved] = useState(!!memory.saved)
  // opened from a saved search (or saved here): saving again updates that search instead of adding another
  const [savedId, setSavedId] = useState(memory.savedId || null)
  // sort and area are part of a saved search too, so changing them un-saves it
  const firstRun = useRef(true)
  useEffect(() => { if (firstRun.current) { firstRun.current = false; return } setSaved(false) }, [sort, JSON.stringify(area)])
  useEffect(() => { onRemember?.({ f, sort, saved, savedId }) }, [f, sort, saved, savedId])
  // switching subcategory drops the old one's category filters
  const set = patch => { setF(prev => ({ ...prev, ...(patch.sub && patch.sub !== prev.sub ? { attrs: {} } : {}), ...patch })); setSaved(false) }
  const facets = facetsFor(sectionId || all.find(l => l.sub === f.sub)?.section, f.sub)
  const nAttrs = extraCount(f)

  const rows = sortItems(run(all, f), sort)
  const subName = f.sub === 'all' ? sectionName : f.sub
  const heading = query ? `“${query}”` : subName
  const filtered = f.ownerOnly || f.photosOnly || f.min != null || f.max != null || nAttrs > 0
  // nothing in this subcategory anywhere in the metro (not just filtered out)
  const zero = !query && f.sub !== 'all' ? zeroLocal[f.sub] : null
  // empty only because of the area: the same search with any area has results
  const areaEmpty = (area.places.length > 0 || area.radius != null) && run(anyArea, f).length > 0

  // Each way to widen an empty result, with how many it would bring back.
  const relaxers = [
    (f.min != null || f.max != null) && ['clear the price filter', { min: null, max: null }],
    f.ownerOnly && ['include dealers', { ownerOnly: false }],
    f.photosOnly && ['include posts without photos', { photosOnly: false }],
    attrCount(f.attrs) > 0 && [`clear ${attrSummary(f.attrs).join(', ')}`, { attrs: {} }],
    f.dealerOnly && ['include owners', { dealerOnly: false }],
    ...FLAGS.filter(([k]) => k !== 'photosOnly' && f[k]).map(([k, label]) => [`without “${label}”`, { [k]: false }]),
    f.lang && ['any language', { lang: null }],
    f.sub !== 'all' && [`all of ${sectionName}`, { sub: 'all' }],
  ].filter(Boolean).map(([label, patch]) => [label, patch, shown(run(all, { ...f, ...patch }).length)])
  if (area.places.length || area.radius != null) relaxers.unshift(['search all areas', 'area', shown(run(anyArea, f).length, ALL_AREAS)])

  return (
    <div className="cat">
      <div className="sticky-top">
        <header className="cat-bar">
          <button type="button" className="icon-btn" aria-label="back" onClick={onBack}><Icon name="back" /></button>
          <div className="cat-title">
            <h1>{heading}</h1>
          </div>
          <button type="button" className="icon-btn" aria-label={'search ' + subName} onClick={() => onSearch(sectionId, query || '')}><Icon name="search" /></button>
          <button type="button" className="icon-btn" aria-haspopup="menu" aria-expanded={menu}
            aria-label={`layout: ${VIEWS.find(v => v[0] === view)[2]}. change`} onClick={() => setMenu(m => !m)}>
            <Icon name={VIEWS.find(v => v[0] === view)[1]} /></button>
          {menu && <>
            <button type="button" className="menu-scrim" aria-label="close menu" onClick={() => setMenu(false)} />
            <div className="menu" role="menu" aria-label="layout" onKeyDown={e => e.key === 'Escape' && setMenu(false)}>
              {VIEWS.map(([key, icon, label]) => (
                <button key={key} type="button" role="menuitemradio" aria-checked={view === key}
                  className={'menu-item' + (view === key ? ' menu-item-on' : '')} onClick={() => { setView(key); setMenu(false) }}>
                  <Icon name={icon} size={24} /><span className="flex1">{label}</span>{view === key && <Icon name="check" size={20} />}
                </button>
              ))}
            </div>
          </>}
        </header>

        {/* scope row: what and where, as two full-size switchers (56dp tall, well above the 48dp minimum) */}
        <div className="scope-switches pad">
          <button type="button" className="scope-btn" onClick={() => setSheet('sub')}>
            <span className="scope-text"><span className="scope-k">{query ? 'in' : section && f.sub !== 'all' ? section.name : 'category'}</span>
              <span className="scope-v">{query ? subName : f.sub === 'all' ? `all ${sectionName}` : subName}</span></span>
            <Icon name="chevron" />
          </button>
          <button type="button" className="scope-btn" onClick={() => onOpenLocation({
            noun: query ? `results for “${query}”` : subName,
            countFor: a => shown(run(anyArea.filter(l => inArea(l, a)), f).length, a),
          })}>
            <span className="scope-text"><span className="scope-k">area</span><span className="scope-v">{area.places.length || area.center || area.radius != null ? areaLabel(area) : 'Minneapolis, MN'}</span></span>
            <Icon name="chevron" />
          </button>
        </div>

        {!zero && <div className="hscroll chips filter-row" aria-label="filters">
          <button type="button" className={'chip' + (nAttrs ? ' chip-on' : '')} onClick={() => setSheet('facets')}>
            <Icon name="sliders" size={18} />{nAttrs ? `filters · ${nAttrs}` : 'filters'}
          </button>
          <button type="button" className="chip" onClick={() => setSheet('sort')}>
            <Icon name="sort" size={18} />{SORTS.find(s => s[0] === sort)[1]}<Icon name="chevron" size={16} />
          </button>
          <button type="button" className={'chip' + (f.min != null || f.max != null ? ' chip-on' : '')} onClick={() => setSheet('price')}>
            {priceChipLabel(f.min, f.max)}<Icon name="chevron" size={16} />
          </button>
          {/* sold by is a three-way choice (all / owner / dealer), so it opens a picker like sort */}
          <button type="button" className={'chip' + (f.ownerOnly || f.dealerOnly ? ' chip-on' : '')} onClick={() => setSheet('soldby')}>
            {f.ownerOnly ? 'by owner' : f.dealerOnly ? 'by dealer' : 'all sellers'}<Icon name="chevron" size={16} />
          </button>
          <button type="button" className={'chip' + (f.photosOnly ? ' chip-on' : '')} aria-pressed={f.photosOnly} onClick={() => set({ photosOnly: !f.photosOnly })}>
            {f.photosOnly && <Icon name="check" size={18} />}has photos
          </button>
        </div>}
      </div>

      {zero ? null : rows.length === 0 && areaEmpty ? (
        <AreaEmpty area={area} what={query ? `“${query}”` : subName} options={widenOptions(area, a => shown(run(anyArea.filter(l => inArea(l, a)), f).length, a))}
          onWiden={a => onAreaChange(a)} onAlert={() => setSheet('save')} saved={saved} />
      ) : null}
      {zero ? (
        <ZeroLocal sub={f.sub} sectionName={sectionName} sectionId={sectionId} info={zero}
          onAlert={() => setSheet('save')} onPick={sub => set({ sub })} toast={toast} saved={saved} />
      ) : rows.length === 0 && areaEmpty ? null : rows.length > 0 ? (
        <>
          <p className="results-line pad">
            {query ? `${rows.length} result${rows.length === 1 ? '' : 's'}` : f.sub === 'all' && !filtered ? `${fmt(shown(rows.length))} listings · ${fmt(newTodayIn(sectionId, area))} new today` : filtered ? `${fmt(shown(rows.length))} match${shown(rows.length) === 1 ? '' : 'es'}` : `${fmt(shown(rows.length))} listing${shown(rows.length) === 1 ? '' : 's'}`} · {SORTS.find(s => s[0] === sort)[1]}
          </p>
          {view === 'map' ? <ResultsMap rows={rows} area={area} favorites={favorites} onToggleFav={onToggleFav} onOpen={id => onOpenListing(id, rows.map(r => r.l.id))} /> : <>
            <div className={'pad ' + (view === 'grid' ? 'grid' : view === 'text' ? 'rows rows-text' : 'rows')}>
              {rows.map(({ l, similar }) => <ListingCard key={l.id} listing={l} similar={similar} variant={view} fav={favorites.has(l.id)} onFav={onToggleFav} onTap={() => onOpenListing(l.id, rows.map(r => r.l.id))} />)}
            </div>
            <p className="feed-end pad">{!query && shown(rows.length) > rows.length ? `prototype: showing ${rows.length} sample listings of ${fmt(shown(rows.length))}` : 'that\u2019s everything posted in the last day.'}</p>
          </>}
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
              <button key={label} type="button" className="relaxer" disabled={n === 0} onClick={() => (patch === 'area' ? onAreaChange(ALL_AREAS) : set(patch))}>
                <span>{label}</span><span className="relaxer-n">{n} listing{n === 1 ? '' : 's'}</span><Icon name="arrow" size={18} />
              </button>
            ))}
          </div>
        </div>
      )}

      {!zero && view !== 'map' && !(rows.length === 0 && areaEmpty) && <button type="button" className={'fab' + (saved ? ' fab-done' : '')} onClick={() => (saved ? toast('manage alerts in saved') : setSheet('save'))}>
        <Icon name={saved ? 'check' : 'bell'} />{saved ? 'alerts on' : savedId ? 'update search' : 'save search'}
      </button>}

      {sheet === 'sub' && (
        <SubSheet query={query} section={section} sectionId={sectionId} current={f.sub} counts={subCounts} total={groupDealers(all).length} scale={(sub, n) => (query ? n : scaledIn(sectionId, sub, area, n))} share={shareOf(area)}
          onClose={() => setSheet(null)} onPick={sub => { set({ sub }); setSheet(null) }} toast={toast} />
      )}
      {sheet === 'soldby' && (
        <Sheet title="sold by" onClose={() => setSheet(null)}>
          <div className="radio-list">
            {[['all', 'all sellers', { ownerOnly: false, dealerOnly: false }], ['owner', 'owner', { ownerOnly: true, dealerOnly: false }], ['dealer', 'dealer', { ownerOnly: false, dealerOnly: true }]].map(([id, label, patch]) => {
              const on = (f.ownerOnly ? 'owner' : f.dealerOnly ? 'dealer' : 'all') === id
              return (
                <button key={id} type="button" role="radio" aria-checked={on} className="radio-row" onClick={() => { set(patch); setSheet(null) }}>
                  <span className={'radio' + (on ? ' radio-on' : '')} />{label}
                </button>
              )
            })}
          </div>
        </Sheet>
      )}
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

      {sheet === 'facets' && <FilterSheet title="filters" facets={facets} f={f} query={query}
        countFor={ff => shown(run(all, ff).length)} onClose={() => setSheet(null)} onApply={patch => { set(patch); setSheet(null) }} />}

      {sheet === 'price' && <PriceSheet all={all} f={f} run={run} shown={shown} onClose={() => setSheet(null)} onApply={p => { set(p); setSheet(null) }} />}

      {sheet === 'save' && (
        <SaveSheet name={query || subName} f={f} area={area} updating={!!savedId} existingLabel={memory.savedLabel} onClose={() => setSheet(null)} onSave={entry => {
          // a saved search keeps everything: filters, area and sort
          const id = savedId || 'u' + Date.now()
          setSaved(true); setSavedId(id); setSheet(null)
          onSaveSearch({ ...entry, id, query, section: sectionId, sub: f.sub === 'all' ? null : f.sub, filters: f, area, sort })
          toast(savedId ? 'search updated' : entry.alerts ? `saved · we'll tell you when new ${query ? '“' + query + '”' : subName} listings post` : 'saved')
        }} />
      )}
    </div>
  )
}

// Subcategory switcher: the section's full taxonomy (or, for search results,
// the subcategories the results fall in, with counts).
// Zero local listings: nothing in this subcategory anywhere near Minneapolis.
// Show how far you'd have to go, offer an alert, related places, and a nudge to post.
// Empty because of the area: show where you were looking and the specific ways
// to widen it, each with its count, plus an alert for this exact area.
function AreaEmpty({ area, what, options, onWiden, onAlert, saved }) {
  return (
    <div className="zero pad">
      <RealMap area={area} interactive={false} height={200} />
      <h2>no {what} in {areaLabel(area)} right now</h2>
      <p>there are some close by. widen your area:</p>
      <div className="relaxers">
        {options.map(o => (
          <button key={o.label} type="button" className="relaxer" onClick={() => onWiden(o.area)}>
            <Icon name={o.label.startsWith('within') || o.label === 'any distance' ? 'near' : 'pin'} size={20} />
            <span className="relaxer-label">{o.label}</span><span className="relaxer-n">{o.n} listing{o.n === 1 ? '' : 's'}</span><Icon name="arrow" size={18} />
          </button>
        ))}
      </div>
      <button type="button" className={saved ? 'btn-tonal' : 'btn-outlined zero-alert'} onClick={saved ? undefined : onAlert}>
        <Icon name={saved ? 'check' : 'bell'} size={18} />{saved ? 'we\u2019ll tell you when one\u2019s posted here' : `alert me when one\u2019s posted in ${areaLabel(area)}`}
      </button>
    </div>
  )
}

function ZeroLocal({ sub, sectionName, sectionId, info, onAlert, onPick, toast, saved }) {
  const subs = taxonomy[sectionId]
  const pick = name => {
    const t = subs.find(x => x.name === name)
    t?.key ? onPick(t.key) : toast(`prototype: no mock listings for ${name} yet`)
  }
  const far = info.nearest[0]
  return (
    <div className="zero pad">
      <RangeRings nearest={far} />
      <h2>no {sub} listings in the {city.name} area</h2>
      <p>it's a rare one here. the closest {far[2] === 1 ? 'is' : 'are'} in {far[0]}, {far[1]} mi away.</p>
      <button type="button" className={saved ? 'btn-tonal' : 'btn-primary zero-cta'} onClick={saved ? undefined : onAlert}>
        <Icon name={saved ? 'check' : 'bell'} />{saved ? 'we\u2019ll tell you when one\u2019s posted' : 'alert me when one\u2019s posted nearby'}
      </button>

      <section className="zero-block">
        <h3>nearest listings</h3>
        <div className="zero-list">
          {info.nearest.map(([place, mi, n]) => (
            <button key={place} type="button" className="zero-row" onClick={() => toast(`would open ${sub} on craigslist ${place.split(",")[0]}`)}>
              <Icon name="pin" />
              <span className="sv-text"><strong>{place}</strong><span>{mi} mi away · craigslist {place.split(',')[0]}</span></span>
              <span className="zero-n">{n} listing{n === 1 ? '' : 's'}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="zero-block">
        <h3>related in {sectionName}</h3>
        <div className="presets">
          {info.related.map(r => <button key={r} type="button" className="chip" onClick={() => pick(r)}>{r}</button>)}
        </div>
      </section>

      <button type="button" className="sell-like" onClick={() => toast('posting flow comes later')}>
        <span className="sell-text"><strong>have {info.thing}?</strong><span>be the first in {city.name} to post it, free</span></span>
        <Icon name="arrow" />
      </button>
    </div>
  )
}

// "You" at the center, empty rings for the metro, the nearest listing out past them.
function RangeRings({ nearest }) {
  return (
    <svg className="rings" viewBox="0 0 240 150" role="img" aria-label={`nothing within the metro; nearest ${nearest[1]} miles away`}>
      {[28, 52, 76].map(r => <circle key={r} cx="120" cy="80" r={r} className="ring" />)}
      <circle cx="120" cy="80" r="7" className="ring-you" />
      <text x="120" y="104" className="ring-label">you</text>
      <circle cx="214" cy="38" r="6" className="ring-far" />
      <text x="214" y="22" className="ring-label">{nearest[0].split(",")[0]}</text>
    </svg>
  )
}

function SubSheet({ query, section, sectionId, current, counts, total, scale, share = 1, onClose, onPick, toast }) {
  const rows = query
    ? [...counts].sort((a, b) => b[1] - a[1]).map(([key, n]) => ({ name: key, key, count: n }))
    : taxonomy[sectionId].map(t => ({ ...t, count: t.key ? scale(t.key, counts.get(t.key) || 0) : Math.round(t.count * share) })) // same shown counts as the list and section page
  const allLabel = query ? 'all results' : `all of ${section.name}`
  return (
    <Sheet title={query ? 'show results in' : section.name} onClose={onClose}>
      <div className="radio-list">
        <button type="button" role="radio" aria-checked={current === 'all'} className="radio-row" onClick={() => onPick('all')}>
          <span className={'radio' + (current === 'all' ? ' radio-on' : '')} /><span className="flex1">{allLabel}</span>
          <span className="az-count">{fmt(scale('all', total))}</span>
        </button>
        {rows.map(r => (
          <button key={r.name} type="button" role="radio" aria-checked={current === r.key} className="radio-row"
            onClick={() => (r.key ? onPick(r.key) : toast(`prototype: no mock listings for ${r.name} yet`))}>
            <span className={'radio' + (current === r.key && r.key ? ' radio-on' : '')} /><span className="flex1">{r.name}</span>
            <span className={'az-count' + (r.zero || !r.count ? ' az-none' : '')}>{r.zero ? 'none nearby' : fmt(r.count)}</span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}

function PriceSheet({ all, f, run, shown, onClose, onApply }) {
  const [min, setMin] = useState(f.min ?? '')
  const [max, setMax] = useState(f.max ?? '')
  const num = v => (v === '' ? null : Math.max(0, Number(v)))
  const count = shown(run(all, { ...f, min: num(min), max: num(max) }).length)
  const h = priceHistogram
  const top = Math.max(...h.bins)
  const inRange = i => {
    const lo = i * h.step, hi = lo + h.step
    return (num(min) == null || hi > num(min)) && (num(max) == null || lo < num(max))
  }

  // Interactive histogram: tap to drop a $300 bracket centered where you tapped, then drag
  // either end (or the middle, to slide it). Snaps to $50; the right edge past $2k means "any".
  const chart = useRef(null)
  const drag = useRef(null)
  const SNAP = 50, WIDTH = 300, GAP = 50
  const lo = num(min), hi = num(max)
  const has = lo != null || hi != null
  const pct = v => `${(Math.min(v, h.max) / h.max) * 100}%`
  const priceAt = x => { const r = chart.current.getBoundingClientRect(); return Math.round(Math.max(0, Math.min(1, (x - r.left) / r.width)) * h.max / SNAP) * SNAP }
  const put = (a, b) => { setMin(a <= 0 ? '' : String(a)); setMax(b >= h.max ? '' : String(b)) }
  const down = e => {
    const part = e.target.dataset.part
    const at = priceAt(e.clientX)
    e.currentTarget.setPointerCapture(e.pointerId)
    if (part) { drag.current = { part, start: at, lo: lo ?? 0, hi: hi ?? h.max }; return }
    // tap on the chart: a new bracket centered here
    const a = Math.max(0, Math.min(at - WIDTH / 2, h.max - WIDTH))
    put(a, a + WIDTH)
    drag.current = null
  }
  const move = e => {
    const d = drag.current; if (!d) return
    const at = priceAt(e.clientX)
    if (d.part === 'lo') put(Math.min(at, d.hi - GAP), d.hi)
    else if (d.part === 'hi') put(d.lo, Math.max(at, d.lo + GAP))
    else { const w = d.hi - d.lo, a = Math.max(0, Math.min(d.lo + at - d.start, h.max - w)); put(a, a + w) }
  }
  const up = () => { drag.current = null }
  const nudge = (end, e) => {
    const step = { ArrowLeft: -SNAP, ArrowDown: -SNAP, ArrowRight: SNAP, ArrowUp: SNAP }[e.key]; if (!step) return
    e.preventDefault()
    const a = lo ?? 0, b = hi ?? h.max
    end === 'lo' ? put(Math.max(0, Math.min(a + step, b - GAP)), b) : put(a, Math.min(h.max, Math.max(b + step, a + GAP)))
  }
  return (
    <Sheet title="price" onClose={onClose} footer={
      <button type="button" className="btn-primary" onClick={() => onApply({ min: num(min), max: num(max) })}>show {count} listing{count === 1 ? '' : 's'}</button>
    }>
      <div className="histo-head">
        <p className="sheet-note">what things sell for in Minneapolis · typical is <strong>{money(h.avg)}</strong></p>
        {has && <button type="button" className="btn-text" onClick={() => put(0, h.max)}>clear</button>}
      </div>
      <div className="histo" ref={chart} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        {h.bins.map((b, i) => <span key={i} className={'bar' + (has && inRange(i) ? ' bar-on' : '')} style={{ height: `${Math.max(4, (b / top) * 100)}%` }} />)}
        <span className="histo-avg" style={{ left: `${(h.avg / h.max) * 100}%` }}><span>typical</span></span>
        {has ? (
          <span className="bracket" data-part="mid" style={{ left: pct(lo ?? 0), width: `calc(${pct(hi ?? h.max)} - ${pct(lo ?? 0)})` }}>
            <span className="bracket-end bracket-lo" data-part="lo" role="slider" tabIndex={0} aria-label="minimum price"
              aria-valuemin={0} aria-valuemax={h.max} aria-valuenow={lo ?? 0} aria-valuetext={money(lo ?? 0)} onKeyDown={e => nudge('lo', e)} />
            <span className="bracket-end bracket-hi" data-part="hi" role="slider" tabIndex={0} aria-label="maximum price"
              aria-valuemin={0} aria-valuemax={h.max} aria-valuenow={hi ?? h.max} aria-valuetext={hi == null ? 'any' : money(hi)} onKeyDown={e => nudge('hi', e)} />
          </span>
        ) : <span className="histo-hint">tap the chart to pick a range</span>}
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

// All filters, in one sheet: the subcategory's own (make and model, type, wheel size…),
// then who's selling and the listing options. Live count on the button; clear resets the sheet.
function FilterSheet({ title, facets, f, query, countFor, onClose, onApply }) {
  const [p, setP] = useState(() => Object.fromEntries(SHEET_KEYS.map(k => [k, f[k]])))
  const [text, setText] = useState(() => (f.attrs?.mm || []).join(' '))
  const set = patch => setP(x => ({ ...x, ...patch }))
  const attrs = { ...(p.attrs || {}), ...(text.trim() ? { mm: [text.trim()] } : { mm: [] }) }
  const toggle = (key, v) => set({ attrs: { ...p.attrs, [key]: (p.attrs?.[key] || []).includes(v) ? p.attrs[key].filter(x => x !== v) : [...(p.attrs?.[key] || []), v] } })
  const next = { ...p, attrs }
  const n = countFor({ ...f, ...next })
  const soldBy = p.ownerOnly ? 'owner' : p.dealerOnly ? 'dealer' : 'all'
  const chip = (on, label, onClick) => <button key={label} type="button" className={'chip' + (on ? ' chip-on' : '')} aria-pressed={on} onClick={onClick}>{on && <Icon name="check" size={18} />}{label}</button>
  return (
    <Sheet title={title} onClose={onClose} footer={
      <div className="facet-foot">
        <button type="button" className="btn-text" onClick={() => { setP({ attrs: {} }); setText('') }}>clear</button>
        <button type="button" className="btn-primary" onClick={() => onApply(next)} disabled={n === 0}>{n === 0 ? 'no matches' : `show ${n} listing${n === 1 ? '' : 's'}`}</button>
      </div>
    }>
      {facets.map(fc => fc.kind === 'text' ? (
        <section key={fc.key} className="facet">
          <h3 className="area-label">{fc.label}</h3>
          <label className="loc-search facet-find" htmlFor={'find-' + fc.key}>
            <Icon name="search" size={20} />
            <input id={'find-' + fc.key} type="search" autoComplete="off" placeholder="e.g. surly long haul trucker" value={text} onChange={e => setText(e.target.value)} />
          </label>
          <div className="presets">{fc.suggest.filter(m => !text.trim() || m.includes(text.trim().toLowerCase())).map(m => chip(text.trim().toLowerCase() === m, m, () => setText(text.trim().toLowerCase() === m ? '' : m)))}</div>
        </section>
      ) : (
        <section key={fc.key} className="facet">
          <h3 className="area-label">{fc.label}</h3>
          <div className="presets">{fc.options.map(o => chip((p.attrs?.[fc.key] || []).includes(o), o, () => toggle(fc.key, o)))}</div>
          {fc.hint && <p className="facet-hint">{fc.hint}</p>}
        </section>
      ))}

      <section className="facet">
        <h3 className="area-label">sold by</h3>
        <div className="segmented" role="radiogroup" aria-label="sold by">
          {['all', 'owner', 'dealer'].map(o => (
            <button key={o} type="button" role="radio" aria-checked={soldBy === o} className={soldBy === o ? 'seg-on' : ''}
              onClick={() => set({ ownerOnly: o === 'owner', dealerOnly: o === 'dealer' })}>{soldBy === o && <Icon name="check" size={18} />}{o}</button>
          ))}
        </div>
      </section>

      <section className="facet">
        <h3 className="area-label">listing</h3>
        <div className="presets">
          {FLAGS.filter(([k]) => k !== 'titles' || query).map(([k, label]) => chip(!!p[k], label, () => set({ [k]: !p[k] })))}
          {chip(p.bundle !== false, 'bundle duplicates', () => set({ bundle: p.bundle === false }))}
        </div>
        <p className="facet-hint">bundle duplicates groups a dealer's repeat posts into one card.</p>
      </section>

      <section className="facet">
        <h3 className="area-label">language of posting</h3>
        <div className="presets">{LANGS.map(l => chip(p.lang === l, l, () => set({ lang: p.lang === l ? null : l })))}</div>
      </section>
    </Sheet>
  )
}

function SaveSheet({ name, f, area, updating, existingLabel, onClose, onSave }) {
  const [label, setLabel] = useState(existingLabel || name)
  const [alerts, setAlerts] = useState(true)
  const [freq, setFreq] = useState('instantly')
  const parts = [priceChipLabel(f.min, f.max) !== 'price' && priceChipLabel(f.min, f.max), ...attrSummary(f.attrs), f.ownerOnly && 'by owner', f.dealerOnly && 'by dealer', ...FLAGS.filter(([k]) => k !== 'photosOnly' && f[k]).map(([, l]) => l), f.lang, f.photosOnly && 'has photos', areaLabel(area)].filter(Boolean)
  return (
    <Sheet title={updating ? 'update this search' : 'save this search'} onClose={onClose} footer={
      <button type="button" className="btn-primary" onClick={() => onSave({ label, detail: parts.join(' · '), alerts })}>{updating ? 'update search' : 'save search'}</button>
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
