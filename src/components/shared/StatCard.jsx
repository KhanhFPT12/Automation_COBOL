import './StatCard.css'

export default function StatCard({ label, value, sub, color = '#1a73e8', icon }) {
  return (
    <div className="stat-card" style={{ borderTopColor: color }}>
      <div className="stat-card-top">
        <span className="stat-icon" style={{ color }}>{icon}</span>
        <span className="stat-value" style={{ color }}>{value}</span>
      </div>
      <p className="stat-label">{label}</p>
      {sub && <p className="stat-sub">{sub}</p>}
    </div>
  )
}
