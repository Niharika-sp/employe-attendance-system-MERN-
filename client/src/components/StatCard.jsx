export default function StatCard({ title, value, sub, compact, icon }) {
  return (
    <div className={`card${compact ? ' compact' : ''}`}>
      <div className="title">{title}{icon && <span className="icon">{icon}</span>}</div>
      <div className="value">{value}</div>
      {sub && <div className="sub">{sub}</div>}
    </div>
  )
}
