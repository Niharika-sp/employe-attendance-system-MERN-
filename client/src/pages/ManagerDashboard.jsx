import { useEffect, useState } from 'react'
import { api } from '../api.js'
import StatCard from '../components/StatCard.jsx'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts'
import Loader from '../components/Loader.jsx'

export default function ManagerDashboard() {
  const [data, setData] = useState(null)
  useEffect(() => {
    api.get('/dashboard/manager').then(r => setData(r.data))
  }, [])
  if (!data) return <div className="pad"><Loader /></div>
  return (
    <div className="pad">
      <h2>Manager Dashboard</h2>
      <div className="grid cols-4">
        <StatCard title="Total Employees" value={data.totalEmployees} />
        <StatCard title="Present Today" value={data.today.present} />
        <StatCard title="Absent Today" value={data.today.absent} />
        <StatCard title="Late Today" value={data.today.late} />
      </div>
      <h3>Weekly</h3>
      <div style={{ height: 280, background: '#fff', borderRadius: 12, padding: 10, border: '1px solid #e5e7eb' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.weekly.map(w => ({ date: new Date(w.date).toLocaleDateString(), count: w.count }))}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <h3>Department</h3>
      <div style={{ height: 280, background: '#fff', borderRadius: 12, padding: 10, border: '1px solid #e5e7eb' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data.department} dataKey="count" nameKey="name" outerRadius={100} label>
              {data.department.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6"][index % 5]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <h3>Absent List</h3>
      <ul>
        {data.absentList.map(a => (
          <li key={a._id}>{a.employeeId} {a.name} {a.department}</li>
        ))}
      </ul>
    </div>
  )
}
