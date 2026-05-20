import { useState } from 'react'
import './DetailsReport.css'

const tableData = [
  { no: 1, patternId: 'PERFORM', legacyAsset: 'NBX1340.txt', beginLine: 97,  endLine: 97,  newAsset: 'logic.java', javaExpression: 'ptnKaishiShori();', remark: '' },
  { no: 2, patternId: 'MOVE',    legacyAsset: 'NBF5144.txt', beginLine: 345, endLine: 345, newAsset: 'logic.java', javaExpression: 'workArea.setS(constantArea.getCon001Num());', remark: '' },
  { no: 3, patternId: 'PERFORM', legacyAsset: 'NBF5144.txt', beginLine: 217, endLine: 217, newAsset: 'logic.java', javaExpression: 'ptnKaishiShori();', remark: '' },
  { no: 4, patternId: 'CALL',    legacyAsset: 'NBF5144.txt', beginLine: 226, endLine: 226, newAsset: 'logic.java', javaExpression: 'nsze05a.execute(e05ag0Sysdate); e05ag0Sysdate =...', remark: '' },
  { no: 5, patternId: 'ACCEPT',  legacyAsset: 'NBF5144.txt', beginLine: 227, endLine: 227, newAsset: 'logic.java', javaExpression: 'e05ag0Sysdate = FieldFormat.format(6, new Simpl...', remark: '' },
  { no: 6, patternId: 'MOVE',    legacyAsset: 'NBF5144.txt', beginLine: 228, endLine: 228, newAsset: 'logic.java', javaExpression: 'WorkAreaDtoAccessor.setWkEdpYmd1(workArea, WkEd...', remark: '' },
  { no: 7, patternId: 'CALL',    legacyAsset: 'NBF5144.txt', beginLine: 224, endLine: 224, newAsset: 'logic.java', javaExpression: 'nsze02a.execute(wpSubIfaNameset); wpSubIfaNames...', remark: '' },
  { no: 8, patternId: 'PERFORM', legacyAsset: 'NBF5144.txt', beginLine: 343, endLine: 344, newAsset: 'logic.java', javaExpression: 'while (!(workArea.getS() > constantArea.getCon0...', remark: '' },
  { no: 9, patternId: 'MOVE',    legacyAsset: 'NBF5144.txt', beginLine: 230, endLine: 230, newAsset: 'logic.java', javaExpression: 'WorkAreaDtoAccessor.setWkEdpMm1(workArea, const...', remark: '' },
]



export default function DetailsReport() {
  const [activeTab, setActiveTab] = useState('statement')
  const [search, setSearch] = useState('')

  const filtered = tableData.filter((row) =>
    row.patternId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="details-report">
      <div className="report-header">
        <h1 className="report-title">
          <span className="back-arrow">&#8592;</span>
          Details Report
        </h1>
        <p className="report-subtitle">
          Your report was last updated on 18/05/2026 10:31:14 PM by tunt1@fpt.com
        </p>
      </div>

      <div className="report-card">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'statement' ? 'active' : ''}`}
            onClick={() => setActiveTab('statement')}
          >
            Statement
          </button>
          <button
            className={`tab ${activeTab === 'failed' ? 'active' : ''}`}
            onClick={() => setActiveTab('failed')}
          >
            Failed Patterns
          </button>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Pattern ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="search-btn">&#128269;</span>
        </div>

        <div className="table-wrapper">
          <table className="report-table">
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
                  <td className="col-no">{row.no}</td>
                  <td>{row.patternId}</td>
                  <td>
                    <span className="file-icon">&#128196;</span>
                    {row.legacyAsset}
                  </td>
                  <td>{row.beginLine}</td>
                  <td>{row.endLine}</td>
                  <td>
                    <span className="file-icon">&#128196;</span>
                    {row.newAsset}
                  </td>
                  <td>
                    <a href="#" className="expression-link">{row.javaExpression}</a>
                  </td>
                  <td>{row.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="scroll-nav">
        <button className="scroll-btn" title="Scroll up">&#8679;</button>
        <button className="scroll-btn" title="Scroll down">&#8681;</button>
      </div>
    </div>
  )
}
