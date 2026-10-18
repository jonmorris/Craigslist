// Mock detail content for listings: specs, descriptions, seller context,
// and typical price ranges per subcategory (from the price histogram data).

const DETAILS = {
  1: { specs: [['condition', 'like new'], ['frame size', '54 cm'], ['type', 'gravel / touring'], ['make', 'surly'], ['brakes', 'mechanical disc']],
    desc: 'bought this spring, maybe 200 miles on it. moving to a place without storage so it has to go. new bar tape, tubeless-ready wheels. happy to let you ride it around the block.' },
  2: { specs: [['condition', 'good'], ['make', 'toro'], ['model', 'power max 824 oe'], ['width', '24 in'], ['start', 'electric + pull']],
    desc: 'two-stage, throws snow across the street. starts first pull every time, electric start too. selling because we hired a service. come see it run before you buy.' },
  3: { specs: [['condition', 'good'], ['frame', 'step-over'], ['speeds', '7'], ['make', 'electra'], ['color', 'blue']],
    desc: 'comfy cruiser, flat-foot design so you can put both feet down at stops. a little rust on the chain, otherwise great. includes rear rack.' },
  4: { specs: [['bedrooms', '1'], ['size', '650 ft²'], ['available', 'oct 1'], ['laundry', 'in building'], ['pets', 'cats ok']],
    desc: 'upper unit in a quiet fourplex near the arts district. heat and water included. hardwood floors, big windows, off-street parking. 12-month lease.' },
  5: { specs: [['condition', 'good'], ['material', 'walnut veneer'], ['size', '60 × 18 × 31 in'], ['drawers', '6']],
    desc: 'classic mid-century lines, dovetail drawers, a few light scratches on top (see photos). you pick up, it needs two people.' },
  6: { specs: [['condition', 'excellent'], ['frame size', '56 cm'], ['type', 'time trial'], ['group', 'campagnolo'], ['material', 'carbon']],
    desc: 'raced two seasons, always stored inside. deep-section wheels included. no crashes. fit kit receipts available.' },
  8: { specs: [['condition', 'excellent'], ['frame size', '56 cm'], ['wheels', '650b'], ['make', 'surly'], ['extras', 'rack + basket']],
    desc: 'great city bike. comes with the front rack and basket, fenders, and a kickstand. tires are a month old.' },
  10: { specs: [['condition', 'good'], ['frame size', '58 cm'], ['type', 'road'], ['make', 'trek'], ['material', 'carbon']],
    desc: 'vintage 5200, the one lance raced. shifts clean, new cables. some paint chips, it is from the 90s.' },
  12: { specs: [['condition', 'excellent'], ['frame size', '19 in'], ['type', 'fat bike'], ['make', 'surly'], ['brakes', 'mechanical disc']],
    desc: 'original moonlander with offset clown shoe wheels. barely used, lived in storage most of its life. standard threaded bottom bracket. perfect for the winter that is coming.' },
  14: { specs: [['condition', 'good'], ['wheels', '29 in'], ['type', 'mountain'], ['make', 'fuji'], ['brakes', 'hydraulic disc']],
    desc: 'solid trail bike, recently tuned. dropper post not included. test rides welcome in Bloomington.' },
  16: { specs: [['condition', 'new'], ['type', 'cruiser'], ['speeds', '1'], ['make', 'haro']],
    desc: 'new old stock from our shop floor. assembled and tuned. mens and womens frames available.' },
  17: { specs: [['condition', 'fair'], ['type', 'kids / chopper'], ['make', 'schwinn'], ['quantity', '3']],
    desc: 'three stingray choppers, kids outgrew them. need new tubes. $50 for all three.' },
  19: { specs: [['condition', 'good'], ['size', 'medium'], ['type', 'frame only'], ['make', 'surly']],
    desc: 'karate monkey frame and fork, ready for a build. some cosmetic wear on the chainstay.' },
  21: { specs: [['condition', 'good'], ['size', '82 in'], ['color', 'dove gray'], ['make', 'west elm']],
    desc: 'no pets, no smoking. cushions are a little soft. we have a truck if you need help getting it home for a few bucks.' },
}

const FALLBACK = {
  sale: { specs: [['condition', 'good']], desc: 'works great, just do not need it anymore. cash or venmo, pickup only.' },
  housing: { specs: [['available', 'nov 1']], desc: 'message for a showing. no smoking.' },
  jobs: { specs: [['type', 'part-time'], ['schedule', 'evenings + weekends']], desc: 'busy kitchen on eat street looking for a reliable line cook. experience preferred, we will train the right person.' },
  gigs: { specs: [['when', 'saturday 9am'], ['time', 'about 2 hrs']], desc: 'need two people to help carry a sectional up to a second floor. easy cash.' },
  services: { specs: [['area', 'South Minneapolis']], desc: 'licensed and insured. seasonal contracts or per visit.' },
  community: { specs: [['when', 'saturday 10–2']], desc: 'bring your bike, we will help you get it ready for winter. free, donations welcome.' },
}

// Seller context, deterministic per listing.
export function sellerFor(l) {
  if (l.mine) return { kind: 'you', since: 2026, other: 0, verified: true }
  if (l.dealer) return { kind: 'dealer', name: l.seller, since: 2014, other: 14, verified: true }
  const years = [2019, 2016, 2021, 2012, 2018]
  return { kind: 'owner', since: years[l.id % years.length], other: (l.id * 7) % 5, verified: l.id % 3 !== 0 }
}

export const detailFor = l => DETAILS[l.id] || FALLBACK[l.section] || FALLBACK.sale
export const setDetail = (id, d) => { DETAILS[id] = d }
