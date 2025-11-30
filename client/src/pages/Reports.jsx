import { useState } from 'react'
import { api } from '../api.js'

export default function Reports() {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [employee, setEmployee] = useState('all')
  const [items, setItems] = useState([])

  const load = async () => {
    const params = {}
    if (dateFrom) params.dateFrom = dateFrom
    if (dateTo) params.dateTo = dateTo
    if (employee && employee !== 'all') params.employee = employee
    const r = await api.get('/attendance/summary', { params })
    setItems([r.data])
  }

  const exportCsv = () => {
    const params = new URLSearchParams()
    if (dateFrom) params.append('dateFrom', dateFrom)
    if (dateTo) params.append('dateTo', dateTo)
    if (employee && employee !== 'all') params.append('employee', employee)
    const url = `${api.defaults.baseURL.replace(/\/$/, '')}/attendance/export?${params.toString()}`
    window.location.href = url
  }

  return (
    <div className="page">
      <div className="pad">
        <h2>Attendance Reports</h2>
        <div style={{ color: '#6b7280', marginBottom: 12 }}>Generate and export attendance reports</div>
        <div className="card">
          <div style={{ marginBottom: 12, fontWeight: 600 }}>Report Configuration</div>
          <div className="grid cols-3">
            <div>
              <label>Start Date</label>
              <div className="input-wrap"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M7 3v4M17 3v4" stroke="#6b7280" strokeWidth="2"/><path d="M3 9h18" stroke="#6b7280" strokeWidth="2"/></svg></span><input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
            </div>
            <div>
              <label>End Date</label>
              <div className="input-wrap"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="16" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M7 3v4M17 3v4" stroke="#6b7280" strokeWidth="2"/><path d="M3 9h18" stroke="#6b7280" strokeWidth="2"/></svg></span><input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
            </div>
            <div>
              <label>Employee</label>
              <div className="input-wrap"><span className="icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="#6b7280"/></svg></span><select value={employee} onChange={e => setEmployee(e.target.value)}><option value="all">All Employees</option></select></div>
            </div>
          </div>
          <div className="row" style={{ marginTop: 16 }}>
            <button className="button" style={{ flex: 1 }} onClick={load}>Generate Report</button>
            <button className="button ghost" onClick={exportCsv}>Export CSV</button>
          </div>
        </div>
        <table className="table" style={{ marginTop: 16 }}>
          <thead>
            <tr><th>Present</th><th>Late</th><th>Half Day</th></tr>
          </thead>
          <tbody>
            {items.map((i, idx) => (
              <tr key={idx}><td>{i.present}</td><td>{i.late}</td><td>{i.halfDay}</td></tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', color: '#6b7280' }}>No report loaded. Set filters and click Generate Report.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
