import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Link, NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout, setUser } from './store.js'
import Auth from './pages/Auth.jsx'
import EmployeeDashboard from './pages/EmployeeDashboard.jsx'
import ManagerDashboard from './pages/ManagerDashboard.jsx'
import AttendanceHistory from './pages/AttendanceHistory.jsx'
import MarkAttendance from './pages/MarkAttendance.jsx'
import Profile from './pages/Profile.jsx'
import ManagerAttendance from './pages/ManagerAttendance.jsx'
import TeamCalendar from './pages/TeamCalendar.jsx'
import Reports from './pages/Reports.jsx'
import { setAuthToken, api } from './api.js'
import { useEffect } from 'react'
import CritterField from './components/CritterField.jsx'

const Guard = ({ children, role }) => {
  const { token, user } = useSelector(s => s.auth)
  if (!token) return <Navigate to="/login" replace />
  if (role && user?.role !== role) return <Navigate to="/" replace />
  return children
}

const Nav = () => {
  const { user } = useSelector(s => s.auth)
  const d = useDispatch()
  return (
    <nav className="nav brand-nav">
      <div className="brand">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2"/><path d="M12 7v5l4 2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/></svg>
        <span>Employee Attendance</span>
      </div>
      <div className="menu">
        <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
        {user?.role === 'manager' && <NavLink to="/manager/attendance" className={({isActive}) => isActive ? 'active' : ''}>All Attendance</NavLink>}
        {user?.role === 'manager' && <NavLink to="/manager/reports" className={({isActive}) => isActive ? 'active' : ''}>Reports</NavLink>}
        <NavLink to="/profile" className={({isActive}) => isActive ? 'active' : ''}>Profile</NavLink>
        <button className="link" onClick={() => { d(logout()); setAuthToken(null) }}>Logout</button>
      </div>
    </nav>
  )
}

export default function App() {
  const { token } = useSelector(s => s.auth)
  const d = useDispatch()
  useEffect(() => {
    if (token) {
      setAuthToken(token)
      api.get('/auth/me').then(r => d(setUser(r.data))).catch(() => {})
    }
  }, [token, d])
  return (
    <BrowserRouter>
      <CritterField />
      {token && <Nav />}
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/" element={<Guard><EmployeeDashboard /></Guard>} />
        <Route path="/manager" element={<Guard role="manager"><ManagerDashboard /></Guard>} />
        <Route path="/manager/attendance" element={<Guard role="manager"><ManagerAttendance /></Guard>} />
        <Route path="/manager/calendar" element={<Guard role="manager"><TeamCalendar /></Guard>} />
        <Route path="/manager/reports" element={<Guard role="manager"><Reports /></Guard>} />
        <Route path="/history" element={<Guard><AttendanceHistory /></Guard>} />
        <Route path="/mark" element={<Guard><MarkAttendance /></Guard>} />
        <Route path="/profile" element={<Guard><Profile /></Guard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
