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

// Metro map in the style of the current app: the map dims and tints purple
// everywhere outside a circular cutout of the area you're searching. The
// circle follows the choice: distance from you, chosen neighborhoods, or the metro.
const SPOTS = {
  'brooklyn park': [118, 22], roseville: [238, 40], 'north loop': [146, 82], northeast: [182, 66], downtown: [190, 100],
  como: [232, 74], 'bryn mawr': [116, 98], 'st. louis park': [80, 116], whittier: [150, 120], uptown: [126, 128],
  seward: [192, 120], powderhorn: [166, 138], longfellow: [204, 146], 'linden hills': [108, 150], 'mac-groveland': [252, 134],
  'south mpls': [172, 164], edina: [102, 186], richfield: [160, 194], bloomington: [150, 222],
}
const YOU = [160, 96]
const PX_PER_MI = 9

function cutout(area) {
  const picked = area.places.flatMap(p => REGIONS[p] || [p]).map(n => SPOTS[n]).filter(Boolean)
  const center = picked.length
    ? [picked.reduce((t, [x]) => t + x, 0) / picked.length, picked.reduce((t, [, y]) => t + y, 0) / picked.length]
    : area.radius != null ? YOU : [165, 120]
  const fit = picked.length ? Math.max(30, ...picked.map(([x, y]) => Math.hypot(x - center[0], y - center[1]) + 24)) : 150
  const r = area.radius != null ? Math.min(fit, area.radius * PX_PER_MI) : fit
  return { cx: center[0], cy: center[1], r, picked: new Set(area.places.flatMap(p => REGIONS[p] || [p])) }
}

export function MetroMap({ area }) {
  const { cx, cy, r, picked } = cutout(area)
  const id = 'cut' + Math.round(cx) + Math.round(cy) + Math.round(r)
  return (
    <svg className="metro" viewBox="0 0 320 240" role="img" aria-label="map of the area you're searching">
      <defs>
        <mask id={id}><rect width="320" height="240" fill="white" /><circle cx={cx} cy={cy} r={r} fill="black" /></mask>
      </defs>
      <rect width="320" height="240" className="map-bg" />
      {/* lakes: bde maka ska, lake of the isles, harriet, nokomis, como */}
      <ellipse cx="112" cy="132" rx="7" ry="10" className="map-water" />
      <ellipse cx="118" cy="112" rx="4" ry="7" className="map-water" />
      <ellipse cx="114" cy="152" rx="6" ry="7" className="map-water" />
      <ellipse cx="196" cy="172" rx="7" ry="6" className="map-water" />
      <ellipse cx="236" cy="62" rx="5" ry="4" className="map-water" />
      <path d="M120 0 C150 40 140 70 168 92 S200 120 214 150 S250 200 300 240" className="map-river" />
      {/* 494/694 ring, interstates, a few arterials */}
      <rect x="40" y="14" width="250" height="200" rx="70" className="map-ring" />
      <path d="M0 112 L118 104 L160 96 L226 98 L320 102 M164 0 L160 96 L168 240 M250 0 L254 98 L246 240 M60 60 L160 96 M160 96 L290 190" className="map-hwy" />
      <path d="M0 150 L320 140 M0 70 L320 62 M100 0 L96 240 M210 0 L216 240" className="map-road" />
      {/* everything outside the cutout is tinted */}
      <rect width="320" height="240" className="map-tint" mask={`url(#${id})`} />
      <circle cx={cx} cy={cy} r={r} className="map-cut" />
      {Object.entries(SPOTS).map(([name, [x, y]]) => (
        <text key={name} x={x} y={y} textAnchor="middle" className={'map-label' + (picked.has(name) ? ' on' : '')}>{name}</text>
      ))}
      <text x="18" y="232" className="map-city">minneapolis</text>
      <text x="304" y="232" textAnchor="end" className="map-city">st. paul</text>
      <circle cx={YOU[0]} cy={YOU[1]} r="5" className="metro-you" />
    </svg>
  )
}
