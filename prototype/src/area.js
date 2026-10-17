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

export function areaLabel(area) {
  const where = !area.places.length ? 'all areas'
    : area.places.length === 1 ? area.places[0] : `${area.places[0]} +${area.places.length - 1}`
  return area.radius != null ? `${where} · ${area.radius} mi` : where
}
