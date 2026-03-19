import { useEffect, useState } from 'react'
import API from '../../api/axios'

export default function Cars() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookingModal, setBookingModal] = useState(null)
    const [bookingForm, setBookingForm] = useState({ startDate: '', endDate: '' })
    const [msg, setMsg] = useState('')

    useEffect(() => {
        API.get('/findAllCar')
            .then(r => setCars(r.data))
            .finally(() => setLoading(false))
    }, [])


    const handleDelete = async (id) => {
        if (!window.confirm('Delete this car?')) return
        try { await API.delete(`/deleteCar/${id}`); fetchCars() }
        catch { setMsg('Failed to delete') }
    }

    const handleBook = async () => {
        try {
            await API.post('/booking', { carId: bookingModal.id, ...bookingForm })
            setBookingModal(null)
            setMsg('Booking created successfully!')
        } catch { setMsg('Booking failed') }
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>
                        {isAdmin ? 'Cars management' : 'Browse cars'}
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        {isAdmin ? 'Add, edit or remove cars from the fleet' : 'Pick a car and make a booking'}
                    </p>
                </div>
                {isAdmin && (
                    <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Add car
                    </button>
                )}
            </div>

            {msg && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl text-sm">
                    {msg}
                </div>
            )}

            {loading ? (
                <div className="text-center py-20 text-slate-400 dark:text-slate-500">Loading cars...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {cars.map(car => (
                        <div key={car.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="h-36 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                <svg className="w-20 h-20 text-blue-200 dark:text-blue-900" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                                    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                                    <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                                    <path d="M5 9h14" />
                                </svg>
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>{car.brand} {car.model}</h3>
                                        <p className="text-blue-700 dark:text-blue-400 font-semibold text-lg mt-0.5" style={{ fontFamily: 'Outfit,sans-serif' }}>
                                            ${car.pricePerDay}<span className="text-slate-400 dark:text-slate-500 text-xs font-normal">/day</span>
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${car.availability
                                            ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                            : 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                                        }`}>
                                        {car.availability ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    {isAdmin ? (
                                        <>
                                            <button onClick={() => openEdit(car)} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                                                Edit
                                            </button>
                                            <button onClick={() => handleDelete(car.id)} className="flex-1 py-2 rounded-lg border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            disabled={!car.availability}
                                            onClick={() => { setBookingModal(car); setBookingForm({ startDate: '', endDate: '' }) }}
                                            className="flex-1 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                        >
                                            Book now
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}


            {/* User booking modal */}
            {bookingModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>
                            Book {bookingModal.brand} {bookingModal.model}
                        </h3>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mb-5">${bookingModal.pricePerDay}/day</p>
                        {[['Start date', 'startDate'], ['End date', 'endDate']].map(([label, key]) => (
                            <div key={key} className="mb-4">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
                                <input
                                    type="date" value={bookingForm[key]}
                                    onChange={e => setBookingForm({ ...bookingForm, [key]: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        ))}
                        <div className="flex gap-3 mt-2">
                            <button onClick={() => setBookingModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                                Cancel
                            </button>
                            <button onClick={handleBook} className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium cursor-pointer transition-colors">
                                Confirm booking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}