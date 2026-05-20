import { useState } from 'react'
import PageHeader from '../components/shared/PageHeader'
import StatCard from '../components/shared/StatCard'
import './DataMigration.css'

const stats = [
  { label: 'Total Tables',  value: '64',   color: '#1a73e8', icon: '🗄' },
  { label: 'Migrated',      value: '41',   color: '#34a853', icon: '✔' },
  { label: 'In Progress',   value: '8',    color: '#fbbc04', icon: '⟳' },
  { label: 'Pending',       value: '15',   color: '#9ca3af', icon: '⏳' },
]

const tables = [
  { name: 'CUSTOMER_MASTER',   rows: '1,248,000', size: '320 MB', status: 'Migrated',     progress: 100 },
  { name: 'ORDER_HEADER',      rows: '4,560,000', size: '890 MB', status: 'Migrated',     progress: 100 },
  { name: 'ORDER_DETAIL',      rows: '12,300,000',size: '2.1 GB', status: 'In Progress',  progress: 68  },
  { name: 'PRODUCT_MASTER',    rows: '82,000',    size: '45 MB',  status: 'Migrated',     progress: 100 },
  { name: 'INVENTORY',         rows: '540,000',   size: '120 MB', status: 'In Progress',  progress: 35  },
  { name: 'TRANSACTION_LOG',   rows: '28,000,000',size: '5.4 GB', status: 'Pending',      progress: 0   },
  { name: 'USER_ACCOUNT',      rows: '95,000',    size: '22 MB',  status: 'Migrated',     progress: 100 },
  { name: 'AUDIT_TRAIL',       rows: '8,900,000', size: '1.8 GB', status: 'Pending',      progress: 0   },
]

const statusColor = { Migrated: '#34a853', 'In Progress': '#1a73e8', Pending: '#9ca3af' }

export default function DataMigration() {
  const [search, setSearch] = useState('')
  const filtered = tables.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page">
      <PageHeader
        title="Data Migration"
        subtitle="Database table migration status and progress"
        actions={
          <>
            <button className="btn-secondary">⟳ Refresh</button>
            <button className="btn-primary">▶ Run Migration</button>
          </>
        }
      />

      <div className="stat-row">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="card dm-overall">
        <h3 className="section-title">Overall Progress</h3>
        <div className="dm-progress-info">
          <span>41 / 64 tables migrated</span>
          <span style={{ fontWeight: 600, color: '#34a853' }}>64%</span>
        </div>
        <div className="progress-bar-track" style={{ height: 14 }}>
          <div className="progress-bar-fill" style={{ width: '64%', background: '#34a853' }} />
        </div>
        <div className="dm-storage">
          <span>Total data: <strong>10.7 GB</strong></span>
          <span>Migrated: <strong>3.4 GB</strong></span>
          <span>Remaining: <strong>7.3 GB</strong></span>
        </div>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <h3 className="section-title" style={{ marginBottom: 0 }}>Table List</h3>
          <div className="search-wrap">
            <span className="search-ico">⌕</span>
            <input
              type="text"
              placeholder="Search tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="data-table" style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Table Name</th>
              <th>Row Count</th>
              <th>Size</th>
              <th>Progress</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.name}>
                <td style={{ fontFamily: 'monospace', fontWeight: 500 }}>🗄 {t.name}</td>
                <td>{t.rows}</td>
                <td>{t.size}</td>
                <td>
                  <div className="inline-progress">
                    <div className="inline-track">
                      <div
                        className="inline-fill"
                        style={{ width: `${t.progress}%`, background: statusColor[t.status] }}
                      />
                    </div>
                    <span>{t.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className="badge" style={{ color: statusColor[t.status], background: statusColor[t.status] + '18' }}>
                    {t.status}
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
