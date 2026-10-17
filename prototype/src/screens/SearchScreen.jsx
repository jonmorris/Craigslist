import React, { useEffect, useRef, useState } from 'react'
import { sections, city, priceLabel } from '../data.js'
import { suggest, scopes, searchListings, TRENDING } from '../search.js'
import { Icon, Thumb } from '../ui.jsx'

// (c) Search — M3 full-screen search view. Empty: recent, saved, trending.
// Typing: completions, "search in" scopes with counts, and listing matches.
export default function SearchScreen({ onOpenListing, scopeSection, initialQuery = '', recent, saved, onSubmit, onOpenSaved, onRemoveRecent, onClearRecent, onBack, toast }) {
  const [q, setQ] = useState(initialQuery)
  const [scope, setScope] = useState(scopeSection)
  const input = useRef(null)
  useEffect(() => { input.current?.focus() }, [])

  const scopeName = scope && sections.find(s => s.id === scope).name
  const typed = q.trim()
  const submit = (text, section = scope, sub = 'all') => { if (text.trim()) onSubmit(text.trim(), section, sub) }
  const completions = suggest(typed)
  // While a word is half-typed ("bik"), scope and preview with the top completion ("bike").
  const term = completions[0]?.startsWith(typed.toLowerCase()) ? completions[0] : typed
  const scoped = typed ? scopes(term, scope) : []
  const hits = typed ? searchListings(term, scope).slice(0, 3) : []

  return (
    <div className="search">
      <div className="search-head">
        <button type="button" className="icon-btn" aria-label="back" onClick={onBack}><Icon name="back" /></button>
        <form className="search-form" role="search" onSubmit={e => { e.preventDefault(); submit(q) }}>
          <input ref={input} id="q" type="search" enterKeyHint="search" autoComplete="off" value={q}
            placeholder={scope ? `search ${scopeName}` : `search ${city.name}`} onChange={e => setQ(e.target.value)} aria-label="search" />
        </form>
        {q && <button type="button" className="icon-btn" aria-label="clear" onClick={() => { setQ(''); input.current?.focus() }}><Icon name="close" /></button>}
      </div>
      <div className="hscroll chips scope-row">
        <button type="button" className="chip" onClick={() => toast('neighborhood sheet comes later')}>
          <Icon name="pin" size={18} />{city.name} · {city.area}<Icon name="chevron" size={16} />
        </button>
        {scope && (
          <button type="button" className="chip chip-on" onClick={() => setScope(null)} aria-label={`remove ${scopeName} filter`}>
            in {scopeName}<Icon name="close" size={18} />
          </button>
        )}
      </div>

      {!typed && (
        <>
          {recent.length > 0 && (
            <section className="sv-block">
              <div className="block-head pad"><h2>recent</h2><button type="button" className="link" onClick={onClearRecent}>clear all</button></div>
              {recent.map(r => (
                <div key={r} className="sv-row">
                  <button type="button" className="sv-main" onClick={() => submit(r)}>
                    <Icon name="history" /><span className="sv-text">{r}</span>
                  </button>
                  <button type="button" className="icon-btn" aria-label={`remove ${r}`} onClick={() => onRemoveRecent(r)}><Icon name="close" size={20} /></button>
                </div>
              ))}
            </section>
          )}
          <section className="sv-block">
            <div className="block-head pad"><h2>saved searches</h2></div>
            {saved.map(s => (
              <button key={s.id} type="button" className="sv-main sv-row-btn" onClick={() => onOpenSaved(s)}>
                <Icon name="bell" />
                <span className="sv-text"><strong>{s.label}</strong><span>{s.detail}</span></span>
                {s.fresh > 0 && <span className="badge">{s.fresh} new</span>}
              </button>
            ))}
          </section>
          <section className="sv-block">
            <div className="block-head pad"><h2>trending in {city.name}</h2></div>
            <div className="pad trend">
              {TRENDING.map(t => <button key={t} type="button" className="chip" onClick={() => submit(t)}><Icon name="trend" size={18} />{t}</button>)}
            </div>
          </section>
        </>
      )}

      {typed && (
        <>
          <section className="sv-block sv-tight">
            {(completions.length ? completions : [typed]).map(c => (
              <div key={c} className="sv-row">
                <button type="button" className="sv-main" onClick={() => submit(c)}>
                  <Icon name="search" />
                  <span className="sv-text">{c.toLowerCase().startsWith(typed.toLowerCase())
                    ? <>{c.slice(0, typed.length)}<b>{c.slice(typed.length)}</b></> : c}</span>
                </button>
                <button type="button" className="icon-btn" aria-label={`edit search: ${c}`} onClick={() => { setQ(c + ' '); input.current?.focus() }}><Icon name="fill" size={20} /></button>
              </div>
            ))}
          </section>

          {scoped.length > 0 && (
            <section className="sv-block">
              <div className="block-head pad"><h2>search in</h2></div>
              {scoped.map(s => (
                <button key={s.section + s.sub} type="button" className="sv-main sv-row-btn" onClick={() => submit(term, s.section, s.sub)}>
                  <span className={'scope-icon tint-' + s.section}><Icon name={sections.find(x => x.id === s.section).icon} size={20} /></span>
                  <span className="sv-text sv-inline">{term} in <strong>{s.sub === 'all' ? `all ${s.sectionName}` : s.sub}</strong></span>
                  <span className="sv-count">{s.n}</span>
                </button>
              ))}
            </section>
          )}

          {hits.length > 0 ? (
            <section className="sv-block">
              <div className="block-head pad"><h2>listings</h2><button type="button" className="link" onClick={() => submit(term)}>see all</button></div>
              {hits.map(l => (
                <button key={l.id} type="button" className="sv-main sv-row-btn sv-hit" onClick={() => onOpenListing(l.id)}>
                  <Thumb listing={l} />
                  <span className="sv-text"><strong>{priceLabel(l)}</strong><span className="sv-hit-title">{l.title}</span><span>{l.age} · {l.hood}</span></span>
                </button>
              ))}
            </section>
          ) : (
            <p className="sv-none pad">nothing matches “{typed}” right now. search anyway and save it, and we'll tell you when one's posted.</p>
          )}
        </>
      )}
    </div>
  )
}
