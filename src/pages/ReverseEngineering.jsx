import { useState } from 'react'
import PageHeader from '../components/shared/PageHeader'
import StatCard from '../components/shared/StatCard'
import './ReverseEngineering.css'

const stats = [
  { label: 'Total Patterns', value: '1,482', color: '#1a73e8', icon: '◈' },
  { label: 'Converted',      value: '1,204', color: '#34a853', icon: '✔' },
  { label: 'Failed',         value: '87',    color: '#ea4335', icon: '✖' },
  { label: 'Skipped',        value: '191',   color: '#9ca3af', icon: '⊘' },
]

const patterns = [
  { id: 'PAT-001', type: 'PERFORM',  file: 'NBX1340.cbl', line: 97,  target: 'ptnKaishiShori()',           status: 'Converted' },
  { id: 'PAT-002', type: 'MOVE',     file: 'NBF5144.cbl', line: 345, target: 'workArea.setS(...)',          status: 'Converted' },
  { id: 'PAT-003', type: 'CALL',     file: 'NBF5144.cbl', line: 226, target: 'nsze05a.execute(...)',        status: 'Converted' },
  { id: 'PAT-004', type: 'EVALUATE', file: 'NBG3310.cbl', line: 112, target: 'switch/case block',          status: 'Failed' },
  { id: 'PAT-005', type: 'PERFORM',  file: 'NBJ6630.cbl', line: 88,  target: 'initProcess()',              status: 'Converted' },
  { id: 'PAT-006', type: 'COPY',     file: 'NBJ6630.cbl', line: 201, target: 'import statement',           status: 'Skipped' },
  { id: 'PAT-007', type: 'ACCEPT',   file: 'NBF5144.cbl', line: 227, target: 'FieldFormat.format(...)',    status: 'Converted' },
  { id: 'PAT-008', type: 'DISPLAY',  file: 'NBI5521.pli', line: 55,  target: 'System.out.println(...)',    status: 'Converted' },
]

const statusColor = { Converted: '#34a853', Failed: '#ea4335', Skipped: '#9ca3af' }
const typeColor   = { PERFORM: '#1a73e8', MOVE: '#7c3aed', CALL: '#ea4335', EVALUATE: '#f97316', COPY: '#9ca3af', ACCEPT: '#0891b2', DISPLAY: '#16a34a' }

export default function ReverseEngineering() {
  const [filter, setFilter] = useState('All')
  const filters = ['All', 'Converted', 'Failed', 'Skipped']

  const rows = filter === 'All' ? patterns : patterns.filter((p) => p.status === filter)

  return (
    <div className="page">
      <PageHeader
        title="Reverse Engineering"
        subtitle="Pattern extraction and Java mapping results"
        actions={<button className="btn-primary">↓ Export</button>}
      />

      <div className="stat-row">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card">
        <div className="table-toolbar">
          <h3 className="section-title" style={{ marginBottom: 0 }}>Pattern Mapping</h3>
          <div className="filter-tabs">
            {filters.map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <table className="data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Pattern ID</th>
              <th>Type</th>
              <th>Source File</th>
              <th>Line</th>
              <th>Java Target</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td style={{ color: '#1a73e8', fontWeight: 500 }}>{r.id}</td>
                <td>
                  <span className="badge" style={{ color: typeColor[r.type] || '#555', background: (typeColor[r.type] || '#555') + '18' }}>
                    {r.type}
                  </span>
                </td>
                <td><span className="file-icon">📄</span>{r.file}</td>
                <td>{r.line}</td>
                <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#555' }}>{r.target}</td>
                <td>
                  <span className="badge" style={{ color: statusColor[r.status], background: statusColor[r.status] + '18' }}>
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
