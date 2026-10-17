// Areas: Minneapolis shoppers think in neighborhoods, not 50-mile circles.
// An area is { places: [region or neighborhood names], radius: miles | null }.

export const REGIONS = {
  minneapolis: ['northeast', 'north loop', 'downtown', 'uptown', 'whittier', 'powderhorn', 'longfellow', 'seward', 'linden hills', 'bryn mawr', 'south mpls'],
  'st. paul': ['mac-groveland', 'como'],
  suburbs: ['richfield', 'st. louis park', 'edina', 'bloomington', 'roseville', 'brooklyn park'],
}
export const NEIGHBORHOODS = Object.values(REGIONS).flat()
export const RADII = [null, 2, 5, 10, 25]

export const ALL_AREAS = { places: [], radius: null }

export function inArea(l, area) {
  if (area.radius != null && l.mi > area.radius) return false
  if (!area.places.length) return true
  return area.places.some(p => p === l.hood || (REGIONS[p] || []).includes(l.hood))
}

// Full label with the city, without repeating it: "minneapolis · all areas",
// "minneapolis · 5 mi", "northeast +1 · 5 mi", "st. paul".
export function areaFull(area, city = 'minneapolis') {
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
  const where = !area.places.length ? 'all areas'
    : area.places.length === 1 ? area.places[0] : `${area.places[0]} +${area.places.length - 1}`
  return area.radius != null ? `${where} · ${area.radius} mi` : where
}
