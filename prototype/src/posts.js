// Your own posts: the post flow writes a record; publishing turns it into a real listing
// (browse, search, filters and the map all see it). Records persist on the phone.
import { listings, typicalRange, ageFrom, fairFor } from './data.js'
import { setDetail } from './details.js'
import { setAttrs } from './facets.js'
import { COORDS, distMeters, MI } from './area.js'

// fields the post flow collects for bikes; they double as the bicycles filters
export const BIKE_FIELDS = [
  ['type', 'bicycle type', ['road', 'gravel', 'mountain', 'hybrid', 'city', 'cruiser', 'fat bike', 'bmx', 'kids', 'frame only']],
  ['size', 'frame size', ['small', 'medium', 'large']],
  ['wheel', 'wheel size', ['20"', '24"', '26"', '27.5" / 650b', '29"', '700c']],
  ['material', 'frame material', ['steel', 'aluminum', 'carbon', 'titanium']],
  ['brakes', 'brake type', ['rim', 'coaster', 'mechanical disc', 'hydraulic disc']],
]
export const CONDITIONS = ['new', 'like new', 'excellent', 'good', 'fair', 'salvage']

export const emptyPost = () => ({
  section: 'sale', sub: 'bicycles', photos: [], title: '', price: '', condition: '', make: '', attrs: {},
  desc: '', hood: '', contact: 'chat', showPhone: false, phone: '',
})

let nextId = 1000
export const miFor = hood => (COORDS[hood] ? Math.round((distMeters(COORDS[hood], COORDS.Downtown) / MI) * 10) / 10 : 1)

// create or update the listing for a post record (status: active | sold)
export function publish(rec) {
  const id = rec.id ?? (rec.id = nextId++)
  if (id >= nextId) nextId = id + 1
  const specs = [
    rec.condition && ['condition', rec.condition],
    ...BIKE_FIELDS.filter(([k]) => rec.attrs[k]).map(([k, label]) => [label, rec.attrs[k]]),
    rec.make && ['make', rec.make],
  ].filter(Boolean)
  setDetail(id, { specs: specs.length ? specs : [['condition', 'good']], desc: rec.desc || 'message me with any questions.' })
  setAttrs(id, { ...rec.attrs, make: rec.make.toLowerCase(), condition: rec.condition })
  const l = {
    id, section: rec.section, sub: rec.sub, title: rec.title.trim().toLowerCase(), price: rec.price === '' ? null : Number(rec.price),
    hood: rec.hood, mi: miFor(rec.hood), age: ageFrom(rec.postedAt), photo: rec.photos[0] || null, photos: rec.photos.length,
    glyph: 'tag', mine: true, status: rec.status || 'active', postedAt: rec.postedAt,
    views: rec.views ?? 0, saves: rec.saves ?? 0, messages: rec.messages ?? 0,
  }
  l.fair = fairFor(l)
  const i = listings.findIndex(x => x.id === id)
  if (i >= 0) listings[i] = l
  else listings.unshift(l)
  return l
}
export function unpublish(id) {
  const i = listings.findIndex(x => x.id === id)
  if (i >= 0) listings.splice(i, 1)
}

// what's missing before a post can go live, in the order the form asks for it
export function missing(rec) {
  return [
    !rec.title.trim() && 'a title',
    rec.price === '' && 'a price (0 for free)',
    !rec.hood && 'a neighborhood',
  ].filter(Boolean)
}

export const typicalFor = sub => typicalRange[sub]
export const EXAMPLE = photos => ({
  ...emptyPost(), photos: photos.slice(0, 3), title: 'Surly Cross-Check 56cm, steel, new tires', price: '650', condition: 'excellent', make: 'Surly',
  attrs: { type: 'gravel', size: 'medium', wheel: '700c', material: 'steel', brakes: 'rim' },
  desc: 'one owner, always stored inside. new tires and bar tape this summer, shifts clean. fits about 5\'8" to 6\'. test rides welcome in Seward, cash or venmo.',
  hood: 'Seward', contact: 'chat',
})
