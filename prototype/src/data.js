// Mock Minneapolis data. Bike photos are cropped from the audit screenshots
// (placeholders only — swap for licensed stock before the deck goes out).
import straggler from './assets/photos/surly-straggler.jpg'
import townie from './assets/photos/trek-townie.jpg'
import austro from './assets/photos/austro-daimler.jpg'
import haroGreen from './assets/photos/haro-green.jpg'
import haroRed from './assets/photos/haro-red.jpg'
import packRat from './assets/photos/surly-pack-rat.jpg'
import trek5200 from './assets/photos/trek-5200.jpg'
import moonlander from './assets/photos/surly-moonlander.jpg'
import fuji from './assets/photos/fuji.jpg'
import choppers from './assets/photos/schwinn-choppers.jpg'
import karate from './assets/photos/surly-karate-monkey.jpg'

export const city = { name: 'Minneapolis', area: 'all areas', total: 21327 }

// Sections in the order people use them; subcategories ordered by demand, not A–Z.
export const sections = [
  { id: 'sale', name: 'for sale', icon: 'tag', count: 12480, newToday: 1312,
    subs: ['furniture', 'cars & trucks', 'bicycles', 'free stuff', 'household', 'electronics', 'tools', 'sporting'], more: 37 },
  { id: 'housing', name: 'housing', icon: 'house', count: 3215, newToday: 284,
    subs: ['apartments', 'rooms & shares', 'sublets', 'parking & storage'], more: 6 },
  { id: 'jobs', name: 'jobs', icon: 'briefcase', count: 1904, newToday: 167,
    subs: ['food & beverage', 'resumes', 'general labor', 'healthcare', 'skilled trades'], more: 27 },
  { id: 'services', name: 'services', icon: 'wrench', count: 2310, newToday: 96,
    subs: ['moving', 'snow removal', 'cleaning', 'handyman'], more: 18 },
  { id: 'gigs', name: 'gigs', icon: 'bolt', count: 486, newToday: 41,
    subs: ['labor', 'event', 'creative', 'domestic'], more: 4 },
  { id: 'community', name: 'community', icon: 'people', count: 932, newToday: 58,
    subs: ['events', 'lost & found', 'volunteers', 'rideshare'], more: 9 },
]

export const savedSearches = [
  { id: 's1', label: 'road bike', detail: 'under $500 · 10 mi', fresh: 3, section: 'sale', sub: 'bicycles', filters: { sub: 'bicycles', ownerOnly: false, photosOnly: false, min: null, max: 500 }, area: { places: [], radius: 10, center: null } },
  { id: 's2', label: '1br northeast', detail: 'under $1,400', fresh: 5, section: 'housing', sub: 'apartments', filters: { sub: 'apartments', ownerOnly: false, photosOnly: false, min: null, max: 1400 } },
  { id: 's3', label: 'fat bike', detail: 'any price', fresh: 1, section: 'sale', sub: 'bicycles' },
]

