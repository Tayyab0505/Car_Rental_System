import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserNavbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">

            <div className="max-w-[1500px] mx-auto h-18 px-5 md:px-8 flex items-center justify-between">

                <div className="flex items-center gap-3">

                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">

                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                            <circle cx="7" cy="17" r="2" />
                            <circle cx="17" cy="17" r="2" />
                            <path d="M5 9h14" />
                        </svg>

                    </div>

                    <div>
                        <h1 className="text-xl font-bold text-[#071b34]">
                            Drive<span className="text-cyan-500">Now</span>
                        </h1>

                        <p className="text-[9px] uppercase tracking-[0.18em] text-slate-400">
                            Premium Rentals
                        </p>
                    </div>

                </div>

                <nav className="hidden md:flex items-center gap-8">

                    <NavLink
                        to="/dashboard/cars"
                        className={({ isActive }) =>
                            `text-sm font-medium transition ${isActive
                                ? 'text-blue-600'
                                : 'text-slate-600 hover:text-blue-600'
                            }`
                        }
                    >
                        Cars
                    </NavLink>

                    <NavLink
                        to="/dashboard/bookings"
                        className={({ isActive }) =>
                            `text-sm font-medium transition ${isActive
                                ? 'text-blue-600'
                                : 'text-slate-600 hover:text-blue-600'
                            }`
                        }
                    >
                        My Bookings
                    </NavLink>

                    <a
                        href="#popular-cars"
                        className="text-sm font-medium text-slate-600 hover:text-blue-600 transition"
                    >
                        Explore
                    </a>

                </nav>

                <div className="flex items-center gap-3">

                    <div className="hidden sm:block text-right">
                        <p className="text-sm font-semibold text-slate-800">
                            {user?.name}
                        </p>

                        <p className="text-[11px] text-slate-400">
                            Customer
                        </p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase()}
                    </div>

                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="w-10 h-10 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.8}
                            viewBox="0 0 24 24"
                        >
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <path d="M16 17l5-5-5-5M21 12H9" />
                        </svg>
                    </button>

                </div>

            </div>

        </header>
    )
}