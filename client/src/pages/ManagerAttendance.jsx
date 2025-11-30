import { useEffect, useState, useCallback } from 'react'
import { api } from '../api.js'

export default function ManagerAttendance() {
  const [items, setItems] = useState([])
  const [employeeId, setEmployeeId] = useState('')
  const [status, setStatus] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const load = useCallback(async () => {
    const params = {}
    if (employeeId) params.employeeId = employeeId
    if (status) params.status = status
    if (dateFrom) params.dateFrom = dateFrom
    if (dateTo) params.dateTo = dateTo
    const r = await api.get('/attendance/all', { params })
    setItems(r.data.items)
  }, [employeeId, status, dateFrom, dateTo])

  useEffect(() => { setTimeout(load, 0) }, [load])

  return (
    <div className="pad">
      <h2>All Employees Attendance</h2>
      <div className="row">
        <input placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Any Status</option>
          <option value="present">Present</option>
          <option value="late">Late</option>
          <option value="half-day">Half Day</option>
          <option value="absent">Absent</option>
        </select>
        <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
        <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
        <button onClick={load}>Filter</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>User</th>
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
              <td>{i.userId}</td>
              <td>{new Date(i.date).toLocaleDateString()}</td>
              <td>{i.status}</td>
              <td>{i.checkInTime ? new Date(i.checkInTime).toLocaleTimeString() : ''}</td>
              <td>{i.checkOutTime ? new Date(i.checkOutTime).toLocaleTimeString() : ''}</td>
              <td>{i.totalHours ?? ''}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: '#6b7280' }}>
                No attendance records match the current filters.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
