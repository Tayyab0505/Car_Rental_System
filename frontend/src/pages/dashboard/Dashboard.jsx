import { useState } from 'react'
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
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const isAdmin = user?.role === 'admin'

    if (isAdmin) {
        return (
            <div className="flex h-dvh overflow-hidden bg-[#f6f8fc]">
                {sidebarOpen && (
                    <button onClick={() => setSidebarOpen(false)} className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden" />
                )}

                <aside className={`fixed inset-y-0 left-0 z-50 w-72 shrink-0 transition-transform duration-300 lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Sidebar onClose={() => setSidebarOpen(false)} />
                </aside>

                <div className="flex-1 min-w-0 flex flex-col">
                    <header className="lg:hidden h-18 shrink-0 bg-white border-b border-slate-200 px-4 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-600">DriveEase</p>
                            <p className="text-sm font-bold text-[#0f172a]">Admin Console</p>
                        </div>

                        <button onClick={() => setSidebarOpen(true)} className="size-11 rounded-xl border border-slate-200 bg-white text-slate-600 flex items-center justify-center shadow-sm">
                            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </header>

                    <main className="flex-1 min-w-0 overflow-y-auto">
                        <Routes>
                            <Route path="/" element={<Navigate to="overview" replace />} />
                            <Route path="overview" element={<Overview />} />
                            <Route path="cars" element={<AdminCars />} />
                            <Route path="bookings" element={<AdminBookings />} />
                            <Route path="*" element={<Navigate to="overview" replace />} />
                        </Routes>
                    </main>
                </div>
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
                    <Route path="*" element={<Navigate to="cars" replace />} />
                </Routes>
            </main>
        </div>
    )
}