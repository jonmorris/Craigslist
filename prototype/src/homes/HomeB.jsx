import React, { useState } from 'react'
import { sections, listings, savedSearches, fmt } from '../data.js'
import { Icon, PeaceSign, LocationButton, SearchBar, ListingCard } from '../ui.jsx'

// B — "local feed": home IS the newest-first feed; chips filter it in place.
const EARLY = new Set(['12 min', '25 min', '38 min', '44 min'])

export default function HomeB({ toast }) {
  const [filter, setFilter] = useState('all')
  const items = filter === 'all' ? listings : listings.filter(l => l.section === filter)
  const lastHour = items.filter(l => EARLY.has(l.age))
  const earlier = items.filter(l => !EARLY.has(l.age))
  const alert = savedSearches[0]
  const sec = sections.find(s => s.id === filter)

  return (
    <div className="home home-b">
      <div className="sticky-top">
        <header className="appbar">
          <PeaceSign size={30} />
          <LocationButton />
          <button className="icon-btn" type="button" aria-label="notifications" onClick={() => toast('notifications come later')}>
            <Icon name="bell" /><span className="dot" />
          </button>
        </header>
        <div className="pad"><SearchBar onTap={() => toast('search is screen (c) — next up')} /></div>
        <div className="chips hscroll" role="tablist" aria-label="filter feed">
          {[{ id: 'all', name: 'everything' }, ...sections].map(s => (
            <button key={s.id} type="button" role="tab" aria-selected={filter === s.id}
              className={'chip' + (filter === s.id ? ' chip-on' : '')} onClick={() => setFilter(s.id)}>
              {s.icon && <Icon name={s.icon} size={18} />}{s.name}
            </button>
          ))}
        </div>
      </div>

      {filter === 'all' && (
        <button type="button" className="alert-banner" onClick={() => toast(`${alert.label}: ${alert.fresh} new`)}>
          <span className="badge">{alert.fresh} new</span>
          <span className="alert-text"><strong>{alert.label}</strong> {alert.detail}</span>
          <Icon name="arrow" size={20} />
        </button>
      )}

      {sec && (
        <div className="feed-context pad">
          <span>{fmt(sec.count)} in {sec.name} · {fmt(sec.newToday)} new today</span>
          <button type="button" className="link" onClick={() => toast(`${sec.name} → category list is screen (b)`)}>open {sec.name}</button>
        </div>
      )}

      {lastHour.length > 0 && <FeedGroup title="just posted" note="last hour" items={lastHour} toast={toast} hero />}
      {earlier.length > 0 && <FeedGroup title="earlier today" items={earlier} toast={toast} />}
      {items.length === 0 && <p className="empty pad">nothing new here yet today.</p>}
      <p className="feed-end pad">newest first, always — no algorithm.</p>
    </div>
  )
}

function FeedGroup({ title, note, items, toast, hero }) {
  const [first, ...rest] = items
  const open = () => toast('listing detail is screen (d)')
  return (
    <section className="block">
      <div className="block-head pad"><h2>{title}</h2>{note && <span className="muted">{note}</span>}</div>
      <div className="pad feed">
        {hero && <ListingCard listing={first} variant="hero" onTap={open} />}
        <div className="grid">
          {(hero ? rest : items).map(l => <ListingCard key={l.id} listing={l} onTap={open} />)}
        </div>
      </div>
    </section>
  )
}
