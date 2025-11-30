import { useSelector } from 'react-redux'

const Icon = ({ children }) => <span style={{ position: 'absolute', left: 10, top: 10 }}>{children}</span>
const Field = ({ label, value, icon }) => (
  <div>
    <label>{label}</label>
    <div className="input-wrap">
      <span className="icon">{icon}</span>
      <input value={value || ''} readOnly />
    </div>
  </div>
)

export default function Profile() {
  const { user } = useSelector(s => s.auth)
  if (!user) return null
  return (
    <div className="page">
      <div className="center" style={{ maxWidth: 860 }}>
        <h2>My Profile</h2>
        <div style={{ color: '#6b7280', marginTop: 4 }}>Manage your personal information</div>
        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 12, color: '#6b7280', fontWeight: 600 }}>Profile Information</div>
          <div className="grid cols-1">
            <Field label="Full Name" value={user.name} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" fill="#6b7280"/></svg>} />
            <Field label="Email" value={user.email} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm0 2 8 5 8-5" stroke="#6b7280" strokeWidth="2"/></svg>} />
            <Field label="Employee ID" value={user.employeeId} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 5h16v14H4z" stroke="#6b7280" strokeWidth="2"/><path d="M6 9h8" stroke="#6b7280" strokeWidth="2"/></svg>} />
            <Field label="Department" value={user.department} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 20h18M6 16h12M9 12h6M12 8h0" stroke="#6b7280" strokeWidth="2"/></svg>} />
            <Field label="Role" value={user.role} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 6-9 6-9-6 9-6Z" stroke="#6b7280" strokeWidth="2"/></svg>} />
          </div>
          <button className="button btn-primary" style={{ marginTop: 16 }}>Edit Profile</button>
        </div>
      </div>
    </div>
  )
}
