import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import AiChat from './components/AiChat/AiChat'
import Assessment from './pages/Assessment'
import ReverseEngineering from './pages/ReverseEngineering'
import Planning from './pages/Planning'
import ApplicationMigration from './pages/ApplicationMigration'
import DataMigration from './pages/DataMigration'
import ApplicationFramework from './pages/ApplicationFramework'
import Forge from './pages/Forge'
import VAlid from './pages/VAlid'
import Run from './pages/Run'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/assessment" replace />} />
            <Route path="/assessment" element={<Assessment />} />
            <Route path="/reverse-engineering" element={<ReverseEngineering />} />
            <Route path="/planning" element={<Planning />} />
            <Route path="/application-migration" element={<ApplicationMigration />} />
            <Route path="/data-migration" element={<DataMigration />} />
            <Route path="/application-framework" element={<ApplicationFramework />} />
            <Route path="/forge" element={<Forge />} />
            <Route path="/valid" element={<VAlid />} />
            <Route path="/run" element={<Run />} />
          </Routes>
        </main>
      </div>
      <AiChat />
    </BrowserRouter>
  )
}

export default App
