import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import './Sidebar.css'

const navGroups = [
  {
    id: 'xray',
    label: 'X-Ray',
    icon: '◈',
    children: [
      { label: 'Assessment', path: '/assessment' },
      { label: 'Reverse Engineering', path: '/reverse-engineering' },
      { label: 'Planning', path: '/planning' },
    ],
  },
  {
    id: 'bridge',
    label: 'Bridge',
    icon: '⬡',
    children: [
      { label: 'Application Migration', path: '/application-migration' },
      { label: 'Data Migration', path: '/data-migration' },
      { label: 'Application Framework', path: '/application-framework' },
    ],
  },
]

const singleItems = [
  { label: 'Forge', path: '/forge', icon: '⚒' },
  { label: 'vAlid', path: '/valid', icon: '✔' },
  { label: 'Run', path: '/run', icon: '▶' },
]

export default function Sidebar() {
  const [expanded, setExpanded] = useState({ xray: true, bridge: true })
  const navigate = useNavigate()

  const toggle = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="sidebar-search">
          <span className="search-icon">⌕</span>
          <span className="search-text">ALS</span>
          <span className="menu-icon">☰</span>
        </div>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ‹ Back
        </button>

        <p className="section-label">Project Modules</p>

        {navGroups.map((group) => (
          <div key={group.id} className="nav-group">
            <button
              className="nav-group-header"
              onClick={() => toggle(group.id)}
            >
              <span className="nav-icon">{group.icon}</span>
              <span>{group.label}</span>
              <span className={`chevron ${expanded[group.id] ? 'open' : ''}`}>›</span>
            </button>
            {expanded[group.id] && (
              <ul className="nav-children">
                {group.children.map((child) => (
                  <li key={child.path}>
                    <NavLink
                      to={child.path}
                      className={({ isActive }) =>
                        `nav-child ${isActive ? 'active' : ''}`
                      }
                    >
                      {child.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {singleItems.map((item) => (
          <div key={item.path} className="nav-group">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `nav-group-header nav-single ${isActive ? 'single-active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          </div>
        ))}
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">k</div>
        <div className="user-info">
          <span className="user-name">khanhng</span>
          <span className="user-email">khanhngde180641@fpt.edu.vn</span>
        </div>
        <span className="chevron open" style={{ marginLeft: 'auto' }}>›</span>
      </div>
    </aside>
  )
}
