import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setToken } from '../store.js'
import { api, setAuthToken } from '../api.js'
import { Link, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { token } = useSelector(s => s.auth)
  const d = useDispatch()
  if (token) return <Navigate to="/" replace />
  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const r = await api.post('/auth/login', { email, password })
      d(setToken(r.data.token))
      setAuthToken(r.data.token)
    } catch (err) {
      const msg = err?.response?.data?.error || 'Invalid credentials'
      setError(msg)
    }
  }
  return (
    <div className="center page" style={{ position: 'relative', overflow: 'hidden' }}>
      <h2>Login</h2>
      <form onSubmit={submit} className="form">
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
        {error && <div className="error">{error}</div>}
      </form>
      <div><Link to="/register">Register</Link></div>
    </div>
  )
}
