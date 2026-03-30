import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const adminLinks = [
    {
        to: '/dashboard/overview', label: 'Overview', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        )
    },
    {
        to: '/dashboard/cars', label: 'Cars', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
        )
    },
    {
        to: '/dashboard/bookings', label: 'Bookings', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        )
    },
]

const userLinks = [
    {
        to: '/dashboard/cars', label: 'Browse Cars', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
            </svg>
        )
    },
    {
        to: '/dashboard/bookings', label: 'My Bookings', icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        )
    },
]

export default function SideBar({ onClose }) {
    const { user, logout } = useAuth();
    const { dark, toggle } = useTheme();

    const navigate = useNavigate();
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
        <div className="w-60 min-h-screen bg-[#0f3460] flex flex-col">
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800/50">

                <div className="flex items-center gap-3">
                    <svg width="30" height="30" viewBox="0 0 36 36" fill="none">
                        <rect width="36" height="36" rx="8" fill="#1d4ed8" />
                        <path d="M8 22h2.5M25.5 22H28M10 18.5l1.5-4.5h13l1.5 4.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                        <path d="M8 22v1.5a1 1 0 001 1h1.5a1 1 0 001-1V22M24.5 22v1.5a1 1 0 001 1H27a1 1 0 001-1V22" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                        <path d="M8 22h20" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                        <circle cx="13" cy="22" r="1.5" fill="#93c5fd" />
                        <circle cx="23" cy="22" r="1.5" fill="#93c5fd" />
                    </svg>
                    <div>
                        <span className="text-blue-300 font-bold text-xs tracking-widest block" style={{ fontFamily: 'Outfit, sans-serif' }}>DriveEase</span>
                    </div>
                </div>
                {/* Close button — mobile only */}
                <button
                    onClick={onClose}
                    className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg bg-blue-800/50 text-blue-200 hover:bg-blue-700/50 cursor-pointer transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>


            {/* User info */}
            <div className="px-5 py-4 border-b border-blue-800/50">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400/30 flex items-center justify-center text-blue-200 text-xs font-semibold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isAdmin ? 'bg-amber-400/20 text-amber-300' : 'bg-blue-400/20 text-blue-300'}`}>
                            {user?.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <p className="text-blue-400/60 text-xs font-medium uppercase tracking-widest px-3 mb-3">
                    {isAdmin ? 'Management' : 'Menu'}
                </p>
                {links.map(link => (
                    <NavLink
                        key={link.to} to={link.to}
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20'
                                : 'text-blue-200 hover:bg-blue-800/50 hover:text-white'
                            }`
                        }
                    >
                        {link.icon}
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            {/* Theme toggle */}
            <div className="px-3 pb-2">
                <button
                    onClick={toggle}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-blue-200 hover:bg-blue-800/50 transition-all cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                        {dark ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                            </svg>
                        )}
                        <span>{dark ? 'Light mode' : 'Dark mode'}</span>
                    </div>
                    {/* Toggle pill */}
                    <div className={`w-10 h-5 rounded-full transition-colors duration-300 relative ${dark ? 'bg-blue-500' : 'bg-blue-800/60'}`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${dark ? 'left-5' : 'left-0.5'}`} />
                    </div>
                </button>
            </div>

            {/* Logout */}
            <div className="px-3 pb-5">
                <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-blue-300 hover:bg-red-500/20 hover:text-red-300 transition-all"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    Sign out
                </button>
            </div>
        </div>
    )
}