import { useState } from 'react'
import PageHeader from '../components/shared/PageHeader'
import './Planning.css'

const sprints = [
  {
    id: 'Sprint 1',
    period: '01/04/2026 – 14/04/2026',
    status: 'Completed',
    tasks: [
      { name: 'Setup project environment', assignee: 'khanhng', status: 'Done', priority: 'High' },
      { name: 'Collect legacy source files',  assignee: 'tunt1',   status: 'Done', priority: 'High' },
      { name: 'Run initial assessment scan',  assignee: 'khanhng', status: 'Done', priority: 'Medium' },
    ],
  },
  {
    id: 'Sprint 2',
    period: '15/04/2026 – 28/04/2026',
    status: 'Completed',
    tasks: [
      { name: 'Reverse engineering – COBOL files', assignee: 'tunt1',   status: 'Done',        priority: 'High' },
      { name: 'Define mapping rules',              assignee: 'khanhng', status: 'Done',        priority: 'High' },
      { name: 'Review failed patterns',            assignee: 'tunt1',   status: 'In Progress', priority: 'Medium' },
    ],
  },
  {
    id: 'Sprint 3',
    period: '29/04/2026 – 12/05/2026',
    status: 'In Progress',
    tasks: [
      { name: 'Application migration – batch 1', assignee: 'khanhng', status: 'In Progress', priority: 'High' },
      { name: 'Data migration preparation',      assignee: 'tunt1',   status: 'Todo',        priority: 'Medium' },
      { name: 'Framework configuration',         assignee: 'khanhng', status: 'Todo',        priority: 'Low' },
    ],
  },
  {
    id: 'Sprint 4',
    period: '13/05/2026 – 26/05/2026',
    status: 'Planned',
    tasks: [
      { name: 'Application migration – batch 2', assignee: 'tunt1',   status: 'Todo', priority: 'High' },
      { name: 'vAlid integration testing',       assignee: 'khanhng', status: 'Todo', priority: 'High' },
      { name: 'Final report generation',         assignee: 'tunt1',   status: 'Todo', priority: 'Medium' },
    ],
  },
]

const sprintStatusColor = { Completed: '#34a853', 'In Progress': '#1a73e8', Planned: '#9ca3af' }
const taskStatusColor   = { Done: '#34a853', 'In Progress': '#1a73e8', Todo: '#9ca3af' }
const priorityColor     = { High: '#ea4335', Medium: '#fbbc04', Low: '#34a853' }

export default function Planning() {
  const [open, setOpen] = useState({ 'Sprint 3': true })

  const toggle = (id) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="page">
      <PageHeader
        title="Planning"
        subtitle="Sprint planning and task tracking"
        actions={
          <>
            <button className="btn-secondary">Import</button>
            <button className="btn-primary">+ Add Sprint</button>
          </>
        }
      />

      <div className="sprint-summary card">
        <div className="sprint-kpi-row">
          <div className="sprint-kpi"><span style={{ color: '#34a853', fontSize: 22, fontWeight: 700 }}>2</span><p>Sprints Completed</p></div>
          <div className="sprint-kpi"><span style={{ color: '#1a73e8', fontSize: 22, fontWeight: 700 }}>1</span><p>In Progress</p></div>
          <div className="sprint-kpi"><span style={{ color: '#9ca3af', fontSize: 22, fontWeight: 700 }}>1</span><p>Planned</p></div>
          <div className="sprint-kpi"><span style={{ color: '#1a1a2e', fontSize: 22, fontWeight: 700 }}>12</span><p>Total Tasks</p></div>
          <div className="sprint-kpi"><span style={{ color: '#34a853', fontSize: 22, fontWeight: 700 }}>7</span><p>Done</p></div>
        </div>
      </div>

      {sprints.map((sprint) => (
        <div key={sprint.id} className="card sprint-card">
          <div className="sprint-header" onClick={() => toggle(sprint.id)}>
            <div className="sprint-header-left">
              <span className="sprint-chevron">{open[sprint.id] ? '▾' : '▸'}</span>
              <div>
                <span className="sprint-id">{sprint.id}</span>
                <span className="sprint-period">{sprint.period}</span>
              </div>
            </div>
            <span className="badge" style={{ color: sprintStatusColor[sprint.status], background: sprintStatusColor[sprint.status] + '18' }}>
              {sprint.status}
            </span>
          </div>

          {open[sprint.id] && (
            <table className="data-table" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {sprint.tasks.map((t) => (
                  <tr key={t.name}>
                    <td>{t.name}</td>
                    <td>
                      <span className="assignee-chip">{t.assignee[0].toUpperCase()}</span>
                      {t.assignee}
                    </td>
                    <td>
                      <span className="badge" style={{ color: priorityColor[t.priority], background: priorityColor[t.priority] + '18' }}>
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span className="badge" style={{ color: taskStatusColor[t.status], background: taskStatusColor[t.status] + '18' }}>
                        {t.status}
                      </span>
                    </td>
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
