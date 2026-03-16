import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

export default function Bookings() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin'
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [msg, setMsg] = useState('')

    const fetchBookings = () => {
        setLoading(true);

        const endpoint = isAdmin ? '/getAllBooking' : `/getByID/${user?.id}`
        API.get(endpoint)
            .then(r => setBookings(Array.isArray(r.data) ? r.data : [r.data]))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        const endpoint = isAdmin ? '/getAllBooking' : `/getByID/${user?.id}`
        API.get(endpoint)
            .then(r => setBookings(Array.isArray(r.data) ? r.data : [r.data]))
            .finally(() => setLoading(false))
    }, [])

    const handleConfirm = async (id) => {
        try {
            await API.put(`/bookings/${id}/confirm`);
            fetchBookings();
            setMsg('Booking Confirmed')
        } catch {
            setMsg('Failed to confirm')
        }
    }

    const handleCancel = async (id) => {
        if (!window.confirm('Cancel this booking?')) return
        try {
            await API.delete(`/cancelBooking/${id}`);
            fetchBookings();
            setMsg('Booking cancelled')
        }
        catch { setMsg('Failed to cancel') }
    }

    const statusStyle = (s) => ({
        confirmed: 'bg-emerald-50 text-emerald-700',
        pending: 'bg-amber-50 text-amber-700',
        cancelled: 'bg-red-50 text-red-600',
    }[s] || 'bg-slate-100 text-slate-500')

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'Outfit,sans-serif' }}>
                    {isAdmin ? 'All bookings' : 'My bookings'}
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                    {isAdmin ? 'Manage and confirm customer bookings' : 'Track your rental history'}
                </p>
            </div>

            {msg && <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-sm">{msg}</div>}

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                {['Booking ID', 'Car ID', 'Start date', 'End date', 'Total', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-6 py-3.5 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="text-center py-16 text-slate-400">Loading bookings...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan={7} className="text-center py-16 text-slate-400">No bookings found</td></tr>
                            ) : bookings.map(b => (
                                <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">#{b.id}</td>
                                    <td className="px-6 py-4 text-slate-600">{b.carId}</td>
                                    <td className="px-6 py-4 text-slate-600">{b.startDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-4 text-slate-600">{b.endDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-4 font-semibold text-slate-800">${Number(b.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle(b.status)}`}>{b.status}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {isAdmin && b.status === 'pending' && (
                                                <button onClick={() => handleConfirm(b.id)} className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-medium hover:bg-emerald-100 transition-colors whitespace-nowrap">
                                                    Confirm
                                                </button>
                                            )}
                                            {b.status !== 'cancelled' && (
                                                <button onClick={() => handleCancel(b.id)} className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors whitespace-nowrap">
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}