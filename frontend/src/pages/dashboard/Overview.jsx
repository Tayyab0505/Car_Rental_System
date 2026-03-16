import { useEffect, useState } from 'react'
import API from '../../api/axios'

const StatCard = ({ label, value, icon, color, sub }) => (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-start justify-between mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                {icon}
            </div>
        </div>
        <p className="text-2xl font-semibold text-slate-800 mb-0.5" style={{ fontFamily: 'Outfit,sans-serif' }}>{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
)

export default function Overview() {
    const [cars, setCars] = useState([])
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

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

    const stats = [
        {
            label: 'Total cars', value: loading ? '...' : cars.length,
            sub: `${availableCars} available`,
            color: 'bg-blue-50 text-blue-600',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
        },
        {
            label: 'Total bookings', value: loading ? '...' : bookings.length,
            sub: `${pendingBookings} pending`,
            color: 'bg-violet-50 text-violet-600',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
        },
        {
            label: 'Revenue', value: loading ? '...' : `$${totalRevenue.toLocaleString()}`,
            sub: 'From confirmed bookings',
            color: 'bg-emerald-50 text-emerald-600',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
        },
        {
            label: 'Confirmed', value: loading ? '...' : bookings.filter(b => b.status === 'confirmed').length,
            sub: 'Bookings confirmed',
            color: 'bg-amber-50 text-amber-600',
            icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
        },
    ]

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800" style={{ fontFamily: 'Outfit,sans-serif' }}>Overview</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back — here's what's happening today</p>
            </div>

            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map(s => <StatCard key={s.label} {...s} />)}
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800" style={{ fontFamily: 'Outfit,sans-serif' }}>Recent bookings</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100">
                                {['ID', 'Car ID', 'Start', 'End', 'Amount', 'Status'].map(h => (
                                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-10 text-slate-400">Loading...</td></tr>
                            ) : bookings.slice(0, 6).map(b => (
                                <tr key={b.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3.5 text-slate-600 font-mono text-xs">#{b.id}</td>
                                    <td className="px-6 py-3.5 text-slate-600">{b.carId}</td>
                                    <td className="px-6 py-3.5 text-slate-600">{b.startDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-3.5 text-slate-600">{b.endDate?.slice(0, 10)}</td>
                                    <td className="px-6 py-3.5 text-slate-700 font-medium">${Number(b.totalAmount || 0).toLocaleString()}</td>
                                    <td className="px-6 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' :
                                                b.status === 'pending' ? 'bg-amber-50 text-amber-700' :
                                                    'bg-red-50 text-red-600'
                                            }`}>{b.status}</span>
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