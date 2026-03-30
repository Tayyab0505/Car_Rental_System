import { useEffect, useState } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

const Pagination = ({ page, totalPages, setPage }) => {
    if (totalPages <= 1) return null
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
        .reduce((acc, n, i, arr) => {
            if (i > 0 && n - arr[i - 1] > 1) acc.push('...')
            acc.push(n)
            return acc
        }, [])
    return (
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                </button>
                {pages.map((n, i) => n === '...' ? (
                    <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-slate-400">...</span>
                ) : (
                    <button key={n} onClick={() => setPage(n)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-medium transition-colors cursor-pointer ${page === n ? 'bg-blue-700 text-white border border-blue-700' : 'border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}>
                        {n}
                    </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </div>
    )
}

export default function UserBookings() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [msg, setMsg] = useState('')
    const [cancelModel, setCancelModel] = useState(null)
    const [rowLimit, setRowLimit] = useState(5)
    const [page, setPage] = useState(1)

    useEffect(() => {
        if (!user?.id) return

        const fetchBookings = () => {
            setLoading(true)
            setError('')
            API.get(`/getBookingsByUser/${user?.id}`)
                .then(r => setBookings(Array.isArray(r.data) ? r.data : []))
                .catch(() => setError('Failed to load bookings. Please try again'))
                .finally(() => setLoading(false))
        }

        fetchBookings()

    }, [user?.id]);

    const totalPages = Math.ceil(bookings.length / rowLimit) || 1
    const paginated = bookings.slice((page - 1) * rowLimit, page * rowLimit)
    const handleLimitChange = (val) => { setRowLimit(Number(val)); setPage(1) }

    const handleCancel = async () => {
        try {
            await API.delete(`/cancelBooking/${cancelModel}`);
            setCancelModel(null)

            setLoading(true)
            API.get(`/getBookingsByUser/${user?.id}`)
                .then(r => setBookings(Array.isArray(r.data) ? r.data : []))
                .catch(() => setError('Failed to refresh bookings'))
                .finally(() => setLoading(false))
            setMsg('Booking cancelled')
            setTimeout(() => setMsg(''), 3000)
        }
        catch { setMsg('Failed to cancel booking') }
        setTimeout(() => setMsg(''), 3000)
    };

    const statusStyle = (s) => ({
        confirmed: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
        pending: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
        cancelled: 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    }[s] || 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>
                    My bookings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Track your rental history
                </p>
            </div>

            {msg && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl text-sm">
                    {msg}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl text-sm">
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">

                    <div>
                        <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>Bookings</h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Showing {paginated.length} of {bookings.length} bookings</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">Rows per page</span>
                        <select
                            value={rowLimit}
                            onChange={e => handleLimitChange(e.target.value)}
                            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer"
                        >
                            {[5, 10, 20, 25, 50].map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                                {['Booking ID', 'Car ID', 'Start date', 'End date', 'Total', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                                            <span className="text-slate-400 dark:text-slate-500 text-sm">
                                                Loading bookings...
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                                                <svg className="w-6 h-6 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                                                </svg>
                                            </div>

                                            <div>
                                                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm">No bookings yet</p>
                                                <p className="text-slate-400 dark:text-slate-500 text-xs mt-0.5">Browse cars and make your first booking</p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : paginated.map(b => (
                                <tr key={b.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">#{b.id}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{b.carId}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{b.startDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{b.endDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">${Number(b.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(b.status)}`}>{b.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {b.status !== 'cancelled' && (
                                            <button
                                                onClick={() => setCancelModel(b.id)} className="px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors cursor-pointer whitespace-nowrap border border-red-100 dark:border-red-800">
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>

            {cancelModel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 dark:border-slate-700">

                        {/* Icon */}
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>

                        {/* Text */}
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 text-center mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>
                            Cancel booking?
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">Booking #{cancelModel} will be permanently cancelled.</p>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setCancelModel(null)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors cursor-pointer"
                            >
                                Yes, cancel it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}