import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

const backendUrl = (API.defaults.baseURL || '').replace(/\/api\/?$/, '')

function getImageUrl(value) {
    if (!value) return ''
    if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) return value
    return `${backendUrl}${value}`
}

function formatDate(value) {
    if (!value) return '-'

    const date = new Date(`${value}T00:00:00`)

    if (Number.isNaN(date.getTime())) return '-'

    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

function getCarName(booking) {
    const brand = booking?.car?.brand || ''
    const model = booking?.car?.model || ''
    const name = `${brand} ${model}`.trim()

    return name || `Car #${booking.carId}`
}

function getCarImage(booking) {
    return getImageUrl(booking?.car?.imageUrl || '')
}

function getStatusClass(status) {
    if (status === 'confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (status === 'cancelled') return 'bg-rose-50 text-rose-600 border-rose-100'

    return 'bg-amber-50 text-amber-700 border-amber-100'
}

function StatCard({ title, value, subtitle, icon, iconClass }) {
    return (
        <div className="group relative overflow-hidden bg-white rounded-[28px] border border-[#e6ebf2] p-5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 transition-all duration-300">
            <div className="absolute -top-10 -right-10 size-24 rounded-full bg-slate-100/70 group-hover:scale-125 transition-transform duration-500" />

            <div className="relative">
                <div className={`size-12 rounded-2xl flex items-center justify-center ${iconClass}`}>
                    {icon}
                </div>

                <div className="mt-6">
                    <p className="text-3xl font-bold tracking-tight text-[#0f172a]">
                        {value}
                    </p>

                    <p className="text-sm font-semibold text-slate-700 mt-1">
                        {title}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                        {subtitle}
                    </p>
                </div>
            </div>
        </div>
    )
}

function Pagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    )
        .filter(number =>
            number === 1 ||
            number === totalPages ||
            Math.abs(number - page) <= 1
        )
        .reduce((result, number, index, array) => {
            if (index > 0 && number - array[index - 1] > 1) {
                result.push('...')
            }

            result.push(number)

            return result
        }, [])

    return (
        <div className="px-5 md:px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
                Page{' '}
                <span className="font-semibold text-slate-600">
                    {page}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-slate-600">
                    {totalPages}
                </span>
            </p>

            <div className="flex items-center gap-1.5">
                <button onClick={() => setPage(current => Math.max(1, current - 1))} disabled={page === 1} className="size-9 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                {pages.map((number, index) =>
                    number === '...' ? (
                        <span key={`dots-${index}`} className="size-9 flex items-center justify-center text-xs text-slate-400">
                            ...
                        </span>
                    ) : (
                        <button key={number} onClick={() => setPage(number)} className={`size-9 rounded-xl text-xs font-semibold transition ${page === number ? 'bg-linear-to-r from-[#1d4ed8] to-[#0ea5e9] text-white shadow-md shadow-blue-500/20' : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'}`}>
                            {number}
                        </button>
                    )
                )}

                <button onClick={() => setPage(current => Math.min(totalPages, current + 1))} disabled={page === totalPages} className="size-9 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition">
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </div>
    )
}

