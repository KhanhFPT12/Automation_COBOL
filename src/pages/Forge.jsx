import PageHeader from '../components/shared/PageHeader'
import StatCard from '../components/shared/StatCard'
import './Forge.css'

const stats = [
  { label: 'Total Builds', value: '38',  color: '#1a73e8', icon: '⚒' },
  { label: 'Successful',   value: '31',  color: '#34a853', icon: '✔' },
  { label: 'Failed',       value: '5',   color: '#ea4335', icon: '✖' },
  { label: 'In Progress',  value: '2',   color: '#fbbc04', icon: '⟳' },
]

const builds = [
  { id: '#038', branch: 'main',    trigger: 'Manual',   duration: '3m 12s', status: 'Success',     time: '18/05/2026 10:31', artifacts: 'logic.jar' },
  { id: '#037', branch: 'main',    trigger: 'Push',     duration: '3m 45s', status: 'Success',     time: '18/05/2026 09:14', artifacts: 'logic.jar' },
  { id: '#036', branch: 'feature/data-mig', trigger: 'Push', duration: '2m 58s', status: 'Failed', time: '17/05/2026 16:22', artifacts: '—' },
  { id: '#035', branch: 'main',    trigger: 'Schedule', duration: '3m 30s', status: 'Success',     time: '17/05/2026 08:00', artifacts: 'logic.jar' },
  { id: '#034', branch: 'feature/re-eng',   trigger: 'Push', duration: '—',      status: 'Running', time: '17/05/2026 07:55', artifacts: '—' },
  { id: '#033', branch: 'main',    trigger: 'Manual',   duration: '4m 01s', status: 'Success',     time: '16/05/2026 17:30', artifacts: 'logic.jar' },
]

const statusColor   = { Success: '#34a853', Failed: '#ea4335', Running: '#1a73e8', Cancelled: '#9ca3af' }
const statusBgColor = { Success: '#f0fdf4', Failed: '#fef2f2', Running: '#eff6ff', Cancelled: '#f3f4f6' }

export default function Forge() {
  return (
    <div className="page">
      <PageHeader
        title="Forge"
        subtitle="Build history and artifact management"
        actions={
          <>
            <button className="btn-secondary">⚙ Build Settings</button>
            <button className="btn-primary">⚒ Trigger Build</button>
          </>
        }
      />

      <div className="stat-row">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card forge-latest">
        <div className="forge-latest-header">
          <div>
            <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 4 }}>Latest Build</p>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e' }}>Build #038 — main</h3>
          </div>
          <span className="badge" style={{ color: '#34a853', background: '#f0fdf4', fontSize: 13, padding: '5px 14px' }}>✔ Success</span>
        </div>
        <div className="forge-meta">
          <span>⏱ 3m 12s</span>
          <span>📅 18/05/2026 10:31</span>
          <span>👤 khanhng</span>
          <span>📦 logic.jar (2.4 MB)</span>
        </div>
        <div className="forge-log">
          <p className="log-line">[10:28:01] ✔ Maven clean</p>
          <p className="log-line">[10:28:04] ✔ Compile sources (248 files)</p>
          <p className="log-line">[10:29:48] ✔ Run tests (124 passed, 0 failed)</p>
          <p className="log-line">[10:30:55] ✔ Package JAR → target/logic.jar</p>
          <p className="log-line success">[10:31:13] ✔ BUILD SUCCESS</p>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Build History</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Build</th>
              <th>Branch</th>
              <th>Trigger</th>
              <th>Duration</th>
              <th>Time</th>
              <th>Artifact</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {builds.map((b) => (
              <tr key={b.id}>
                <td style={{ color: '#1a73e8', fontWeight: 600 }}>{b.id}</td>
                <td><code style={{ fontSize: 12, fontFamily: 'monospace' }}>{b.branch}</code></td>
                <td>{b.trigger}</td>
                <td>{b.duration}</td>
                <td style={{ color: '#9ca3af', fontSize: 12 }}>{b.time}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{b.artifacts}</td>
                <td>
                  <span className="badge" style={{ color: statusColor[b.status], background: statusBgColor[b.status] }}>
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
