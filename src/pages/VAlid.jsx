import { useState } from 'react'
import PageHeader from '../components/shared/PageHeader'
import StatCard from '../components/shared/StatCard'
import './VAlid.css'

const stats = [
  { label: 'Total Test Cases', value: '124', color: '#1a73e8', icon: '📋' },
  { label: 'Passed',           value: '112', color: '#34a853', icon: '✔' },
  { label: 'Failed',           value: '8',   color: '#ea4335', icon: '✖' },
  { label: 'Skipped',          value: '4',   color: '#9ca3af', icon: '⊘' },
]

const suites = [
  {
    name: 'Unit Tests – Logic Layer',
    total: 52, passed: 50, failed: 2, duration: '1.2s',
    cases: [
      { name: 'testPtnKaishiShori_normal',       status: 'Passed', duration: '12ms' },
      { name: 'testPtnKaishiShori_boundary',     status: 'Passed', duration: '8ms'  },
      { name: 'testWorkAreaSetS_nullInput',       status: 'Failed', duration: '5ms', error: 'NullPointerException at line 23' },
      { name: 'testConstantAreaGetCon001Num',     status: 'Passed', duration: '9ms'  },
      { name: 'testFieldFormat_invalidLength',   status: 'Failed', duration: '6ms', error: 'Expected "000000" but was ""' },
    ],
  },
  {
    name: 'Integration Tests – DB Layer',
    total: 38, passed: 36, failed: 2, duration: '4.8s',
    cases: [
      { name: 'testCustomerMasterInsert',        status: 'Passed', duration: '210ms' },
      { name: 'testOrderHeaderSelect',           status: 'Passed', duration: '180ms' },
      { name: 'testTransactionLogInsert_large',  status: 'Failed', duration: '1200ms', error: 'ORA-12899: value too large for column' },
      { name: 'testInventoryUpdate',             status: 'Passed', duration: '95ms'  },
    ],
  },
  {
    name: 'End-to-End Tests',
    total: 34, passed: 26, failed: 4, duration: '12.4s',
    cases: [
      { name: 'e2e_fullMigrationFlow_batch1',    status: 'Passed', duration: '5.1s'  },
      { name: 'e2e_fullMigrationFlow_batch2',    status: 'Failed', duration: '6.2s', error: 'Timeout waiting for DB commit' },
    ],
  },
]

export default function VAlid() {
  const [open, setOpen] = useState({ 'Unit Tests – Logic Layer': true })
  const toggle = (k) => setOpen((p) => ({ ...p, [k]: !p[k] }))

  return (
    <div className="page">
      <PageHeader
        title="vAlid"
        subtitle="Validation and test suite results"
        actions={
          <>
            <button className="btn-secondary">↓ Export Report</button>
            <button className="btn-primary">▶ Run All Tests</button>
          </>
        }
      />

      <div className="stat-row">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <h3 className="section-title">Test Coverage</h3>
        <div className="progress-bar-wrap">
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: '90%', background: '#34a853' }} />
          </div>
          <span className="progress-pct">90%</span>
        </div>
        <div className="progress-legend">
          <span><span className="dot" style={{ background: '#34a853' }} />Passed (112)</span>
          <span><span className="dot" style={{ background: '#ea4335' }} />Failed (8)</span>
          <span><span className="dot" style={{ background: '#9ca3af' }} />Skipped (4)</span>
        </div>
      </div>

      {suites.map((suite) => (
        <div key={suite.name} className="card valid-suite">
          <div className="suite-header" onClick={() => toggle(suite.name)}>
            <div className="suite-header-left">
              <span className="suite-chevron">{open[suite.name] ? '▾' : '▸'}</span>
              <span className="suite-name">{suite.name}</span>
              <span className="suite-meta">{suite.total} tests · {suite.duration}</span>
            </div>
            <div className="suite-counts">
              <span style={{ color: '#34a853' }}>✔ {suite.passed}</span>
              {suite.failed > 0 && <span style={{ color: '#ea4335' }}>✖ {suite.failed}</span>}
            </div>
          </div>

          {open[suite.name] && (
            <table className="data-table" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Test Case</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {suite.cases.map((c) => (
                  <tr key={c.name}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12 }}>{c.name}</td>
                    <td style={{ color: '#9ca3af', fontSize: 12 }}>{c.duration}</td>
                    <td>
                      <span className="badge" style={{ color: c.status === 'Passed' ? '#34a853' : '#ea4335', background: c.status === 'Passed' ? '#f0fdf4' : '#fef2f2' }}>
                        {c.status}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: '#ea4335' }}>{c.error || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  )
}
