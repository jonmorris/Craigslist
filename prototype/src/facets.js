// Category-specific filters (the current app's make/model, bedrooms, etc.), per subcategory.
// Values come from each listing's specs, normalized here so the mock data filters cleanly.
import { detailFor } from './details.js'

const BIKES = {
  1: { type: 'gravel', size: 'medium', wheel: '700c', material: 'steel', suspension: 'none', brakes: 'mechanical disc', bars: 'drop', electric: 'none', make: 'surly' },
  3: { type: 'cruiser', wheel: '26"', material: 'aluminum', suspension: 'none', brakes: 'rim', bars: 'cruiser', electric: 'none', make: 'electra' },
  6: { type: 'road', size: 'medium', wheel: '700c', material: 'carbon', suspension: 'none', brakes: 'rim', bars: 'aero', electric: 'none', make: 'austro daimler' },
  8: { type: 'city', size: 'medium', wheel: '27.5" / 650b', material: 'steel', suspension: 'none', brakes: 'rim', bars: 'riser', electric: 'none', make: 'surly' },
  10: { type: 'road', size: 'large', wheel: '700c', material: 'carbon', suspension: 'none', brakes: 'rim', bars: 'drop', electric: 'none', make: 'trek' },
  12: { type: 'fat bike', size: 'large', wheel: '26"', material: 'steel', suspension: 'none', brakes: 'mechanical disc', bars: 'flat', electric: 'none', make: 'surly' },
  14: { type: 'mountain', wheel: '29"', material: 'aluminum', suspension: 'front', brakes: 'hydraulic disc', bars: 'flat', electric: 'none', make: 'fuji' },
  16: { type: 'cruiser', wheel: '26"', material: 'steel', suspension: 'none', brakes: 'coaster', bars: 'cruiser', electric: 'none', make: 'haro' },
  17: { type: 'kids', wheel: '20"', material: 'steel', suspension: 'none', brakes: 'coaster', bars: 'cruiser', electric: 'none', make: 'schwinn' },
  19: { type: 'frame only', size: 'medium', wheel: '29"', material: 'steel', suspension: 'none', electric: 'none', make: 'surly' },
  20: { type: 'cruiser', wheel: '26"', material: 'steel', suspension: 'none', brakes: 'coaster', bars: 'cruiser', electric: 'none', make: 'haro' },
}
const HOUSING = {
  4: { beds: '1', pets: ['cats ok'], laundry: 'in building' },
  13: { beds: 'room', pets: [], laundry: 'in unit' },
}

const CONDITION = { key: 'condition', label: 'condition', options: ['new', 'like new', 'excellent', 'good', 'fair', 'salvage'] }
export const FACETS = {
  // every bicycle filter in the current app, plus frame size
  bicycles: [
    { key: 'mm', label: 'make and model', kind: 'text', suggest: ['surly', 'trek', 'electra', 'fuji', 'haro', 'schwinn', 'austro daimler', 'specialized'] },
    { key: 'type', label: 'bicycle type', options: ['road', 'gravel', 'mountain', 'hybrid', 'city', 'cruiser', 'fat bike', 'bmx', 'kids', 'frame only'] },
    { key: 'size', label: 'frame size', options: ['small', 'medium', 'large'], hint: 'small ≤ 52 cm / 16 in · medium 53–56 cm / 17–18 in · large 57 cm+ / 19 in+' },
    { key: 'wheel', label: 'wheel size', options: ['20"', '24"', '26"', '27.5" / 650b', '29"', '700c'] },
    { key: 'material', label: 'frame material', options: ['steel', 'aluminum', 'carbon', 'titanium'] },
    { key: 'suspension', label: 'suspension', options: ['none', 'front', 'full'] },
    { key: 'brakes', label: 'brake type', options: ['rim', 'coaster', 'mechanical disc', 'hydraulic disc'] },
    { key: 'bars', label: 'handlebar type', options: ['drop', 'flat', 'riser', 'cruiser', 'aero'] },
    { key: 'electric', label: 'electric assist', options: ['none', 'pedal assist', 'throttle'] },
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
    // make and model: free text against the title and the make
    if (key === 'mm') return picked.every(t => (l.title + ' ' + (facetValue(l, 'make') || '')).toLowerCase().includes(t.toLowerCase()))
    const v = facetValue(l, key)
    return Array.isArray(v) ? picked.every(p => v.includes(p)) : picked.includes(v)
  })
}

export const attrCount = attrs => Object.values(attrs || {}).reduce((n, v) => n + (v?.length || 0), 0)
export const attrSummary = attrs => Object.values(attrs || {}).flat().filter(Boolean)
