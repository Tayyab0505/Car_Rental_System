import { useEffect, useState } from 'react'
import API from '../../api/axios'
import { useAuth } from '../../context/AuthContext'

export default function UserBookings() {
    const { user } = useAuth()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')
    const [cancelModel, setCancelModel] = useState(null)

    const fetchBookings = () => {
        setLoading(true)
        API.get('/getAllBooking')
            .then(r => {
                const all = Array.isArray(r.data) ? r.data : []
                setBookings(all.filter(b => b.userId === user?.id))
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        fetchBookings()
    }, []);

    const handleCancel = async () => {
        try {
            await API.delete(`/cancelBooking/${cancelModel}`);
            setCancelModel(null)
            fetchBookings()
            setMsg('Booking cancelled')
        }
        catch { setMsg('Failed to cancel') }
    }

    const statusStyle = (s) => ({
        confirmed: 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400',
        pending: 'bg-amber-50 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400',
        cancelled: 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400',
    }[s] || 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400')

    return (
        <div className="p-8">
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

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                                {['Booking ID', 'User ID', 'Car ID', 'Start date', 'End date', 'Total', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={8} className="text-center py-16 text-slate-400 dark:text-slate-500">Loading bookings...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-16 text-slate-400 dark:text-slate-500">No bookings found</td></tr>
                            ) : bookings.map(b => (
                                <tr key={b.id} className="border-b border-slate-50 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500 dark:text-slate-400">#{b.id}</td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{b.userId}</td>
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