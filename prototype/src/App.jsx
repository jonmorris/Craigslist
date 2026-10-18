import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import HomeScreen from './screens/HomeScreen.jsx'
import CategoryScreen from './screens/CategoryScreen.jsx'
import SearchScreen from './screens/SearchScreen.jsx'
import DetailScreen from './screens/DetailScreen.jsx'
import SectionScreen from './screens/SectionScreen.jsx'
import LocationScreen from './screens/LocationScreen.jsx'
import SavedScreen from './screens/SavedScreen.jsx'
import { seedRecent } from './search.js'
import { ALL_AREAS, areaFull } from './area.js'
import { savedSearches as seedSaved, hidden } from './data.js'
import { BottomNav, Icon } from './ui.jsx'

const SCREENS = [
  { id: 'a', name: 'home', status: 'built', note: 'Search, six section tiles, your saved searches, fresh listings near you.' },
  { id: 'b', name: 'category → list', status: 'built', note: 'A landing page per section (popular subcategories, trending, just posted, the full taxonomy), then the list: filter chips in plain sight, category filters (frame size, make, bedrooms), a price sheet with the typical price, dealer reposts grouped, grid / large photos / list / no images / map layouts, save search with alerts on. Filters survive going back.' },
  { id: 'c', name: 'search', status: 'built', note: 'Full-screen search: recent, saved and trending; suggestions with "search in" category counts; results by category; no-results turns into an alert.' },
  { id: 'd', name: 'listing detail', status: 'built', note: 'Swipeable photos, price vs. typical, specs, approximate area, seller context and safety, one-tap message with quick replies, swipe or tap to the next listing.' },
]

const store = {
  get(k) { try { return localStorage.getItem(k) } catch { return null } },
  set(k, v) { try { localStorage.setItem(k, v) } catch { /* storage blocked */ } },
}

// What a person did survives reloads and reopening the installed app.
const SAVE_KEY = 'cl-state-v1'
const kept = (() => { try { return JSON.parse(store.get(SAVE_KEY)) || {} } catch { return {} } })()
for (const id of kept.hidden || []) hidden.add(id)

