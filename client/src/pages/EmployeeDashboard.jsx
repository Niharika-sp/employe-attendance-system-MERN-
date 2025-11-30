import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'
import StatCard from '../components/StatCard.jsx'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import Loader from '../components/Loader.jsx'

export default function EmployeeDashboard() {
  const [data, setData] = useState(null)
  useEffect(() => {
    api.get('/dashboard/employee').then(r => setData(r.data))
  }, [])
  if (!data) return <div className="pad"><Loader /></div>
  const ci = data.today?.checkInTime ? new Date(data.today.checkInTime) : null
  const co = data.today?.checkOutTime ? new Date(data.today.checkOutTime) : null
  const diffMs = ci && co ? co - ci : 0
  const hoursDec = (diffMs / 3600000).toFixed(2)
  const hoursHM = (() => { const t = Math.floor(diffMs / 60000); const h = Math.floor(t / 60); const m = t % 60; return `${h}h ${String(m).padStart(2,'0')}m` })()
  const isLateToday = (() => { if (!ci) return false; const h = ci.getHours(); const m = ci.getMinutes(); return h > 9 || (h === 9 && m > 0) })()
  return (
    <div className="pad">
      <h2>Employee Dashboard</h2>
      <div className="grid cols-4">
        <StatCard
          title="Today"
          value={data.today.checkedIn ? 'Checked In' : 'Not Checked In'}
          compact
          sub={`Check-In: ${data.today?.checkInTime ? new Date(data.today.checkInTime).toLocaleTimeString() : '-'} · Check-Out: ${data.today?.checkOutTime ? new Date(data.today.checkOutTime).toLocaleTimeString() : '-'}`}
          icon={data.today.checkedIn ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6l-11 11-5-5" stroke="#10b981" strokeWidth="2"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#ef4444" strokeWidth="2"/></svg>
          )}
        />
        <StatCard title="Present" value={data.present} compact icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 6l-11 11-5-5" stroke="#10b981" strokeWidth="2"/></svg>} />
        <StatCard title="Late" value={isLateToday ? 'Late' : 'On Time'} sub={ci ? `Arrived at ${ci.toLocaleTimeString()}` : 'No check-in'} compact icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l10 18H2L12 2Z" stroke="#f59e0b" strokeWidth="2"/></svg>} />
        <StatCard title="Total Hours" value={hoursDec} sub={hoursHM} compact icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2"/><path d="M12 7v5l4 2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/></svg>} />
      </div>
      <div className="row">
        <Link className="button" to="/mark">Quick Check-In/Out</Link>
        <Link className="button secondary" to="/history">My Attendance</Link>
      </div>
      <h3>Recent</h3>
      <div style={{ height: 260, background: '#fff', borderRadius: 12, padding: 10, border: '1px solid #e5e7eb' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.recent.map(r => ({ date: new Date(r.date).toLocaleDateString(), value: r.totalHours || (r.checkInTime && r.checkOutTime ? 1 : 0) }))}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
