import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { REGIONS, COORDS, distMeters, MI } from './area.js'
import metroMap from './assets/metro-map.webp'

// Map (Leaflet) over a static metro map image for now, georeferenced from known
// towns (Monticello, Minneapolis, St Paul, Hastings, Prior Lake). Swap the image
// overlay back to a tile layer (e.g. Google Maps SDK in the native app) later.
// In the current
// app's style: everything outside the search area is tinted purple, with a
// circular cutout where you're looking. The circle follows the choice:
// distance from you, the chosen neighborhoods, or the whole metro.
export const YOU = COORDS.downtown
const METRO = { center: [44.965, -93.24], r: 22000 }
// [south-west, north-east] of the 2000×1851 map image
const IMAGE_BOUNDS = L.latLngBounds([44.618, -93.9376], [45.5367, -92.5368])

const dist = distMeters

export function cutoutFor(area) {
  if (area.center) return { center: area.center, r: (area.radius ?? 5) * MI }
  const picked = area.places.flatMap(p => REGIONS[p] || [p]).map(n => COORDS[n]).filter(Boolean)
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
const isDark = () => document.documentElement.dataset.theme === 'dark'
  || (document.documentElement.dataset.theme !== 'light' && matchMedia('(prefers-color-scheme: dark)').matches)

export default function RealMap({ area, interactive = true, height = 240, onCenterChange }) {
  const el = useRef(null)
  const map = useRef(null)
  const layers = useRef(null)

  useEffect(() => {
    const m = L.map(el.current, {
      zoomControl: false, attributionControl: true, dragging: interactive, scrollWheelZoom: false,
      touchZoom: interactive, doubleClickZoom: interactive, boxZoom: false, keyboard: interactive,
    })
    L.imageOverlay(metroMap, IMAGE_BOUNDS, { className: 'map-image' + (isDark() ? ' map-image-dark' : '') }).addTo(m)
    m.setMaxBounds(IMAGE_BOUNDS.pad(0.02))
    m.attributionControl.addAttribution('map image for prototype use')
    m.attributionControl.setPrefix(false)
    m.setView(METRO.center, 11)
    m.setMinZoom(9)
    m.setMaxZoom(12) // the image gets soft past this
    layers.current = L.layerGroup().addTo(m)
    map.current = m
    return () => m.remove()
  }, [interactive])

  useEffect(() => {
    const m = map.current
    const { center, r } = cutoutFor(area)
    const primary = cssVar('--md-sys-color-primary') || '#6a2bb8'
    layers.current.clearLayers()
    const world = [[85, -179.9], [85, 179.9], [-85, 179.9], [-85, -179.9]]
    const hole = L.polygon([world, ring(center, r)], { stroke: false, fillColor: primary, fillOpacity: 0.28, interactive: false }).addTo(layers.current)
    const edge = L.circle(center, { radius: r, color: primary, weight: 2.5, fill: false, interactive: false }).addTo(layers.current)
    // "you" only when the area is measured from you (no neighborhoods picked)
    if (interactive && onCenterChange) {
      // drag handle in the middle of the circle: moves the cutout live, commits on release
      const handle = L.marker(center, {
        draggable: true, keyboard: true, title: 'drag to move the search area',
        icon: L.divIcon({ className: 'map-handle', html: '<span></span>', iconSize: [44, 44], iconAnchor: [22, 22] }),
      }).addTo(layers.current)
      handle.on('drag', e => {
        const c = e.target.getLatLng()
        hole.setLatLngs([world, ring([c.lat, c.lng], r)])
        edge.setLatLng(c)
      })
      handle.on('dragend', e => {
        const c = e.target.getLatLng()
        onCenterChange([c.lat, c.lng], Math.round(r / MI))
      })
    }
    if (!area.places.length && !area.center) L.circleMarker(YOU, { radius: 6, color: '#fff', weight: 3, fillColor: primary, fillOpacity: 1, interactive: false })
      .bindTooltip('you', { permanent: true, direction: 'bottom', className: 'map-you-tip', offset: [0, 6] }).addTo(layers.current)
    // bounds from center + radius (getBounds needs a projected view, which a fresh map doesn't have yet)
    m.fitBounds(L.latLng(center).toBounds(r * 2), { padding: [16, 16], animate: false, maxZoom: 12 })
  }, [area])

  return <div ref={el} className="real-map" style={{ height }} role="img" aria-label="map of the area you're searching" />
}
