import React from 'react'
import { listings, priceLabel } from '../data.js'
import { Icon, ListingCard, Thumb } from '../ui.jsx'

// Saved tab: the place every "save", "save search" and "hide" leads to.
// Listings you saved, searches with their alerts, and posts you hid (with a way back).
const TABS = [['listings', 'listings'], ['searches', 'searches'], ['hidden', 'hidden']]

export default function SavedScreen({ tab, onTab, favorites, onToggleFav, saved, onOpenSaved, onToggleAlerts, onDeleteSaved, hiddenIds, onUnhide, onOpenListing, onBrowse }) {
  const favs = listings.filter(l => favorites.has(l.id) && !hiddenIds.includes(l.id))
  const hiddenList = listings.filter(l => hiddenIds.includes(l.id))
  const counts = { listings: favs.length, searches: saved.length, hidden: hiddenList.length }

  return (
    <div className="saved">
      <div className="sticky-top">
        <header className="cat-bar"><h1 className="saved-title">saved</h1></header>
        <div className="tabs" role="tablist" aria-label="saved">
          {TABS.map(([key, label]) => (
            <button key={key} type="button" role="tab" aria-selected={tab === key} className={'tab' + (tab === key ? ' tab-on' : '')} onClick={() => onTab(key)}>
              <span className="tab-label">{label}{counts[key] > 0 && <span className="tab-n">{counts[key]}</span>}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === 'listings' && (favs.length ? (
        <div className="pad grid saved-grid">
          {favs.map(l => <ListingCard key={l.id} listing={l} fav onFav={onToggleFav} onTap={() => onOpenListing(l.id, favs.map(x => x.id))} />)}
        </div>
      ) : (
        <Empty icon="bookmark" title="nothing saved yet" body="tap the bookmark on a listing and it lands here, even after you close the app." action="browse listings" onAction={onBrowse} />
      ))}

      {tab === 'searches' && (saved.length ? (
        <div className="saved-list">
          {saved.map(s => (
            <div key={s.id} className="saved-row">
              <button type="button" className="saved-main" onClick={() => onOpenSaved(s)}>
                <Icon name="search" />
                <span className="saved-text"><strong>{s.label}</strong><span>{s.detail}{s.alerts === false ? ' · alerts off' : ''}</span></span>
                {s.fresh > 0 && <span className="badge">{s.fresh} new</span>}
              </button>
              <button type="button" className="icon-btn" aria-pressed={s.alerts !== false}
                aria-label={s.alerts === false ? `turn on alerts for ${s.label}` : `turn off alerts for ${s.label}`} onClick={() => onToggleAlerts(s.id)}>
                <Icon name={s.alerts === false ? 'bell-off' : 'bell'} />
              </button>
              <button type="button" className="icon-btn" aria-label={`delete ${s.label}`} onClick={() => onDeleteSaved(s.id)}><Icon name="delete" /></button>
            </div>
          ))}
          <p className="saved-note pad">opening a saved search brings back its filters. change them and save again to update it.</p>
        </div>
      ) : (
        <Empty icon="bell" title="no saved searches" body="save a search from any list and we'll tell you when something new is posted." action="browse listings" onAction={onBrowse} />
      ))}

      {tab === 'hidden' && (hiddenList.length ? (
        <div className="saved-list">
          {hiddenList.map(l => (
            <div key={l.id} className="saved-row">
              <div className="saved-main saved-static">
                <Thumb listing={l} />
                <span className="saved-text"><strong>{priceLabel(l)}</strong><span className="saved-hidden-title">{l.title}</span></span>
              </div>
              <button type="button" className="btn-text" onClick={() => onUnhide(l.id)}>unhide</button>
            </div>
          ))}
          <p className="saved-note pad">hidden posts stay out of every list and search on this phone.</p>
        </div>
      ) : (
        <Empty icon="hide" title="nothing hidden" body="hide a listing you're not interested in and it stops showing up. you can bring it back here." />
      ))}
    </div>
  )
}

function Empty({ icon, title, body, action, onAction }) {
  return (
    <div className="saved-empty pad">
      <span className="saved-empty-icon"><Icon name={icon} size={32} /></span>
      <h2>{title}</h2>
      <p>{body}</p>
      {action && <button type="button" className="btn-tonal" onClick={onAction}>{action}</button>}
    </div>
  )
}
