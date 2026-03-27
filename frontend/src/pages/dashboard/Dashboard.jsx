import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import { useAuth } from '../../context/AuthContext'

import Overview from '../admin/Overview'
import AdminCars from '../admin/Cars'
import AdminBookings from '../admin/Bookings'

import UserCars from '../user/Cars'
import UserBookings from '../user/Bookings'

export default function Dashboard() {
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-900">
                <Routes>
                    <Route path="/" element={<Navigate to={isAdmin ? 'overview' : 'cars'} />} />
                    {isAdmin ? (
                        <>
                            <Route path="overview" element={<Overview />} />
                            <Route path="cars" element={<AdminCars />} />
                            <Route path="bookings" element={<AdminBookings />} />
                        </>
                    ) : (
                        <>
                            <Route path="cars" element={<UserCars />} />
                            <Route path="bookings" element={<UserBookings />} />
                        </>
                    )}
                </Routes>
            </main>
        </div>
    )
}