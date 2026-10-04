import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import UserCars from './pages/user/Cars'

import ProtectedRoute from './components/ProtectedRoute'
import UserNavbar from './components/UserNavbar'

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/cars" replace />}
      />

      <Route
        path="/cars"
        element={
          <div className="min-h-screen bg-[#f5f8fc]">
            <UserNavbar />
            <UserCars />
          </div>
        }
      />

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={<Navigate to="/cars" replace />}
      />

    </Routes>
  )
}

export default App