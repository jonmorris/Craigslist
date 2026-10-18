// Areas: Minneapolis shoppers think in neighborhoods, not 50-mile circles.
// An area is { places: [region or neighborhood names], radius: miles | null }.

export const REGIONS = {
  Minneapolis: ['Northeast', 'North Loop', 'Downtown', 'Uptown', 'Whittier', 'Powderhorn', 'Longfellow', 'Seward', 'Linden Hills', 'Bryn Mawr', 'South Mpls'],
  'St. Paul': ['Mac-Groveland', 'Como'],
  suburbs: ['Richfield', 'St. Louis Park', 'Edina', 'Bloomington', 'Roseville', 'Brooklyn Park'],
}
export const NEIGHBORHOODS = Object.values(REGIONS).flat()
// craigslist's own sub-areas for Minneapolis (counties), as in the current app's filters
export const SUBAREAS = {
  'hennepin co': [...REGIONS.Minneapolis, 'Richfield', 'St. Louis Park', 'Edina', 'Bloomington', 'Brooklyn Park'],
  'ramsey co': [...REGIONS['St. Paul'], 'Roseville'],
  'anok/chis/isa': [], 'washington/WI': [], 'dakota/scott': [], 'carv/sher/wri': [],
}
const GROUPS = { ...REGIONS, ...SUBAREAS }
export const RADII = [null, 2, 5, 10, 25]

// approximate neighborhood centers (lat, lng); listings sit at their neighborhood
export const COORDS = {
  Northeast: [45.0016, -93.256], 'North Loop': [44.988, -93.278], Downtown: [44.9778, -93.265], Uptown: [44.949, -93.298],
  Whittier: [44.959, -93.278], Powderhorn: [44.942, -93.256], Longfellow: [44.936, -93.219], Seward: [44.959, -93.235],
  'Linden Hills': [44.924, -93.315], 'Bryn Mawr': [44.97, -93.315], 'South Mpls': [44.92, -93.26], 'Mac-Groveland': [44.931, -93.17],
  Como: [44.98, -93.15], Richfield: [44.8833, -93.283], 'St. Louis Park': [44.948, -93.348], Edina: [44.8897, -93.35],
  Bloomington: [44.8408, -93.2983], Roseville: [45.0061, -93.1566], 'Brooklyn Park': [45.0941, -93.3563],
}
export const MI = 1609.34
export function distMeters([a1, o1], [a2, o2]) {
  const r = Math.PI / 180, x = (o2 - o1) * r * Math.cos(((a1 + a2) / 2) * r), y = (a2 - a1) * r
  return Math.sqrt(x * x + y * y) * 6371000
}
// nearest named neighborhood to a point, for labels like "near uptown"
export function nearestHood(c) {
  return Object.entries(COORDS).sort((a, b) => distMeters(a[1], c) - distMeters(b[1], c))[0][0]
}

// An area may also have a custom center (dragged on the map): { center: [lat, lng], radius }.
export const ALL_AREAS = { places: [], radius: null, center: null }

export const placesIn = p => GROUPS[p] || [p]

export function inArea(l, area) {
  if (area.center) return COORDS[l.hood] ? distMeters(COORDS[l.hood], area.center) <= (area.radius ?? 5) * MI : false
  if (area.radius != null && l.mi > area.radius) return false
  if (!area.places.length) return true
  return area.places.some(p => p === l.hood || (GROUPS[p] || []).includes(l.hood))
}

// Full label with the city, without repeating it: "minneapolis · all areas",
// "minneapolis · 5 mi", "northeast +1 · 5 mi", "st. paul".
export function areaFull(area, city = 'Minneapolis, MN') {
  if (area.center) return areaLabel(area)
  if (!area.places.length) return `${city} · ${areaLabel(area)}`
  return areaLabel(area)
}

// Ways to widen an area that came up empty, each with how many results it brings:
// a larger distance, single other neighborhoods, the whole region, everywhere.
export function widenOptions(area, count) {
  const out = []
  for (const r of RADII.filter(r => r != null && (area.radius == null ? false : r > area.radius))) {
    out.push({ label: `within ${r} mi`, area: { ...area, radius: r } })
  }
  if (area.radius != null) out.push({ label: 'any distance', area: { ...area, radius: null } })
  if (area.places.length) {
    const near = NEIGHBORHOODS.filter(h => !area.places.includes(h))
      .map(h => ({ label: h, area: { places: [h], radius: area.radius } }))
    out.push(...near)
    const region = Object.keys(REGIONS).find(r => area.places.some(p => REGIONS[r].includes(p) || p === r))
    if (region && !area.places.includes(region)) out.push({ label: `all of ${region}`, area: { places: [region], radius: null } })
  }
  out.push({ label: 'all areas', area: { places: [], radius: null } })
  return out.map(o => ({ ...o, n: count(o.area) })).filter(o => o.n > 0)
    // keep distance and region options, plus the 3 neighborhoods with the most matches
    .filter((o, i, arr) => !NEIGHBORHOODS.includes(o.label) || arr.filter(x => NEIGHBORHOODS.includes(x.label)).sort((a, b) => b.n - a.n).slice(0, 3).includes(o))
}

export function areaLabel(area) {
  if (area.center) return `near ${nearestHood(area.center)} · ${area.radius ?? 5} mi`
  const where = !area.places.length ? 'all areas'
    : area.places.length === 1 ? area.places[0] : `${area.places[0]} +${area.places.length - 1}`
  return area.radius != null ? `${where} · ${area.radius} mi` : where
}
