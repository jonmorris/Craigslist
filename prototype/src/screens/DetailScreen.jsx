import React, { useRef, useState } from 'react'
import { listings, sections, priceLabel, fmt, city, typicalRange, visible } from '../data.js'
import { detailFor, sellerFor } from '../details.js'
import { Icon, NoPhoto, FairBadge, Sheet, Thumb } from '../ui.jsx'

// (d) Listing detail — photos first, the decision context (price vs typical,
// specs, distance), trust at the moment of contact, one-tap reply.
const money = n => '$' + fmt(n)

export default function DetailScreen({ id, favorites, onToggleFav, onHide, onBack, onOpenListing, onOpenCategory, toast }) {
  const l = listings.find(x => x.id === id)
  const d = detailFor(l)
  const seller = sellerFor(l)
  const section = sections.find(s => s.id === l.section)
  const fav = favorites.has(l.id)
  const [sheet, setSheet] = useState(null)
  const [sent, setSent] = useState(false)
  const similar = visible(listings).filter(x => x.id !== l.id && x.sub === l.sub).slice(0, 6)
  const url = `https://minneapolis.craigslist.org/${l.section}/${79661}${String(l.id).padStart(5, '0')}`
  // Android's system share sheet (with its own copy action) when available; a stand-in elsewhere.
  const share = async () => {
    if (navigator.share) { try { await navigator.share({ title: l.title, text: `${priceLabel(l)} · ${l.title}`, url }); return } catch (e) { if (e.name === 'AbortError') return } }
    setSheet('share')
  }

  return (
    <>
    <div className="detail">
      <Gallery l={l} />
      <div className="detail-actions">
        <button type="button" className="icon-btn on-photo" aria-label="back" onClick={onBack}><Icon name="back" /></button>
        <span className="flex1" />
        <button type="button" className="icon-btn on-photo" aria-label="share" onClick={share}><Icon name="share" /></button>
      </div>

      <div className="pad detail-body">
        <div className="detail-price-row">
          <span className={'detail-price' + (l.price === 0 ? ' price-free' : '')}>{priceLabel(l)}</span>
          <FairBadge fair={l.fair} />
        </div>
        <h1 className="detail-title">{l.title}</h1>
        <p className="detail-meta"><Icon name="pin" size={16} />{l.hood} · {l.mi} mi away · posted {l.age} ago</p>
        <div className="detail-chips">
          <button type="button" className="chip" onClick={() => onOpenCategory(l.section, l.sub)}><Icon name={section.icon} size={18} />{l.sub}</button>
          <span className="chip chip-static">{seller.kind === 'dealer' ? 'dealer' : 'by owner'}</span>
          {l.photos > 0 && <span className="chip chip-static"><Icon name="camera" size={18} />{l.photos} photos</span>}
        </div>

        <FairPrice l={l} />

        <section className="detail-block">
          <h2>details</h2>
          <div className="specs" role="list">
            {d.specs.map(([k, v]) => <div key={k} className="spec" role="listitem"><span className="spec-k">{k}</span><span className="spec-v">{v}</span></div>)}
          </div>
        </section>

        <section className="detail-block">
          <h2>description</h2>
          <p className="desc">{d.desc}</p>
        </section>

        <section className="detail-block">
          <h2>where</h2>
          <div className="map-card">
            <AreaMap />
            <div className="map-text">
              <strong>{l.hood}</strong>
              <span>approximate area · {l.mi} mi from you</span>
              <span>the exact address is only shared if the seller sends it</span>
            </div>
          </div>
        </section>

        <section className="detail-block">
          <h2>{seller.kind === 'dealer' ? 'seller' : 'posted by'}</h2>
          <div className="seller-card">
            <div className="seller-row">
              <span className={'avatar tint-' + l.section}>{seller.kind === 'dealer' ? seller.name[0] : <Icon name="person" />}</span>
              <span className="seller-text">
                <strong>{seller.kind === 'dealer' ? seller.name : 'private seller'}</strong>
                <span>on craigslist since {seller.since}{seller.other > 0 && ` · ${seller.other} other listing${seller.other === 1 ? '' : 's'}`}</span>
              </span>
              {seller.verified && <span className="verified"><Icon name="check" size={16} />phone verified</span>}
            </div>
            <div className="safety">
              <Icon name="shield" />
              <p><strong>meet somewhere public.</strong> many police stations around the metro have safe exchange spots. never pay before you've seen it in person.</p>
            </div>
            <button type="button" className="report-row" onClick={() => setSheet('report')}>
              <Icon name="flag" size={20} /><span>something off? report this listing</span><Icon name="arrow" size={18} />
            </button>
          </div>
        </section>

        {similar.length > 0 && (
          <section className="detail-block">
            <div className="block-head"><h2>similar {l.sub}</h2>
              <button type="button" className="link" onClick={() => onOpenCategory(l.section, l.sub)}>see all</button></div>
            <div className="hscroll similar">
              {similar.map(s => (
                <button key={s.id} type="button" className="mini" onClick={() => onOpenListing(s.id)}>
                  <Thumb listing={s} />
                  <span className="mini-price">{priceLabel(s)}</span>
                  <span className="mini-title">{s.title}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {l.section === 'sale' && (
          <button type="button" className="sell-like" onClick={() => toast('posting flow comes later')}>
            <span className="sell-text"><strong>have {l.sub === 'bicycles' ? 'a bike' : 'one'} to sell?</strong><span>post it free in about two minutes</span></span>
            <Icon name="arrow" />
          </button>
        )}

        <p className="post-foot">post id 79661{String(l.id).padStart(5, '0')}</p>
      </div>
    </div>

      <div className="detail-bar">
        <button type="button" className="btn-tonal-icon" aria-label="hide this listing" onClick={() => onHide(l.id)}>
          <Icon name="hide" />
        </button>
        <button type="button" className="btn-tonal-icon" aria-label={fav ? 'remove from saved' : 'save'} aria-pressed={fav} onClick={() => onToggleFav(l.id)}>
          <Icon name={fav ? 'heart-fill' : 'heart'} />
        </button>
        {sent
          ? <button type="button" className="btn-primary btn-sent" onClick={() => toast('chat comes later')}><Icon name="check" />message sent · open chat</button>
          : <button type="button" className="btn-primary" onClick={() => setSheet('reply')}><Icon name="chat" />message {seller.kind === 'dealer' ? 'dealer' : 'seller'}</button>}
      </div>

      {sheet === 'reply' && <ReplySheet l={l} onClose={() => setSheet(null)} onSend={() => { setSent(true); setSheet(null); toast(`sent · replies show up in chat`) }} />}
      {sheet === 'share' && (
        <Sheet title="share" onClose={() => setSheet(null)}>
          <div className="share-preview">
            <Thumb listing={l} />
            <span className="sv-text"><strong>{priceLabel(l)} · {l.title}</strong><span className="share-url">{url}</span></span>
          </div>
          <button type="button" className="btn-tonal" onClick={() => {
            navigator.clipboard?.writeText(url).then(() => toast('link copied'), () => toast('link copied'))
            setSheet(null)
          }}><Icon name="link" />copy link</button>
          <p className="sheet-note">on a phone this is android's share sheet, with copy, nearby share and your apps.</p>
        </Sheet>
      )}
      {sheet === 'report' && <ReportSheet onClose={() => setSheet(null)} onSubmit={() => { setSheet(null); toast('thanks for flagging it. we\u2019ll take a look') }} />}
    </>
  )
}

function Gallery({ l }) {
  const ref = useRef(null)
  const [i, setI] = useState(0)
  if (!l.photo) return <div className="gallery gallery-empty"><NoPhoto listing={l} big /></div>
  // One stand-in photo per listing: extra slides show it reframed, like detail shots.
  const frames = [
    { objectPosition: '50% 50%' }, { objectPosition: '20% 60%', transform: 'scale(1.6)' },
    { objectPosition: '80% 40%', transform: 'scale(1.8)' }, { objectPosition: '50% 90%', transform: 'scale(1.4)' },
  ].slice(0, Math.min(4, l.photos))
  const onScroll = e => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))
  return (
    <div className="gallery">
      <div className="gallery-track" ref={ref} onScroll={onScroll}>
        {frames.map((st, k) => <div key={k} className="slide"><img src={l.photo} alt={k === 0 ? l.title : ''} style={st} /></div>)}
      </div>
      <span className="gallery-count">{i + 1} / {l.photos}</span>
      {frames.length > 1 && <div className="dots" aria-hidden="true">{frames.map((_, k) => <span key={k} className={k === i ? 'on' : ''} />)}</div>}
    </div>
  )
}

function FairPrice({ l }) {
  const r = typicalRange[l.sub]
  if (!r || !l.price) return null
  const lo = 0, hi = Math.max(r[1] * 1.6, l.price * 1.1)
  const pct = v => `${Math.min(100, (v / hi) * 100)}%`
  const verdict = l.fair === 'typical' ? 'within' : l.fair
  return (
    <section className={'fair-card fair-card-' + verdict}>
      <div className="fair-head"><Icon name="tag" size={20} /><strong>{verdict === 'within' ? 'typical price' : verdict + ' typical'}</strong></div>
      <div className="range" aria-hidden="true">
        <span className="range-band" style={{ left: pct(r[0]), width: `calc(${pct(r[1])} - ${pct(r[0])})` }} />
        <span className="range-dot" style={{ left: pct(l.price) }} />
      </div>
      <div className="range-axis"><span>{money(lo)}</span><span style={{ left: pct(r[0]) }}>{money(r[0])}</span><span style={{ left: pct(r[1]) }}>{money(r[1])}</span></div>
      <p>{l.sub} in {city.name} usually go for <strong>{money(r[0])}–{money(r[1])}{l.per ? '/' + l.per : ''}</strong>. this one is {priceLabel(l)}.</p>
    </section>
  )
}

// Stylized, privacy-first area map: a soft circle, never a pin.
function AreaMap() {
  return (
    <svg className="area-map" viewBox="0 0 320 140" role="img" aria-label="approximate area map">
      <rect width="320" height="140" className="map-bg" />
      <path d="M0 40 L320 28 M0 98 L320 112 M70 0 L84 140 M190 0 L176 140 M260 0 L282 140" className="map-road" />
      <path d="M0 70 C80 60 120 90 200 72 S300 60 320 66" className="map-river" />
      <circle cx="150" cy="72" r="44" className="map-area" />
      <circle cx="150" cy="72" r="5" className="map-center" />
    </svg>
  )
}

function ReportSheet({ onClose, onSubmit }) {
  const reasons = ['looks like a scam', 'prohibited item', 'already sold or not available', 'wrong category', 'offensive or inappropriate']
  const [why, setWhy] = useState(null)
  return (
    <Sheet title="report this listing" onClose={onClose} footer={
      <button type="button" className="btn-primary" disabled={!why} onClick={onSubmit}>send report</button>
    }>
      <p className="sheet-note">reports are anonymous. the seller won't know it was you.</p>
      <div className="radio-list">
        {reasons.map(r => (
          <button key={r} type="button" role="radio" aria-checked={why === r} className="radio-row" onClick={() => setWhy(r)}>
            <span className={'radio' + (why === r ? ' radio-on' : '')} />{r}
          </button>
        ))}
      </div>
    </Sheet>
  )
}

function ReplySheet({ l, onClose, onSend }) {
  const offer = l.price ? '$' + fmt(Math.round((l.price * 0.85) / 5) * 5) : null
  const quick = ['is this still available?', 'can i see it today?', offer && `would you take ${offer}?`].filter(Boolean)
  const [msg, setMsg] = useState(quick[0])
  const [via, setVia] = useState('chat')
  return (
    <Sheet title="message seller" onClose={onClose} footer={
      <button type="button" className="btn-primary" disabled={!msg.trim()} onClick={onSend}>send message</button>
    }>
      <div className="presets">
        {quick.map(q => <button key={q} type="button" className={'chip' + (msg === q ? ' chip-on' : '')} onClick={() => setMsg(q)}>{msg === q && <Icon name="check" size={18} />}{q}</button>)}
      </div>
      <label className="tf" htmlFor="msg">
        <textarea id="msg" rows={3} value={msg} onChange={e => setMsg(e.target.value)} />
        <span className="tf-label">message</span>
      </label>
      <div className="radio-list">
        {[['chat', 'craigslist chat', 'your phone number and email stay private'], ['email', 'email relay', 'replies come to your inbox, address hidden'], ['call', 'call or text', 'the seller didn’t share a number']].map(([id, label, note]) => (
          <button key={id} type="button" role="radio" aria-checked={via === id} disabled={id === 'call'} className="radio-row radio-row-2" onClick={() => setVia(id)}>
            <span className={'radio' + (via === id ? ' radio-on' : '')} />
            <span className="radio-text"><span>{label}</span><span>{note}</span></span>
          </button>
        ))}
      </div>
    </Sheet>
  )
}
