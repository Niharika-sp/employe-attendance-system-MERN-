import { useState } from 'react'
import { api } from '../api.js'
import { useDispatch } from 'react-redux'
import { setToken } from '../store.js'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState('employee')
  const [error, setError] = useState('')
  const { token } = useSelector(s => s.auth)
  const d = useDispatch()
  if (token) return <Navigate to="/" replace />
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const r = await api.post('/auth/register', { name, email, password, employeeId, department, role })
      d(setToken(r.data.token))
    } catch (err) {
      const msg = err?.response?.data?.error || 'Registration failed'
      setError(msg)
    }
  }
  return (
    <div className="center page" style={{ position: 'relative', overflow: 'hidden' }}>
      <h2>Register</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Employee ID" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
        <input placeholder="Department" value={department} onChange={(e) => setDepartment(e.target.value)} />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button type="submit">Create</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div><Link to="/login">Login</Link></div>
    </div>
  )
}
