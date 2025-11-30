import { api } from '../api.js'
import { useEffect, useState } from 'react'
import Loader from '../components/Loader.jsx'

export default function MarkAttendance() {
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [today, setToday] = useState(null)
  const load = async () => {
    setLoading(true)
    try { const r = await api.get('/attendance/today'); setToday(r.data) } catch { setToday(null) }
    setLoading(false)
  }
  useEffect(() => { setTimeout(load, 0) }, [])
  const checkin = async () => {
    setMsg('')
    try { await api.post('/attendance/checkin'); setMsg('Checked in'); load() } catch { setMsg('Already checked in') }
  }
  const checkout = async () => {
    setMsg('')
    try { await api.post('/attendance/checkout'); setMsg('Checked out'); load() } catch { setMsg('Not checked in') }
  }
  return (
    <div className="center">
      <h2>Mark Attendance</h2>
      {loading ? <Loader /> : (
        <div className="row">
          {!today?.checkedIn && <button onClick={checkin}>Check-In</button>}
          {today?.checkedIn && !today?.checkedOut && <button onClick={checkout}>Check-Out</button>}
          {today?.checkedIn && today?.checkedOut && <div className="info">Done for today</div>}
        </div>
      )}
      {msg && <div className="info" style={{ marginTop: 10 }}>{msg}</div>}
    </div>
  )
}
