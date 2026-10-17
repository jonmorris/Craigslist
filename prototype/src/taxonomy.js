// The real craigslist subcategory taxonomy per section, with mock Minneapolis
// counts. `key` links a subcategory to the mock listings in data.js (only some
// have listings in the prototype).

const raw = {
  sale: [
    ['antiques', 212], ['appliances', 486], ['arts & crafts', 133], ['atvs, utvs, snowmobiles', 174], ['auto parts', 612],
    ['auto wheels & tires', 288], ['aviation', 0], ['baby & kid stuff', 341], ['barter', 22], ['bicycle parts', 262],
    ['bicycles', 1354, 'bicycles'], ['boat parts', 61], ['boats', 118], ['books & magazines', 97], ['business/commercial', 84],
    ['cars & trucks', 2106], ['cds/dvds/vhs', 41], ['cell phones', 156], ['clothing & accessories', 302], ['collectibles', 245],
    ['computer parts', 129], ['computers', 188], ['electronics', 421], ['farm & garden', 267], ['free stuff', 389, 'free stuff'],
    ['furniture', 1488, 'furniture'], ['garage & moving sales', 76], ['general for sale', 512], ['health and beauty', 58],
    ['heavy equipment', 93], ['household items', 604, 'household'], ['jewelry', 71], ['materials', 199], ['motorcycle parts', 87],
    ['motorcycles/scooters', 288], ['musical instruments', 236], ['photo/video', 64], ['rvs & camping', 143],
    ['sporting goods', 577, 'sporting'], ['tickets', 48], ['tools', 694, 'tools'], ['toys & games', 152], ['trailers', 121],
    ['video gaming', 109], ['wanted', 166],
  ],
  housing: [
    ['apartments / housing for rent', 1904, 'apartments'], ['housing swap', 0], ['housing wanted', 58], ['office & commercial', 77],
    ['parking & storage', 112], ['real estate for sale', 296], ['rooms & shares', 488, 'rooms & shares'], ['rooms wanted', 41],
    ['sublets & temporary', 203], ['vacation rentals', 30],
  ],
  jobs: [
    ['accounting/finance', 64], ['admin/office', 88], ['architect/engineer/cad', 31], ['art/media/design', 22], ['biotech/science', 17],
    ['business/mgmt', 46], ['customer service', 93], ['education/teaching', 52], ['et cetera', 40], ['food/beverage/hospitality', 214, 'food & beverage'],
    ['general labor', 187], ['government', 19], ['healthcare', 176], ['human resources', 14], ['legal/paralegal', 11],
    ['manufacturing', 98], ['marketing/advertising/pr', 21], ['nonprofit', 26], ['real estate', 18], ['retail/wholesale', 121],
    ['sales', 102], ['salon/spa/fitness', 34], ['security', 29], ['skilled trades/artisan', 143], ['software/qa/dba/etc', 23],
    ['systems/networking', 12], ['technical support', 19], ['transportation', 158], ['tv/film/video/radio', 0], ['web/html/info design', 9],
    ['writing/editing', 8],
  ],
  services: [
    ['automotive', 214], ['beauty', 96], ['cell phone / mobile', 18], ['computer', 77], ['creative', 64], ['cycle', 21],
    ['event', 88], ['farm & garden', 132], ['financial', 29], ['health/wellness', 47], ['household', 301],
    ['labor/hauling/moving', 388], ['legal', 15], ['lessons & tutoring', 102], ['marine', 0], ['pet', 54],
    ['real estate', 26], ['skilled trade', 343], ['small biz ads', 71], ['snow removal', 120, 'snow removal'], ['travel/vacation', 11],
    ['writing/editing/translation', 18],
  ],
  gigs: [
    ['computer', 38], ['creative', 71], ['crew', 22], ['domestic', 64], ['event', 59], ['labor', 168, 'labor'], ['talent', 27], ['writing', 17],
  ],
  community: [
    ['activities', 92], ['artists', 41], ['childcare', 63], ['classes', 77], ['events', 148, 'events'], ['general', 104],
    ['groups', 58], ['local news', 12], ['lost & found', 66], ['missed connections', 81], ['musicians', 74], ['pets', 102],
    ['politics', 18], ['rants & raves', 39], ['rideshare', 23], ['volunteers', 34],
  ],
}

// Subcategories with nothing in the Minneapolis area right now: where the nearest
// listings are (other craigslist cities) and related places to look.
export const zeroLocal = {
  aviation: { nearest: [['st. cloud', 62, 3], ['rochester', 80, 2], ['duluth', 150, 4]], related: ['boats', 'rvs & camping', 'sporting goods'], thing: 'aviation gear' },
  'housing swap': { nearest: [['st. cloud', 62, 1], ['madison, wi', 270, 4]], related: ['sublets & temporary', 'vacation rentals', 'rooms & shares'], thing: 'a place to swap' },
  'tv/film/video/radio': { nearest: [['rochester', 80, 1], ['duluth', 150, 2]], related: ['art/media/design', 'writing/editing', 'marketing/advertising/pr'], thing: 'a job like this' },
  marine: { nearest: [['duluth', 150, 6], ['brainerd', 128, 3]], related: ['automotive', 'skilled trade', 'cycle'], thing: 'marine services' },
}

export const taxonomy = Object.fromEntries(Object.entries(raw).map(([sec, subs]) =>
  [sec, subs.map(([name, count, key]) => ({
    name, count, key: key || (zeroLocal[name] ? name : null), zero: !!zeroLocal[name],
    fresh: count ? Math.max(1, Math.round(count * 0.09)) : 0,
  }))]))

// What Minneapolis is looking for in each section this week (mid-October).
export const trendingBySection = {
  sale: ['snowblower', 'snow tires', 'fat bike', 'firewood', 'halloween costume'],
  housing: ['1br northeast', 'nov 1 move-in', 'heat included', 'garage parking'],
  jobs: ['line cook', 'seasonal retail', 'snow plow driver', 'warehouse'],
  services: ['snow removal', 'gutter cleaning', 'furnace tune-up', 'movers'],
  gigs: ['moving help', 'leaf raking', 'halloween party', 'dog walking'],
  community: ['halloween events', 'lost dog', 'bike tune-up clinic', 'volunteer'],
}
