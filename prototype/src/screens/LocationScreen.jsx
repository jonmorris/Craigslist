import React, { useState } from 'react'
import { listings, city, fmt, visible } from '../data.js'
import { inArea, areaFull } from '../area.js'
import AreaControls from './AreaControls.jsx'
import RealMap, { YOU } from '../RealMap.jsx'
import { Icon } from '../ui.jsx'

// The one location picker (M3 full-screen dialog), opened from Home, list
// headers, search results and the search view. Which craigslist city, then
// where in it: neighborhoods and distance, previewed on a real map.
// `context` (optional) = { noun, countFor } so a list shows its own count.
const SITES = [
  ['minneapolis / st. paul', 'mn', 0], ['st. cloud', 'mn', 62], ['rochester', 'mn', 80], ['mankato', 'mn', 78],
  ['duluth / superior', 'mn', 150], ['brainerd', 'mn', 128], ['eau claire', 'wi', 90], ['fargo / moorhead', 'nd', 235],
  ['madison', 'wi', 270], ['sioux falls', 'sd', 240], ['des moines', 'ia', 245],
]

export default function LocationScreen({ area, context, onApply, onClose, toast }) {
  const [next, setNext] = useState(area)
  const [q, setQ] = useState('')
  const all = visible(listings)
  // Home: mock listings stand in for the whole metro, so scale their share to the real total.
  const homeCount = a => Math.round((city.total * all.filter(l => inArea(l, a)).length) / all.length / 10) * 10
  const n = context ? context.countFor(next) : homeCount(next)
  const countText = context ? `${fmt(n)} ${context.noun}` : `about ${fmt(n)} listings`
  const matches = q.trim() ? SITES.filter(([name]) => name.includes(q.trim().toLowerCase()) || (/^\d{5}$/.test(q.trim()) && name.startsWith('minneapolis'))) : []

  const useMyLocation = () => {
    const near = () => { setNext({ places: [], radius: 5, center: null }); toast('using your location · within 5 mi') }
    if (!navigator.geolocation) return near()
    navigator.geolocation.getCurrentPosition(pos => {
      const km = distKm([pos.coords.latitude, pos.coords.longitude], YOU)
      if (km > 60) { setNext({ places: [], radius: 5, center: null }); toast(`you're ${Math.round(km / 1.609)} mi from minneapolis · showing 5 mi around downtown`) }
      else near()
    }, near, { timeout: 6000 })
  }

  return (
    <div className="loc-page">
      <header className="cat-bar loc-bar">
        <button type="button" className="icon-btn" aria-label="close without saving" onClick={onClose}><Icon name="close" /></button>
        <h1 className="flex1">location</h1>
        <button type="button" className="link loc-save" onClick={() => onApply(next)}>save</button>
      </header>

      <div className="pad loc-body">
        <label className="loc-search" htmlFor="locq">
          <Icon name="search" />
          <input id="locq" type="search" autoComplete="off" placeholder="city or zip code" value={q} onChange={e => setQ(e.target.value)} />
        </label>

        {q.trim() ? (
          <div className="zero-list">
            {matches.length ? matches.map(([name, st, mi]) => (
              <button key={name} type="button" className="zero-row" onClick={() => {
                if (mi === 0) { setQ(''); return }
                toast(`prototype: mock listings are for minneapolis only (${name} is ${mi} mi away)`)
              }}>
                <Icon name="pin" />
                <span className="sv-text"><strong>{name}, {st}</strong><span>{mi === 0 ? 'your current site' : `craigslist ${name.split(' /')[0]} · ${mi} mi away`}</span></span>
                {mi === 0 && <Icon name="check" />}
              </button>
            )) : <p className="sv-none">no craigslist city matches “{q.trim()}”.</p>}
          </div>
        ) : (
          <>
            <button type="button" className="zero-row loc-gps" onClick={useMyLocation}>
              <Icon name="near" />
              <span className="sv-text"><strong>use my current location</strong><span>show what's close to you right now</span></span>
            </button>

            <div className="loc-current">
              <span className="sv-text"><strong>minneapolis / st. paul</strong><span>craigslist minneapolis · the whole metro</span></span>
              <button type="button" className="link" onClick={() => document.getElementById('locq')?.focus()}>change city</button>
            </div>

            <RealMap area={next} onCenterChange={(center, mi) => setNext(n => ({
              places: [], center, radius: n.radius ?? [2, 5, 10, 25].reduce((b, r) => (Math.abs(r - mi) < Math.abs(b - mi) ? r : b), 5),
            }))} />
            <p className="map-hint"><Icon name="pin" size={16} />drag the map to move your search area</p>
            <p className="loc-summary" role="status"><strong>{areaFull(next, city.name)}</strong> · {countText}</p>
            {n === 0 && <p className="area-zero"><Icon name="pin" size={18} />nothing here yet. a bigger distance or nearby neighborhood should help.</p>}

            <AreaControls value={next} onChange={setNext} />
          </>
        )}
      </div>
    </div>
  )
}

function distKm([a1, o1], [a2, o2]) {
  const r = Math.PI / 180, x = (o2 - o1) * r * Math.cos(((a1 + a2) / 2) * r), y = (a2 - a1) * r
  return Math.sqrt(x * x + y * y) * 6371
}
