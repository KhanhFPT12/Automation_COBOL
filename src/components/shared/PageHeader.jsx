import { useNavigate } from 'react-router-dom'
import './PageHeader.css'

export default function PageHeader({ title, subtitle, actions }) {
  const navigate = useNavigate()
  return (
    <div className="page-header">
      <div className="page-header-left">
        <button className="ph-back" onClick={() => navigate(-1)}>← Back</button>
        <div>
          <h1 className="ph-title">{title}</h1>
          {subtitle && <p className="ph-subtitle">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="page-header-actions">{actions}</div>}
    </div>
  )
}
