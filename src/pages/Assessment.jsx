import PageHeader from '../components/shared/PageHeader'
import StatCard from '../components/shared/StatCard'
import './Assessment.css'

const projectStats = [
  { label: 'Total Source Files', value: '248', sub: 'COBOL / PL/I', color: '#1a73e8', icon: '📁' },
  { label: 'Analyzed', value: '216', sub: '87% complete', color: '#34a853', icon: '✔' },
  { label: 'Failed Analysis', value: '14', sub: 'Needs review', color: '#ea4335', icon: '✖' },
  { label: 'Pending', value: '18', sub: 'In queue', color: '#fbbc04', icon: '⏳' },
]

const fileRows = [
  { name: 'NBX1340.cbl', type: 'COBOL', lines: 1240, status: 'Analyzed', complexity: 'High' },
  { name: 'NBF5144.cbl', type: 'COBOL', lines: 892, status: 'Analyzed', complexity: 'Medium' },
  { name: 'NBF2201.pli', type: 'PL/I',  lines: 560,  status: 'Analyzed', complexity: 'Low' },
  { name: 'NBG3310.cbl', type: 'COBOL', lines: 2100, status: 'Failed',   complexity: 'High' },
  { name: 'NBH4412.cbl', type: 'COBOL', lines: 330,  status: 'Pending',  complexity: 'Low' },
  { name: 'NBI5521.pli', type: 'PL/I',  lines: 780,  status: 'Analyzed', complexity: 'Medium' },
  { name: 'NBJ6630.cbl', type: 'COBOL', lines: 1560, status: 'Analyzed', complexity: 'High' },
  { name: 'NBK7741.cbl', type: 'COBOL', lines: 430,  status: 'Pending',  complexity: 'Low' },
]

const statusColor = { Analyzed: '#34a853', Failed: '#ea4335', Pending: '#fbbc04' }
const complexityColor = { High: '#ea4335', Medium: '#fbbc04', Low: '#34a853' }

export default function Assessment() {
  return (
    <div className="page">
      <PageHeader
        title="Assessment"
        subtitle="Project source code analysis overview"
        actions={
          <button className="btn-primary">+ New Assessment</button>
        }
      />

      <div className="stat-row">
        {projectStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="progress-section card">
        <h3 className="section-title">Overall Progress</h3>
        <div className="progress-bar-wrap">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: '87%', background: '#34a853' }} />
          </div>
          <span className="progress-pct">87%</span>
        </div>
        <div className="progress-legend">
          <span><span className="dot" style={{ background: '#34a853' }} />Analyzed (216)</span>
          <span><span className="dot" style={{ background: '#ea4335' }} />Failed (14)</span>
          <span><span className="dot" style={{ background: '#fbbc04' }} />Pending (18)</span>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Source File List</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Lines of Code</th>
              <th>Complexity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fileRows.map((f) => (
              <tr key={f.name}>
                <td><span className="file-icon">📄</span>{f.name}</td>
                <td><span className="badge badge-type">{f.type}</span></td>
                <td>{f.lines.toLocaleString()}</td>
                <td>
                  <span className="badge" style={{ color: complexityColor[f.complexity], background: complexityColor[f.complexity] + '18' }}>
                    {f.complexity}
                  </span>
                </td>
                <td>
                  <span className="badge" style={{ color: statusColor[f.status], background: statusColor[f.status] + '18' }}>
                    {f.status}
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
