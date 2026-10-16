import React, { useEffect, useRef, useState } from 'react'
import HomeA from './homes/HomeA.jsx'
import HomeB from './homes/HomeB.jsx'
import HomeC from './homes/HomeC.jsx'
import { BottomNav, Icon } from './ui.jsx'

const VARIANTS = [
  { id: 'a', name: 'search + browse', Comp: HomeA,
    pitch: 'Search on top, six section tiles, your saved searches, then a grid of fresh listings.',
    plus: 'Familiar and balanced: works for "I know what I want" and "just looking".',
    minus: 'The safest option, so the least memorable.' },
  { id: 'b', name: 'local feed', Comp: HomeB,
    pitch: 'Home is a newest-first feed of listings near you. Chips filter it in place.',
    plus: 'Zero taps to real listings. The chips work, so try them.',
    minus: 'Can drift toward Facebook Marketplace. Strictly chronological keeps it craigslist.' },
  { id: 'c', name: 'the board', Comp: HomeC,
    pitch: 'The classic craigslist homepage, rebuilt as section cards with demand-ordered subcategories and fresh thumbnails.',
    plus: 'The most on-brand and distinctive. A strong story for the deck.',
    minus: 'More scrolling before a listing, and it needs craft to avoid looking busy.' },
]

const store = {
  get(k) { try { return localStorage.getItem(k) } catch { return null } },
  set(k, v) { try { localStorage.setItem(k, v) } catch { /* storage blocked */ } },
}

function initialVariant() {
  const h = location.hash.replace('#', '')
  if (VARIANTS.some(v => v.id === h)) return h
  const s = store.get('cl-home')
  return VARIANTS.some(v => v.id === s) ? s : 'a'
}

export default function App() {
  const [variant, setVariant] = useState(initialVariant)
  const [theme, setTheme] = useState(() => store.get('cl-theme') || 'system')
  const [toastMsg, setToastMsg] = useState(null)
  const screenRef = useRef(null)
  const timer = useRef()

  useEffect(() => {
    store.set('cl-home', variant)
    screenRef.current?.scrollTo({ top: 0 })
  }, [variant])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    store.set('cl-theme', theme)
  }, [theme])

  useEffect(() => {
    const onKey = e => {
      if (e.target.closest?.('input, textarea')) return
      const v = VARIANTS[Number(e.key) - 1]
      if (v) setVariant(v.id)
    }
    addEventListener('keydown', onKey)
    return () => removeEventListener('keydown', onKey)
  }, [])

  const toast = msg => {
    clearTimeout(timer.current)
    setToastMsg(msg)
    timer.current = setTimeout(() => setToastMsg(null), 2200)
  }

  const current = VARIANTS.find(v => v.id === variant)
  const Home = current.Comp

  return (
    <div className="stage">
      <aside className="panel">
        <p className="eyebrow">craigslist redesign · prototype</p>
        <h1>home directions</h1>
        <p className="panel-lede">Three takes on screen (a), with the same Minneapolis data. Switch between them, or press 1, 2 or 3.</p>
        <div className="options" role="radiogroup" aria-label="home direction">
          {VARIANTS.map((v, i) => (
            <button key={v.id} type="button" role="radio" aria-checked={v.id === variant}
              className={'option' + (v.id === variant ? ' option-on' : '')} onClick={() => setVariant(v.id)}>
              <span className="option-key">{String.fromCharCode(65 + i)}</span>
              <span className="option-body">
                <strong>{v.name}</strong>
                <span>{v.pitch}</span>
                {v.id === variant && <>
                  <span className="pro">+ {v.plus}</span>
                  <span className="con">− {v.minus}</span>
                </>}
              </span>
            </button>
          ))}
        </div>
        <div className="theme-row" role="radiogroup" aria-label="theme">
          {[['light', 'sun'], ['dark', 'moon'], ['system', 'sparkle']].map(([t, ic]) => (
            <button key={t} type="button" role="radio" aria-checked={theme === t}
              className={'theme-btn' + (theme === t ? ' theme-on' : '')} onClick={() => setTheme(t)}>
              <Icon name={ic} size={16} />{t}
            </button>
          ))}
        </div>
        <p className="panel-note">Bike photos are cropped from the audit screenshots as stand-ins. Listings without photos show the designed no-photo state.</p>
      </aside>

      <div className="device">
        <div className="statusbar" aria-hidden="true"><span>9:41</span><span className="sb-icons">▲ ◢ ▮</span></div>
        <main className="screen" ref={screenRef} key={variant}>
          <Home toast={toast} />
        </main>

        <div className="switcher" role="radiogroup" aria-label="home direction">
          {VARIANTS.map((v, i) => (
            <button key={v.id} type="button" role="radio" aria-checked={v.id === variant}
              className={v.id === variant ? 'on' : ''} onClick={() => { setVariant(v.id); toast(`${String.fromCharCode(65 + i)} · ${v.name}`) }}>
              {String.fromCharCode(65 + i)}
            </button>
          ))}
          <button type="button" className="sw-theme" aria-label="toggle theme"
            onClick={() => setTheme(t => (t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)) ? 'light' : 'dark')}>
            <Icon name="moon" size={16} />
          </button>
        </div>

        {toastMsg && <div className="snackbar" role="status">{toastMsg}</div>}
        <BottomNav onTap={toast} />
        <div className="gesture" aria-hidden="true" />
      </div>
    </div>
  )
}
