import React, { useRef, useState } from 'react'
import { sections, photoLibrary, priceLabel, fmt, city } from '../data.js'
import { NEIGHBORHOODS } from '../area.js'
import { BIKE_FIELDS, CONDITIONS, emptyPost, missing, typicalFor, EXAMPLE, miFor } from '../posts.js'
import { Icon, Sheet, ListingCard } from '../ui.jsx'

// Post (and edit) flow: a full-screen form in four short steps. Every field works;
// "fill example" drops in a sample bike post for demos. Validation happens on the way,
// and the preview lists anything still missing with a jump back to it.
const STEPS = ['category', 'details', 'where & contact', 'preview']

export default function PostScreen({ draft, onCancel, onPublish }) {
  const editing = !!draft?.id
  const [p, setP] = useState(() => draft ? structuredClone(draft) : emptyPost())
  const [step, setStep] = useState(editing ? 1 : 0)
  const [sheet, setSheet] = useState(null)
  const [tried, setTried] = useState(false)
  const body = useRef(null)
  const set = patch => setP(x => ({ ...x, ...patch }))
  const setAttr = (k, v) => setP(x => ({ ...x, attrs: { ...x.attrs, [k]: x.attrs[k] === v ? undefined : v } }))
  const go = n => { setStep(n); body.current?.closest('.screen')?.scrollTo({ top: 0 }) }
  const dirty = JSON.stringify(p) !== JSON.stringify(draft ?? emptyPost())
  const gaps = missing(p)
  const section = sections.find(s => s.id === p.section)
  const range = typicalFor(p.sub)
  const bikes = p.sub === 'bicycles'

  const close = () => (dirty ? setSheet('discard') : onCancel())
  const next = () => {
    if (step === 1 && (!p.title.trim() || p.price === '')) { setTried(true); return }
    if (step === 2 && !p.hood) { setTried(true); return }
    setTried(false); go(step + 1)
  }

  return (
    <div className="post" ref={body}>
      <header className="cat-bar post-bar">
        <button type="button" className="icon-btn" aria-label={editing ? 'close without saving' : 'discard post'} onClick={close}><Icon name="close" /></button>
        <div className="flex1">
          <h1>{editing ? 'edit post' : 'new post'}</h1>
          <p className="post-step">step {step + 1} of 4 · {STEPS[step]}</p>
        </div>
        {!editing && <button type="button" className="link post-fill" onClick={() => { setP(EXAMPLE(photoLibrary)); go(3) }}><Icon name="sparkle" size={18} />fill example</button>}
      </header>
      <div className="post-progress" aria-hidden="true"><span style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>

      <div className="pad post-body">
        {step === 0 && (
          <>
            <h2 className="post-h">what are you posting?</h2>
            <div className="post-sections" role="radiogroup" aria-label="section">
              {sections.map(s => (
                <button key={s.id} type="button" role="radio" aria-checked={p.section === s.id}
                  className={'post-section tint-' + s.id + (p.section === s.id ? ' on' : '')} onClick={() => set({ section: s.id, sub: s.subs[0] })}>
                  <Icon name={s.icon} />{s.name}
                </button>
              ))}
            </div>
            <h3 className="area-label">category</h3>
            <div className="presets">
              {section.subs.map(sub => (
                <button key={sub} type="button" className={'chip' + (p.sub === sub ? ' chip-on' : '')} aria-pressed={p.sub === sub} onClick={() => set({ sub })}>
                  {p.sub === sub && <Icon name="check" size={18} />}{sub}
                </button>
              ))}
            </div>
            <p className="post-note"><Icon name="tag" size={18} />{p.section === 'sale' && !['cars & trucks'].includes(p.sub)
              ? 'posting for sale by owner is free.' : 'some categories have a small posting fee, shown before you post.'}</p>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="post-h">photos</h2>
            <div className="post-photos">
              {p.photos.map((src, i) => (
                <div key={i} className="post-photo">
                  <img src={src} alt={i === 0 ? 'cover photo' : `photo ${i + 1}`} />
                  {i === 0 && <span className="post-cover">cover</span>}
                  <button type="button" className="post-photo-x" aria-label={`remove photo ${i + 1}`} onClick={() => set({ photos: p.photos.filter((_, k) => k !== i) })}><Icon name="close" size={18} /></button>
                </div>
              ))}
              {p.photos.length < 12 && (
                <button type="button" className="post-photo post-photo-add" onClick={() => setSheet('photos')}>
                  <Icon name="camera" size={28} /><span>{p.photos.length ? 'add more' : 'add photos'}</span>
                </button>
              )}
            </div>
            <p className="post-hint">listings with photos get far more replies. the first one is the cover.</p>

            <label className="tf post-tf" htmlFor="ptitle">
              <input id="ptitle" maxLength={70} value={p.title} placeholder={bikes ? 'e.g. Trek FX 3, 54cm, new tires' : 'what is it?'} onChange={e => set({ title: e.target.value })}
                aria-invalid={tried && !p.title.trim()} />
              <span className="tf-label">title</span>
              <span className="tf-support">{tried && !p.title.trim() ? <em>add a title</em> : 'make, model, size: what people search for'}<span>{p.title.length}/70</span></span>
            </label>

            <label className="tf post-tf post-price" htmlFor="pprice">
              <span className="tf-prefix">$</span>
              <input id="pprice" inputMode="numeric" value={p.price} placeholder="0" onChange={e => set({ price: e.target.value.replace(/\D/g, '').slice(0, 7) })}
                aria-invalid={tried && p.price === ''} />
              <span className="tf-label">price</span>
              <span className="tf-support">{tried && p.price === '' ? <em>add a price, or 0 for free</em> : range ? <span>{p.sub} in {city.name} usually go for <strong>${fmt(range[0])}–${fmt(range[1])}</strong></span> : '0 lists it as free'}</span>
            </label>

            {p.section === 'sale' && (
              <>
                <h3 className="area-label">condition</h3>
                <div className="presets">{CONDITIONS.map(c => <Chip key={c} on={p.condition === c} onClick={() => set({ condition: p.condition === c ? '' : c })}>{c}</Chip>)}</div>
              </>
            )}

            {bikes && (
              <>
                <label className="tf post-tf" htmlFor="pmake">
                  <input id="pmake" value={p.make} placeholder="e.g. Surly" onChange={e => set({ make: e.target.value })} />
                  <span className="tf-label">make</span>
                </label>
                {BIKE_FIELDS.map(([k, label, opts]) => (
                  <React.Fragment key={k}>
                    <h3 className="area-label">{label}</h3>
                    <div className="presets">{opts.map(o => <Chip key={o} on={p.attrs[k] === o} onClick={() => setAttr(k, o)}>{o}</Chip>)}</div>
                  </React.Fragment>
                ))}
                <p className="post-hint">these match the filters buyers use, so your bike shows up when someone filters by size or type.</p>
              </>
            )}

            <label className="tf post-tf" htmlFor="pdesc">
              <textarea id="pdesc" rows={5} value={p.desc} placeholder="condition, what's included, why you're selling, when you can meet" onChange={e => set({ desc: e.target.value })} />
              <span className="tf-label">description</span>
            </label>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="post-h">where is it?</h2>
            <p className="post-hint">buyers see the neighborhood and an approximate area, never your address.</p>
            <div className="presets">{NEIGHBORHOODS.map(h => <Chip key={h} on={p.hood === h} onClick={() => set({ hood: h })}>{h}</Chip>)}</div>
            {tried && !p.hood && <p className="post-error">pick a neighborhood</p>}

            <h2 className="post-h">how should buyers reach you?</h2>
            <div className="radio-list post-radios">
              {[['chat', 'craigslist chat', 'replies come to the chat tab. your number and email stay private'], ['email', 'email relay', 'replies come to your inbox through an anonymous craigslist address']].map(([id, label, sub]) => (
                <button key={id} type="button" role="radio" aria-checked={p.contact === id} className="radio-row" onClick={() => set({ contact: id })}>
                  <span className={'radio' + (p.contact === id ? ' radio-on' : '')} />
                  <span className="sv-text"><strong>{label}</strong><span>{sub}</span></span>
                </button>
              ))}
            </div>
            <button type="button" className="switch-row" role="switch" aria-checked={p.showPhone} onClick={() => set({ showPhone: !p.showPhone })}>
              <Icon name="chat" />
              <span className="switch-text"><strong>also show a phone number</strong><span>off by default; scammers harvest numbers from posts</span></span>
              <span className={'switch' + (p.showPhone ? ' switch-on' : '')}><span /></span>
            </button>
            {p.showPhone && (
              <label className="tf post-tf" htmlFor="pphone">
                <input id="pphone" inputMode="tel" value={p.phone} placeholder="612 555 0100" onChange={e => set({ phone: e.target.value.replace(/[^\d ()-]/g, '') })} />
                <span className="tf-label">phone</span>
              </label>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="post-h">here's how it looks</h2>
            <div className="post-preview">
              <ListingCard listing={{ id: -1, section: p.section, sub: p.sub, title: p.title.trim().toLowerCase() || 'your title', price: p.price === '' ? null : Number(p.price), hood: p.hood || 'your neighborhood', mi: p.hood ? miFor(p.hood) : 0, age: 'just now', photo: p.photos[0], photos: p.photos.length, glyph: 'tag' }} onTap={() => go(1)} />
            </div>
            <dl className="post-summary">
              <Row k="category" v={`${section.name} › ${p.sub}`} onEdit={() => go(0)} />
              <Row k="price" v={p.price === '' ? '—' : priceLabel({ price: Number(p.price) })} onEdit={() => go(1)} />
              <Row k="photos" v={p.photos.length ? `${p.photos.length}` : 'none'} onEdit={() => go(1)} />
              <Row k="details" v={[p.condition, p.make, ...Object.values(p.attrs).filter(Boolean)].filter(Boolean).join(' · ') || '—'} onEdit={() => go(1)} />
              <Row k="where" v={p.hood || '—'} onEdit={() => go(2)} />
              <Row k="replies" v={(p.contact === 'chat' ? 'craigslist chat' : 'email relay') + (p.showPhone && p.phone ? ` · ${p.phone}` : '')} onEdit={() => go(2)} />
            </dl>
            {gaps.length > 0 && <p className="post-error">still needs {gaps.join(', ')}.</p>}
            <p className="post-hint">posts stay up for 30 days. you can edit, mark sold or delete it from your account anytime.</p>
          </>
        )}
      </div>

      <div className="detail-bar post-actions">
        {/* back keeps its slot on step 1 (hidden) so the buttons don't change size between steps */}
        <button type="button" className="btn-tonal post-back" onClick={() => go(step - 1)} disabled={step === 0}
          style={step === 0 ? { visibility: 'hidden' } : undefined} aria-hidden={step === 0 || undefined} tabIndex={step === 0 ? -1 : undefined}>back</button>
        {step < 3
          ? <button type="button" className="btn-primary" onClick={next}>next</button>
          : <button type="button" className="btn-primary" disabled={gaps.length > 0} onClick={() => onPublish(p)}><Icon name={editing ? 'check' : 'plus'} />{editing ? 'save changes' : 'post it'}</button>}
      </div>

      {sheet === 'photos' && <PhotoSheet chosen={p.photos} onClose={() => setSheet(null)} onDone={photos => { set({ photos }); setSheet(null) }} />}
      {sheet === 'discard' && (
        <Sheet title={editing ? 'discard your changes?' : 'discard this post?'} onClose={() => setSheet(null)} footer={
          <div className="facet-foot">
            <button type="button" className="btn-text" onClick={() => setSheet(null)}>keep editing</button>
            <button type="button" className="btn-primary" onClick={onCancel}>discard</button>
          </div>
        }>
          <p className="sheet-note">{editing ? 'your post stays as it was.' : 'nothing has been posted yet.'}</p>
        </Sheet>
      )}
    </div>
  )
}

const Chip = ({ on, onClick, children }) => (
  <button type="button" className={'chip' + (on ? ' chip-on' : '')} aria-pressed={on} onClick={onClick}>{on && <Icon name="check" size={18} />}{children}</button>
)
const Row = ({ k, v, onEdit }) => (
  <div className="post-row"><dt>{k}</dt><dd>{v}</dd><button type="button" className="link" onClick={onEdit}>edit</button></div>
)

// Stand-in for Android's photo picker: pick up to 12, in the order tapped.
function PhotoSheet({ chosen, onClose, onDone }) {
  const [sel, setSel] = useState(chosen)
  const toggle = src => setSel(s => (s.includes(src) ? s.filter(x => x !== src) : s.length < 12 ? [...s, src] : s))
  return (
    <Sheet title="choose photos" onClose={onClose} footer={
      <button type="button" className="btn-primary" onClick={() => onDone(sel)}>{sel.length ? `add ${sel.length} photo${sel.length === 1 ? '' : 's'}` : 'done'}</button>
    }>
      <p className="sheet-note">prototype photos. on a phone this opens Android's photo picker.</p>
      <div className="photo-grid">
        {photoLibrary.map(src => {
          const n = sel.indexOf(src)
          return (
            <button key={src} type="button" className={'photo-pick' + (n >= 0 ? ' on' : '')} aria-pressed={n >= 0} onClick={() => toggle(src)}>
              <img src={src} alt="" />{n >= 0 && <span className="photo-n">{n + 1}</span>}
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}
