import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

export default function SideBar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const isAdmin = user?.role === 'admin'
    const links = isAdmin ? adminLinks : userLinks

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="w-60 min-h-screen bg-[#0f3460] flex flex-col">
            {/* Brand */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-800/50">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="text-white font-semibold text-base tracking-wide" style={{ fontFamily: 'Outfit,sans-serif' }}>DriveEase</span>
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