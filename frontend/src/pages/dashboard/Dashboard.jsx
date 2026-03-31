import { useState } from 'react'
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
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out lg:static lg:h-screen lg:translate-x-0 lg:z-auto lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <Sidebar onClose={() => setSidebarOpen(false)} />
            </aside>

            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
                {/* Mobile topbar */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-[#0f3460] border-b border-blue-800/50 sticky top-0 z-20">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-500/20 text-white cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <div className="flex items-center gap-2">
                        <svg width="22" height="22" viewBox="0 0 36 36" fill="none">
                            <rect width="36" height="36" rx="8" fill="#1d4ed8" />
                            <path d="M8 22h2.5M25.5 22H28M10 18.5l1.5-4.5h13l1.5 4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M8 22v1.5a1 1 0 001 1h1.5a1 1 0 001-1V22M24.5 22v1.5a1 1 0 001 1H27a1 1 0 001-1V22" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M8 22h20" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                            <circle cx="13" cy="22" r="1.5" fill="#93c5fd" />
                            <circle cx="23" cy="22" r="1.5" fill="#93c5fd" />
                        </svg>
                        <span className="text-white font-semibold text-sm" style={{ fontFamily: 'Outfit,sans-serif' }}>DriveEase</span>
                    </div>
                </div>

                <main className="flex-1 h-screen overflow-y-auto bg-slate-50 dark:bg-slate-900">
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
        </div>
    )
}