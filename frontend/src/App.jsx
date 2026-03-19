import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/user/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {

  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/login"} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/*" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
    </Routes>
  )
}

export default App
