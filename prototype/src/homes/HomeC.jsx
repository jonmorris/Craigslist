import React from 'react'
import { sections, savedSearches, bySection, priceLabel, fmt } from '../data.js'
import { Icon, PeaceSign, SearchBar, Thumb } from '../ui.jsx'

// C — "the board": the classic craigslist homepage as expressive section cards.
export default function HomeC({ toast }) {
  return (
    <div className="home home-c">
      <header className="board-head pad">
        <div className="wordmark"><PeaceSign size={34} /><span>craigslist</span></div>
        <button type="button" className="city" onClick={() => toast('location sheet comes later')}>
          minneapolis <Icon name="chevron" size={18} />
        </button>
        <p className="board-sub">{fmt(21327)} listings · {fmt(1958)} posted today</p>
      </header>

      <div className="pad"><SearchBar placeholder="search all of minneapolis" onTap={() => toast('search is screen (c) — next up')} /></div>

      <section className="block">
        <div className="block-head pad"><h2>pinned</h2><span className="muted">your saved searches</span></div>
        <div className="hscroll notes">
          {savedSearches.map((s, i) => (
            <button key={s.id} type="button" className={'note tint-' + s.section} style={{ '--tilt': ['-1.2deg', '0.8deg', '-0.4deg'][i] }}
              onClick={() => toast(`${s.label}: ${s.fresh} new listings`)}>
              <span className="note-pin" />
              <strong>{s.label}</strong>
              <span>{s.detail}</span>
              <span className="note-new">{s.fresh} new</span>
            </button>
          ))}
          <button type="button" className="note note-add" onClick={() => toast('save a search from any results page')}>
            <Icon name="plus" /><span>pin a search</span>
          </button>
        </div>
      </section>

      <div className="pad board">
        {sections.map(s => <SectionCard key={s.id} section={s} toast={toast} />)}
      </div>
      <p className="feed-end pad">all {sections.length} sections · tap a heading to browse everything</p>
    </div>
  )
}

function SectionCard({ section: s, toast }) {
  const fresh = bySection(s.id).slice(0, 3)
  const open = what => toast(`${what} → category list is screen (b)`)
  return (
    <article className="board-card">
      <button type="button" className={'board-card-head tint-' + s.id} onClick={() => open(s.name)}>
        <Icon name={s.icon} size={22} />
        <h3>{s.name}</h3>
        <span className="board-count">{fmt(s.count)}</span>
        <Icon name="arrow" size={20} className="board-arrow" />
      </button>
      <div className="board-subs">
        {s.subs.map(sub => <button key={sub} type="button" className="sub" onClick={() => open(sub)}>{sub}</button>)}
        <button type="button" className="sub sub-more" onClick={() => open(s.name)}>+{s.more} more</button>
      </div>
      {fresh.length > 0 && (
        <div className="board-fresh">
          {fresh.map(l => (
            <button key={l.id} type="button" className="mini" onClick={() => toast('listing detail is screen (d)')}>
              <Thumb listing={l} />
              <span className="mini-price">{priceLabel(l)}</span>
              <span className="mini-title">{l.title}</span>
            </button>
          ))}
        </div>
      )}
      <p className="board-foot">{fmt(s.newToday)} new today</p>
    </article>
  )
}
