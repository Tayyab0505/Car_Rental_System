import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const adminLinks = [
    {
        to: '/dashboard/overview',
        label: 'Overview',
        icon: (
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        )
    },
    {
        to: '/dashboard/cars',
        label: 'Cars',
        icon: (
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
                <path d="M5 9h14" />
            </svg>
        )
    },
    {
        to: '/dashboard/bookings',
        label: 'Bookings',
        icon: (
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        )
    }
]

const userLinks = [
    {
        to: '/dashboard/cars',
        label: 'Browse Cars',
        icon: (
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
                <path d="M5 9h14" />
            </svg>
        )
    },
    {
        to: '/dashboard/bookings',
        label: 'My Bookings',
        icon: (
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        )
    }
]

export default function Sidebar({ onClose }) {
    const { user, logout } = useAuth()
    const { dark, toggle } = useTheme()

    const navigate = useNavigate()

    const isAdmin = user?.role === 'admin'
    const links = isAdmin ? adminLinks : userLinks

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleNavClick = () => {
        if (onClose) {
            onClose()
        }
    }

    return (
        <div className="w-64 h-screen bg-[#081b33] flex flex-col text-white border-r border-white/5">

            <div className="h-20 px-5 flex items-center justify-between border-b border-white/10">

                <div className="flex items-center gap-3">

                    <div className="size-11 rounded-xl bg-linear-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">

                        <svg
                            className="size-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.7}
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                            <circle cx="7" cy="17" r="2" />
                            <circle cx="17" cy="17" r="2" />
                            <path d="M5 9h14" />
                        </svg>

                    </div>

                    <div>

                        <h1 className="text-lg font-bold tracking-wide">
                            Drive<span className="text-cyan-400">Ease</span>
                        </h1>

                        <p className="text-[9px] text-slate-400 tracking-[0.15em]">
                            PREMIUM RENTALS
                        </p>

                    </div>

                </div>

                <button
                    onClick={onClose}
                    className="lg:hidden size-8 rounded-lg flex items-center justify-center bg-white/10 text-slate-300 hover:bg-white/15"
                >
                    <svg
                        className="size-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                    >
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>

            </div>

            <div className="p-4">

                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">

                    <div className="flex items-center gap-3">

                        <div className="size-11 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-200 font-semibold">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">

                            <p className="text-sm font-semibold text-white truncate">
                                {user?.name}
                            </p>

                            <div className="flex items-center gap-1.5 mt-1">

                                <span className="size-1.5 rounded-full bg-emerald-400" />

                                <span className="text-xs text-slate-400 capitalize">
                                    {user?.role} account
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            <nav className="flex-1 px-3">

                <p className="px-3 mb-3 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.18em]">
                    {isAdmin ? 'Management' : 'Discover'}
                </p>

                <div className="space-y-1.5">

                    {links.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                                }`
                            }
                        >
                            {link.icon}
                            <span>{link.label}</span>
                        </NavLink>
                    ))}

                </div>

            </nav>

            <div className="px-3 pb-4">

                <button
                    onClick={toggle}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm text-slate-300 hover:bg-white/10 transition"
                >

                    <div className="flex items-center gap-3">

                        {dark ? (
                            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="4" />
                                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                            </svg>
                        ) : (
                            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                        )}

                        <span>
                            {dark ? 'Light mode' : 'Dark mode'}
                        </span>

                    </div>

                    <div className={`w-10 h-5 rounded-full relative transition-all ${dark ? 'bg-blue-500' : 'bg-slate-600'}`}>

                        <div
                            className={`absolute top-0.5 size-4 rounded-full bg-white shadow transition-all duration-300 ${dark ? 'left-5' : 'left-0.5'
                                }`}
                        />

                    </div>

                </button>

                <div className="my-2 border-t border-white/10" />

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm text-slate-400 hover:text-red-300 hover:bg-red-500/10 transition"
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

                    <span>Sign out</span>

                </button>

            </div>

        </div>
    )
}