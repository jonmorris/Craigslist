// Mock search: token match on title + subcategory with a few synonyms.
import { listings, sections } from './data.js'

const SYN = {
  bike: ['bicycle'], bikes: ['bicycle', 'bike'], bicycle: ['bike'],
  couch: ['sofa', 'sectional'], sofa: ['couch'],
  apartment: ['1br', 'apartments'], apt: ['1br', 'apartments'],
  snowblower: ['snow blower'], skis: ['ski'],
}

const norm = s => s.toLowerCase().trim()

export function matches(l, query) {
  const hay = (l.title + ' ' + l.sub).toLowerCase()
  return norm(query).split(/\s+/).filter(Boolean).every(t =>
    (t === 'free' && l.price === 0) || hay.includes(t) || (SYN[t] || []).some(s => hay.includes(s)))
}

export const searchListings = (query, sectionId = null) =>
  listings.filter(l => (!sectionId || l.section === sectionId) && matches(l, query))

// "search in" scopes: the section, then its subcategories, most results first.
export function scopes(query, sectionId = null) {
  const hits = searchListings(query, sectionId)
  const bySub = new Map()
  for (const l of hits) {
    const k = l.section + '|' + l.sub
    bySub.set(k, (bySub.get(k) || 0) + 1)
  }
  const subs = [...bySub].map(([k, n]) => { const [section, sub] = k.split('|'); return { section, sub, n } }).sort((a, b) => b.n - a.n)
  const secs = [...new Set(subs.map(s => s.section))]
  const out = []
  if (secs.length === 1 && subs.length > 1) out.push({ section: secs[0], sub: 'all', n: hits.length })
  out.push(...subs.slice(0, 4))
  return out.map(s => ({ ...s, sectionName: sections.find(x => x.id === s.section).name }))
}

const VOCAB = [
  'bike', 'bike rack', 'bike trailer', 'bike parts', 'bikes for kids', 'fat bike', 'road bike', 'electric bike',
  'surly', 'surly long haul trucker', 'surly pugsley', 'trek', 'townie',
  'snowblower', 'snow tires', 'snow removal', 'cross-country skis', 'firewood', 'winter coat', 'halloween costume',
  'sofa', 'sectional', 'dresser', 'standing desk', 'ikea kallax', 'cast iron', 'kayak',
  'free stuff', 'free couch', '1br apartment', 'apartment northeast', 'room for rent', 'line cook', 'moving help',
]

export function suggest(query) {
  const q = norm(query)
  if (!q) return []
  const starts = VOCAB.filter(v => v.startsWith(q))
  const contains = VOCAB.filter(v => !v.startsWith(q) && v.includes(q))
  return [...starts, ...contains].slice(0, 5)
}

// What Minneapolis is searching this week (mid-October).
export const TRENDING = ['snowblower', 'snow tires', 'fat bike', 'firewood', 'halloween costume', 'winter coat', 'free couch']

export const seedRecent = ['surly', 'snow tires', 'standing desk', 'kayak']
