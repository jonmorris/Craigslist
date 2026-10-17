import React, { useEffect, useRef, useState } from 'react'
import { sections, listings, city, fmt } from '../data.js'
import { Icon, PeaceSign, LocationButton, SearchBar, ListingCard } from '../ui.jsx'

// (a) Home — search hero, six section tiles, saved searches, fresh grid.
export default function HomeScreen({ toast, onOpen, onSearch, onOpenSaved, savedSearches }) {
  const fresh = listings.filter(l => l.photo || l.section === 'sale').slice(0, 8)
  // Brand + location row scrolls away; the search bar pins and picks up the mark.
  const barRef = useRef(null)
  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    const el = barRef.current
    const io = new IntersectionObserver(([e]) => setCollapsed(!e.isIntersecting),
      { root: el.closest('.screen'), threshold: 0 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div className="home">
      <header className="appbar" ref={barRef}>
        <PeaceSign size={30} />
        <LocationButton />
        <button className="icon-btn" type="button" aria-label="notifications" onClick={() => toast('notifications come later')}>
          <Icon name="bell" /><span className="dot" />
        </button>
      </header>

      <div className={'pad home-search' + (collapsed ? ' home-search-stuck' : '')}>
        <span className="stuck-mark" aria-hidden={!collapsed}><PeaceSign size={26} /></span>
        <SearchBar placeholder={collapsed ? `search ${city.name}` : 'search craigslist'} onTap={() => onSearch()} />
      </div>

      <section className="pad tiles" aria-label="browse">
        {sections.map(s => (
          <button key={s.id} type="button" className={'tile tint-' + s.id} onClick={() => onOpen(s.id)}>
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
            <button key={s.id} type="button" className="saved-chip" onClick={() => onOpenSaved(s)}>
              <span className="saved-text"><strong>{s.label}</strong><span>{s.detail}</span></span>
              {s.fresh > 0 ? <span className="badge">{s.fresh} new</span> : <span className="badge badge-quiet">just saved</span>}
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block-head pad"><h2>fresh near you</h2><button type="button" className="link" onClick={() => onOpen('sale')}>see all</button></div>
        <div className="grid pad">
          {fresh.map(l => <ListingCard key={l.id} listing={l} onTap={() => toast('listing detail is screen (d)')} />)}
        </div>
      </section>
    </div>
  )
}
