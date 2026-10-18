import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import metroMap from './assets/metro-map.webp'
import { COORDS } from './area.js'
import { priceLabel } from './data.js'
import { IMAGE_BOUNDS, isDark, cutoutFor } from './RealMap.jsx'
import { ListingCard } from './ui.jsx'

// Map view of a result list: a price pin per listing at its neighborhood (spread out
// when several share one), tap a pin to preview, tap the preview to open it.
// Locations stay approximate (neighborhood, never the address), like the detail map.
function spread(rows) {
  const byHood = {}
  return rows.map(({ l }) => {
    const c = COORDS[l.hood]; if (!c) return null
    const i = (byHood[l.hood] = (byHood[l.hood] ?? -1) + 1)
    const a = i * 2.4, r = i ? 0.006 + 0.002 * i : 0 // golden-angle-ish spiral, ~700 m apart
    return { l, at: [c[0] + r * Math.cos(a), c[1] + (r * Math.sin(a)) / 0.7] }
  }).filter(Boolean)
}

export default function ResultsMap({ rows, area, onOpen }) {
  const el = useRef(null)
  const map = useRef(null)
  const pins = useRef(null)
  const [sel, setSel] = useState(null)
  const [h, setH] = useState(480)
  const points = spread(rows)

  useEffect(() => {
    // fill the screen below the sticky header, above the nav bar
    const scr = el.current.closest('.screen')
    if (scr) setH(Math.max(320, scr.clientHeight - (el.current.getBoundingClientRect().top - scr.getBoundingClientRect().top) - 88))
    const m = L.map(el.current, { zoomControl: false, zoomSnap: 0.25, scrollWheelZoom: false, attributionControl: true })
    L.imageOverlay(metroMap, IMAGE_BOUNDS, { className: 'map-image' + (isDark() ? ' map-image-dark' : '') }).addTo(m)
    m.attributionControl.setPrefix(false)
    m.attributionControl.addAttribution('map image for prototype use · locations are approximate')
    m.setMaxBounds(IMAGE_BOUNDS.pad(0.1))
    m.on('click', () => setSel(null))
    pins.current = L.layerGroup().addTo(m)
    map.current = m
    return () => m.remove()
  }, [])

  useEffect(() => {
    const m = map.current; if (!m) return
    m.invalidateSize()
    pins.current.clearLayers()
    const { center, r } = cutoutFor(area)
    if (area.places.length || area.center || area.radius != null) {
      L.circle(center, { radius: r, className: 'results-area', interactive: false }).addTo(pins.current)
    }
    for (const { l, at } of points) {
      const icon = L.divIcon({ className: 'pin-wrap', html: `<span class="pin${l.id === sel ? ' pin-on' : ''}">${priceLabel(l)}</span>`, iconSize: null })
      L.marker(at, { icon, keyboard: true, title: l.title, riseOnHover: true, zIndexOffset: l.id === sel ? 1000 : 0 })
        .on('click', e => { L.DomEvent.stopPropagation(e); setSel(l.id) }).addTo(pins.current)
    }
  }, [rows, area, sel, h])

  // frame the results whenever the set changes
  useEffect(() => {
    const m = map.current; if (!m || !points.length) return
    m.invalidateSize()
    m.fitBounds(L.latLngBounds(points.map(p => p.at)).pad(0.25), { maxZoom: 13, animate: false })
  }, [rows.map(r => r.l.id).join(), h])

  const pick = rows.find(r => r.l.id === sel)
  return (
    <div className="results-map pad">
      <div className="real-map results-map-canvas" ref={el} style={{ height: h }} />
      {pick ? (
        <div className="map-preview">
          <ListingCard listing={pick.l} similar={pick.similar} variant="row" onTap={() => onOpen(pick.l.id)} />
        </div>
      ) : <p className="map-tip">{points.length} listing{points.length === 1 ? '' : 's'} · tap a price to preview</p>}
    </div>
  )
}
