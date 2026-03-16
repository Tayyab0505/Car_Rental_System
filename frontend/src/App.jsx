import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'

function App() {

  return (
    <Routes>
      <Routes path="/" element={<Navigate to={"/login"} />} />
    </Routes>
  )
}

export default App
