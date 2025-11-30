import { useEffect, useState } from 'react'

const Cat = () => (
  <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
    <circle cx="6" cy="8" r="4" fill="#f59e0b" />
    <rect x="10" y="6" width="12" height="6" rx="3" fill="#f59e0b" />
    <circle cx="20" cy="9" r="2" fill="#111827" />
    <circle cx="13" cy="9" r="1" fill="#111827" />
    <circle cx="9" cy="9" r="1" fill="#111827" />
    <path d="M4 4 L6 6 L3 6 Z" fill="#f59e0b" />
    <path d="M8 4 L6 6 L9 6 Z" fill="#f59e0b" />
  </svg>
)

const Dog = () => (
  <svg width="28" height="18" viewBox="0 0 28 18" fill="none">
    <rect x="4" y="6" width="16" height="6" rx="3" fill="#10b981" />
    <circle cx="20" cy="9" r="3" fill="#10b981" />
    <circle cx="22" cy="7" r="2" fill="#10b981" />
    <circle cx="15" cy="9" r="1.3" fill="#111827" />
    <circle cx="11" cy="9" r="1.3" fill="#111827" />
  </svg>
)

export default function CritterField() {
  const [critters] = useState([
    { id: 1, top: '12%', right: false, dur: '38s', type: 'cat' },
    { id: 2, top: '28%', right: true, dur: '42s', type: 'dog' },
    { id: 3, top: '55%', right: false, dur: '36s', type: 'dog' },
    { id: 4, top: '70%', right: true, dur: '48s', type: 'cat' },
    { id: 5, top: '85%', right: false, dur: '44s', type: 'cat' },
  ])
  useEffect(() => {}, [])
  return (
    <div className="critters" aria-hidden>
      {critters.map(c => (
        <div key={c.id} className={`critter ${c.right ? 'walk-right' : 'walk-left'}`} style={{ top: c.top, '--dur': c.dur }}>
          {c.type === 'cat' ? <Cat /> : <Dog />}
        </div>
      ))}
    </div>
  )
}
