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

export const city = { name: 'minneapolis', area: 'all areas', total: 21327 }

// Sections in the order people use them; subcategories ordered by demand, not A–Z.
export const sections = [
  { id: 'sale', name: 'for sale', icon: 'tag', count: 12480, newToday: 1312,
    subs: ['furniture', 'cars & trucks', 'bicycles', 'free stuff', 'household', 'electronics', 'tools', 'sporting'], more: 37 },
  { id: 'housing', name: 'housing', icon: 'house', count: 3215, newToday: 284,
    subs: ['apartments', 'rooms & shares', 'sublets', 'parking & storage'], more: 6 },
  { id: 'jobs', name: 'jobs', icon: 'briefcase', count: 1904, newToday: 167,
    subs: ['food & beverage', 'general labor', 'healthcare', 'skilled trades'], more: 27 },
  { id: 'services', name: 'services', icon: 'wrench', count: 2310, newToday: 96,
    subs: ['moving', 'snow removal', 'cleaning', 'handyman'], more: 18 },
  { id: 'gigs', name: 'gigs', icon: 'bolt', count: 486, newToday: 41,
    subs: ['labor', 'event', 'creative', 'domestic'], more: 4 },
  { id: 'community', name: 'community', icon: 'people', count: 932, newToday: 58,
    subs: ['events', 'lost & found', 'volunteers', 'rideshare'], more: 9 },
]

export const savedSearches = [
  { id: 's1', label: 'road bike', detail: 'under $500 · 10 mi', fresh: 3, section: 'sale' },
  { id: 's2', label: '1br northeast', detail: 'under $1,400', fresh: 5, section: 'housing' },
  { id: 's3', label: 'fat bike', detail: 'any price', fresh: 1, section: 'sale' },
]

// fair: 'below' | 'typical' | 'above' — derived from the category price histogram.
export const listings = [
  { id: 1, section: 'sale', sub: 'bicycles', title: 'surly straggler 54cm, barely ridden', price: 1150, fair: 'typical', hood: 'northeast', mi: 1.4, age: '12 min', photo: straggler, photos: 9 },
  { id: 2, section: 'sale', sub: 'tools', title: 'toro power max 824 snowblower — starts first pull', price: 350, fair: 'below', hood: 'richfield', mi: 6.2, age: '25 min', glyph: 'snow' },
  { id: 3, section: 'sale', sub: 'bicycles', title: 'electra townie 7d step-over, blue', price: 235, fair: 'below', hood: 'longfellow', mi: 3.8, age: '38 min', photo: townie, photos: 5 },
  { id: 4, section: 'housing', sub: 'apartments', title: '1br in a fourplex, heat included, cats ok', price: 1295, per: 'mo', fair: 'typical', hood: 'northeast', mi: 1.9, age: '44 min', glyph: 'house', meta: '1br · 650 ft² · oct 1' },
  { id: 5, section: 'sale', sub: 'furniture', title: 'mid-century walnut dresser, 6 drawers', price: 180, fair: 'below', hood: 'uptown', mi: 2.6, age: '1 h', glyph: 'dresser' },
  { id: 6, section: 'sale', sub: 'bicycles', title: 'austro daimler carbon tt, campagnolo', price: 1350, fair: 'above', hood: 'mac-groveland', mi: 7.9, age: '1 h', photo: austro, photos: 7 },
  { id: 7, section: 'jobs', sub: 'food & beverage', title: 'line cook — eat street, nights + weekends', price: null, pay: '$22–26/hr', hood: 'whittier', mi: 1.7, age: '1 h', glyph: 'briefcase' },
  { id: 8, section: 'sale', sub: 'bicycles', title: 'surly pack rat 56cm, rack + basket', price: 900, fair: 'typical', hood: 'powderhorn', mi: 3.1, age: '2 h', photo: packRat, photos: 11 },
  { id: 9, section: 'sale', sub: 'free stuff', title: 'free ikea kallax 4×4 — curb by 6pm', price: 0, hood: 'como', mi: 4.4, age: '2 h', glyph: 'shelf' },
  { id: 10, section: 'sale', sub: 'bicycles', title: 'trek 5200 vintage carbon road, 58cm', price: 375, fair: 'below', hood: 'st. louis park', mi: 5.0, age: '3 h', photo: trek5200, photos: 6 },
  { id: 11, section: 'gigs', sub: 'labor', title: 'help moving a sectional saturday am', price: 60, fair: null, hood: 'northeast', mi: 1.2, age: '3 h', glyph: 'bolt', pay: '$60 · 2 hrs' },
  { id: 12, section: 'sale', sub: 'bicycles', title: 'surly moonlander fat bike, clown shoe wheels', price: 1950, fair: 'above', hood: 'edina', mi: 8.3, age: '4 h', photo: moonlander, photos: 13 },
  { id: 13, section: 'housing', sub: 'rooms & shares', title: 'room in 3br house near the greenway', price: 725, per: 'mo', fair: 'below', hood: 'seward', mi: 2.9, age: '4 h', glyph: 'house', meta: 'private room · nov 1' },
  { id: 14, section: 'sale', sub: 'bicycles', title: 'fuji nevada 29er, hydraulic discs', price: 1000, fair: 'above', hood: 'bloomington', mi: 10.6, age: '5 h', photo: fuji, photos: 4 },
  { id: 15, section: 'services', sub: 'snow removal', title: 'snow removal — seasonal contracts open', price: null, pay: 'from $45/visit', hood: 'south mpls', mi: 3.5, age: '5 h', glyph: 'snow' },
  { id: 16, section: 'sale', sub: 'bicycles', title: 'haro delsol single speed cruiser', price: 128, fair: 'below', hood: 'roseville', mi: 9.2, age: '6 h', photo: haroGreen, photos: 3, dealer: true },
  { id: 17, section: 'sale', sub: 'bicycles', title: '3 schwinn stingray choppers', price: 50, fair: 'below', hood: 'brooklyn park', mi: 11.4, age: '7 h', photo: choppers, photos: 2 },
  { id: 18, section: 'community', sub: 'events', title: 'free bike tune-up clinic at the hub co-op', price: null, pay: 'sat 10–2', hood: 'seward', mi: 2.8, age: '8 h', glyph: 'people' },
  { id: 19, section: 'sale', sub: 'bicycles', title: 'surly karate monkey frame (medium)', price: 800, fair: 'typical', hood: 'northeast', mi: 1.6, age: '9 h', photo: karate, photos: 6 },
  { id: 20, section: 'sale', sub: 'bicycles', title: 'haro delsol single speed, womens', price: 128, fair: 'below', hood: 'roseville', mi: 9.2, age: '9 h', photo: haroRed, photos: 3, dealer: true },
]

export const bySection = id => listings.filter(l => l.section === id)

export function priceLabel(l) {
  if (l.pay) return l.pay
  if (l.price === 0) return 'free'
  if (l.price == null) return ''
  return '$' + l.price.toLocaleString('en-US') + (l.per ? '/' + l.per : '')
}

export const fmt = n => n.toLocaleString('en-US')
