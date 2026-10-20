// Live counts, from the same listings the lists show: visible (not hidden or sold),
// in the chosen area, with dealer reposts bundled like the list's default. A count on
// a tile or menu is always what you get when you tap it.
import { listings, visible, ageMinutes } from './data.js'
import { inArea, ALL_AREAS } from './area.js'

const bundled = list => {
  const dealers = new Set()
  return list.filter(l => (l.dealer ? (dealers.has(l.seller) ? false : dealers.add(l.seller)) : true))
}
export const listingsIn = (section, sub = 'all', area = ALL_AREAS) =>
  bundled(visible(listings).filter(l => l.section === section && (sub === 'all' || l.sub === sub) && inArea(l, area)))
export const countIn = (section, sub = 'all', area = ALL_AREAS) => listingsIn(section, sub, area).length
// posted in the last 3 hours, for the "fresh" line on section pages
export const freshIn = (section, sub = 'all', area = ALL_AREAS) => listingsIn(section, sub, area).filter(l => ageMinutes(l.age) <= 180).length
export const countAll = (area = ALL_AREAS) => bundled(visible(listings).filter(l => inArea(l, area))).length
