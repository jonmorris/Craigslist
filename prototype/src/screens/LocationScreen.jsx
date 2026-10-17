import React, { useState } from 'react'
import { listings, city, fmt, visible } from '../data.js'
import { REGIONS, inArea, areaFull } from '../area.js'
import AreaControls from './AreaControls.jsx'
import { Icon } from '../ui.jsx'

// Home location picker — M3 full-screen dialog. Which craigslist city, then
// where in it: neighborhoods and distance, previewed on a schematic metro map.
const SITES = [
  ['minneapolis / st. paul', 'mn', 0], ['st. cloud', 'mn', 62], ['rochester', 'mn', 80], ['mankato', 'mn', 78],
  ['duluth / superior', 'mn', 150], ['brainerd', 'mn', 128], ['eau claire', 'wi', 90], ['fargo / moorhead', 'nd', 235],
  ['madison', 'wi', 270], ['sioux falls', 'sd', 240], ['des moines', 'ia', 245],
]

export default function LocationScreen({ area, onApply, onClose, toast }) {
  const [next, setNext] = useState(area)
  const [q, setQ] = useState('')
  const all = visible(listings)
  // mock listings stand in for the whole metro: scale the share in the area to the real total
  const est = a => Math.round((city.total * all.filter(l => inArea(l, a)).length) / all.length / 10) * 10
  const n = est(next)
  const matches = q.trim() ? SITES.filter(([name]) => name.includes(q.trim().toLowerCase()) || (/^\d{5}$/.test(q.trim()) && name.startsWith('minneapolis'))) : []

  return (
    <div className="loc-page">
      <header className="cat-bar loc-bar">
        <button type="button" className="icon-btn" aria-label="close" onClick={onClose}><Icon name="close" /></button>
        <h1 className="flex1">location</h1>
        <button type="button" className="link loc-reset" onClick={() => setNext({ places: [], radius: null })}>reset</button>
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
            <button type="button" className="zero-row loc-gps" onClick={() => { setNext({ places: [], radius: 5 }); toast('using your location · within 5 mi') }}>
              <Icon name="near" />
              <span className="sv-text"><strong>use my current location</strong><span>show what's close to you right now</span></span>
            </button>

            <div className="loc-current">
              <span className="sv-text"><strong>minneapolis / st. paul</strong><span>craigslist minneapolis · the whole metro</span></span>
              <button type="button" className="link" onClick={() => document.getElementById('locq')?.focus()}>change city</button>
            </div>

            <MetroMap area={next} />
            <p className="loc-summary"><strong>{areaFull(next, city.name)}</strong> · about {fmt(n)} listings</p>

            <AreaControls value={next} onChange={setNext} />
          </>
        )}
      </div>

      <div className="detail-bar">
        <button type="button" className="btn-primary" disabled={n === 0} onClick={() => onApply(next)}>
          {n === 0 ? 'no listings in this area' : `show ${fmt(n)} listings`}
        </button>
      </div>
    </div>
  )
}

// Schematic metro map: approximate neighborhood positions, the river, and a
// distance ring around "you" (downtown) scaled at 9px per mile.
const SPOTS = {
  'brooklyn park': [118, 22], roseville: [238, 40], 'north loop': [148, 82], northeast: [182, 66], downtown: [160, 96],
  como: [232, 74], 'bryn mawr': [116, 98], 'st. louis park': [80, 116], whittier: [150, 120], uptown: [126, 128],
  seward: [192, 120], powderhorn: [166, 138], longfellow: [204, 146], 'linden hills': [108, 150], 'mac-groveland': [252, 134],
  'south mpls': [172, 164], edina: [102, 186], richfield: [160, 194], bloomington: [150, 222],
}
function MetroMap({ area }) {
  const on = new Set(area.places.flatMap(p => REGIONS[p] || [p]))
  const all = !area.places.length
  const r = area.radius == null ? null : area.radius * 9
  return (
    <svg className="metro" viewBox="0 0 320 240" role="img" aria-label="map of selected neighborhoods">
      <rect width="320" height="240" rx="12" className="map-bg" />
      <path d="M120 0 C150 40 140 70 168 92 S200 120 214 150 S250 200 300 240" className="map-river" />
      <text x="296" y="20" className="metro-city" textAnchor="end">st. paul</text>
      <text x="16" y="20" className="metro-city">minneapolis</text>
      {r && <circle cx="160" cy="96" r={r} className="metro-ring" />}
      {Object.entries(SPOTS).map(([name, [x, y]]) => {
        const hit = all || on.has(name)
        return (
          <g key={name} className={hit ? 'spot on' : 'spot'}>
            <circle cx={x} cy={y} r={hit ? 5 : 3.5} />
            <text x={x} y={y - 8} textAnchor="middle">{name}</text>
          </g>
        )
      })}
      <circle cx="160" cy="96" r="6" className="metro-you" />
    </svg>
  )
}
