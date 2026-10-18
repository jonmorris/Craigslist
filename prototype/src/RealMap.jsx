import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { COORDS, distMeters, MI, placesIn } from './area.js'
import metroMap from './assets/metro-map.webp'

// Map (Leaflet) over a static metro map image for now, georeferenced from known
// towns (Monticello, Minneapolis, St Paul, Hastings, Prior Lake). Swap the image
// overlay back to a tile layer (e.g. Google Maps SDK in the native app) later.
// In the current
// app's style: everything outside the search area is tinted purple, with a
// circular cutout where you're looking. The circle follows the choice:
// distance from you, the chosen neighborhoods, or the whole metro.
export const YOU = COORDS.downtown
const METRO = { center: [44.965, -93.24], r: 15000 } // 'all areas': the core metro, leaving room to pan
// [south-west, north-east] of the 2000×1851 map image
export const IMAGE_BOUNDS = L.latLngBounds([44.618, -93.9376], [45.5367, -92.5368])

const dist = distMeters

export function cutoutFor(area) {
  if (area.center) return { center: area.center, r: (area.radius ?? 5) * MI }
  const picked = area.places.flatMap(placesIn).map(n => COORDS[n]).filter(Boolean)
  if (!picked.length && area.radius == null) return METRO
  const center = picked.length
    ? [picked.reduce((t, [a]) => t + a, 0) / picked.length, picked.reduce((t, [, b]) => t + b, 0) / picked.length]
    : YOU
  const fit = picked.length ? Math.max(1800, ...picked.map(p => dist(p, center) + 1600)) : Infinity
  return { center, r: Math.min(fit, area.radius != null ? area.radius * MI : Infinity) }
}

// circle as a polygon ring (lat/lng), for the hole in the world-sized tint
function ring([lat, lng], r, n = 72) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const t = (i / n) * 2 * Math.PI
    pts.push([lat + (r / 111320) * Math.cos(t), lng + (r / (111320 * Math.cos((lat * Math.PI) / 180))) * Math.sin(t)])
  }
  return pts
}

const cssVar = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim()
export const isDark = () => document.documentElement.dataset.theme === 'dark'
  || (document.documentElement.dataset.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)

// Fixed circle in the middle of the view; the map pans underneath it (like the
// current app). The circle's size in miles comes from the distance choice, so the
// map zooms to make the fixed circle cover exactly that radius. Panning sets a
// custom center when you let go.
const CIRCLE = 0.44 // circle radius as a share of the map's shorter side (bigger = more zoomed in)

export default function RealMap({ area, interactive = true, height = 300, onCenterChange }) {
  const el = useRef(null)
  const map = useRef(null)
  const layers = useRef(null)
  const [box, setBox] = useState({ w: 0, h: height })
  const latest = useRef({ r: 0, onCenterChange })
  latest.current.onCenterChange = onCenterChange

  useEffect(() => {
    const m = L.map(el.current, {
      zoomControl: false, attributionControl: true, zoomSnap: 0, dragging: interactive, scrollWheelZoom: false,
      touchZoom: false, doubleClickZoom: false, boxZoom: false, keyboard: interactive, inertia: false,
    })
    L.imageOverlay(metroMap, IMAGE_BOUNDS, { className: 'map-image' + (isDark() ? ' map-image-dark' : '') }).addTo(m)
    m.attributionControl.addAttribution('map image for prototype use')
    m.attributionControl.setPrefix(false)
    m.setView(METRO.center, 11)
    // let the view run a little past the image edge so large radii can still pan
    m.setMaxBounds(IMAGE_BOUNDS.pad(0.3))
    layers.current = L.layerGroup().addTo(m)
    // user pan ends → the map's center is the new search center
    m.on('dragend', () => {
      const c = m.getCenter()
      latest.current.onCenterChange?.([c.lat, c.lng], latest.current.r / MI)
    })
    map.current = m
    const ro = new ResizeObserver(([e]) => setBox({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(el.current)
    return () => { ro.disconnect(); m.remove() }
  }, [interactive])

  useEffect(() => {
    const m = map.current
    if (!box.w) return
    m.invalidateSize()
    const { center, r } = cutoutFor(area)
    latest.current.r = r
    // zoom so that r meters spans the fixed circle's radius in pixels
    const px = Math.min(box.w, box.h) * CIRCLE
    const zoom = Math.log2((156543.03392 * Math.cos((center[0] * Math.PI) / 180) * px) / r)
    m.setView(center, zoom, { animate: false })
    layers.current.clearLayers()
  }, [area, box])

  const R = Math.min(box.w, box.h) * CIRCLE
  return (
    <div className={'real-map-wrap' + (interactive ? ' can-pan' : '')} style={{ height }}>
      <div ref={el} className="real-map" style={{ height }} role="img" aria-label="map of the area you're searching" />
      {box.w > 0 && (
        <svg className="map-overlay" width={box.w} height={box.h} aria-hidden="true">
          <defs><mask id="cutout"><rect width="100%" height="100%" fill="white" /><circle cx={box.w / 2} cy={box.h / 2} r={R} fill="black" /></mask></defs>
          <rect width="100%" height="100%" className="map-tint" mask="url(#cutout)" />
          <circle cx={box.w / 2} cy={box.h / 2} r={R} className="map-cut" />
        </svg>
      )}
    </div>
  )
}
