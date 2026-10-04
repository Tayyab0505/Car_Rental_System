import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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

function getStatusText(status) {
    const value = String(status || 'pending').toLowerCase()

    if (value === 'confirmed') return 'Confirmed'
    if (value === 'cancelled') return 'Cancelled'

    return 'Pending'
}

function getStatusClass(status) {
    const value = String(status || '').toLowerCase()

    if (value === 'confirmed') {
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
    }

    if (value === 'cancelled') {
        return 'bg-red-50 text-red-600 border border-red-100'
    }

    return 'bg-amber-50 text-amber-600 border border-amber-100'
}

function getBookingId(booking) {
    return booking?.id || booking?._id || '-'
}

function getCarId(booking) {
    return booking?.carId || booking?.car?.id || booking?.car?._id || '-'
}

function getCarName(booking) {
    const brand = booking?.car?.brand || booking?.brand || ''
    const model = booking?.car?.model || booking?.model || ''

    const name = `${brand} ${model}`.trim()

    if (name) return name

    return `Car #${getCarId(booking)}`
}

function getCarImage(booking) {
    return booking?.car?.imageUrl || booking?.imageUrl || ''
}

function getLocation(booking) {
    const city = booking?.car?.city || booking?.city || ''
    const country = booking?.car?.country || booking?.country || ''

    return [city, country].filter(Boolean).join(', ') || 'Location not available'
}

function getTotal(booking) {
    return Number(booking?.totalAmount || 0)
}

function getDays(startDate, endDate) {
    if (!startDate || !endDate) return 0

    const start = new Date(`${startDate}T00:00:00`)
    const end = new Date(`${endDate}T00:00:00`)

    if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime())
    ) {
        return 0
    }

    const difference = end.getTime() - start.getTime()

    const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    )

    return days > 0 ? days : 0
}

function StatusTimeline({ status }) {
    const value = String(status || 'pending').toLowerCase()
    const confirmed = value === 'confirmed'
    const cancelled = value === 'cancelled'

    return (
        <div className="mt-7">
            <p className="text-sm font-semibold text-[#0b1b30]">
                Booking Status
            </p>

            <div className="flex items-center mt-5">
                <div className="flex flex-col items-center">
                    <div className="size-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <svg
                            className="size-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                            viewBox="0 0 24 24"
                        >
                            <path d="M5 12l4 4L19 6" />
                        </svg>
                    </div>

                    <p className="text-xs font-medium text-slate-700 mt-2 whitespace-nowrap">
                        Request Sent
                    </p>
                </div>

                <div
                    className={`h-1 flex-1 mx-3 rounded-full ${confirmed
                        ? 'bg-emerald-500'
                        : cancelled
                            ? 'bg-red-400'
                            : 'bg-slate-200'
                        }`}
                />

                <div className="flex flex-col items-center">
                    <div
                        className={`size-9 rounded-full flex items-center justify-center ${confirmed
                            ? 'bg-emerald-500 text-white'
                            : cancelled
                                ? 'bg-red-500 text-white'
                                : 'bg-slate-100 text-slate-400 border border-slate-200'
                            }`}
                    >
                        {cancelled ? (
                            <svg
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        ) : confirmed ? (
                            <svg
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                                viewBox="0 0 24 24"
                            >
                                <path d="M5 12l4 4L19 6" />
                            </svg>
                        ) : (
                            <svg
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <circle cx="12" cy="12" r="9" />
                                <path d="M12 8v4l3 2" />
                            </svg>
                        )}
                    </div>

                    <p
                        className={`text-xs font-medium mt-2 whitespace-nowrap ${confirmed
                            ? 'text-emerald-600'
                            : cancelled
                                ? 'text-red-500'
                                : 'text-slate-500'
                            }`}
                    >
                        {confirmed
                            ? 'Confirmed'
                            : cancelled
                                ? 'Cancelled'
                                : 'Waiting for Admin'
                        }
                    </p>
                </div>
            </div>
        </div>
    )
}

