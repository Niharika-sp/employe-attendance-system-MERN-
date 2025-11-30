import { useMemo } from 'react'

const statusColor = (s) => {
  if (s === 'present') return 'green'
  if (s === 'absent') return 'red'
  if (s === 'late') return 'yellow'
  if (s === 'half-day') return 'orange'
  return 'gray'
}

export default function Calendar({ items = [], year, month }) {
  const byDay = useMemo(() => {
    const map = {}
    for (const i of items) {
      const d = new Date(i.date)
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
      map[key] = i
    }
    return map
  }, [items])
  const first = new Date(year, month, 1)
  const days = new Date(year, month + 1, 0).getDate()
  const leading = first.getDay()
  const cells = []
  for (let i = 0; i < leading; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)
  return (
    <div>
      <div className="legend">
        <div className="item"><span className="tag green">Present</span></div>
        <div className="item"><span className="tag red">Absent</span></div>
        <div className="item"><span className="tag yellow">Late</span></div>
        <div className="item"><span className="tag orange">Half Day</span></div>
      </div>
      <div className="calendar">
        {cells.map((d, idx) => {
          if (!d) return <div key={idx} className="day" />
          const key = `${year}-${month}-${d}`
          const rec = byDay[key]
          return (
            <div key={idx} className="day">
              <div className="date">{d}</div>
              {rec && <span className={`tag ${statusColor(rec.status)}`}>{rec.status}</span>}
            </div>
          )
        })}
      </div>
    </div>
  )
}

