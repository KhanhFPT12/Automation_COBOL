import { useState } from 'react'
import PageHeader from '../components/shared/PageHeader'
import './ApplicationMigration.css'

const tableData = [
  { no: 1,  patternId: 'PERFORM', legacyAsset: 'NBX1340.txt', beginLine: 97,  endLine: 97,  newAsset: 'logic.java', javaExpression: 'ptnKaishiShori();',                                    remark: '' },
  { no: 2,  patternId: 'MOVE',    legacyAsset: 'NBF5144.txt', beginLine: 345, endLine: 345, newAsset: 'logic.java', javaExpression: 'workArea.setS(constantArea.getCon001Num());',           remark: '' },
  { no: 3,  patternId: 'PERFORM', legacyAsset: 'NBF5144.txt', beginLine: 217, endLine: 217, newAsset: 'logic.java', javaExpression: 'ptnKaishiShori();',                                    remark: '' },
  { no: 4,  patternId: 'CALL',    legacyAsset: 'NBF5144.txt', beginLine: 226, endLine: 226, newAsset: 'logic.java', javaExpression: 'nsze05a.execute(e05ag0Sysdate); e05ag0Sysdate =...',   remark: '' },
  { no: 5,  patternId: 'ACCEPT',  legacyAsset: 'NBF5144.txt', beginLine: 227, endLine: 227, newAsset: 'logic.java', javaExpression: 'e05ag0Sysdate = FieldFormat.format(6, new Simpl...',   remark: '' },
  { no: 6,  patternId: 'MOVE',    legacyAsset: 'NBF5144.txt', beginLine: 228, endLine: 228, newAsset: 'logic.java', javaExpression: 'WorkAreaDtoAccessor.setWkEdpYmd1(workArea, WkEd...',  remark: '' },
  { no: 7,  patternId: 'CALL',    legacyAsset: 'NBF5144.txt', beginLine: 224, endLine: 224, newAsset: 'logic.java', javaExpression: 'nsze02a.execute(wpSubIfaNameset); wpSubIfaNames...',  remark: '' },
  { no: 8,  patternId: 'PERFORM', legacyAsset: 'NBF5144.txt', beginLine: 343, endLine: 344, newAsset: 'logic.java', javaExpression: 'while (!(workArea.getS() > constantArea.getCon0...', remark: '' },
  { no: 9,  patternId: 'MOVE',    legacyAsset: 'NBF5144.txt', beginLine: 230, endLine: 230, newAsset: 'logic.java', javaExpression: 'WorkAreaDtoAccessor.setWkEdpMm1(workArea, const...', remark: '' },
  { no: 10, patternId: 'CALL',    legacyAsset: 'NBJ6630.txt', beginLine: 88,  endLine: 88,  newAsset: 'logic.java', javaExpression: 'initProcess(workArea, sysdate);',                     remark: '' },
  { no: 11, patternId: 'EVALUATE', legacyAsset: 'NBJ6630.txt', beginLine: 112, endLine: 125, newAsset: 'logic.java', javaExpression: 'switch(workArea.getCode()) { case "01": ... }',     remark: 'Manual review needed' },
  { no: 12, patternId: 'MOVE',    legacyAsset: 'NBJ6630.txt', beginLine: 200, endLine: 200, newAsset: 'logic.java', javaExpression: 'workArea.setResult(calcResult);',                     remark: '' },
]

const failedData = [
  { no: 1, patternId: 'EVALUATE', file: 'NBG3310.txt', line: 112, reason: 'Complex nested EVALUATE not supported', severity: 'High' },
  { no: 2, patternId: 'COPY',     file: 'NBJ6630.txt', line: 201, reason: 'COPY REPLACING not yet implemented',    severity: 'Medium' },
  { no: 3, patternId: 'SEARCH',   file: 'NBI5521.txt', line: 88,  reason: 'SEARCH ALL pattern unsupported',       severity: 'Medium' },
]

export default function ApplicationMigration() {
  const [activeTab, setActiveTab] = useState('statement')
  const [search, setSearch] = useState('')

  const filtered = tableData.filter((r) =>
    r.patternId.toLowerCase().includes(search.toLowerCase()) ||
    r.legacyAsset.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page">
      <PageHeader
        title="Details Report"
        subtitle={`Your report was last updated on 18/05/2026 10:31:14 PM by khanhng`}
      />

      <div className="report-card card">
        <div className="am-tabs">
          <button className={`am-tab ${activeTab === 'statement' ? 'active' : ''}`} onClick={() => setActiveTab('statement')}>
            Statement
          </button>
          <button className={`am-tab ${activeTab === 'failed' ? 'active' : ''}`} onClick={() => setActiveTab('failed')}>
            Failed Patterns
            <span className="tab-badge">{failedData.length}</span>
          </button>
        </div>

        <div className="am-toolbar">
          <div className="search-wrap">
            <span className="search-ico">⌕</span>
            <input
              type="text"
              placeholder="Search by Pattern ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-secondary">↓ Export CSV</button>
        </div>

        {activeTab === 'statement' && (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Pattern ID</th>
                  <th>Legacy Asset ID</th>
                  <th>Begin Line</th>
                  <th>End Line</th>
                  <th>New Asset ID</th>
                  <th>Java Expression</th>
                  <th>Remark</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr key={row.no}>
                    <td style={{ color: '#1a73e8', fontWeight: 600 }}>{row.no}</td>
                    <td>{row.patternId}</td>
                    <td><span className="file-icon">📄</span>{row.legacyAsset}</td>
                    <td>{row.beginLine}</td>
                    <td>{row.endLine}</td>
                    <td><span className="file-icon">📄</span>{row.newAsset}</td>
                    <td><a href="#" className="expr-link">{row.javaExpression}</a></td>
                    <td style={{ color: row.remark ? '#ea4335' : '#ccc', fontSize: 12 }}>{row.remark || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'failed' && (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Pattern ID</th>
                  <th>File</th>
                  <th>Line</th>
                  <th>Failure Reason</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {failedData.map((row) => (
                  <tr key={row.no}>
                    <td style={{ color: '#ea4335', fontWeight: 600 }}>{row.no}</td>
                    <td>{row.patternId}</td>
                    <td><span className="file-icon">📄</span>{row.file}</td>
                    <td>{row.line}</td>
                    <td style={{ color: '#555', fontSize: 13 }}>{row.reason}</td>
                    <td>
                      <span className="badge" style={{ color: row.severity === 'High' ? '#ea4335' : '#fbbc04', background: row.severity === 'High' ? '#fef2f2' : '#fefce8' }}>
                        {row.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="scroll-nav">
        <button className="scroll-btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>⇧</button>
        <button className="scroll-btn" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}>⇩</button>
      </div>
    </div>
  )
}
