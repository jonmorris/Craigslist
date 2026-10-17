import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { REGIONS } from './area.js'

// Real map (Leaflet + CARTO basemap from OpenStreetMap data), in the current
// app's style: everything outside the search area is tinted purple, with a
// circular cutout where you're looking. The circle follows the choice:
// distance from you, the chosen neighborhoods, or the whole metro.
export const COORDS = {
  northeast: [45.0016, -93.256], 'north loop': [44.988, -93.278], downtown: [44.9778, -93.265], uptown: [44.949, -93.298],
  whittier: [44.959, -93.278], powderhorn: [44.942, -93.256], longfellow: [44.936, -93.219], seward: [44.959, -93.235],
  'linden hills': [44.924, -93.315], 'bryn mawr': [44.97, -93.315], 'south mpls': [44.92, -93.26], 'mac-groveland': [44.931, -93.17],
  como: [44.98, -93.15], richfield: [44.8833, -93.283], 'st. louis park': [44.948, -93.348], edina: [44.8897, -93.35],
  bloomington: [44.8408, -93.2983], roseville: [45.0061, -93.1566], 'brooklyn park': [45.0941, -93.3563],
}
export const YOU = COORDS.downtown
const METRO = { center: [44.965, -93.24], r: 22000 }
const MI = 1609.34

const dist = (a, b) => L.latLng(a).distanceTo(L.latLng(b))

export function cutoutFor(area) {
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

export default function RealMap({ area, interactive = true, height = 240 }) {
  const el = useRef(null)
  const map = useRef(null)
  const layers = useRef(null)

  useEffect(() => {
    const m = L.map(el.current, {
      zoomControl: false, attributionControl: true, dragging: interactive, scrollWheelZoom: false,
      touchZoom: interactive, doubleClickZoom: interactive, boxZoom: false, keyboard: interactive,
    })
    L.tileLayer(`https://{s}.basemaps.cartocdn.com/${isDark() ? 'dark_all' : 'light_all'}/{z}/{x}/{y}{r}.png`, {
      subdomains: 'abcd', maxZoom: 18,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(m)
    m.attributionControl.setPrefix(false)
    m.setView(METRO.center, 11)
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
    L.polygon([world, ring(center, r)], { stroke: false, fillColor: primary, fillOpacity: 0.28, interactive: false }).addTo(layers.current)
    L.circle(center, { radius: r, color: primary, weight: 2.5, fill: false, interactive: false }).addTo(layers.current)
    // "you" only when the area is measured from you (no neighborhoods picked)
    if (!area.places.length) L.circleMarker(YOU, { radius: 6, color: '#fff', weight: 3, fillColor: primary, fillOpacity: 1, interactive: false })
      .bindTooltip('you', { permanent: true, direction: 'bottom', className: 'map-you-tip', offset: [0, 6] }).addTo(layers.current)
    // bounds from center + radius (getBounds needs a projected view, which a fresh map doesn't have yet)
    m.fitBounds(L.latLng(center).toBounds(r * 2), { padding: [16, 16], animate: false })
  }, [area])

  return <div ref={el} className="real-map" style={{ height }} role="img" aria-label="map of the area you're searching" />
}
