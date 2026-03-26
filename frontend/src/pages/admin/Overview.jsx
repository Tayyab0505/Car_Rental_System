import { useEffect, useState } from 'react'
import API from '../../api/axios'

const StatCard = ({ label, value, icon, color, sub }) => (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
        <p className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-0.5" style={{ fontFamily: 'Outfit,sans-serif' }}>{value}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
    </div>
)

export default function Overview() {
    const [cars, setCars] = useState([])
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [rowLimit, setRowLimit] = useState(5)
    const [page, setPage] = useState(1)

    useEffect(() => {
        Promise.all([API.get('/findAllCar'), API.get('/getAllBooking')])
            .then(([carsRes, bookingsRes]) => {
                setCars(carsRes.data)
                setBookings(bookingsRes.data)
            })
            .finally(() => setLoading(false))
    }, [])

    const totalRevenue = bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + Number(b.totalAmount || 0), 0)

    const pendingBookings = bookings.filter(b => b.status === 'pending').length
    const availableCars = cars.filter(c => c.availability).length

    const totalPages = Math.ceil(bookings.length / rowLimit)
    const paginated = bookings.slice((page - 1) * rowLimit, page * rowLimit);

    const handleLimitChange = (val) => {
        setRowLimit(Number(val))
        setPage(1)
    }

    const stats = [
        {
            label: 'Total cars', value: loading ? '...' : cars.length,
            sub: `${availableCars} available`,
            color: 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
        },
        {
            label: 'Total bookings', value: loading ? '...' : bookings.length,
            sub: `${pendingBookings} pending`,
            color: 'bg-violet-50 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
        },
        {
            label: 'Revenue', value: loading ? '...' : `$${totalRevenue.toLocaleString()}`,
            sub: 'From confirmed bookings',
            color: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
        },
        {
            label: 'Confirmed', value: loading ? '...' : bookings.filter(b => b.status === 'confirmed').length,
            sub: 'Bookings confirmed',
            color: 'bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        },
    ]

    const statusStyle = (s) => ({
        confirmed: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
        pending: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
        cancelled: 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    }[s] || 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>Overview</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Welcome back — here's what's happening today</p>
            </div>

            {/* Stat Cards */}

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Recent bookings table */}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">

                {/* Table header with row limit selector */}

                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>Recent bookings</h2>
                        <p className='text-xs text-slate-400 dark:text-slate-500 mt-0.5'>Showing {paginated.length} of {bookings.length} bookings</p>
                    </div>

                    {/* Rows per page */}

                    <div className='flex items-center gap-2'>
                        <span className='text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap'>Rows per page</span>
                        <select value={rowLimit}
                            onChange={e => handleLimitChange(e.target.value)}
                            className='text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer transition-colors'>
                            {[5, 10, 20, 25, 50].map(n => (
                                <option key={n} value={n}>{n}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                {['ID', 'User ID', 'Car ID', 'Start', 'End', 'Amount', 'Status'].map(h => (
                                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-10 text-slate-400 dark:text-slate-500">Loading...</td></tr>
                            ) : bookings.slice(0, 6).map(b => (
                                <tr key={b.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400 font-mono text-xs">#{b.id}</td>
                                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">{b.userId}</td>
                                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">{b.carId}</td>
                                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">{b.startDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-3.5 text-slate-600 dark:text-slate-400">{b.endDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300 font-medium">${Number(b.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(b.status)}`}>{b.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination footer */}

                {totalPages > 1 && (
                    <div className='px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between'>
                        <span className='text-xs text-slate-400 dark:text-slate-500'>
                            Page {page} of {totalPages}
                        </span>

                        <div className='flex items-center gap-1'>
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className='w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer'>
                                
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}