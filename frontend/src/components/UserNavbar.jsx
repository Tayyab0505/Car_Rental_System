import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserNavbar() {
    const { token, user, logout } = useAuth()
    const navigate = useNavigate()

    const carsPath = token
        ? '/dashboard/cars'
        : '/cars'

    const handleLogout = () => {
        logout()
        navigate('/cars')
    }

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">

            <div className="max-w-1500px mx-auto h-20 px-5 md:px-8 flex items-center justify-between">

                <Link
                    to={carsPath}
                    className="flex items-center gap-3"
                >

                    <div className="size-12 rounded-xl bg-linear-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">

                        <svg
                            className="size-7 text-white"
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

                        <h1 className="text-xl font-bold text-[#0b1b30] tracking-tight">
                            Drive<span className="text-cyan-500">Ease</span>
                        </h1>

                        <p className="text-[9px] uppercase tracking-[0.2em] text-slate-400">
                            Premium Rentals
                        </p>

                    </div>

                </Link>

                <nav className="hidden md:flex items-center gap-9">

                    <NavLink
                        to={carsPath}
                        className={({ isActive }) =>
                            `relative py-7 text-sm font-medium transition-colors ${isActive
                                ? 'text-blue-600'
                                : 'text-slate-600 hover:text-blue-600'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                Cars

                                {isActive && (
                                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-400 rounded-full" />
                                )}
                            </>
                        )}
                    </NavLink>

                    {token && (
                        <NavLink
                            to="/dashboard/bookings"
                            className={({ isActive }) =>
                                `relative py-7 text-sm font-medium transition-colors ${isActive
                                    ? 'text-blue-600'
                                    : 'text-slate-600 hover:text-blue-600'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    My Bookings

                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-cyan-400 rounded-full" />
                                    )}

                                </>
                            )}
                        </NavLink>
                    )}

                </nav>

                {token ? (
                    <div className="flex items-center gap-3">

                        <div className="hidden sm:block text-right">

                            <p className="text-sm font-semibold text-[#0b1b30]">
                                {user?.name}
                            </p>

                            <p className="text-[11px] text-slate-400">
                                Customer
                            </p>

                        </div>

                        <div className="size-11 rounded-full bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <button
                            onClick={handleLogout}
                            title="Sign out"
                            className="size-11 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition"
                        >
                            <svg
                                className="size-5"
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
                ) : (
                    <div className="flex items-center gap-2 sm:gap-3">

                        <Link
                            to="/login"
                            className="h-11 px-4 sm:px-5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center justify-center hover:border-blue-300 hover:text-blue-600 transition"
                        >
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="h-11 px-4 sm:px-5 rounded-xl bg-linear-to-r from-[#2563eb] to-[#0ea5e9] text-white text-sm font-semibold flex items-center justify-center shadow-md shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
                        >
                            Sign Up
                        </Link>

                    </div>
                )}

            </div>

        </header>
    )
}