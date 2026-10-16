import React from 'react'
import { priceLabel } from './data.js'

// 24px outline icons, Material-ish proportions, stroked with currentColor.
const P = {
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" /><path d="M10 20.5a2 2 0 0 0 4 0" /></>,
  chevron: <path d="m7 10 5 5 5-5" />,
  arrow: <path d="M5 12h14m-5-5 5 5-5 5" />,
  home: <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z" />,
  bookmark: <path d="M7 4h10v17l-5-4-5 4z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  chat: <path d="M5 5h14v10H10l-4 4v-4H5z" />,
  person: <><circle cx="12" cy="8.5" r="3.5" /><path d="M5 20c1-4 4-5.5 7-5.5s6 1.5 7 5.5" /></>,
  tag: <><path d="M4 12V4h8l8 8-8 8z" /><circle cx="8.5" cy="8.5" r="1.3" /></>,
  house: <><path d="M4 11 12 4l8 7" /><path d="M6 9.5V20h12V9.5" /><path d="M10 20v-5h4v5" /></>,
  briefcase: <><rect x="3.5" y="7.5" width="17" height="12" rx="2" /><path d="M9 7.5V5h6v2.5M3.5 13h17" /></>,
  wrench: <path d="M14.5 4.5a4 4 0 0 0-4.8 5.3L4 15.5 8.5 20l5.7-5.7a4 4 0 0 0 5.3-4.8l-2.6 2.6-2.8-.8-.8-2.8z" />,
  bolt: <path d="M13 3 5 13.5h6L10 21l8-10.5h-6z" />,
  people: <><circle cx="9" cy="9" r="3" /><circle cx="16.5" cy="10" r="2.3" /><path d="M3.5 19c.8-3.4 3-4.8 5.5-4.8s4.7 1.4 5.5 4.8M15 14.6c2.6-.3 4.6 1 5.3 4.4" /></>,
  pin: <><path d="M12 21s-6-5.6-6-11a6 6 0 1 1 12 0c0 5.4-6 11-6 11z" /><circle cx="12" cy="10" r="2.2" /></>,
  snow: <path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 7l2.5-2.5M9.5 19.5 12 17l2.5 2.5" />,
  dresser: <><rect x="4.5" y="4" width="15" height="14" rx="1.5" /><path d="M4.5 8.7h15M4.5 13.3h15M11 6.4h2M11 11h2M11 15.6h2M6.5 18v2M17.5 18v2" /></>,
  shelf: <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M12 4v16M4 12h16" /></>,
  camera: <><path d="M4 8h3.5L9 6h6l1.5 2H20v11H4z" /><circle cx="12" cy="13" r="3.3" /></>,
  sparkle: <path d="M12 3.5 13.8 10l6.7 2-6.7 2L12 20.5 10.2 14l-6.7-2 6.7-2z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" /></>,
  moon: <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />,
}

export function Icon({ name, size = 24, className = '', strokeWidth = 1.8 }) {
  return (
    <svg className={'icon ' + className} width={size} height={size} viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"
      strokeLinejoin="round" aria-hidden="true">{P[name]}</svg>
  )
}

export function PeaceSign({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-label="craigslist" role="img">
      <defs>
        <linearGradient id="peace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--peace-a)" />
          <stop offset="1" stopColor="var(--peace-b)" />
        </linearGradient>
      </defs>
      <circle cx="16" cy="16" r="12.5" fill="none" stroke="url(#peace)" strokeWidth="4" />
      <path d="M16 4v24M16 16.5 7.4 25M16 16.5l8.6 8.5" stroke="url(#peace)" strokeWidth="3.6" fill="none" />
    </svg>
  )
}

export function LocationButton({ compact }) {
  return (
    <button className="loc" type="button">
      {!compact && <span className="loc-label">location</span>}
      <span className="loc-value">minneapolis <span className="loc-area">· all areas</span>
        <Icon name="chevron" size={18} /></span>
    </button>
  )
}

export function SearchBar({ placeholder = 'search craigslist', onTap }) {
  return (
    <button className="searchbar" type="button" onClick={onTap}>
      <Icon name="search" />
      <span>{placeholder}</span>
    </button>
  )
}

export function FairBadge({ fair }) {
  if (!fair || fair === 'typical') return null
  return <span className={'fair fair-' + fair}>{fair === 'below' ? 'below typical' : 'above typical'}</span>
}

// Intentional no-photo treatment: section tint + item glyph instead of a black box.
export function NoPhoto({ listing, big }) {
  return (
    <div className={'nophoto tint-' + listing.section + (big ? ' big' : '')}>
      <Icon name={listing.glyph || 'tag'} size={big ? 56 : 40} strokeWidth={1.4} />
      {listing.meta && <span className="nophoto-meta">{listing.meta}</span>}
    </div>
  )
}

export function Thumb({ listing, big }) {
  if (!listing.photo) return <NoPhoto listing={listing} big={big} />
  return (
    <div className="thumb">
      <img src={listing.photo} alt="" loading="lazy" />
      {listing.photos > 1 && <span className="photo-count"><Icon name="camera" size={14} />{listing.photos}</span>}
    </div>
  )
}

export function ListingCard({ listing, variant = 'grid', onTap }) {
  return (
    <button type="button" className={'card card-' + variant} onClick={onTap}>
      <Thumb listing={listing} big={variant === 'hero'} />
      <div className="card-body">
        <div className="card-price-row">
          <span className={'price' + (listing.price === 0 ? ' price-free' : '')}>{priceLabel(listing)}</span>
          <FairBadge fair={listing.fair} />
        </div>
        <span className="card-title">{listing.title}</span>
        <span className="card-meta">{listing.age} · {listing.hood} · {listing.mi} mi</span>
      </div>
    </button>
  )
}

const NAV = [
  ['home', 'home'], ['bookmark', 'saved'], ['plus', 'post'], ['chat', 'chat'], ['person', 'account'],
]

export function BottomNav({ onTap }) {
  return (
    <nav className="navbar" aria-label="main">
      {NAV.map(([icon, label], i) => (
        <button key={label} type="button" className={'nav-item' + (i === 0 ? ' active' : '') + (label === 'post' ? ' nav-post' : '')}
          onClick={() => i !== 0 && onTap(`${label} isn't built yet`)}>
          <span className="nav-pill"><Icon name={icon} /></span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
