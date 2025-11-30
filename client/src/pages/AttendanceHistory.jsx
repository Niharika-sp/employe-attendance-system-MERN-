import { useEffect, useState, useCallback } from 'react'
import { api } from '../api.js'
import Calendar from '../components/Calendar.jsx'
import Loader from '../components/Loader.jsx'

const color = (s) => {
  if (s === 'present') return 'green'
  if (s === 'absent') return 'red'
  if (s === 'late') return 'yellow'
  if (s === 'half-day') return 'orange'
  return 'gray'
}

export default function AttendanceHistory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const load = useCallback(async () => {
    setLoading(true)
    const r = await api.get('/attendance/my-history', { params: { month, year } })
    setItems(r.data.items)
    setLoading(false)
  }, [month, year])
  useEffect(() => { setTimeout(load, 0) }, [load])
  return (
    <div className="pad">
      <h2>My Attendance</h2>
      <div className="row" style={{ marginBottom: 12 }}>
        <select value={month} onChange={e => setMonth(parseInt(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input type="number" value={year} onChange={e => setYear(parseInt(e.target.value))} />
      </div>
      {loading ? <Loader /> : <Calendar items={items} year={year} month={month - 1} />}
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
            <th>Check-In</th>
            <th>Check-Out</th>
            <th>Total Hours</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i._id}>
              <td>{new Date(i.date).toLocaleDateString()}</td>
              <td><span className={`tag ${color(i.status)}`}>{i.status}</span></td>
              <td>{i.checkInTime ? new Date(i.checkInTime).toLocaleTimeString() : ''}</td>
              <td>{i.checkOutTime ? new Date(i.checkOutTime).toLocaleTimeString() : ''}</td>
              <td>{i.totalHours ?? ''}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', color: '#6b7280' }}>
                No attendance records for {month}/{year}. Mark your attendance to see it here.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
