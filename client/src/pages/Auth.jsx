import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
import { api, setAuthToken } from '../api.js'
import { setToken } from '../store.js'

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="9" stroke="#3b82f6" strokeWidth="2"/>
    <path d="M12 7v5l4 2" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="#6b7280"/></svg>
)
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5" stroke="#6b7280" strokeWidth="2"/></svg>
)
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="5" y="11" width="14" height="9" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M8 11V8a4 4 0 1 1 8 0v3" stroke="#6b7280" strokeWidth="2"/></svg>
)
const RoleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="7" width="16" height="11" rx="2" stroke="#6b7280" strokeWidth="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="#6b7280" strokeWidth="2"/></svg>
)

export default function Auth() {
  const { token } = useSelector(s => s.auth)
  const d = useDispatch()
  const loc = useLocation()
  const [tab, setTab] = useState(loc.pathname.includes('register') ? 'register' : 'login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('employee')
  const [regErr, setRegErr] = useState('')

  if (token) return <Navigate to="/" replace />

  const doLogin = async (e) => {
    e.preventDefault()
    setLoginErr('')
    try {
      const r = await api.post('/auth/login', { email: loginEmail, password: loginPassword })
      d(setToken(r.data.token))
      setAuthToken(r.data.token)
    } catch (err) {
      const msg = err?.response?.data?.error || 'Invalid credentials'
      setLoginErr(msg)
    }
  }

  const doRegister = async (e) => {
    e.preventDefault()
    setRegErr('')
    try {
      const r = await api.post('/auth/register', { name, email, password, employeeId, department, role })
      d(setToken(r.data.token))
      setAuthToken(r.data.token)
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed'
      setRegErr(msg)
    }
  }

  return (
    <div className="page" style={{ paddingTop: 40 }}>
      <div className="auth-header">
        <ClockIcon />
        <div>
          <div className="auth-title">Employee Attendance</div>
          <div className="auth-sub">Track your attendance and manage your work hours</div>
        </div>
      </div>
      <div className="center auth-card">
        <div className="tabs">
          <button className={`tab ${tab==='login'?'active':''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`tab ${tab==='register'?'active':''}`} onClick={() => setTab('register')}>Register</button>
        </div>
        {tab === 'login' && (
          <form onSubmit={doLogin} className="form">
            <div className="input-wrap"><span className="icon"><MailIcon /></span><span className="inline-label">Username</span><input placeholder="Enter your username" value={loginEmail} onChange={e=>setLoginEmail(e.target.value)} /></div>
            <div className="input-wrap"><span className="icon"><LockIcon /></span><span className="inline-label">Password</span><input type="password" placeholder="Enter your password" value={loginPassword} onChange={e=>setLoginPassword(e.target.value)} /></div>
            <button className="button btn-primary" type="submit">Login</button>
            {loginErr && <div className="error">{loginErr}</div>}
          </form>
        )}
        {tab === 'register' && (
          <form onSubmit={doRegister} className="form">
            <div className="input-wrap"><span className="icon"><UserIcon /></span><span className="inline-label">Full Name</span><input placeholder="Enter your full name" value={name} onChange={e=>setName(e.target.value)} /></div>
            <div className="input-wrap"><span className="icon"><MailIcon /></span><span className="inline-label">Email</span><input placeholder="Enter your email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
            <div className="input-wrap"><span className="icon"><UserIcon /></span><span className="inline-label">Department</span><input placeholder="Enter your department" value={department} onChange={e=>setDepartment(e.target.value)} /></div>
            <div className="input-wrap"><span className="icon"><RoleIcon /></span><span className="inline-label">Register As</span>
              <select value={role} onChange={e=>setRole(e.target.value)}>
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <div className="input-wrap"><span className="icon"><LockIcon /></span><span className="inline-label">Password</span><input type="password" placeholder="Choose a password" value={password} onChange={e=>setPassword(e.target.value)} /></div>
            <div className="input-wrap"><span className="icon"><UserIcon /></span><span className="inline-label">Employee ID</span><input placeholder="e.g. EMP001" value={employeeId} onChange={e=>setEmployeeId(e.target.value)} /></div>
            <button className="button btn-primary" type="submit">Register</button>
            {regErr && <div className="error">{regErr}</div>}
          </form>
        )}
      </div>
    </div>
  )
}