// fair: 'below' | 'typical' | 'above' — derived from the category price histogram.
export const listings = [
  { id: 1, section: 'sale', sub: 'bicycles', title: 'surly straggler 54cm, barely ridden', price: 1150, hood: 'Northeast', mi: 1.4, age: '12 min', photo: straggler, photos: 9 },
  { id: 2, section: 'sale', sub: 'tools', title: 'toro power max 824 snowblower — starts first pull', price: 350, hood: 'Richfield', mi: 6.2, age: '25 min', glyph: 'snow', delivery: true },
  { id: 3, section: 'sale', sub: 'bicycles', title: 'electra townie 7d step-over, blue', price: 235, hood: 'Longfellow', mi: 3.8, age: '38 min', photo: townie, photos: 5 },
  { id: 4, section: 'housing', sub: 'apartments', title: '1br in a fourplex, heat included, cats ok', price: 1295, per: 'mo', hood: 'Northeast', mi: 1.9, age: '44 min', glyph: 'house', meta: '1br · 650 ft² · oct 1' },
  { id: 5, section: 'sale', sub: 'furniture', title: 'mid-century walnut dresser, 6 drawers', price: 180, hood: 'Uptown', mi: 2.6, age: '1 h', glyph: 'dresser' },
  { id: 6, section: 'sale', sub: 'bicycles', title: 'austro daimler carbon tt, campagnolo', price: 1350, hood: 'Mac-Groveland', mi: 7.9, age: '1 h', photo: austro, photos: 7 },
  { id: 7, section: 'jobs', sub: 'food & beverage', title: 'line cook — eat street, nights + weekends', price: null, pay: '$22–26/hr', hood: 'Whittier', mi: 1.7, age: '1 h', glyph: 'briefcase' },
  { id: 8, section: 'sale', sub: 'bicycles', title: 'surly pack rat 56cm, rack + basket', price: 900, hood: 'Powderhorn', mi: 3.1, age: '2 h', photo: packRat, photos: 11 },
  { id: 9, section: 'sale', sub: 'free stuff', title: 'free ikea kallax 4×4 — curb by 6pm', price: 0, hood: 'Como', mi: 4.4, age: '2 h', glyph: 'shelf' },
  { id: 10, section: 'sale', sub: 'bicycles', title: 'trek 5200 vintage carbon road, 58cm', price: 375, hood: 'St. Louis Park', mi: 5.0, age: '3 h', photo: trek5200, photos: 6 },
  { id: 11, section: 'gigs', sub: 'labor', title: 'help moving a sectional saturday am', price: 60, hood: 'Northeast', mi: 1.2, age: '3 h', glyph: 'bolt', pay: '$60 · 2 hrs' },
  { id: 12, section: 'sale', sub: 'bicycles', title: 'surly moonlander fat bike, clown shoe wheels', price: 1950, hood: 'Edina', mi: 8.3, age: '4 h', photo: moonlander, photos: 13, crypto: true },
  { id: 13, section: 'housing', sub: 'rooms & shares', title: 'room in 3br house near the greenway', price: 725, per: 'mo', hood: 'Seward', mi: 2.9, age: '4 h', glyph: 'house', meta: 'private room · nov 1' },
  { id: 14, section: 'sale', sub: 'bicycles', title: 'fuji nevada 29er, hydraulic discs', price: 1000, hood: 'Bloomington', mi: 10.6, age: '5 h', photo: fuji, photos: 4 },
  { id: 15, section: 'services', sub: 'snow removal', title: 'snow removal — seasonal contracts open', price: null, pay: 'from $45/visit', hood: 'South Mpls', mi: 3.5, age: '5 h', glyph: 'snow' },
  { id: 16, section: 'sale', sub: 'bicycles', title: 'haro delsol single speed cruiser', price: 128, hood: 'Roseville', mi: 9.2, age: '6 h', photo: haroGreen, photos: 3, dealer: true, seller: 'Roseville Cycle', delivery: true },
  { id: 17, section: 'sale', sub: 'bicycles', title: '3 schwinn stingray choppers', price: 50, hood: 'Brooklyn Park', mi: 11.4, age: '7 h', photo: choppers, photos: 2 },
  { id: 18, section: 'community', sub: 'events', title: 'free bike tune-up clinic at the hub co-op', price: null, pay: 'sat 10–2', hood: 'Seward', mi: 2.8, age: '8 h', glyph: 'people' },
  { id: 19, section: 'sale', sub: 'bicycles', title: 'surly karate monkey frame (medium)', price: 800, hood: 'Northeast', mi: 1.6, age: '9 h', photo: karate, photos: 6 },
  { id: 20, section: 'sale', sub: 'bicycles', title: 'haro delsol single speed, womens', price: 128, hood: 'Roseville', mi: 9.2, age: '9 h', photo: haroRed, photos: 3, dealer: true, seller: 'Roseville Cycle', delivery: true },
  { id: 21, section: 'sale', sub: 'furniture', title: 'west elm harmony sofa, 82in, dove gray', price: 300, hood: 'North Loop', mi: 1.1, age: '10 h', glyph: 'sofa', delivery: true },
  { id: 22, section: 'sale', sub: 'sporting', title: 'fischer cross-country skis + boots, size 43', price: 90, hood: 'Linden Hills', mi: 4.7, age: '11 h', glyph: 'snow' },
  { id: 23, section: 'sale', sub: 'furniture', title: 'uplift standing desk, 60×30, walnut top', price: 450, hood: 'Downtown', mi: 0.6, age: '12 h', glyph: 'desk' },
  { id: 24, section: 'sale', sub: 'household', title: 'lodge cast iron set — 8, 10, 12 in', price: 40, hood: 'Bryn Mawr', mi: 2.4, age: '13 h', glyph: 'tag' },
  { id: 25, section: 'jobs', sub: 'resumes', title: 'line cook, 6 years scratch kitchens, available nights + weekends', price: null, pay: 'seeking part-time', hood: 'Powderhorn', mi: 3.0, age: '2 h', glyph: 'person' },
  { id: 26, section: 'jobs', sub: 'resumes', title: 'forklift certified warehouse lead looking for full-time days', price: null, pay: 'seeking full-time', hood: 'Brooklyn Park', mi: 11.2, age: '6 h', glyph: 'person' },
]