export default function App() {
  // Navigation stack: { name: 'home' } | { name: 'cat', section, sub } |
  // { name: 'search', scope, q } | { name: 'results', query, section, sub }
  const [stack, setStack] = useState(() => [{ name: 'home' }, ...(location.hash === '#b' ? [{ name: 'cat', section: 'sale', sub: 'all' }] : [])])
  const route = stack[stack.length - 1]
  const [saved, setSaved] = useState(kept.saved || seedSaved)
  const [recent, setRecent] = useState(kept.recent || seedRecent)
  const [favorites, setFavorites] = useState(() => new Set(kept.favorites || []))
  const [area, setArea] = useState(kept.area || ALL_AREAS)
  const [view, setView] = useState(kept.view || 'grid')
  const [theme, setTheme] = useState(() => store.get('cl-theme') || 'system')
  const [toastMsg, setToastMsg] = useState(null) // { msg, action?: { label, run } }
  const [hiddenVersion, setHiddenVersion] = useState(0)
  const screenRef = useRef(null)
  const timer = useRef()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', theme)
    store.set('cl-theme', theme)
  }, [theme])

  // Desktop preview: keep a real phone's proportions (412×915 dp, e.g. Pixel 7 /
  // Galaxy S24+) and scale the whole frame down to fit short windows.
  useEffect(() => {
    const fit = () => document.documentElement.style.setProperty('--device-zoom', Math.min(1, (innerHeight - 48) / 935).toFixed(3))
    fit(); addEventListener('resize', fit)
    return () => removeEventListener('resize', fit)
  }, [])

  // Android back gesture / browser back pops one screen.
  useEffect(() => {
    const onPop = () => setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
    addEventListener('popstate', onPop)
    return () => removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    store.set(SAVE_KEY, JSON.stringify({ saved, recent, favorites: [...favorites], hidden: [...hidden], area, view }))
  }, [saved, recent, favorites, hiddenVersion, area, view])

  // New screen → top; back to a screen → where you left it.
  const routeKey = [stack.length, route.name, route.id, route.query, route.section, route.sub].join('|')
  useLayoutEffect(() => { screenRef.current?.scrollTo({ top: route.scroll || 0 }) }, [routeKey])

  const toast = (msg, action) => {
    clearTimeout(timer.current)
    setToastMsg({ msg, action })
    timer.current = setTimeout(() => setToastMsg(null), action ? 5000 : 2400)
  }
  const push = r => {
    try { history.pushState({ depth: stack.length }, '') } catch { /* sandboxed */ }
    const scroll = screenRef.current?.scrollTop || 0
    setStack(s => [...s.slice(0, -1), { ...s[s.length - 1], scroll }, r])
  }
  // screens stash their own state (filters, sort) on their stack entry
  const remember = mem => setStack(s => s.map((r, i) => (i === s.length - 1 ? { ...r, mem } : r)))
  const back = () => { try { history.back() } catch { setStack(s => s.slice(0, -1)) } }
  const replaceTop = r => setStack(s => [...s.slice(0, -1), r])
  const goHome = () => {
    if (stack.length === 1) return
    try { history.go(-(stack.length - 1)) } catch { /* sandboxed */ }
    setStack([{ name: 'home' }])
  }

  const openCategory = (section, sub = 'all') => push({ name: 'cat', section, sub })
  // `ids` = the list it was opened from, so detail can swipe to the next/previous one
  const openListing = (id, ids = null) => push({ name: 'detail', id, ids })
  const pageListing = (id, dir) => replaceTop({ ...route, id, enter: dir })
  const openSection = id => push({ name: 'section', section: id })
  // one location picker everywhere; lists pass a context so it shows their own count
  const openLocation = (context = null) => push({ name: 'location', context })
  const hideListing = id => {
    hidden.add(id); setHiddenVersion(v => v + 1); back()
    toast('hidden · you won\u2019t see it in lists or search', { label: 'undo', run: () => { hidden.delete(id); setHiddenVersion(v => v + 1) } })
  }
  const openSavedTab = (tab = 'listings') => (route.name === 'saved' ? replaceTop({ ...route, tab }) : push({ name: 'saved', tab }))
  const toggleFav = id => {
    const had = favorites.has(id)
    setFavorites(f => { const n = new Set(f); had ? n.delete(id) : n.add(id); return n })
    had ? toast('removed from saved') : toast('saved', { label: 'view', run: () => openSavedTab('listings') })
  }
  const unhide = id => { hidden.delete(id); setHiddenVersion(v => v + 1); toast('back in lists and search') }
  const toggleAlerts = id => setSaved(list => list.map(s => (s.id === id ? { ...s, alerts: s.alerts === false } : s)))
  const deleteSaved = id => {
    const i = saved.findIndex(s => s.id === id), gone = saved[i]
    setSaved(list => list.filter(s => s.id !== id))
    toast(`deleted “${gone.label}”`, { label: 'undo', run: () => setSaved(list => [...list.slice(0, i), gone, ...list.slice(i)]) })
  }
  const openSearch = (scope = null, q = '', focus = true) => push({ name: 'search', scope, q, focus })
  const runSearch = (query, section, sub) => {
    setRecent(r => [query, ...r.filter(x => x !== query)].slice(0, 6))
    push({ name: 'results', query, section, sub })
  }
  // a saved search reopens with its own filters
  const openSaved = s => {
    const mem = s.filters ? { f: s.filters, saved: true } : undefined
    s.query ? push({ name: 'results', query: s.query, section: s.section ?? null, sub: s.sub || 'all', mem })
      : push({ name: 'cat', section: s.section, sub: s.sub || 'all', mem })
  }
  const addSaved = entry => setSaved(prev => [{ id: 'u' + Date.now(), fresh: 0, ...entry, label: entry.label }, ...prev])
  // From the results bar: search icon reopens search; "search all sections" swaps scope in place.
  const searchFromList = (scope, q, widen) => (widen ? replaceTop({ name: 'results', query: q, section: null, sub: 'all' }) : openSearch(scope, q))

  const current = { home: 'a', section: 'b', cat: 'b', search: 'c', results: 'c', detail: 'd' }[route.name]

  return (
    <div className="stage">
      <aside className="panel">
        <p className="eyebrow">craigslist redesign · prototype</p>
        <h1>Minneapolis, reimagined</h1>
        <p className="panel-lede">An Android prototype of the four screens in the brief, with mock Minneapolis data. Tap around in the phone, or jump to a screen here.</p>
        <div className="options">
          {SCREENS.map(s => (
            <button key={s.id} type="button" disabled={s.status !== 'built'}
              className={'option' + (s.id === current ? ' option-on' : '')}
              onClick={() => (s.id === 'a' ? goHome() : s.id === 'b' ? openSection('sale') : s.id === 'c' ? openSearch(null, '', false) : openListing(12))}>
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
        <button type="button" className="link panel-reset" onClick={() => { store.set(SAVE_KEY, '{}'); location.reload() }}>reset prototype data</button>
      </aside>

      <div className="device">
        <div className="statusbar" aria-hidden="true"><span>9:41</span><span className="sb-icons">▲ ◢ ▮</span></div>
        <main className="screen" ref={screenRef}>
          {route.name === 'home' && <HomeScreen toast={toast} onOpen={openCategory} onOpenSection={openSection} onSearch={() => openSearch()} onOpenSaved={openSaved} onOpenListing={openListing} savedSearches={saved} areaText={areaFull(area)} onLocation={() => openLocation()} onManageSaved={() => openSavedTab('searches')} />}
          {route.name === 'saved' && <SavedScreen tab={route.tab} onTab={tab => replaceTop({ ...route, tab })} favorites={favorites} onToggleFav={toggleFav}
            saved={saved} onOpenSaved={openSaved} onToggleAlerts={toggleAlerts} onDeleteSaved={deleteSaved} hiddenIds={[...hidden]} onUnhide={unhide}
            onOpenListing={openListing} onBrowse={goHome} />}
          {route.name === 'location' && <LocationScreen area={area} context={route.context} toast={toast} onClose={back}
            onApply={a => { setArea(a); back(); toast(`location saved · ${areaFull(a)}`) }} />}
          {route.name === 'section' && <SectionScreen key={'sec' + route.section} sectionId={route.section} onBack={back}
            onOpenList={openCategory} onSearch={scope => openSearch(scope)} onRunSearch={(q, sec) => runSearch(q, sec, 'all')}
            onOpenListing={openListing} toast={toast} />}
          {route.name === 'cat' && <CategoryScreen key={'c' + route.section + route.sub} sectionId={route.section} initialSub={route.sub} area={area} onAreaChange={setArea} onOpenLocation={openLocation}
            onBack={back} onSearch={searchFromList} onOpenListing={openListing} toast={toast} onSaveSearch={addSaved}
            memory={route.mem} onRemember={remember} view={view} onViewChange={setView} />}
          {route.name === 'results' && <CategoryScreen key={'r' + route.query + route.section + route.sub} sectionId={route.section} initialSub={route.sub} query={route.query} area={area} onAreaChange={setArea} onOpenLocation={openLocation}
            onBack={back} onSearch={searchFromList} onOpenListing={openListing} toast={toast} onSaveSearch={addSaved}
            memory={route.mem} onRemember={remember} view={view} onViewChange={setView} />}
          {route.name === 'search' && <SearchScreen key={'s' + stack.length} autoFocus={route.focus !== false} scopeSection={route.scope} initialQuery={route.q} recent={recent} saved={saved}
            onSubmit={runSearch} onOpenSaved={openSaved} onOpenListing={openListing} onBack={back} toast={toast}
            onRemoveRecent={r => setRecent(x => x.filter(y => y !== r))} onClearRecent={() => setRecent([])}
            area={area} onAreaChange={setArea} onOpenLocation={openLocation} />}
          {route.name === 'detail' && <DetailScreen key={'d' + route.id} id={route.id} ids={route.ids?.filter(x => !hidden.has(x))} enter={route.enter} onPage={pageListing} favorites={favorites} onToggleFav={toggleFav} onHide={hideListing}
            onBack={back} onOpenListing={openListing} onOpenCategory={openCategory} toast={toast} />}
        </main>
        {toastMsg && (
          <div className="snackbar" role="status">
            <span className="snack-text">{toastMsg.msg}</span>
            {toastMsg.action && <button type="button" className="snack-action" onClick={() => { toastMsg.action.run(); setToastMsg(null) }}>{toastMsg.action.label}</button>}
          </div>
        )}
        {!['search', 'detail', 'location'].includes(route.name) && <BottomNav onTap={toast} onHome={goHome} onSaved={() => openSavedTab()} active={route.name === 'saved' ? 'saved' : 'home'} />}
        <div className="gesture" aria-hidden="true" />
      </div>
    </div>
  )
}
