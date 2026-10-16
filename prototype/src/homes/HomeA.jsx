import React from 'react'
import { sections, savedSearches, listings, fmt } from '../data.js'
import { Icon, PeaceSign, LocationButton, SearchBar, ListingCard } from '../ui.jsx'

// A — "search + browse": search hero, six section tiles, saved searches, fresh grid.
export default function HomeA({ toast }) {
  const fresh = listings.filter(l => l.photo || l.section === 'sale').slice(0, 8)
  return (
    <div className="home home-a">
      <header className="appbar">
        <PeaceSign size={30} />
        <LocationButton />
        <button className="icon-btn" type="button" aria-label="notifications" onClick={() => toast('notifications come later')}>
          <Icon name="bell" /><span className="dot" />
        </button>
      </header>

      <div className="pad"><SearchBar onTap={() => toast('search is screen (c) — next up')} /></div>

      <section className="pad tiles" aria-label="browse">
        {sections.map(s => (
          <button key={s.id} type="button" className={'tile tint-' + s.id} onClick={() => toast(`${s.name} → category list is screen (b)`)}>
            <Icon name={s.icon} size={26} />
            <span className="tile-name">{s.name}</span>
            <span className="tile-count">{fmt(s.count)}</span>
          </button>
        ))}
      </section>

      <section className="block">
        <div className="block-head pad"><h2>your searches</h2><button type="button" className="link" onClick={() => toast('saved searches list')}>manage</button></div>
        <div className="hscroll">
          {savedSearches.map(s => (
            <button key={s.id} type="button" className="saved-chip" onClick={() => toast(`${s.label}: ${s.fresh} new listings`)}>
              <span className="saved-text"><strong>{s.label}</strong><span>{s.detail}</span></span>
              <span className="badge">{s.fresh} new</span>
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block-head pad"><h2>fresh near you</h2><button type="button" className="link" onClick={() => toast('full feed')}>see all</button></div>
        <div className="grid pad">
          {fresh.map(l => <ListingCard key={l.id} listing={l} onTap={() => toast('listing detail is screen (d)')} />)}
        </div>
      </section>
    </div>
  )
}
