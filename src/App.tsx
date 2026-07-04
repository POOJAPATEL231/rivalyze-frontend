import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Splash from './views/Splash'
import Brief from './views/Brief'
import Discovery from './views/Discovery'
import RunMonitor from './views/RunMonitor'
import Dashboard from './views/Dashboard'
import Recommendations from './views/Recommendations'
import History from './views/History'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/brief" element={<Brief />} />
        <Route path="/discovery" element={<Discovery />} />
        <Route path="/run/:jobId" element={<RunMonitor />} />
        <Route path="/dash/:runId" element={<Dashboard />} />
        <Route path="/recs/:runId" element={<Recommendations />} />
        <Route path="/history" element={<History />} />
        {/* stretch, behind VITE_STRETCH: /compare/:runId (Krutarth) · /workspace/:runId (Vatsal) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
