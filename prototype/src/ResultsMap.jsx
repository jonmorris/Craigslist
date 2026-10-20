import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import metroMap from './assets/metro-map.webp'
import { COORDS } from './area.js'
import { priceLabel } from './data.js'
import { IMAGE_BOUNDS, isDark, cutoutFor } from './RealMap.jsx'
import { Icon, ListingCard } from './ui.jsx'

// Map view of a result list, Zillow-style: listings close together on screen merge
// into a count bubble; a lone listing is a price marker. Tap a bubble to zoom into
// it (or, when its listings share a spot, to page through them); tap a price to
// preview; tap the preview to open. Positions are approximate (neighborhood, never
// the address), like the detail map.
const MAX_ZOOM = 14 // the static map image gets blurry past this
const MERGE_PX = 46 // markers closer than this on screen become one bubble

// listings in the same neighborhood fan out a little so they can separate when zoomed in
function spread(rows) {
  const byHood = {}
  return rows.map(({ l, similar }) => {
    const c = COORDS[l.hood]; if (!c) return null
    const i = (byHood[l.hood] = (byHood[l.hood] ?? -1) + 1)
    const a = i * 2.4, r = i ? 0.0026 + 0.0009 * i : 0 // spiral, ~300 m steps
    return { l, similar, at: [c[0] + r * Math.cos(a), c[1] + (r * Math.sin(a)) / 0.7] }
  }).filter(Boolean)
}

// greedy screen-space clustering at the current zoom
function cluster(m, points) {
  const groups = []
  for (const p of points) {
    const px = m.latLngToLayerPoint(p.at)
    const g = groups.find(g => g.px.distanceTo(px) < MERGE_PX)
    if (g) { g.items.push(p); g.px = g.px.multiplyBy(g.items.length - 1).add(px).divideBy(g.items.length) }
    else groups.push({ px, items: [p] })
  }
  return groups.map(g => ({ items: g.items, at: m.layerPointToLatLng(g.px) }))
}

export default function ResultsMap({ rows, area, onOpen, favorites = new Set(), onToggleFav }) {
  const el = useRef(null)
  const map = useRef(null)
  const pins = useRef(null)
  const [sel, setSel] = useState(null) // ids under the preview: one listing, or a bubble that can't split
  const [view, setView] = useState(0) // bumps on zoom/pan end so markers re-cluster
  const [h, setH] = useState(480)
  const points = spread(rows)

  useEffect(() => {
    // fill the screen below the sticky header, above the nav bar
    const scr = el.current.closest('.screen')
    if (scr) setH(Math.max(320, scr.clientHeight - (el.current.getBoundingClientRect().top - scr.getBoundingClientRect().top) - 88))
    const m = L.map(el.current, { zoomControl: false, zoomSnap: 0.25, maxZoom: MAX_ZOOM, scrollWheelZoom: false, attributionControl: true })
    L.imageOverlay(metroMap, IMAGE_BOUNDS, { className: 'map-image' + (isDark() ? ' map-image-dark' : '') }).addTo(m)
    m.attributionControl.setPrefix(false)
    m.attributionControl.addAttribution('map image for prototype use · locations are approximate')
    m.setMaxBounds(IMAGE_BOUNDS.pad(0.1))
    m.on('click', () => setSel(null))
    m.on('zoomend', () => setView(v => v + 1))
    pins.current = L.layerGroup().addTo(m)
    map.current = m
    return () => m.remove()
  }, [])

  // frame the results whenever the set changes
  useEffect(() => {
    const m = map.current; if (!m || !points.length) return
    m.invalidateSize()
    m.fitBounds(L.latLngBounds(points.map(p => p.at)).pad(0.2), { maxZoom: 13, animate: false })
    setView(v => v + 1)
  }, [rows.map(r => r.l.id).join(), h])

  useEffect(() => {
    const m = map.current; if (!m || !m._loaded) return
    pins.current.clearLayers()
    const { center, r } = cutoutFor(area)
    if (area.places.length || area.center || area.radius != null) {
      L.circle(center, { radius: r, className: 'results-area', interactive: false }).addTo(pins.current)
    }
    for (const g of cluster(m, points)) {
      const ids = g.items.map(p => p.l.id)
      const on = sel && ids.some(id => sel.includes(id))
      if (g.items.length === 1) {
        const { l } = g.items[0]
        const icon = L.divIcon({ className: 'pin-wrap', iconSize: null, html: `<span class="pin${on ? ' pin-on' : ''}">${priceLabel(l)}</span>` })
        L.marker(g.at, { icon, title: `${priceLabel(l)} · ${l.title}`, zIndexOffset: on ? 1000 : 0 })
          .on('click', e => { L.DomEvent.stopPropagation(e); setSel([l.id]) }).addTo(pins.current)
      } else {
        const n = g.items.length, size = n < 5 ? 40 : n < 10 ? 46 : 52
        const icon = L.divIcon({ className: 'pin-wrap', iconSize: null, html: `<span class="bubble${on ? ' bubble-on' : ''}" style="width:${size}px;height:${size}px">${n}</span>` })
        L.marker(g.at, { icon, title: `${n} listings here`, zIndexOffset: on ? 1000 : 500 })
          .on('click', e => {
            L.DomEvent.stopPropagation(e)
            const b = L.latLngBounds(g.items.map(p => p.at))
            // zoom in until the bubble splits; at the deepest zoom, page through what's left
            if (m.getZoom() < MAX_ZOOM - 0.25) { setSel(null); m.flyToBounds(b.pad(0.6), { maxZoom: Math.min(MAX_ZOOM, m.getZoom() + 2), duration: 0.35 }) }
            else setSel(ids)
          }).addTo(pins.current)
      }
    }
  }, [rows, area, sel, view])

  const picks = sel ? rows.filter(r => sel.includes(r.l.id)) : []
  const zoom = d => map.current?.setZoom(map.current.getZoom() + d)
  return (
    <div className="results-map pad">
      <div className="real-map results-map-canvas" ref={el} style={{ height: h }} />
      <div className="map-zoom">
        <button type="button" className="icon-btn" aria-label="zoom in" onClick={() => zoom(1)}><Icon name="plus" /></button>
        <button type="button" className="icon-btn" aria-label="zoom out" onClick={() => zoom(-1)}><Icon name="minus" /></button>
      </div>
      {picks.length ? (
        <div className={'map-preview' + (picks.length > 1 ? ' map-preview-many' : '')}>
          {picks.length > 1 && <p className="map-preview-n">{picks.length} listings here · swipe</p>}
          <div className={picks.length > 1 ? 'map-preview-track' : undefined}>
            {picks.map(r => <ListingCard key={r.l.id} listing={r.l} similar={r.similar} variant="row" fav={favorites.has(r.l.id)} onFav={onToggleFav} onTap={() => onOpen(r.l.id)} />)}
          </div>
        </div>
      ) : <p className="map-tip">tap {view >= 0 && pins.current?.getLayers().some(x => x.options?.title?.endsWith('listings here')) ? 'a number to zoom in' : 'a price to preview'}</p>}
    </div>
  )
}
