import React, { useState } from 'react'
import { listings, priceLabel, ageFrom } from '../data.js'
import { Icon, Thumb } from '../ui.jsx'

// Account tab = your seller home. Your posts come first (active and sold), each with its
// numbers and a one-tap way in, so a lister never has to hunt for their own post.
export default function AccountScreen({ posts, onNewPost, onOpenPost, onEditPost, theme, onTheme, onReset }) {
  const [tab, setTab] = useState('active')
  const mine = posts.map(r => listings.find(l => l.id === r.id)).filter(Boolean)
  const shown = mine.filter(l => (tab === 'active' ? l.status !== 'sold' : l.status === 'sold'))
  const count = s => mine.filter(l => (s === 'active' ? l.status !== 'sold' : l.status === 'sold')).length

  return (
    <div className="account">
      <header className="cat-bar"><h1 className="saved-title">account</h1></header>

      <section className="pad acct-block">
        <div className="block-head"><h2>your posts</h2></div>
        <button type="button" className="btn-tonal acct-new" onClick={onNewPost}><Icon name="plus" />post something</button>
        {mine.length > 0 && (
          <div className="segmented acct-seg" role="tablist" aria-label="your posts">
            {['active', 'sold'].map(t => (
              <button key={t} type="button" role="tab" aria-selected={tab === t} className={tab === t ? 'seg-on' : ''} onClick={() => setTab(t)}>
                {tab === t && <Icon name="check" size={18} />}{t} · {count(t)}
              </button>
            ))}
          </div>
        )}
        {mine.length === 0 ? (
          <p className="acct-empty">nothing posted yet. what you post shows up here with its views, saves and messages, and you can edit, mark it sold or delete it.</p>
        ) : shown.length === 0 ? (
          <p className="acct-empty">{tab === 'sold' ? 'nothing marked sold yet.' : 'no active posts.'}</p>
        ) : (
          <div className="acct-list">
            {shown.map(l => (
              <div key={l.id} className="acct-post">
                <button type="button" className="acct-main" onClick={() => onOpenPost(l.id)}>
                  <Thumb listing={l} />
                  <span className="saved-text">
                    <strong>{priceLabel(l)} <span className={'status status-' + l.status}>{l.status}</span></strong>
                    <span className="acct-title">{l.title}</span>
                    <span>{l.views} views · {l.saves} saves · {l.messages} messages · posted {ageFrom(l.postedAt)}{ageFrom(l.postedAt) === 'just now' ? '' : ' ago'}</span>
                  </span>
                </button>
                {l.status !== 'sold' && <button type="button" className="btn-text" onClick={() => onEditPost(l.id)}>edit</button>}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="pad acct-block">
        <div className="block-head"><h2>settings</h2></div>
        <h3 className="area-label">theme</h3>
        <div className="segmented" role="radiogroup" aria-label="theme">
          {['light', 'dark', 'system'].map(t => (
            <button key={t} type="button" role="radio" aria-checked={theme === t} className={theme === t ? 'seg-on' : ''} onClick={() => onTheme(t)}>{theme === t && <Icon name="check" size={18} />}{t}</button>
          ))}
        </div>
        <div className="zero-list acct-rows">
          <button type="button" className="zero-row" onClick={onReset}><Icon name="history" /><span className="sv-text"><strong>reset prototype data</strong><span>clears saved, hidden and your posts on this phone</span></span></button>
        </div>
      </section>
    </div>
  )
}
