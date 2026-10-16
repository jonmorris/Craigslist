import React, { useEffect, useRef, useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import CategoryScreen from './screens/CategoryScreen.jsx'
import { savedSearches as seedSaved } from './data.js'
import { BottomNav, Icon } from './ui.jsx'

const SCREENS = [
  { id: 'a', name: 'home', status: 'built', note: 'Search, six section tiles, your saved searches, fresh listings near you.' },
  { id: 'b', name: 'category → list', status: 'built', note: 'Subcategory tabs, filter chips in plain sight, a price sheet with the typical price, dealer reposts grouped, save search with alerts on.' },
  { id: 'c', name: 'search', status: 'next', note: 'Typeahead with results by category, recent and saved searches.' },
  { id: 'd', name: 'listing detail', status: 'next', note: 'Swipeable photos, key specs, trust signals, a one-tap reply sheet.' },
]

const store = {
  get(k) { try { return localStorage.getItem(k) } catch { return null } },
  set(k, v) { try { localStorage.setItem(k, v) } catch { /* storage blocked */ } },
}

export default function App() {
  // route: null = home, or { section, sub } for a category list
  const [route, setRoute] = useState(() => (location.hash === '#b' ? { section: 'sale', sub: 'all' } : null))
  const [saved, setSaved] = useState(seedSaved)
  const [theme, setTheme] = useState(() => store.get('cl-theme') || 'system')
  const [toastMsg, setToastMsg] = useState(null)
  const screenRef = useRef(null)
  const timer = useRef()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    store.set('cl-theme', theme)
  }, [theme])

  // Android back gesture / browser back returns to home.
  useEffect(() => {
    const onPop = () => setRoute(null)
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => { screenRef.current?.scrollTo({ top: 0 }) }, [route])

  const toast = msg => {
    clearTimeout(timer.current)
    setToastMsg(msg)
    timer.current = setTimeout(() => setToastMsg(null), 2400)
  }
  const openCategory = (section, sub = 'all') => {
    try { history.pushState({ cat: section }, '') } catch { /* sandboxed */ }
    setRoute({ section, sub })
  }
  const goHome = () => (history.state?.cat ? history.back() : setRoute(null))
  const addSaved = entry => setSaved(prev => [{ id: 'u' + Date.now(), fresh: 0, section: route.section, sub: route.sub === 'all' ? null : route.sub, ...entry }, ...prev])

  const current = route ? 'b' : 'a'

  return (
    <div className="stage">
      <aside className="panel">
        <p className="eyebrow">craigslist redesign · prototype</p>
        <h1>minneapolis, reimagined</h1>
        <p className="panel-lede">An Android prototype of the four screens in the brief, with mock Minneapolis data. Tap around in the phone, or jump to a screen here.</p>
        <div className="options">
          {SCREENS.map(s => (
            <button key={s.id} type="button" disabled={s.status !== 'built'}
              className={'option' + (s.id === current ? ' option-on' : '')}
              onClick={() => (s.id === 'a' ? setRoute(null) : s.id === 'b' ? openCategory('sale') : null)}>
              <span className="option-key">{s.id}</span>
              <span className="option-body">
                <strong>{s.name}{s.status === 'next' && <em className="soon">next</em>}</strong>
                <span>{s.note}</span>
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
        <main className="screen" ref={screenRef}>
          {route
            ? <CategoryScreen key={route.section + route.sub} sectionId={route.section} initialSub={route.sub} onBack={goHome} toast={toast} onSaveSearch={addSaved} />
            : <HomeScreen toast={toast} onOpen={openCategory} savedSearches={saved} />}
        </main>
        {toastMsg && <div className="snackbar" role="status">{toastMsg}</div>}
        <BottomNav onTap={toast} onHome={goHome} />
        <div className="gesture" aria-hidden="true" />
      </div>
    </div>
  )
}
