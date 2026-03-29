import { useEffect, useState } from 'react'
import API from '../../api/axios'

const CarImage = ({ url, alt }) => {
    const [error, setError] = useState(false)

    if (!url || error) return (
        <div className="h-44 bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 flex flex-col items-center justify-center gap-2">
            <svg className="w-16 h-16 text-blue-200 dark:text-blue-900" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                <path d="M5 9h14" />
            </svg>
            <span className="text-xs text-slate-400 dark:text-slate-500">No image</span>
        </div>
    )
    return (
        <div className="h-44 overflow-hidden bg-slate-100 dark:bg-slate-700">
            <img
                src={url} alt={alt}
                onError={() => setError(true)}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
        </div>
    )
}

export default function UserCars() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [bookingModal, setBookingModal] = useState(null)
    const [bookingForm, setBookingForm] = useState({ startDate: '', endDate: '' })
    const [msg, setMsg] = useState('')

    // Filters
    const [brandFilter, setBrandFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('none')
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [sliderMin, setSliderMin] = useState(0)
    const [sliderMax, setSliderMax] = useState(0)

    useEffect(() => {
        API.get('/findAllCar')
            .then(r => {
                const data = r.data
                setCars(data)
                if (data.length > 0) {
                    const prices = data.map(c => Number(c.pricePerDay))
                    const lo = Math.min(...prices)
                    const hi = Math.max(...prices)
                    setMinPrice(lo); setMaxPrice(hi)
                    setSliderMin(lo); setSliderMax(hi)
                }
            })
            .finally(() => setLoading(false))
    }, [])

    const brands = useMemo(() => ['all', ...new Set(cars.map(c => c.brand))], [cars])

    const filtered = useMemo(() => {
        let list = [...cars].filter(c => c.availability)
        if (brandFilter !== 'all') list = list.filter(c => c.brand === brandFilter)
        list = list.filter(c => Number(c.pricePerDay) >= sliderMin && Number(c.pricePerDay) <= sliderMax)
        if (sortOrder === 'asc') list.sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay))
        if (sortOrder === 'desc') list.sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay))
        return list
    }, [cars, brandFilter, sliderMin, sliderMax, sortOrder])

    const handleSliderMin = (val) => setSliderMin(Math.min(Number(val), sliderMax - 1))
    const handleSliderMax = (val) => setSliderMax(Math.max(Number(val), sliderMin + 1))
    const handleInputMin = (val) => setSliderMin(Math.max(minPrice, Math.min(Number(val), sliderMax - 1)))
    const handleInputMax = (val) => setSliderMax(Math.min(maxPrice, Math.max(Number(val), sliderMin + 1)))
    const resetFilters = () => { setBrandFilter('all'); setSortOrder('none'); setSliderMin(minPrice); setSliderMax(maxPrice) }


    const handleBook = async () => {
        try {
            await API.post('/booking', { carId: bookingModal.id, ...bookingForm })
            setBookingModal(null)
            setMsg('Booking created successfully!')
        } catch { setMsg('Booking failed') }
    };

    const range = maxPrice - minPrice || 1
    const leftPct = ((sliderMin - minPrice) / range) * 100
    const rightPct = 100 - ((sliderMax - minPrice) / range) * 100

    return (
        <div className="p-8">

            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>Browse cars</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Pick a car and make a booking</p>
            </div>

            {msg && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl text-sm">
                    {msg}
                </div>
            )}

            {/* FILTER BAR */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-5 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300" style={{ fontFamily: 'Outfit,sans-serif' }}>Filters</h2>
                    <button onClick={resetFilters} className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Reset all</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {/* Brand */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Brand</label>
                        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
                            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer">
                            {brands.map(b => <option key={b} value={b}>{b === 'all' ? 'All brands' : b}</option>)}
                        </select>
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Sort by price</label>
                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}
                            className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 outline-none focus:border-blue-500 cursor-pointer">
                            <option value="none">Default</option>
                            <option value="asc">Low to high</option>
                            <option value="desc">High to low</option>
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400 dark:text-slate-500 text-sm">Loading cars...</span>
                </div>
            ) : cars.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No cars available</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Check back later</p>
                </div>
            ) : (
                <div div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {cars.map(car => (
                        <div key={car.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">

                            <CarImage url={car.imageUrl} alt={`${car.brand} ${car.model}`} />

                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>{car.brand} {car.model}</h3>
                                        <p className="text-blue-700 dark:text-blue-400 font-semibold text-lg mt-0.5" style={{ fontFamily: 'Outfit,sans-serif' }}>
                                            {car.pricePerDay}<span className="text-slate-400 dark:text-slate-500 text-xs font-normal">/day</span>
                                        </p>
                                    </div>
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${car.availability
                                        ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                        : 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400'
                                        }`}>
                                        {car.availability ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <button
                                    disabled={!car.availability}
                                    onClick={() => { setBookingModal(car); setBookingForm({ startDate: '', endDate: '' }) }}
                                    className="flex-1 py-2 px-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Book now
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            {
                bookingModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
                            {bookingModal.imageUrl && (
                                <div className='h-40 overflow-hidden'>
                                    <img src={bookingModal.imageUrl} alt={`${bookingModal.brand} ${bookingModal.model}`}
                                        onError={e => e.target.parentElement.style.display = 'none'}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}

                            <div className='p-6'>
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>
                                    Book {bookingModal.brand} {bookingModal.model}
                                </h3>
                            </div>
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
                )
            }
        </div >
    )
}