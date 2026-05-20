import { useState } from 'react'
import PageHeader from '../components/shared/PageHeader'
import './ApplicationFramework.css'

const components = [
  { name: 'Spring Boot',       version: '3.2.5',  status: 'Active',    category: 'Core' },
  { name: 'MyBatis',           version: '3.5.16', status: 'Active',    category: 'ORM' },
  { name: 'Log4j2',            version: '2.23.1', status: 'Active',    category: 'Logging' },
  { name: 'Jackson',           version: '2.17.0', status: 'Active',    category: 'Serialization' },
  { name: 'Oracle JDBC',       version: '21.9.0', status: 'Active',    category: 'Database' },
  { name: 'JUnit 5',           version: '5.10.2', status: 'Active',    category: 'Testing' },
  { name: 'Mockito',           version: '5.11.0', status: 'Active',    category: 'Testing' },
  { name: 'Swagger / OpenAPI', version: '2.5.0',  status: 'Optional',  category: 'Docs' },
]

const categoryColor = {
  Core: '#1a73e8', ORM: '#7c3aed', Logging: '#f97316',
  Serialization: '#0891b2', Database: '#dc2626', Testing: '#16a34a', Docs: '#9ca3af',
}

export default function ApplicationFramework() {
  const [config, setConfig] = useState({
    projectName: 'LegacyMigrationProject',
    javaVersion: '17',
    buildTool: 'Maven',
    dbUrl: 'jdbc:oracle:thin:@localhost:1521:XE',
    dbUser: 'migration_user',
    outputDir: '/output/java-src',
    encoding: 'UTF-8',
  })

  const update = (k, v) => setConfig((prev) => ({ ...prev, [k]: v }))

  return (
    <div className="page">
      <PageHeader
        title="Application Framework"
        subtitle="Framework configuration and component management"
        actions={
          <>
            <button className="btn-secondary">Reset</button>
            <button className="btn-primary">💾 Save Configuration</button>
          </>
        }
      />

      <div className="two-col">
        <div className="card">
          <h3 className="section-title">Project Settings</h3>
          <div className="form-row">
            <label className="form-label">Project Name</label>
            <input className="form-input" value={config.projectName} onChange={(e) => update('projectName', e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">Java Version</label>
            <select className="form-select" value={config.javaVersion} onChange={(e) => update('javaVersion', e.target.value)}>
              <option>11</option>
              <option>17</option>
              <option>21</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Build Tool</label>
            <select className="form-select" value={config.buildTool} onChange={(e) => update('buildTool', e.target.value)}>
              <option>Maven</option>
              <option>Gradle</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Source Encoding</label>
            <select className="form-select" value={config.encoding} onChange={(e) => update('encoding', e.target.value)}>
              <option>UTF-8</option>
              <option>Shift_JIS</option>
              <option>EUC-JP</option>
            </select>
          </div>
          <div className="form-row">
            <label className="form-label">Output Directory</label>
            <input className="form-input" value={config.outputDir} onChange={(e) => update('outputDir', e.target.value)} />
          </div>
        </div>

        <div className="card">
          <h3 className="section-title">Database Connection</h3>
          <div className="form-row">
            <label className="form-label">JDBC URL</label>
            <input className="form-input" value={config.dbUrl} onChange={(e) => update('dbUrl', e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">DB Username</label>
            <input className="form-input" value={config.dbUser} onChange={(e) => update('dbUser', e.target.value)} />
          </div>
          <div className="form-row">
            <label className="form-label">DB Password</label>
            <input className="form-input" type="password" placeholder="••••••••" />
          </div>
          <button className="btn-secondary" style={{ marginTop: 8 }}>🔌 Test Connection</button>

          <div className="conn-status">
            <span className="dot" style={{ background: '#34a853' }} />
            <span style={{ fontSize: 13, color: '#34a853', fontWeight: 500 }}>Connected</span>
            <span style={{ fontSize: 12, color: '#9ca3af', marginLeft: 8 }}>Oracle 21c · 2ms latency</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="section-title">Framework Components</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Version</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {components.map((c) => (
              <tr key={c.name}>
                <td style={{ fontWeight: 500 }}>{c.name}</td>
                <td><code style={{ fontFamily: 'monospace', fontSize: 12, color: '#555' }}>{c.version}</code></td>
                <td>
                  <span className="badge" style={{ color: categoryColor[c.category] || '#555', background: (categoryColor[c.category] || '#555') + '18' }}>
                    {c.category}
                  </span>
                </td>
                <td>
                  <span className="badge" style={{ color: c.status === 'Active' ? '#34a853' : '#9ca3af', background: c.status === 'Active' ? '#f0fdf4' : '#f3f4f6' }}>
                    {c.status}
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
