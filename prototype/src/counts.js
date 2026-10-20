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

// Shown counts: each section and subcategory has a realistic metro total (sections and
// taxonomy). The prototype holds only a sample of listings, so a narrower view (an area,
// filters) shows that total scaled by the share of the sample that survives. Every screen
// uses this, so the home tile, the section page and the list header always agree.
import { sections } from './data.js'
import { taxonomy } from './taxonomy.js'
export const totalFor = (section, sub = 'all') => sub === 'all'
  ? sections.find(s => s.id === section)?.count ?? 0
  : taxonomy[section]?.find(t => t.key === sub)?.count ?? 0
// share of the whole metro's listings that sit in an area (from the sample)
const areaShare = area => (countAll() ? countAll(area) / countAll() : 0)
// shown count for a view: the realistic total, times the area's share of the metro, times the
// share of that area's sample the filters keep. Unfiltered + all areas = the realistic total.
export function scaledIn(section, sub, area, sampleCount) {
  const sample = countIn(section, sub, area)
  return sample ? Math.round((totalFor(section, sub) * areaShare(area) * sampleCount) / sample) : 0
}
export const shownIn = (section, sub = 'all', area = ALL_AREAS) => scaledIn(section, sub, area, countIn(section, sub, area))
// new today, scaled the same way from the section's daily total
export const newTodayIn = (section, area = ALL_AREAS) => (countIn(section, 'all', area) ? Math.round(sections.find(x => x.id === section).newToday * areaShare(area)) : 0)
export const shareOf = areaShare