export default function Overview() {
    const { user } = useAuth()
    const navigate = useNavigate()

    const [cars, setCars] = useState([])
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [rowLimit, setRowLimit] = useState(5)
    const [page, setPage] = useState(1)

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                const [carsResponse, bookingsResponse] = await Promise.all([
                    API.get('/findAllAdminCars'),
                    API.get('/getAllBooking')
                ])

                setCars(
                    Array.isArray(carsResponse.data)
                        ? carsResponse.data
                        : []
                )

                setBookings(
                    Array.isArray(bookingsResponse.data)
                        ? bookingsResponse.data
                        : []
                )
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load dashboard data'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchOverview()
    }, [])

    const summary = useMemo(() => {
        const availableCars = cars.filter(car =>
            car.availability &&
            (car.status || 'available') === 'available'
        ).length

        const pending = bookings.filter(booking =>
            booking.status === 'pending'
        ).length

        const confirmed = bookings.filter(booking =>
            booking.status === 'confirmed'
        ).length

        const cancelled = bookings.filter(booking =>
            booking.status === 'cancelled'
        ).length

        const revenue = bookings
            .filter(booking =>
                booking.status === 'confirmed'
            )
            .reduce(
                (total, booking) =>
                    total + Number(booking.totalAmount || 0),
                0
            )

        return {
            availableCars,
            pending,
            confirmed,
            cancelled,
            revenue
        }
    }, [cars, bookings])

    const totalPages = Math.max(
        1,
        Math.ceil(bookings.length / rowLimit)
    )

    const safePage = Math.min(
        page,
        totalPages
    )

    const paginatedBookings = useMemo(() => {
        const start = (safePage - 1) * rowLimit

        return bookings.slice(
            start,
            start + rowLimit
        )
    }, [bookings, rowLimit, safePage])

    const stats = [
        {
            title: 'Total Cars',
            value: loading ? '...' : cars.length,
            subtitle: `${summary.availableCars} currently available`,
            iconClass: 'bg-blue-50 text-blue-600',
            icon: (
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                    <path d="M5 9h14" />
                </svg>
            )
        },
        {
            title: 'Total Bookings',
            value: loading ? '...' : bookings.length,
            subtitle: `${summary.pending} awaiting approval`,
            iconClass: 'bg-violet-50 text-violet-600',
            icon: (
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
            )
        },
        {
            title: 'Revenue',
            value: loading ? '...' : `$${summary.revenue.toLocaleString()}`,
            subtitle: 'From confirmed bookings',
            iconClass: 'bg-emerald-50 text-emerald-600',
            icon: (
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path d="M12 2v20M17 6.5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H7" />
                </svg>
            )
        },
        {
            title: 'Confirmed',
            value: loading ? '...' : summary.confirmed,
            subtitle: 'Approved rental requests',
            iconClass: 'bg-cyan-50 text-cyan-600',
            icon: (
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12l2.5 2.5L16 9" />
                </svg>
            )
        }
    ]

    return (
        <div className="min-h-full bg-[#f6f8fc]">
            <div className="max-w-screen-2xl mx-auto px-4 py-6 md:px-8 md:py-8">
                <section className="relative overflow-hidden rounded-4xl bg-linear-to-r from-[#0a1426] via-[#10243f] to-[#183b63] p-7 md:p-9 shadow-[0_20px_50px_rgba(2,6,23,0.18)]">
                    <div className="absolute -top-24 right-10 size-72 rounded-full bg-sky-400/10 blur-3xl" />
                    <div className="absolute -bottom-24 left-1/3 size-64 rounded-full bg-blue-500/10 blur-3xl" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div>
                            <p className="text-sky-300 text-xs font-semibold tracking-[0.22em] uppercase">
                                Admin Overview
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold text-white mt-3">
                                Welcome back,{' '}
                                <span className="text-sky-300">
                                    {user?.name || 'Admin'}
                                </span>
                            </h1>

                            <p className="text-sm md:text-base text-slate-300 mt-3 max-w-2xl leading-7">
                                Monitor your fleet, bookings and rental activity from one place.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="min-w-32 rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <p className="text-2xl font-bold text-white">
                                    {loading ? '...' : summary.pending}
                                </p>

                                <p className="text-xs text-slate-300 mt-1">
                                    Pending Requests
                                </p>
                            </div>

                            <div className="min-w-32 rounded-3xl border border-white/10 bg-white/8 backdrop-blur-xl px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                                <p className="text-2xl font-bold text-white">
                                    {loading ? '...' : summary.availableCars}
                                </p>

                                <p className="text-xs text-slate-300 mt-1">
                                    Cars Available
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {error && (
                    <div className="mt-6 px-4 py-3.5 rounded-2xl border border-red-200 bg-red-50 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                    {stats.map(stat => (
                        <StatCard key={stat.title} {...stat} />
                    ))}
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-[1fr_2fr] items-start gap-5 mt-6">
                    <div className="self-start bg-white rounded-[28px] border border-[#e6ebf2] shadow-[0_10px_30px_rgba(15,23,42,0.05)] p-6">
                        <p className="text-xs font-semibold tracking-[0.18em] text-sky-600 uppercase">
                            Booking Status
                        </p>

                        <h2 className="text-xl font-bold text-[#0f172a] mt-2">
                            Request Summary
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                            Current booking distribution.
                        </p>

                        <div className="space-y-4 mt-7">
                            <div className="flex items-center justify-between rounded-3xl bg-amber-50 border border-amber-100 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                        <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Pending
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Awaiting action
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xl font-bold text-amber-600">
                                    {summary.pending}
                                </p>
                            </div>

                            <div className="flex items-center justify-between rounded-3xl bg-emerald-50 border border-emerald-100 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 12l4 4L19 6" /></svg>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Confirmed
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Active bookings
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xl font-bold text-emerald-600">
                                    {summary.confirmed}
                                </p>
                            </div>

                            <div className="flex items-center justify-between rounded-3xl bg-rose-50 border border-rose-100 px-4 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center">
                                        <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-700">
                                            Cancelled
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Cancelled requests
                                        </p>
                                    </div>
                                </div>

                                <p className="text-xl font-bold text-rose-500">
                                    {summary.cancelled}
                                </p>
                            </div>
                        </div>

                        <button onClick={() => navigate('/dashboard/bookings')} className="w-full h-11 rounded-2xl border border-slate-200 text-slate-700 text-sm font-semibold mt-6 hover:border-sky-300 hover:text-sky-700 hover:bg-sky-50 transition">
                            Manage Bookings
                        </button>
                    </div>

                    <div className="bg-white rounded-[28px] border border-[#e6ebf2] shadow-[0_10px_30px_rgba(15,23,42,0.05)] overflow-hidden">
                        <div className="px-5 md:px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100">
                            <div>
                                <p className="text-xs font-semibold tracking-[0.18em] text-sky-600 uppercase">
                                    Latest Activity
                                </p>

                                <h2 className="text-xl font-bold text-[#0f172a] mt-1">
                                    Recent Bookings
                                </h2>

                                <p className="text-xs text-slate-400 mt-1">
                                    Showing {paginatedBookings.length} of {bookings.length} bookings
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">
                                    Rows
                                </span>

                                <select
                                    value={rowLimit}
                                    onChange={event => {
                                        setRowLimit(Number(event.target.value))
                                        setPage(1)
                                    }}
                                    className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:border-sky-500"
                                >
                                    {[5, 10, 20].map(value => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>

                                <button onClick={() => navigate('/dashboard/bookings')} className="h-10 px-4 rounded-xl bg-sky-50 text-sky-700 text-sm font-semibold hover:bg-sky-100 transition">
                                    View All
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-190">
                                <thead className="bg-[#f8fafc]">
                                    <tr>
                                        {[
                                            'Booking',
                                            'Vehicle',
                                            'Customer',
                                            'Rental Period',
                                            'Amount',
                                            'Status'
                                        ].map(title => (
                                            <th key={title} className="px-5 py-4 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                                {title}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan={6} className="py-16">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="size-6 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />

                                                    <span className="text-sm text-slate-400">
                                                        Loading dashboard...
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : paginatedBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                                                No bookings found
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedBookings.map(booking => (
                                            <tr key={booking.id} className="border-t border-slate-100 hover:bg-slate-50/70 transition">
                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-semibold text-[#0f172a]">
                                                        #{booking.id}
                                                    </p>

                                                    <p className="text-[11px] text-slate-400 mt-1">
                                                        Car #{booking.carId}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-11 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                                            {getCarImage(booking) ? (
                                                                <img src={getCarImage(booking)} alt={getCarName(booking)} className="size-full object-cover" />
                                                            ) : (
                                                                <div className="size-full flex items-center justify-center text-slate-300">
                                                                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                                                        <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                                                                        <circle cx="7" cy="17" r="2" />
                                                                        <circle cx="17" cy="17" r="2" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <p className="text-sm font-semibold text-slate-700">
                                                            {getCarName(booking)}
                                                        </p>
                                                    </div>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-slate-600">
                                                        User #{booking.userId}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm text-slate-600">
                                                        {formatDate(booking.startDate)}
                                                    </p>

                                                    <p className="text-xs text-slate-400 mt-1">
                                                        to {formatDate(booking.endDate)}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <p className="text-sm font-bold text-[#0f172a]">
                                                        ${Number(booking.totalAmount || 0).toLocaleString()}
                                                    </p>
                                                </td>

                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-semibold capitalize ${getStatusClass(booking.status)}`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination page={safePage} totalPages={totalPages} setPage={setPage} />
                    </div>
                </section>
            </div>
        </div>
    )
}