function EmptyState({ onBrowse }) {
    return (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-16 text-center">
            <div className="size-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <svg
                    className="size-10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    viewBox="0 0 24 24"
                >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
            </div>

            <h3 className="text-2xl font-bold text-[#0b1b30] mt-6">
                No bookings yet
            </h3>

            <p className="text-slate-500 text-sm mt-2 max-w-md mx-auto leading-6">
                You have not made any booking requests yet. Browse available cars and send your first request.
            </p>

            <button
                onClick={onBrowse}
                className="mt-6 px-6 h-12 rounded-xl bg-linear-to-r from-[#2563eb] via-[#1687f8] to-[#0ea5e9] text-white text-sm font-semibold shadow-md shadow-blue-500/20"
            >
                Browse Cars
            </button>
        </div>
    )
}

export default function UserBookings() {
    const navigate = useNavigate()

    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [message, setMessage] = useState('')

    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [rowsPerPage, setRowsPerPage] = useState(5)
    const [currentPage, setCurrentPage] = useState(1)

    const [selectedBooking, setSelectedBooking] = useState(null)
    const [cancelTarget, setCancelTarget] = useState(null)
    const [cancelling, setCancelling] = useState(false)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await API.get('/myBookings')

                const data = Array.isArray(response.data)
                    ? response.data
                    : response.data?.bookings || []

                setBookings(data)
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    'Unable to load bookings'
                )
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
    }, [])

    const stats = useMemo(() => {
        return {
            total: bookings.length,
            pending: bookings.filter(
                booking => booking.status === 'pending'
            ).length,
            confirmed: bookings.filter(
                booking => booking.status === 'confirmed'
            ).length,
            cancelled: bookings.filter(
                booking => booking.status === 'cancelled'
            ).length
        }
    }, [bookings])

    const filteredBookings = useMemo(() => {
        let list = [...bookings]

        if (statusFilter !== 'all') {
            list = list.filter(
                booking => booking.status === statusFilter
            )
        }

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase()

            list = list.filter(booking => {
                const text = `
                    ${getBookingId(booking)}
                    ${getCarId(booking)}
                    ${getCarName(booking)}
                    ${getLocation(booking)}
                    ${getStatusText(booking.status)}
                `.toLowerCase()

                return text.includes(search)
            })
        }

        return list
    }, [bookings, searchTerm, statusFilter])

    const totalPages = Math.max(
        1,
        Math.ceil(filteredBookings.length / rowsPerPage)
    )

    const safePage = Math.min(currentPage, totalPages)

    const paginatedBookings = useMemo(() => {
        const start = (safePage - 1) * rowsPerPage
        const end = start + rowsPerPage

        return filteredBookings.slice(start, end)
    }, [filteredBookings, rowsPerPage, safePage])

    const handleCancelBooking = async () => {
        if (!cancelTarget) return

        setCancelling(true)
        setError('')
        setMessage('')

        try {
            const response = await API.delete(
                `/cancelBooking/${getBookingId(cancelTarget)}`
            )

            const updatedBooking = response.data.booking

            setBookings(current =>
                current.map(booking =>
                    getBookingId(booking) === getBookingId(cancelTarget)
                        ? {
                            ...booking,
                            ...updatedBooking
                        }
                        : booking
                )
            )

            if (
                selectedBooking &&
                getBookingId(selectedBooking) === getBookingId(cancelTarget)
            ) {
                setSelectedBooking(current => ({
                    ...current,
                    ...updatedBooking
                }))
            }

            setMessage('Booking cancelled successfully')
            setCancelTarget(null)
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to cancel booking'
            )
        } finally {
            setCancelling(false)
        }
    }

    const statusTabs = [
        {
            key: 'all',
            label: 'All'
        },
        {
            key: 'pending',
            label: 'Pending'
        },
        {
            key: 'confirmed',
            label: 'Confirmed'
        },
        {
            key: 'cancelled',
            label: 'Cancelled'
        }
    ]

    return (
        <div className="bg-[#f5f8fc] min-h-screen pb-12">
            <div className="max-w-375 mx-auto px-5 md:px-8 py-8">
                <section className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[#08172a] via-[#0d2c4d] to-[#164b72] px-6 py-8 md:px-10 md:py-10 shadow-lg">
                    <div className="absolute top-0 right-0 size-72 bg-white/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-16 left-1/3 size-72 bg-sky-400/10 rounded-full blur-3xl" />

                    <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div>
                            <p className="text-sky-300 text-xs font-semibold tracking-[0.24em] uppercase mb-3">
                                Track • Manage • Review
                            </p>

                            <h1 className="text-3xl md:text-5xl font-bold text-white">
                                My Bookings
                            </h1>

                            <p className="text-slate-200 text-sm md:text-base mt-3 max-w-2xl leading-7">
                                Review your booking history and track every rental request in one place.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
                            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 min-w-30">
                                <p className="text-white text-2xl font-bold">
                                    {stats.total}
                                </p>
                                <p className="text-slate-300 text-xs mt-1">
                                    Total
                                </p>
                            </div>

                            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 min-w-30">
                                <p className="text-white text-2xl font-bold">
                                    {stats.pending}
                                </p>
                                <p className="text-slate-300 text-xs mt-1">
                                    Pending
                                </p>
                            </div>

                            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 min-w-30">
                                <p className="text-white text-2xl font-bold">
                                    {stats.confirmed}
                                </p>
                                <p className="text-slate-300 text-xs mt-1">
                                    Confirmed
                                </p>
                            </div>

                            <div className="bg-white/10 border border-white/10 rounded-2xl px-4 py-4 min-w-30">
                                <p className="text-white text-2xl font-bold">
                                    {stats.cancelled}
                                </p>
                                <p className="text-slate-300 text-xs mt-1">
                                    Cancelled
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="relative -mt-6 z-20">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-4 md:p-5">
                        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
                            <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.3fr_auto] gap-3">
                                <div className="relative">
                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="M21 21l-4.35-4.35" />
                                    </svg>

                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={e => {
                                            setSearchTerm(e.target.value)
                                            setCurrentPage(1)
                                        }}
                                        placeholder="Search booking or car"
                                        className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10"
                                    />
                                </div>

                                <div className="flex gap-2 overflow-x-auto">
                                    {statusTabs.map(tab => (
                                        <button
                                            key={tab.key}
                                            onClick={() => {
                                                setStatusFilter(tab.key)
                                                setCurrentPage(1)
                                            }}
                                            className={`h-12 px-5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${statusFilter === tab.key
                                                ? 'bg-linear-to-r from-[#2563eb] to-[#0ea5e9] text-white shadow-md shadow-blue-500/20'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:border-sky-400'
                                                }`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <span className="text-sm text-slate-500">
                                    Rows
                                </span>

                                <select
                                    value={rowsPerPage}
                                    onChange={e => {
                                        setRowsPerPage(Number(e.target.value))
                                        setCurrentPage(1)
                                    }}
                                    className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-sky-500"
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={15}>15</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {message && (
                    <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <section className="mt-8">
                    {loading ? (
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm py-24 flex items-center justify-center gap-3">
                            <div className="size-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />

                            <span className="text-sm text-slate-500">
                                Loading bookings...
                            </span>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <EmptyState
                            onBrowse={() => navigate('/dashboard/cars')}
                        />
                    ) : (
                        <>
                            <div className="hidden xl:block bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100">
                                    <h2 className="text-xl font-bold text-[#0b1b30]">
                                        Booking History
                                    </h2>

                                    <p className="text-sm text-slate-500 mt-1">
                                        Showing {paginatedBookings.length} of {filteredBookings.length} bookings
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                                    Booking
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                                    Car
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                                    Dates
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                                    Days
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                                    Total
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginatedBookings.map(booking => (
                                                <tr
                                                    key={getBookingId(booking)}
                                                    className="border-t border-slate-100"
                                                >
                                                    <td className="px-6 py-5">
                                                        <p className="text-sm font-semibold text-[#0b1b30]">
                                                            #{getBookingId(booking)}
                                                        </p>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            Car ID: {getCarId(booking)}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="size-14 rounded-xl bg-slate-100 overflow-hidden shrink-0">
                                                                {getCarImage(booking) ? (
                                                                    <img
                                                                        src={getCarImage(booking)}
                                                                        alt={getCarName(booking)}
                                                                        className="size-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="size-full flex items-center justify-center text-slate-300">
                                                                        <svg
                                                                            className="size-6"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth={1.8}
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                                                                            <circle cx="7" cy="17" r="2" />
                                                                            <circle cx="17" cy="17" r="2" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <p className="text-sm font-semibold text-[#0b1b30]">
                                                                    {getCarName(booking)}
                                                                </p>

                                                                <p className="text-xs text-slate-400 mt-1">
                                                                    {getLocation(booking)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <p className="text-sm text-slate-700">
                                                            {formatDate(booking.startDate)}
                                                        </p>

                                                        <p className="text-xs text-slate-400 mt-1">
                                                            to {formatDate(booking.endDate)}
                                                        </p>
                                                    </td>

                                                    <td className="px-6 py-5 text-sm text-slate-700">
                                                        {getDays(
                                                            booking.startDate,
                                                            booking.endDate
                                                        )} days
                                                    </td>

                                                    <td className="px-6 py-5 text-sm font-bold text-blue-600">
                                                        ${getTotal(booking).toLocaleString()}
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <span
                                                            className={`inline-flex px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(booking.status)}`}
                                                        >
                                                            {getStatusText(booking.status)}
                                                        </span>
                                                    </td>

                                                    <td className="px-6 py-5">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setSelectedBooking(booking)}
                                                                className="h-10 px-4 rounded-xl bg-linear-to-r from-[#2563eb] to-[#0ea5e9] text-white text-sm font-semibold"
                                                            >
                                                                View
                                                            </button>

                                                            {booking.status === 'pending' && (
                                                                <button
                                                                    onClick={() => setCancelTarget(booking)}
                                                                    className="h-10 px-4 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50 transition"
                                                                >
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

                            <div className="xl:hidden grid grid-cols-1 md:grid-cols-2 gap-5">
                                {paginatedBookings.map(booking => (
                                    <div
                                        key={getBookingId(booking)}
                                        className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5"
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="size-20 rounded-2xl bg-slate-100 overflow-hidden shrink-0">
                                                {getCarImage(booking) ? (
                                                    <img
                                                        src={getCarImage(booking)}
                                                        alt={getCarName(booking)}
                                                        className="size-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="size-full flex items-center justify-center text-slate-300">
                                                        <svg
                                                            className="size-7"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeWidth={1.8}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                                                            <circle cx="7" cy="17" r="2" />
                                                            <circle cx="17" cy="17" r="2" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="text-lg font-bold text-[#0b1b30]">
                                                    {getCarName(booking)}
                                                </p>

                                                <p className="text-xs text-slate-400 mt-1">
                                                    #{getBookingId(booking)}
                                                </p>

                                                <span
                                                    className={`inline-flex mt-2 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(booking.status)}`}
                                                >
                                                    {getStatusText(booking.status)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Pickup
                                                </p>
                                                <p className="text-sm font-medium text-slate-700 mt-1">
                                                    {formatDate(booking.startDate)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Return
                                                </p>
                                                <p className="text-sm font-medium text-slate-700 mt-1">
                                                    {formatDate(booking.endDate)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Duration
                                                </p>
                                                <p className="text-sm font-medium text-slate-700 mt-1">
                                                    {getDays(
                                                        booking.startDate,
                                                        booking.endDate
                                                    )} days
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Total
                                                </p>
                                                <p className="text-sm font-bold text-blue-600 mt-1">
                                                    ${getTotal(booking).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 mt-5">
                                            <button
                                                onClick={() => setSelectedBooking(booking)}
                                                className="flex-1 h-11 rounded-xl bg-linear-to-r from-[#2563eb] to-[#0ea5e9] text-white text-sm font-semibold"
                                            >
                                                View Details
                                            </button>

                                            {booking.status === 'pending' && (
                                                <button
                                                    onClick={() => setCancelTarget(booking)}
                                                    className="h-11 px-4 rounded-xl border border-red-200 text-red-500 text-sm font-semibold hover:bg-red-50"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between gap-4 flex-wrap mt-6">
                                <p className="text-sm text-slate-500">
                                    Page{' '}
                                    <span className="font-semibold text-slate-700">
                                        {safePage}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-slate-700">
                                        {totalPages}
                                    </span>
                                </p>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.max(safePage - 1, 1)
                                            )
                                        }
                                        disabled={safePage === 1}
                                        className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        onClick={() =>
                                            setCurrentPage(
                                                Math.min(
                                                    safePage + 1,
                                                    totalPages
                                                )
                                            )
                                        }
                                        disabled={safePage === totalPages}
                                        className="h-11 px-4 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </section>

                {selectedBooking && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase text-blue-600">
                                        Booking Details
                                    </p>

                                    <h3 className="text-2xl font-bold text-[#0b1b30] mt-1">
                                        #{getBookingId(selectedBooking)}
                                    </h3>
                                </div>

                                <button
                                    onClick={() => setSelectedBooking(null)}
                                    className="size-10 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50"
                                >
                                    <svg
                                        className="size-5"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {getCarImage(selectedBooking) && (
                                        <img
                                            src={getCarImage(selectedBooking)}
                                            alt={getCarName(selectedBooking)}
                                            className="size-20 rounded-2xl object-cover"
                                        />
                                    )}

                                    <div>
                                        <h4 className="text-xl font-bold text-[#0b1b30]">
                                            {getCarName(selectedBooking)}
                                        </h4>

                                        <p className="text-sm text-slate-500 mt-1">
                                            {getLocation(selectedBooking)}
                                        </p>

                                        <span
                                            className={`inline-flex mt-3 px-3 py-1.5 rounded-full text-xs font-semibold ${getStatusClass(selectedBooking.status)}`}
                                        >
                                            {getStatusText(selectedBooking.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                                    <div className="bg-slate-50 rounded-2xl p-4">
                                        <p className="text-xs text-slate-400">
                                            Pickup
                                        </p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {formatDate(selectedBooking.startDate)}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-4">
                                        <p className="text-xs text-slate-400">
                                            Return
                                        </p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {formatDate(selectedBooking.endDate)}
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-4">
                                        <p className="text-xs text-slate-400">
                                            Duration
                                        </p>
                                        <p className="text-sm font-semibold text-slate-700 mt-1">
                                            {getDays(
                                                selectedBooking.startDate,
                                                selectedBooking.endDate
                                            )} days
                                        </p>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-4">
                                        <p className="text-xs text-slate-400">
                                            Total
                                        </p>
                                        <p className="text-sm font-bold text-blue-600 mt-1">
                                            ${getTotal(selectedBooking).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <StatusTimeline
                                    status={selectedBooking.status}
                                />

                                <div className="flex justify-end gap-3 mt-8">
                                    <button
                                        onClick={() => setSelectedBooking(null)}
                                        className="h-11 px-5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium"
                                    >
                                        Close
                                    </button>

                                    {selectedBooking.status === 'pending' && (
                                        <button
                                            onClick={() => setCancelTarget(selectedBooking)}
                                            className="h-11 px-5 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition"
                                        >
                                            Cancel Booking
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {cancelTarget && (
                    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-60 flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
                            <div className="size-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                                <svg
                                    className="size-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 9v4M12 17h.01" />
                                    <path d="M10.3 3.8L2.7 17a2 2 0 001.7 3h15.2a2 2 0 001.7-3L13.7 3.8a2 2 0 00-3.4 0z" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-[#0b1b30] mt-5">
                                Cancel Booking?
                            </h3>

                            <p className="text-sm text-slate-500 mt-2 leading-6">
                                Are you sure you want to cancel booking #{getBookingId(cancelTarget)} for {getCarName(cancelTarget)}?
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={() => setCancelTarget(null)}
                                    disabled={cancelling}
                                    className="h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold disabled:opacity-50"
                                >
                                    Keep Booking
                                </button>

                                <button
                                    onClick={handleCancelBooking}
                                    disabled={cancelling}
                                    className="h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold disabled:opacity-60"
                                >
                                    {cancelling
                                        ? 'Cancelling...'
                                        : 'Yes, Cancel'
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}