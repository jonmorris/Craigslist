// Category-specific filters (the current app's make/model, bedrooms, etc.), per subcategory.
// Values come from each listing's specs, normalized here so the mock data filters cleanly.
import { detailFor } from './details.js'

const BIKES = {
  1: { type: 'gravel / touring', size: 'medium', make: 'surly' },
  3: { type: 'cruiser', make: 'electra' },
  6: { type: 'road', size: 'medium', make: 'austro daimler' },
  8: { type: 'city', size: 'medium', make: 'surly' },
  10: { type: 'road', size: 'large', make: 'trek' },
  12: { type: 'fat bike', size: 'large', make: 'surly' },
  14: { type: 'mountain', make: 'fuji' },
  16: { type: 'cruiser', make: 'haro' },
  17: { type: 'kids', make: 'schwinn' },
  19: { type: 'frame only', size: 'medium', make: 'surly' },
  20: { type: 'cruiser', make: 'haro' },
}
const HOUSING = {
  4: { beds: '1', pets: ['cats ok'], laundry: 'in building' },
  13: { beds: 'room', pets: [], laundry: 'in unit' },
}

const CONDITION = { key: 'condition', label: 'condition', options: ['new', 'like new', 'excellent', 'good', 'fair'] }
export const FACETS = {
  bicycles: [
    { key: 'type', label: 'type', options: ['road', 'gravel / touring', 'mountain', 'fat bike', 'city', 'cruiser', 'kids', 'frame only'] },
    { key: 'size', label: 'frame size', options: ['small', 'medium', 'large'], hint: 'small ≤ 52 cm / 16 in · medium 53–56 cm / 17–18 in · large 57 cm+ / 19 in+' },
    { key: 'make', label: 'make', search: true, options: ['austro daimler', 'electra', 'fuji', 'haro', 'schwinn', 'specialized', 'surly', 'trek'] },
    CONDITION,
  ],
  apartments: [
    { key: 'beds', label: 'bedrooms', options: ['studio', '1', '2', '3+'] },
    { key: 'pets', label: 'pets', options: ['cats ok', 'dogs ok'] },
    { key: 'laundry', label: 'laundry', options: ['in unit', 'in building'] },
  ],
  'rooms & shares': [
    { key: 'pets', label: 'pets', options: ['cats ok', 'dogs ok'] },
    { key: 'laundry', label: 'laundry', options: ['in unit', 'in building'] },
  ],
}
// any other for-sale subcategory gets condition
export const facetsFor = (section, sub) => FACETS[sub] || (section === 'sale' && sub !== 'all' && sub !== 'free stuff' ? [CONDITION] : [])

export function facetValue(l, key) {
  if (key === 'condition') return detailFor(l).specs.find(s => s[0] === 'condition')?.[1]
  return (BIKES[l.id] || HOUSING[l.id] || {})[key]
}

// attrs = { key: [picked values] }; a listing matches when every facet with picks matches one of them
export function matchesAttrs(l, attrs = {}) {
  return Object.entries(attrs).every(([key, picked]) => {
    if (!picked?.length) return true
    const v = facetValue(l, key)
    return Array.isArray(v) ? picked.every(p => v.includes(p)) : picked.includes(v)
  })
}

export const attrCount = attrs => Object.values(attrs || {}).reduce((n, v) => n + (v?.length || 0), 0)
export const attrSummary = attrs => Object.values(attrs || {}).flat().filter(Boolean)
