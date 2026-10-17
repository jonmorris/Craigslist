import React, { useState } from 'react'
import { REGIONS, NEIGHBORHOODS, RADII } from '../area.js'
import { Icon, Sheet } from '../ui.jsx'

// Shared area controls (regions, neighborhoods, distance), used by the list's area
// sheet and the Home location picker. Controlled: value = { places, radius }.
export default function AreaControls({ value, onChange }) {
  const { places, radius } = value
  const set = patch => onChange({ ...value, ...patch })
  const toggle = p => set({ places: places.includes(p) ? places.filter(x => x !== p) : [...places, p] })
  const chip = (p, label = p) => (
    <button key={p} type="button" className={'chip' + (places.includes(p) ? ' chip-on' : '')} aria-pressed={places.includes(p)} onClick={() => toggle(p)}>
      {places.includes(p) && <Icon name="check" size={18} />}{label}
    </button>
  )
  return (
    <>
      <div className="presets">
        <button type="button" className={'chip' + (!places.length ? ' chip-on' : '')} onClick={() => set({ places: [] })}>
          {!places.length && <Icon name="check" size={18} />}all areas
        </button>
        {Object.keys(REGIONS).map(r => chip(r, r === 'suburbs' ? 'the suburbs' : `all of ${r}`))}
      </div>
      <p className="area-label">neighborhoods</p>
      <div className="presets">{NEIGHBORHOODS.map(h => chip(h))}</div>
      <p className="area-label">distance from you</p>
      <div className="segmented" role="radiogroup" aria-label="distance">
        {RADII.map(r => (
          <button key={String(r)} type="button" role="radio" aria-checked={radius === r} className={radius === r ? 'seg-on' : ''} onClick={() => set({ radius: r })}>
            {radius === r && <Icon name="check" size={18} />}{r == null ? 'any' : `${r} mi`}
          </button>
        ))}
      </div>
    </>
  )
}

// Area: regions and neighborhoods (multi-select) plus distance from you, with a live count.
export function AreaSheet({ area, countFor, onClose, onApply }) {
  const [next, setNext] = useState(area)
  const n = countFor(next)
  return (
    <Sheet title="area" onClose={onClose} footer={
      <button type="button" className="btn-primary" onClick={() => onApply(next)}>{n === 0 ? 'show this area anyway' : `show ${n} listing${n === 1 ? '' : 's'}`}</button>
    }>
      <AreaControls value={next} onChange={setNext} />
      {n === 0 && <p className="area-zero" role="status"><Icon name="pin" size={18} />nothing here yet. a bigger distance or nearby neighborhood should help.</p>}
    </Sheet>
  )
}

