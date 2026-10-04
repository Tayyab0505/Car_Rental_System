import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const adminLinks = [
    {
        to: '/dashboard/overview',
        label: 'Overview',
        icon: (
            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
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

export default function Sidebar({ onClose }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const handleNavClick = () => {
        if (onClose) onClose()
    }

    return (
        <div className="relative w-full h-dvh overflow-hidden bg-linear-to-b from-[#171b2b] via-[#151a29] to-[#101521] text-white flex flex-col border-r border-white/5 shadow-[12px_0_35px_rgba(15,23,42,0.12)]">
            <div className="absolute -top-36 -left-24 size-72 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute bottom-10 -right-28 size-64 rounded-full bg-violet-500/8 blur-3xl" />

            <div className="relative h-22 px-5 flex items-center justify-between border-b border-white/8">
                <div className="flex items-center gap-3">
                    <div className="size-12 rounded-2xl bg-linear-to-br from-indigo-500 via-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-950/40">
                        <svg className="size-7 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                            <circle cx="7" cy="17" r="2" />
                            <circle cx="17" cy="17" r="2" />
                            <path d="M5 9h14" />
                        </svg>
                    </div>

                    <div>
                        <h1 className="text-lg font-bold tracking-tight">
                            Drive<span className="text-indigo-300">Ease</span>
                        </h1>
                        <p className="text-[9px] text-slate-500 tracking-[0.24em] uppercase">Admin Console</p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="lg:hidden size-9 rounded-xl bg-white/5 text-slate-300 flex items-center justify-center hover:bg-white/10 transition"
                >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                </button>
            </div>

            <div className="relative px-4 pt-5">
                <div className="rounded-3xl border border-white/8 bg-white/5 p-4 shadow-[0_12px_30px_rgba(0,0,0,0.16)]">
                    <div className="flex items-center gap-3">
                        <div className="size-13 rounded-2xl bg-linear-to-br from-indigo-500/25 to-violet-500/10 border border-indigo-300/15 text-indigo-200 flex items-center justify-center text-lg font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-100 truncate">{user?.name || 'Administrator'}</p>

                            <div className="flex items-center gap-2 mt-1">
                                <span className="size-1.5 rounded-full bg-emerald-400" />
                                <span className="text-[11px] text-slate-500">Administrator</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="relative flex-1 px-3 pt-7">
                <p className="px-3 mb-3 text-[10px] font-semibold text-slate-600 uppercase tracking-[0.24em]">Management</p>

                <div className="space-y-2">
                    {adminLinks.map(link => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            onClick={handleNavClick}
                            className={({ isActive }) =>
                                `group relative flex items-center gap-3 px-3 py-3 rounded-2xl border text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-white/9 border-white/10 text-white shadow-[0_12px_30px_rgba(0,0,0,0.16)]'
                                    : 'border-transparent text-slate-500 hover:bg-white/5 hover:text-slate-200'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`size-10 rounded-xl flex items-center justify-center transition-all ${isActive
                                            ? 'bg-linear-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-950/30'
                                            : 'bg-white/4 text-slate-500 group-hover:bg-white/7 group-hover:text-indigo-300'
                                        }`}>
                                        {link.icon}
                                    </span>

                                    <span>{link.label}</span>

                                    {isActive && (
                                        <span className="absolute right-4 size-1.5 rounded-full bg-indigo-300 shadow-[0_0_10px_rgba(165,180,252,0.8)]" />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>

            <div className="relative px-4 pb-5">
                <div className="rounded-3xl border border-white/8 bg-white/4 p-4 mb-3">
                    <div className="flex items-center gap-2">
                        <span className="relative flex size-2">
                            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 opacity-40 animate-ping" />
                            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                        </span>

                        <p className="text-xs font-medium text-slate-300">System Online</p>
                    </div>

                    <p className="text-[10px] text-slate-600 mt-1.5">DriveEase management services are active.</p>
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-slate-500 hover:text-rose-300 hover:bg-rose-500/8 transition"
                >
                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                        <path d="M16 17l5-5-5-5M21 12H9" />
                    </svg>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    )
}