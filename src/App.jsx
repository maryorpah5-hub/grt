import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import TrackingResult from './pages/TrackingResult'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/track/:number" element={<TrackingResult />} />
        <Route path="/secure-admin" element={<AdminLogin />} />
        <Route 
          path="/secure-admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}
