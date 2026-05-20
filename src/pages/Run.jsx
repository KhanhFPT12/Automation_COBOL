import { useState } from 'react'
import PageHeader from '../components/shared/PageHeader'
import './Run.css'

const recentRuns = [
  { id: 'RUN-038', type: 'Full Migration',   started: '18/05/2026 10:28', duration: '3m 12s', status: 'Completed', user: 'khanhng' },
  { id: 'RUN-037', type: 'Partial – Batch1', started: '18/05/2026 09:10', duration: '1m 44s', status: 'Completed', user: 'tunt1'   },
  { id: 'RUN-036', type: 'Validation Only',  started: '17/05/2026 16:20', duration: '0m 55s', status: 'Failed',    user: 'khanhng' },
  { id: 'RUN-035', type: 'Full Migration',   started: '17/05/2026 08:00', duration: '3m 30s', status: 'Completed', user: 'khanhng' },
  { id: 'RUN-034', type: 'RE Scan',          started: '16/05/2026 17:55', duration: '—',       status: 'Running',  user: 'tunt1'   },
]

const statusColor   = { Completed: '#34a853', Failed: '#ea4335', Running: '#1a73e8' }
const statusBgColor = { Completed: '#f0fdf4', Failed: '#fef2f2', Running: '#eff6ff' }

const logLines = [
  { time: '10:28:01', msg: 'Initializing migration run RUN-038...', type: 'info' },
  { time: '10:28:03', msg: 'Loading source files: 248 files found', type: 'info' },
  { time: '10:28:10', msg: 'Assessment validation: PASSED', type: 'success' },
  { time: '10:28:15', msg: 'Starting reverse engineering phase...', type: 'info' },
  { time: '10:29:02', msg: 'Pattern extraction: 1,482 patterns found', type: 'info' },
  { time: '10:29:05', msg: 'Applying mapping rules...', type: 'info' },
  { time: '10:29:48', msg: 'Mapping complete: 1,204 converted, 87 failed, 191 skipped', type: 'warn' },
  { time: '10:29:50', msg: 'Starting code generation...', type: 'info' },
  { time: '10:30:55', msg: 'Code generation complete: 248 Java files generated', type: 'success' },
  { time: '10:30:56', msg: 'Starting build (Maven)...', type: 'info' },
  { time: '10:31:10', msg: 'Build successful: logic.jar (2.4 MB)', type: 'success' },
  { time: '10:31:13', msg: '✔ Migration run RUN-038 COMPLETED', type: 'success' },
]

export default function Run() {
  const [runType, setRunType] = useState('Full Migration')
  const [running, setRunning] = useState(false)

  const handleRun = () => setRunning(true)

  return (
    <div className="page">
      <PageHeader
        title="Run"
        subtitle="Execute migration jobs and monitor execution logs"
      />

      <div className="two-col">
        <div className="card">
          <h3 className="section-title">New Run Configuration</h3>

          <div className="form-row">
            <label className="form-label">Run Type</label>
            <select className="form-select" value={runType} onChange={(e) => setRunType(e.target.value)}>
              <option>Full Migration</option>
              <option>Partial – Batch1</option>
              <option>Partial – Batch2</option>
              <option>Validation Only</option>
              <option>RE Scan</option>
              <option>Forge Build Only</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Target Environment</label>
            <select className="form-select">
              <option>Development</option>
              <option>Staging</option>
              <option>Production</option>
            </select>
          </div>

          <div className="form-row">
            <label className="form-label">Source Branch</label>
            <input className="form-input" defaultValue="main" />
          </div>

          <div className="run-options">
            <label className="run-option">
              <input type="checkbox" defaultChecked /> Run vAlid after migration
            </label>
            <label className="run-option">
              <input type="checkbox" defaultChecked /> Trigger Forge build
            </label>
            <label className="run-option">
              <input type="checkbox" /> Dry run (no file output)
            </label>
          </div>

          <button
            className={`btn-run ${running ? 'running' : ''}`}
            onClick={handleRun}
            disabled={running}
          >
            {running ? '⟳ Running...' : '▶ Start Run'}
          </button>
        </div>

        <div className="card">
          <h3 className="section-title">Execution Log — RUN-038</h3>
          <div className="exec-log">
            {logLines.map((l, i) => (
              <div key={i} className={`exec-line exec-${l.type}`}>
                <span className="exec-time">{l.time}</span>
                <span>{l.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Recent Runs</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Type</th>
              <th>Started</th>
              <th>Duration</th>
              <th>Triggered By</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recentRuns.map((r) => (
              <tr key={r.id}>
                <td style={{ color: '#1a73e8', fontWeight: 600 }}>{r.id}</td>
                <td>{r.type}</td>
                <td style={{ color: '#9ca3af', fontSize: 12 }}>{r.started}</td>
                <td>{r.duration}</td>
                <td>
                  <span className="assignee-chip">{r.user[0].toUpperCase()}</span>
                  {r.user}
                </td>
                <td>
                  <span className="badge" style={{ color: statusColor[r.status], background: statusBgColor[r.status] }}>
                    {r.status}
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
