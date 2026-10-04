import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import UserNavbar from '../../components/UserNavbar'
import { useAuth } from '../../context/AuthContext'

import Overview from '../admin/Overview'
import AdminCars from '../admin/Cars'
import AdminBookings from '../admin/Bookings'

import UserCars from '../user/Cars'
import UserBookings from '../user/Bookings'

export default function Dashboard() {
    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    if (isAdmin) {
        return (
            <div className="flex h-screen overflow-hidden bg-slate-50">

                <aside className="w-64 shrink-0 h-screen">
                    <Sidebar />
                </aside>

                <main className="flex-1 overflow-y-auto">

                    <Routes>
                        <Route path="/" element={<Navigate to="overview" replace />} />
                        <Route path="overview" element={<Overview />} />
                        <Route path="cars" element={<AdminCars />} />
                        <Route path="bookings" element={<AdminBookings />} />
                    </Routes>

                </main>

            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f5f8fc]">

            <UserNavbar />

            <main>
                <Routes>
                    <Route path="/" element={<Navigate to="cars" replace />} />
                    <Route path="cars" element={<UserCars />} />
                    <Route path="bookings" element={<UserBookings />} />
                </Routes>
            </main>

        </div>
    )
}