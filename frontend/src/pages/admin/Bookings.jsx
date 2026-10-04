import { useEffect, useMemo, useState } from 'react'
import API from '../../api/axios'

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

function getBookingId(booking) {
    return booking?.id || booking?._id || '-'
}

function getCarName(booking) {
    const brand = booking?.car?.brand || ''
    const model = booking?.car?.model || ''
    const name = `${brand} ${model}`.trim()

    return name || `Car #${booking.carId}`
}

function getCarImage(booking) {
    return booking?.car?.imageUrl || ''
}

function getLocation(booking) {
    const city = booking?.car?.city || ''
    const country = booking?.car?.country || ''

    return [city, country].filter(Boolean).join(', ') || 'Location unavailable'
}

function getDays(startDate, endDate) {
    if (!startDate || !endDate) return 0

    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T00:00:00`)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    return days > 0 ? days : 0
}

function getStatusClass(status) {
    if (status === 'confirmed') return 'bg-emerald-50 text-emerald-700 border-emerald-100'
    if (status === 'cancelled') return 'bg-red-50 text-red-600 border-red-100'

    return 'bg-amber-50 text-amber-700 border-amber-100'
}

function getStatusLabel(status) {
    if (status === 'confirmed') return 'Confirmed'
    if (status === 'cancelled') return 'Cancelled'

    return 'Pending'
}

function BookingStat({ label, value, subtext, icon, iconClass }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] px-5 py-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[28px] leading-none font-bold text-slate-900">{value}</p>
                    <p className="text-[15px] font-semibold text-slate-700 mt-3">{label}</p>
                    <p className="text-xs text-slate-400 mt-1">{subtext}</p>
                </div>

                <div className={`size-12 rounded-2xl flex items-center justify-center ${iconClass}`}>
                    {icon}
                </div>
            </div>
        </div>
    )
}

function Pagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null

    const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
        .filter(number => number === 1 || number === totalPages || Math.abs(number - page) <= 1)
        .reduce((result, number, index, array) => {
            if (index > 0 && number - array[index - 1] > 1) result.push('...')
            result.push(number)
            return result
        }, [])

    return (
        <div className="px-5 md:px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
            <p className="text-xs text-slate-400">
                Page <span className="font-semibold text-slate-600">{page}</span> of{' '}
                <span className="font-semibold text-slate-600">{totalPages}</span>
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => setPage(current => Math.max(1, current - 1))}
                    disabled={page === 1}
                    className="size-9 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                </button>

                {pages.map((number, index) =>
                    number === '...' ? (
                        <span key={`dots-${index}`} className="size-9 flex items-center justify-center text-xs text-slate-400">...</span>
                    ) : (
                        <button
                            key={number}
                            onClick={() => setPage(number)}
                            className={`size-9 rounded-xl text-xs font-semibold transition ${page === number
                                    ? 'bg-linear-to-r from-sky-600 to-blue-600 text-white shadow-md shadow-sky-500/20'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {number}
                        </button>
                    )
                )}

                <button
                    onClick={() => setPage(current => Math.min(totalPages, current + 1))}
                    disabled={page === totalPages}
                    className="size-9 rounded-xl border border-slate-200 bg-white text-slate-500 flex items-center justify-center hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                </button>
            </div>
        </div>
    )
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)

    const [message, setMessage] = useState({
        text: '',
        type: 'success'
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [rowLimit, setRowLimit] = useState(10)
    const [page, setPage] = useState(1)

    const [selectedBooking, setSelectedBooking] = useState(null)
    const [confirmTarget, setConfirmTarget] = useState(null)
    const [declineTarget, setDeclineTarget] = useState(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get('/getAllBooking')
                setBookings(Array.isArray(response.data) ? response.data : [])
            } catch (error) {
                setMessage({
                    text: error.response?.data?.message || 'Failed to load bookings.',
                    type: 'error'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [])

    const refreshBookings = async () => {
        const response = await API.get('/getAllBooking')
        setBookings(Array.isArray(response.data) ? response.data : [])
    }

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type })

        setTimeout(() => {
            setMessage({
                text: '',
                type: 'success'
            })
        }, 2500)
    }

    const stats = useMemo(() => ({
        total: bookings.length,
        pending: bookings.filter(booking => booking.status === 'pending').length,
        confirmed: bookings.filter(booking => booking.status === 'confirmed').length,
        cancelled: bookings.filter(booking => booking.status === 'cancelled').length
    }), [bookings])

    const filteredBookings = useMemo(() => {
        let list = [...bookings]

        if (statusFilter !== 'all') {
            list = list.filter(booking => booking.status === statusFilter)
        }

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase()

            list = list.filter(booking => {
                const text = `
                    ${getBookingId(booking)}
                    ${booking.userId || ''}
                    ${booking.carId || ''}
                    ${getCarName(booking)}
                    ${getLocation(booking)}
                    ${booking.status || ''}
                `.toLowerCase()

                return text.includes(search)
            })
        }

        return list
    }, [bookings, searchTerm, statusFilter])

    const totalPages = Math.max(1, Math.ceil(filteredBookings.length / rowLimit))
    const safePage = Math.min(page, totalPages)

    const paginatedBookings = useMemo(() => {
        const start = (safePage - 1) * rowLimit
        return filteredBookings.slice(start, start + rowLimit)
    }, [filteredBookings, rowLimit, safePage])

    const handleConfirm = async () => {
        if (!confirmTarget) return

        setActionLoading(true)

        try {
            await API.put(`/bookings/${getBookingId(confirmTarget)}/confirm`)
            await refreshBookings()

            setConfirmTarget(null)
            setSelectedBooking(null)

            showMessage('Booking confirmed successfully.')
        } catch (error) {
            showMessage(
                error.response?.data?.message || 'Failed to confirm booking.',
                'error'
            )
        } finally {
            setActionLoading(false)
        }
    }

    const handleDecline = async () => {
        if (!declineTarget) return

        setActionLoading(true)

        try {
            await API.put(`/updateBooking/${getBookingId(declineTarget)}`, {
                status: 'cancelled'
            })

            await refreshBookings()

            setDeclineTarget(null)
            setSelectedBooking(null)

            showMessage('Booking request declined.')
        } catch (error) {
            showMessage(
                error.response?.data?.message || 'Failed to decline booking.',
                'error'
            )
        } finally {
            setActionLoading(false)
        }
    }

    const statusTabs = [
        { key: 'all', label: 'All' },
        { key: 'pending', label: 'Pending' },
        { key: 'confirmed', label: 'Confirmed' },
        { key: 'cancelled', label: 'Cancelled' }
    ]

    return (
        <div className="min-h-full bg-[#f4f7fb]">
            <div className="max-w-screen-2xl mx-auto px-5 py-6 md:px-8 md:py-7">
                <section className="relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#334155] px-6 py-6 md:px-8 md:py-7 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                    <div className="absolute -top-20 right-10 size-56 rounded-full bg-white/8 blur-3xl" />
                    <div className="absolute -bottom-20 left-1/3 size-60 rounded-full bg-sky-400/10 blur-3xl" />

                    <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-sky-300">Booking Management</p>
                            <h1 className="text-3xl md:text-[40px] leading-tight font-bold text-white mt-3">Manage Bookings</h1>

                            <p className="text-[15px] leading-7 text-slate-300 mt-3 max-w-xl">
                                Review customer requests, confirm rentals and keep track of booking activity.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="min-w-28 rounded-[22px] border border-white/10 bg-white/8 backdrop-blur-md px-4 py-4">
                                <p className="text-2xl font-bold text-white">{stats.pending}</p>
                                <p className="text-sm text-slate-300 mt-1">Pending Requests</p>
                            </div>

                            <div className="min-w-28 rounded-[22px] border border-white/10 bg-white/8 backdrop-blur-md px-4 py-4">
                                <p className="text-2xl font-bold text-white">{stats.confirmed}</p>
                                <p className="text-sm text-slate-300 mt-1">Confirmed</p>
                            </div>
                        </div>
                    </div>
                </section>

                {message.text && (
                    <div className={`mt-5 rounded-2xl border px-4 py-3.5 text-sm ${message.type === 'error'
                            ? 'bg-red-50 border-red-200 text-red-600'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        }`}>
                        {message.text}
                    </div>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                    <BookingStat
                        label="Total Bookings"
                        value={stats.total}
                        subtext="All booking requests"
                        iconClass="bg-blue-50 text-blue-600"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}
                    />

                    <BookingStat
                        label="Pending"
                        value={stats.pending}
                        subtext="Waiting for approval"
                        iconClass="bg-amber-50 text-amber-600"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>}
                    />

                    <BookingStat
                        label="Confirmed"
                        value={stats.confirmed}
                        subtext="Approved rentals"
                        iconClass="bg-emerald-50 text-emerald-600"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 12l4 4L19 6" /></svg>}
                    />

                    <BookingStat
                        label="Cancelled"
                        value={stats.cancelled}
                        subtext="Cancelled requests"
                        iconClass="bg-red-50 text-red-500"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>}
                    />
                </section>

                <section className="mt-6 bg-white rounded-[28px] border border-slate-200/80 shadow-[0_10px_28px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="p-5 md:p-6">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="relative flex-1">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => {
                                        setSearchTerm(e.target.value)
                                        setPage(1)
                                    }}
                                    placeholder="Search booking, car or customer ID"
                                    className="w-full h-12 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 transition"
                                />
                            </div>

                            <div className="flex gap-2 overflow-x-auto">
                                {statusTabs.map(tab => (
                                    <button
                                        key={tab.key}
                                        onClick={() => {
                                            setStatusFilter(tab.key)
                                            setPage(1)
                                        }}
                                        className={`h-12 px-5 rounded-2xl border text-sm font-semibold whitespace-nowrap transition ${statusFilter === tab.key
                                                ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10'
                                                : 'bg-white border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
                                            }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-5 md:px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Booking Requests</h2>
                            <p className="text-xs text-slate-400 mt-1">
                                Showing {paginatedBookings.length} of {filteredBookings.length} bookings
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">Rows</span>

                            <select
                                value={rowLimit}
                                onChange={e => {
                                    setRowLimit(Number(e.target.value))
                                    setPage(1)
                                }}
                                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 outline-none focus:border-sky-400"
                            >
                                {[5, 10, 20, 25, 50].map(value => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-240">
                            <thead className="bg-slate-50/80">
                                <tr>
                                    {['Booking', 'Vehicle', 'Customer', 'Rental Period', 'Duration', 'Total', 'Status', 'Actions'].map(title => (
                                        <th key={title} className="px-5 py-4 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                            {title}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="py-20">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="size-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                                                <span className="text-sm text-slate-400">Loading bookings...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center">
                                            <div className="size-14 rounded-2xl bg-slate-100 text-slate-300 flex items-center justify-center mx-auto">
                                                <svg className="size-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                                            </div>

                                            <p className="text-sm font-semibold text-slate-600 mt-4">No bookings found</p>
                                            <p className="text-xs text-slate-400 mt-1">Try changing your search or status filter.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedBookings.map(booking => (
                                        <tr key={getBookingId(booking)} className="border-t border-slate-100 hover:bg-slate-50/70 transition">
                                            <td className="px-5 py-4">
                                                <p className="text-sm font-bold text-slate-900">#{getBookingId(booking)}</p>
                                                <p className="text-[11px] text-slate-400 mt-1">Car #{booking.carId}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-12 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                                        {getCarImage(booking) ? (
                                                            <img src={getCarImage(booking)} alt={getCarName(booking)} className="size-full object-cover" />
                                                        ) : (
                                                            <div className="size-full flex items-center justify-center text-slate-300">
                                                                <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-700">{getCarName(booking)}</p>
                                                        <p className="text-xs text-slate-400 mt-1">{getLocation(booking)}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-medium text-slate-700">User #{booking.userId}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm text-slate-600">{formatDate(booking.startDate)}</p>
                                                <p className="text-xs text-slate-400 mt-1">to {formatDate(booking.endDate)}</p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm text-slate-600">
                                                    {getDays(booking.startDate, booking.endDate)} days
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="text-sm font-bold text-slate-900">
                                                    ${Number(booking.totalAmount || 0).toLocaleString()}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className={`inline-flex px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusClass(booking.status)}`}>
                                                    {getStatusLabel(booking.status)}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => setSelectedBooking(booking)}
                                                        className="h-9 px-3 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50"
                                                    >
                                                        View
                                                    </button>

                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => setConfirmTarget(booking)}
                                                                className="h-9 px-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition"
                                                            >
                                                                Confirm
                                                            </button>

                                                            <button
                                                                onClick={() => setDeclineTarget(booking)}
                                                                className="h-9 px-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs font-semibold hover:bg-red-100 transition"
                                                            >
                                                                Decline
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination page={safePage} totalPages={totalPages} setPage={setPage} />
                </section>

                {selectedBooking && (
                    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-white rounded-[28px] shadow-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-sky-600 tracking-[0.18em] uppercase">Booking Details</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1">Booking #{getBookingId(selectedBooking)}</h3>
                                </div>

                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="size-10 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50"
                                >
                                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="size-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                                        {getCarImage(selectedBooking) ? (
                                            <img src={getCarImage(selectedBooking)} alt={getCarName(selectedBooking)} className="size-full object-cover" />
                                        ) : (
                                            <div className="size-full flex items-center justify-center text-slate-300">
                                                <svg className="size-8" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <h4 className="text-xl font-bold text-slate-900">{getCarName(selectedBooking)}</h4>
                                        <p className="text-sm text-slate-500 mt-1">{getLocation(selectedBooking)}</p>
                                        <p className="text-sm text-slate-500 mt-1">Customer: User #{selectedBooking.userId}</p>

                                        <span className={`inline-flex mt-3 px-3 py-1.5 rounded-full border text-xs font-semibold ${getStatusClass(selectedBooking.status)}`}>
                                            {getStatusLabel(selectedBooking.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-xs text-slate-400">Pickup</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{formatDate(selectedBooking.startDate)}</p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-xs text-slate-400">Return</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">{formatDate(selectedBooking.endDate)}</p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-xs text-slate-400">Duration</p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {getDays(selectedBooking.startDate, selectedBooking.endDate)} days
                                        </p>
                                    </div>

                                    <div className="rounded-2xl bg-slate-50 border border-slate-100 p-4">
                                        <p className="text-xs text-slate-400">Total</p>
                                        <p className="text-sm font-bold text-slate-900 mt-1">
                                            ${Number(selectedBooking.totalAmount || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-7">
                                    <button
                                        onClick={() => setSelectedBooking(null)}
                                        className="h-11 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50"
                                    >
                                        Close
                                    </button>

                                    {selectedBooking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => setDeclineTarget(selectedBooking)}
                                                className="h-11 px-5 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
                                            >
                                                Decline
                                            </button>

                                            <button
                                                onClick={() => setConfirmTarget(selectedBooking)}
                                                className="h-11 px-5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                                            >
                                                Confirm Booking
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {confirmTarget && (
                    <div className="fixed inset-0 z-60 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl p-6">
                            <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M5 12l4 4L19 6" /></svg>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mt-5">Confirm Booking?</h3>

                            <p className="text-sm text-slate-500 mt-2 leading-6">
                                Confirm booking #{getBookingId(confirmTarget)} for{' '}
                                <span className="font-semibold text-slate-700">{getCarName(confirmTarget)}</span>?
                                The vehicle will be marked as booked.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={() => setConfirmTarget(null)}
                                    disabled={actionLoading}
                                    className="h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold disabled:opacity-50"
                                >
                                    Not Now
                                </button>

                                <button
                                    onClick={handleConfirm}
                                    disabled={actionLoading}
                                    className="h-11 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60"
                                >
                                    {actionLoading ? 'Confirming...' : 'Yes, Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {declineTarget && (
                    <div className="fixed inset-0 z-60 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl p-6">
                            <div className="size-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mt-5">Decline Request?</h3>

                            <p className="text-sm text-slate-500 mt-2 leading-6">
                                Booking #{getBookingId(declineTarget)} will be marked as cancelled and will no longer be available for confirmation.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={() => setDeclineTarget(null)}
                                    disabled={actionLoading}
                                    className="h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold disabled:opacity-50"
                                >
                                    Keep Request
                                </button>

                                <button
                                    onClick={handleDecline}
                                    disabled={actionLoading}
                                    className="h-11 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60"
                                >
                                    {actionLoading ? 'Declining...' : 'Yes, Decline'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}