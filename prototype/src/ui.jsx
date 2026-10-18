import React from 'react'
import { priceLabel } from './data.js'
import { ICONS } from './icons.js'

// Material Symbols Rounded (generated into icons.js by scripts/icons.mjs).
export function Icon({ name, size = 24, className = '' }) {
  return (
    <svg className={'icon ' + className} width={size} height={size} viewBox="0 -960 960 960"
      fill="currentColor" aria-hidden="true">{(ICONS[name] || []).map((d, i) => <path key={i} d={d} />)}</svg>
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

export function LocationButton({ compact, area = 'all areas', onTap }) {
  return (
    <button className="loc" type="button" onClick={onTap} aria-label={`location: ${area}. change`}>
      {!compact && <span className="loc-label">location</span>}
      <span className="loc-value">{area.includes(' · ') ? <>{area.split(' · ')[0]} <span className="loc-area">· {area.split(' · ').slice(1).join(' · ')}</span></> : <span>{area}</span>}
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
      <Icon name={listing.glyph || 'tag'} size={big ? 56 : 40} />
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

// `onFav` adds a save heart on the card itself, so people can collect a few listings
// from a list without opening each one.
export function ListingCard({ listing, variant = 'grid', onTap, similar = 0, fav, onFav }) {
  const card = (
    <button type="button" className={'card card-' + variant} onClick={onTap}>
      {variant !== 'text' && <Thumb listing={listing} big={variant === 'large'} />}
      <div className="card-body">
        <div className="card-price-row">
          <span className={'price' + (listing.price === 0 ? ' price-free' : '')}>{priceLabel(listing)}</span>
          <FairBadge fair={listing.fair} />
        </div>
        <span className="card-title">{listing.title}</span>
        <span className="card-meta">{listing.age} · {listing.hood} · {listing.mi} mi</span>
        {listing.dealer && <span className="card-seller">dealer · {listing.seller}{similar > 0 && ` · +${similar} similar`}</span>}
      </div>
    </button>
  )
  if (!onFav) return card
  const onPhoto = (variant === 'grid' || variant === 'large')
  return (
    <div className={'card-wrap card-wrap-' + variant}>
      {card}
      <button type="button" className={'icon-btn card-fav' + (onPhoto ? ' on-photo' : '') + (fav ? ' fav-on' : '')}
        aria-pressed={!!fav} aria-label={fav ? `remove ${listing.title} from saved` : `save ${listing.title}`} onClick={() => onFav(listing.id)}>
        <Icon name={fav ? 'bookmark-fill' : 'bookmark'} size={22} />
      </button>
    </div>
  )
}

// Material bottom sheet, scoped to the device frame.
export function Sheet({ title, onClose, children, footer }) {
  return (
    <div className="sheet-layer">
      <button type="button" className="scrim" aria-label="close" onClick={onClose} />
      <div className="sheet" role="dialog" aria-label={title}>
        <span className="sheet-handle" />
        <div className="sheet-head"><h2>{title}</h2>
          <button type="button" className="icon-btn" aria-label="close" onClick={onClose}><Icon name="close" /></button></div>
        <div className="sheet-body">{children}</div>
        {footer && <div className="sheet-foot">{footer}</div>}
      </div>
    </div>
  )
}

const NAV = [
  ['home', 'home'], ['bookmark', 'saved'], ['plus', 'post'], ['chat', 'chat'], ['person', 'account'],
]

export function BottomNav({ onTap, onHome, onSaved, onPost, onAccount, active = 'home', hideOnPhone = false }) {
  return (
    <nav className={'navbar' + (hideOnPhone ? ' nav-phone-hidden' : '')} aria-label="main">
      {NAV.map(([icon, label]) => (
        <button key={label} type="button" className={'nav-item' + (label === active ? ' active' : '') + (label === 'post' ? ' nav-post' : '')}
          aria-current={label === active ? 'page' : undefined}
          onClick={() => (label === 'home' ? onHome() : label === 'saved' ? onSaved() : label === 'post' ? onPost() : label === 'account' ? onAccount() : onTap(`${label} isn't built yet`))}>
          <span className="nav-pill"><Icon name={icon} /></span>
          <span className="nav-label">{label}</span>
        </button>
      ))}
    </nav>
  )
}
