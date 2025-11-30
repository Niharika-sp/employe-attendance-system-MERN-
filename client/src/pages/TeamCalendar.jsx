import { useEffect, useState } from 'react'
import { api } from '../api.js'

export default function TeamCalendar() {
  const [employeeId, setEmployeeId] = useState('')
  const [items, setItems] = useState([])

  const load = async () => {
    if (!employeeId) return
    const user = await api.get('/attendance/all', { params: { employeeId } })
    setItems(user.data.items)
  }

  useEffect(() => { /* initial no-op */ }, [])

  return (
    <div className="pad">
      <h2>Team Calendar</h2>
      <div className="row">
        <input placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
        <button onClick={load}>Load</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i._id}>
              <td>{new Date(i.date).toLocaleDateString()}</td>
              <td>{i.status}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={2} style={{ textAlign: 'center', color: '#6b7280' }}>
                {employeeId ? 'No records found for this employee.' : 'Enter an Employee ID and click Load.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
