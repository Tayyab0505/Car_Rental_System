import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import Overview from './Overview'
import Cars from './Cars'
import Bookings from './Bookings'
import { useAuth } from '../../context/AuthContext'

export default function Dashboard() {
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <Routes>
                    <Route path="/" element={<Navigate to={isAdmin ? 'overview' : 'cars'} />} />
                    {isAdmin && <Route path="overview" element={<Overview />} />}
                    <Route path="cars" element={<Cars />} />
                    <Route path="bookings" element={<Bookings />} />
                </Routes>
            </main>
        </div>
    )
}