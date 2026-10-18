import React, { useState } from 'react'
import { sections, city, fmt, bySection } from '../data.js'
import { taxonomy, trendingBySection } from '../taxonomy.js'
import { Icon, ListingCard } from '../ui.jsx'

// Section landing (interstitial between Home and the list): pick where to go
// inside a section before seeing listings. Popular subcategories first, the full
// real taxonomy A–Z below, plus what's trending and what's fresh.
export default function SectionScreen({ favorites = new Set(), onToggleFav, sectionId, onBack, onOpenList, onSearch, onRunSearch, onOpenListing, toast }) {
  const s = sections.find(x => x.id === sectionId)
  const subs = taxonomy[sectionId]
  const popular = [...subs].sort((a, b) => b.count - a.count).slice(0, 6)
  const fresh = bySection(sectionId).slice(0, 4)
  const [showAll, setShowAll] = useState(false)
  const az = showAll ? subs : subs.slice(0, 12)

  const openSub = sub => (sub.key ? onOpenList(sectionId, sub.key)
    : toast(`prototype: no mock listings for ${sub.name} yet`))

  return (
    <div className="section-page">
      <div className={'section-hero tint-' + sectionId}>
        <header className="cat-bar">
          <button type="button" className="icon-btn" aria-label="back" onClick={onBack}><Icon name="back" /></button>
          <span className="flex1" />
          <button type="button" className="icon-btn" aria-label={'search ' + s.name} onClick={() => onSearch(sectionId)}><Icon name="search" /></button>
        </header>
        <div className="pad section-hero-body">
          <Icon name={s.icon} size={32} />
          <h1>{s.name}</h1>
          <p>{fmt(s.count)} listings · {fmt(s.newToday)} new today · {city.name}, {city.area}</p>
        </div>
      </div>

      <div className="pad">
        <button type="button" className="browse-all" onClick={() => onOpenList(sectionId, 'all')}>
          <span className="sv-text"><strong>browse all of {s.name}</strong><span>newest first, every subcategory</span></span>
          <Icon name="arrow" />
        </button>
      </div>

      <section className="block">
        <div className="block-head pad"><h2>popular</h2></div>
        <div className="pad pop-grid">
          {popular.map(sub => (
            <button key={sub.name} type="button" className={'pop-tile tint-' + sectionId} onClick={() => openSub(sub)}>
              <strong>{sub.name}</strong>
              <span>{fmt(sub.count)} · {fmt(sub.fresh)} new</span>
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block-head pad"><h2>trending this week</h2></div>
        <div className="hscroll chips">
          {trendingBySection[sectionId].map(t => (
            <button key={t} type="button" className="chip" onClick={() => onRunSearch(t, sectionId)}><Icon name="trend" size={18} />{t}</button>
          ))}
        </div>
      </section>

      {fresh.length > 0 && (
        <section className="block">
          <div className="block-head pad"><h2>just posted</h2>
            <button type="button" className="link" onClick={() => onOpenList(sectionId, 'all')}>see all</button></div>
          <div className="grid pad">
            {fresh.map(l => <ListingCard key={l.id} listing={l} fav={favorites.has(l.id)} onFav={onToggleFav} onTap={() => onOpenListing(l.id, fresh.map(x => x.id))} />)}
          </div>
        </section>
      )}

      <section className="block">
        <div className="block-head pad"><h2>all {subs.length} subcategories</h2></div>
        <div className="az-list" role="list">
          {az.map(sub => (
            <button key={sub.name} type="button" role="listitem" className="az-row" onClick={() => openSub(sub)}>
              <span className="az-name">{sub.name}</span>
              <span className={'az-count' + (sub.zero ? ' az-none' : '')}>{sub.zero ? 'none nearby' : fmt(sub.count)}</span>
              <Icon name="arrow" size={18} />
            </button>
          ))}
        </div>
        {subs.length > 12 && (
          <div className="pad"><button type="button" className="btn-outlined" onClick={() => setShowAll(v => !v)}>
            {showAll ? 'show fewer' : `show all ${subs.length}`}<Icon name="chevron" size={18} className={showAll ? 'flip' : ''} />
          </button></div>
        )}
      </section>
      <p className="feed-end pad">subcategories from craigslist {city.name} · counts are mock data</p>
    </div>
  )
}