export function ageMinutes(age) {
  if (age === 'just now') return 0
  const [n, unit] = age.split(' ')
  return unit === 'min' ? +n : unit === 'd' ? +n * 1440 : +n * 60
}
// "12 min", "3 h", "2 d" from a timestamp (your own posts)
export const ageFrom = t => { const m = Math.max(0, Math.round((Date.now() - t) / 60000)); return m < 1 ? 'just now' : m < 60 ? `${m} min` : m < 1440 ? `${Math.round(m / 60)} h` : `${Math.round(m / 1440)} d` }

// Stand-in photo library for the post flow's picker (a native app uses Android's photo picker)
export const photoLibrary = [straggler, packRat, karate, moonlander, trek5200, austro, townie, fuji, haroGreen, haroRed, choppers]

// Price spread for the fair-price histogram (for sale, all of minneapolis).
export const priceHistogram = {
  max: 2000, avg: 264, step: 100,
  bins: [118, 86, 61, 40, 28, 22, 15, 12, 9, 8, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1],
}

// Typical price range per subcategory (from the price histogram). The fair-price
// badge on every card and the range on the detail screen both derive from this.
export const typicalRange = {
  bicycles: [300, 1200], furniture: [200, 600], tools: [400, 800], sporting: [60, 220],
  household: [50, 120], apartments: [1100, 1500], 'rooms & shares': [750, 1000],
}
export const fairFor = l => { const r = typicalRange[l.sub]; return r && l.price ? (l.price < r[0] ? 'below' : l.price > r[1] ? 'above' : 'typical') : null }
for (const l of listings) {
  const r = typicalRange[l.sub]
  l.fair = r && l.price ? (l.price < r[0] ? 'below' : l.price > r[1] ? 'above' : 'typical') : null
}

// Listings the viewer hid from the detail screen; every list skips them.
export const hidden = new Set()
// browse and search skip hidden posts and your own sold ones
export const visible = list => list.filter(l => !hidden.has(l.id) && l.status !== 'sold')

export const bySection = id => visible(listings).filter(l => l.section === id)

export function priceLabel(l) {
  if (l.pay) return l.pay
  if (l.price === 0) return 'free'
  if (l.price == null) return ''
  return '$' + l.price.toLocaleString('en-US') + (l.per ? '/' + l.per : '')
}

export const fmt = n => n.toLocaleString('en-US')
