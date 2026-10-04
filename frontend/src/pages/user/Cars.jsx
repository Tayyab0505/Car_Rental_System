import { useEffect, useMemo, useState } from 'react'
import API from '../../api/axios'

const CarSlider = ({ car }) => {
    const images = [
        car.imageUrl,
        car.imageUrl2,
        car.imageUrl3
    ].filter(Boolean)

    const [current, setCurrent] = useState(0)
    const [errored, setErrored] = useState({})

    const validImages = images.filter((_, index) => !errored[index])

    if (validImages.length === 0) {
        return (
            <div className="h-52 bg-slate-100 flex items-center justify-center">

                <svg
                    className="size-16 text-slate-300"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.2}
                    viewBox="0 0 24 24"
                >
                    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                    <path d="M5 9h14" />
                </svg>

            </div>
        )
    }

    const prev = e => {
        e.stopPropagation()

        setCurrent(current =>
            (current - 1 + validImages.length) % validImages.length
        )
    }

    const next = e => {
        e.stopPropagation()

        setCurrent(current =>
            (current + 1) % validImages.length
        )
    }

    const index = current % validImages.length

    return (
        <div className="relative h-52 overflow-hidden bg-slate-100 group">

            <img
                src={validImages[index]}
                alt={`${car.brand} ${car.model}`}
                onError={() => {
                    const originalIndex = images.indexOf(validImages[index])

                    setErrored(prev => ({
                        ...prev,
                        [originalIndex]: true
                    }))
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent" />

            <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 text-emerald-600 text-[11px] font-semibold shadow-sm">
                Available
            </span>

            {validImages.length > 1 && (
                <>

                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-slate-950/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-950/60 transition"
                    >
                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-slate-950/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-slate-950/60 transition"
                    >
                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path d="M9 18l6-6-6-6" />
                        </svg>
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">

                        {validImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={e => {
                                    e.stopPropagation()
                                    setCurrent(i)
                                }}
                                className={`h-1.5 rounded-full transition-all ${i === index
                                        ? 'w-5 bg-white'
                                        : 'w-1.5 bg-white/60'
                                    }`}
                            />
                        ))}

                    </div>

                </>
            )}

        </div>
    )
}

const DetailBadge = ({ icon, label }) => {
    return (
        <div className="flex items-center gap-2 text-slate-500">

            <span className="text-slate-400">
                {icon}
            </span>

            <span className="text-xs font-medium">
                {label}
            </span>

        </div>
    )
}

export default function UserCars() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)

    const [bookingModal, setBookingModal] = useState(null)
    const [bookingError, setBookingError] = useState('')

    const [bookingForm, setBookingForm] = useState({
        startDate: '',
        endDate: ''
    })

    const [msg, setMsg] = useState('')

    const [searchTerm, setSearchTerm] = useState('')
    const [filtersOpen, setFiltersOpen] = useState(false)

    const [brandFilter, setBrandFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [countryFilter, setCountryFilter] = useState('all')
    const [cityFilter, setCityFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('none')

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [sliderMin, setSliderMin] = useState(0)
    const [sliderMax, setSliderMax] = useState(0)

    useEffect(() => {
        API.get('/findAllCar')
            .then(response => {
                const data = response.data

                setCars(data)

                if (data.length > 0) {
                    const prices = data.map(car => Number(car.pricePerDay))

                    const lowest = Math.min(...prices)
                    const highest = Math.max(...prices)

                    setMinPrice(lowest)
                    setMaxPrice(highest)
                    setSliderMin(lowest)
                    setSliderMax(highest)
                }
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const brands = useMemo(() => {
        return [
            'all',
            ...new Set(
                cars
                    .map(car => car.brand)
                    .filter(Boolean)
            )
        ]
    }, [cars])

    const categories = useMemo(() => {
        return [
            'all',
            ...new Set(
                cars
                    .map(car => car.category)
                    .filter(Boolean)
            )
        ]
    }, [cars])

    const availableCountries = useMemo(() => {
        return [
            'all',
            ...new Set(
                cars
                    .filter(car => car.availability)
                    .map(car => car.country)
                    .filter(Boolean)
            )
        ]
    }, [cars])

    const availableCities = useMemo(() => {
        const availableCars = cars.filter(car => car.availability)

        if (countryFilter === 'all') {
            return [
                'all',
                ...new Set(
                    availableCars
                        .map(car => car.city)
                        .filter(Boolean)
                )
            ]
        }

        return [
            'all',
            ...new Set(
                availableCars
                    .filter(car => car.country === countryFilter)
                    .map(car => car.city)
                    .filter(Boolean)
            )
        ]
    }, [cars, countryFilter])

    const filtered = useMemo(() => {
        let list = [...cars].filter(car => car.availability)

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase()

            list = list.filter(car => {
                const text = `
                    ${car.brand || ''}
                    ${car.model || ''}
                    ${car.city || ''}
                    ${car.country || ''}
                    ${car.category || ''}
                `.toLowerCase()

                return text.includes(search)
            })
        }

        if (brandFilter !== 'all') {
            list = list.filter(car => car.brand === brandFilter)
        }

        if (countryFilter !== 'all') {
            list = list.filter(car => car.country === countryFilter)
        }

        if (cityFilter !== 'all') {
            list = list.filter(car => car.city === cityFilter)
        }

        if (categoryFilter !== 'all') {
            list = list.filter(car => car.category === categoryFilter)
        }

        list = list.filter(car =>
            Number(car.pricePerDay) >= sliderMin &&
            Number(car.pricePerDay) <= sliderMax
        )

        if (sortOrder === 'asc') {
            list.sort((a, b) =>
                Number(a.pricePerDay) - Number(b.pricePerDay)
            )
        }

        if (sortOrder === 'desc') {
            list.sort((a, b) =>
                Number(b.pricePerDay) - Number(a.pricePerDay)
            )
        }

        return list
    }, [
        cars,
        searchTerm,
        brandFilter,
        countryFilter,
        cityFilter,
        categoryFilter,
        sliderMin,
        sliderMax,
        sortOrder
    ])

    const handleInputMin = value => {
        setSliderMin(
            Math.max(
                minPrice,
                Math.min(Number(value), sliderMax - 1)
            )
        )
    }

    const handleInputMax = value => {
        setSliderMax(
            Math.min(
                maxPrice,
                Math.max(Number(value), sliderMin + 1)
            )
        )
    }

    const resetFilters = () => {
        setSearchTerm('')
        setBrandFilter('all')
        setCountryFilter('all')
        setCityFilter('all')
        setCategoryFilter('all')
        setSortOrder('none')
        setSliderMin(minPrice)
        setSliderMax(maxPrice)
    }

    const handleBook = async () => {
        setBookingError('')

        if (!bookingForm.startDate || !bookingForm.endDate) {
            setBookingError('Please select both start and end date')
            return
        }

        if (new Date(bookingForm.startDate) >= new Date(bookingForm.endDate)) {
            setBookingError('End date must be after start date')
            return
        }

        try {
            await API.post('/booking', {
                carId: bookingModal.id,
                ...bookingForm
            })

            setBookingModal(null)

            setBookingForm({
                startDate: '',
                endDate: ''
            })

            setBookingError('')
            setMsg('Booking request sent successfully!')

            setTimeout(() => {
                setMsg('')
            }, 3000)

        } catch (error) {
            setBookingError(
                error.response?.data?.message ||
                'Booking failed'
            )
        }
    }

    const bookingDays = useMemo(() => {
        if (!bookingForm.startDate || !bookingForm.endDate) {
            return 0
        }

        const start = new Date(bookingForm.startDate)
        const end = new Date(bookingForm.endDate)

        const difference = end.getTime() - start.getTime()

        const days = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        )

        return days > 0 ? days : 0
    }, [bookingForm])

    const bookingTotal = bookingModal
        ? bookingDays * Number(bookingModal.pricePerDay)
        : 0

    const selectClass = 'w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition'
    const labelClass = 'block text-xs font-medium text-slate-500 mb-2'

    return (
        <div className="bg-[#f5f8fc] min-h-screen pb-12">

            <section className="relative min-h-430px overflow-hidden bg-[#07111f]">

                <div className="absolute top-0 right-0 w-full lg:w-[68%] h-full">

                    <img
                        src="/hero-car.jpg"
                        alt="Luxury car"
                        onError={e => {
                            if (cars[0]?.imageUrl) {
                                e.currentTarget.src = cars[0].imageUrl
                            }
                        }}
                        className="w-full h-full object-contain object-bottom-right"
                    />

                </div>

                <div className="absolute inset-0 bg-linear-to-r from-[#07111f] via-[#0a1d33]/95 via-45% to-[#102d4c]/20" />

                <div className="absolute inset-0 bg-linear-to-t from-[#07111f]/40 via-transparent to-[#0c2847]/10" />

                <div className="absolute -top-36 left-[40%] size-96 bg-blue-500/10 rounded-full blur-3xl" />

                <div className="relative max-w-1500px mx-auto px-5 md:px-8 py-16 min-h-430px flex items-center">

                    <div className="max-w-2xl">

                        <p className="text-sky-400 text-xs font-semibold tracking-[0.28em] uppercase">
                            Explore • Drive • Discover
                        </p>

                        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mt-4">

                            Rent Your

                            <span className="bg-linear-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
                                {' '}Perfect Car
                            </span>

                        </h1>

                        <p className="text-slate-300 text-base md:text-lg mt-4 max-w-xl leading-7">
                            Browse premium vehicles, compare prices and book your next journey with ease.
                        </p>

                        <div className="flex flex-wrap gap-7 mt-9">

                            <div className="flex items-center gap-3">

                                <div className="size-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sky-400 backdrop-blur-sm">

                                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                        <path d="M9 12l2 2 4-4" />
                                    </svg>

                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Verified Vehicles
                                    </p>

                                    <p className="text-[11px] text-slate-400">
                                        Safe & Reliable
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <div className="size-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sky-400 backdrop-blur-sm">

                                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="9" />
                                        <path d="M12 8v4l3 2" />
                                    </svg>

                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Quick Booking
                                    </p>

                                    <p className="text-[11px] text-slate-400">
                                        Book in minutes
                                    </p>
                                </div>

                            </div>

                            <div className="flex items-center gap-3">

                                <div className="size-11 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-sky-400 backdrop-blur-sm">

                                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <path d="M20 7h-9M14 17H5M17 4l3 3-3 3M8 14l-3 3 3 3" />
                                    </svg>

                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-white">
                                        Best Prices
                                    </p>

                                    <p className="text-[11px] text-slate-400">
                                        Simple pricing
                                    </p>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            <div className="max-w-1500px mx-auto px-5 md:px-8">

                <section className="relative -mt-10 z-20">

                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200/70 p-4 md:p-5">

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_auto] gap-3">

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
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search car, city or country"
                                    className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition"
                                />

                            </div>

                            <select
                                value={cityFilter}
                                onChange={e => setCityFilter(e.target.value)}
                                className={selectClass}
                            >
                                {availableCities.map(city => (
                                    <option key={city} value={city}>
                                        {city === 'all' ? 'All Locations' : city}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={categoryFilter}
                                onChange={e => setCategoryFilter(e.target.value)}
                                className={selectClass}
                            >
                                <option value="all">
                                    All Car Types
                                </option>

                                {categories
                                    .filter(category => category !== 'all')
                                    .map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                            </select>

                            <button
                                onClick={() => setFiltersOpen(prev => !prev)}
                                className="h-12 px-7 rounded-xl bg-linear-to-r from-[#2563eb] via-[#1687f8] to-[#0ea5e9] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all"
                            >
                                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path d="M3 6h18M6 12h12M10 18h4" />
                                </svg>

                                Filters
                            </button>

                        </div>

                    </div>

                </section>

                {msg && (
                    <div className="mt-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                        {msg}
                    </div>
                )}

                <section className="mt-9 flex items-center justify-between gap-5 flex-wrap">

                    <div className="flex gap-2 overflow-x-auto">

                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setCategoryFilter(category)}
                                className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${categoryFilter === category
                                        ? 'bg-linear-to-r from-blue-600 to-sky-500 border-transparent text-white shadow-md shadow-blue-500/15'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-600'
                                    }`}
                            >
                                {category === 'all' ? 'All Cars' : category}
                            </button>
                        ))}

                    </div>

                    <button
                        onClick={() => setFiltersOpen(prev => !prev)}
                        className="text-sm font-semibold text-blue-600 hover:text-sky-500 transition"
                    >
                        More Filters →
                    </button>

                </section>

                {filtersOpen && (
                    <section className="mt-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

                        <div className="flex items-center justify-between mb-5">

                            <div>
                                <h2 className="font-semibold text-slate-800">
                                    Advanced Filters
                                </h2>

                                <p className="text-xs text-slate-400 mt-1">
                                    Refine your car search
                                </p>
                            </div>

                            <button
                                onClick={resetFilters}
                                className="text-sm font-medium text-blue-600 hover:text-sky-500"
                            >
                                Reset All
                            </button>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

                            <div>
                                <label className={labelClass}>
                                    Brand
                                </label>

                                <select
                                    value={brandFilter}
                                    onChange={e => setBrandFilter(e.target.value)}
                                    className={selectClass}
                                >
                                    {brands.map(brand => (
                                        <option key={brand} value={brand}>
                                            {brand === 'all' ? 'All Brands' : brand}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Country
                                </label>

                                <select
                                    value={countryFilter}
                                    onChange={e => {
                                        setCountryFilter(e.target.value)
                                        setCityFilter('all')
                                    }}
                                    className={selectClass}
                                >
                                    {availableCountries.map(country => (
                                        <option key={country} value={country}>
                                            {country === 'all' ? 'All Countries' : country}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Sort By Price
                                </label>

                                <select
                                    value={sortOrder}
                                    onChange={e => setSortOrder(e.target.value)}
                                    className={selectClass}
                                >
                                    <option value="none">Default</option>
                                    <option value="asc">Low to High</option>
                                    <option value="desc">High to Low</option>
                                </select>
                            </div>

                            <div>

                                <label className={labelClass}>
                                    Price Range
                                </label>

                                <div className="flex items-center gap-2">

                                    <input
                                        type="number"
                                        value={sliderMin}
                                        onChange={e => handleInputMin(e.target.value)}
                                        className={selectClass}
                                    />

                                    <span className="text-slate-400">
                                        -
                                    </span>

                                    <input
                                        type="number"
                                        value={sliderMax}
                                        onChange={e => handleInputMax(e.target.value)}
                                        className={selectClass}
                                    />

                                </div>

                            </div>

                        </div>

                    </section>
                )}

                <section id="popular-cars" className="mt-11">

                    <div className="flex items-end justify-between gap-5">

                        <div>

                            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-blue-600 mb-2">
                                Our Collection
                            </p>

                            <h2 className="text-2xl md:text-3xl font-bold text-[#0b1b30]">
                                Popular Cars
                            </h2>

                            <p className="text-sm text-slate-500 mt-1">
                                Handpicked vehicles for your next journey.
                            </p>

                        </div>

                        <p className="text-sm text-slate-500">
                            <span className="font-semibold text-slate-800">
                                {filtered.length}
                            </span>{' '}
                            cars available
                        </p>

                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-24 gap-3">

                            <div className="size-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />

                            <span className="text-sm text-slate-500">
                                Loading cars...
                            </span>

                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="mt-6 bg-white rounded-2xl border border-slate-200 text-center py-20">

                            <h3 className="font-semibold text-slate-700">
                                No cars found
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                                Try changing your filters
                            </p>

                            <button
                                onClick={resetFilters}
                                className="mt-4 px-5 py-2.5 rounded-xl bg-linear-to-r from-blue-600 to-sky-500 text-white text-sm font-medium"
                            >
                                Reset Filters
                            </button>

                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">

                            {filtered.map(car => (
                                <div
                                    key={car.id}
                                    className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >

                                    <CarSlider car={car} />

                                    <div className="p-5">

                                        <div className="flex items-start justify-between gap-4">

                                            <div>

                                                <h3 className="text-lg font-bold text-[#0b1b30]">
                                                    {car.brand} {car.model}
                                                </h3>

                                                {(car.city || car.country) && (
                                                    <p className="text-xs text-slate-400 mt-1">
                                                        {[car.city, car.country]
                                                            .filter(Boolean)
                                                            .join(', ')}
                                                    </p>
                                                )}

                                            </div>

                                            <p className="text-xl font-bold text-blue-600 whitespace-nowrap">

                                                ${Number(car.pricePerDay).toLocaleString()}

                                                <span className="text-xs font-normal text-slate-400">
                                                    /day
                                                </span>

                                            </p>

                                        </div>

                                        <div className="flex items-center flex-wrap gap-x-5 gap-y-3 mt-5 pt-4 border-t border-slate-100">

                                            {car.year && (
                                                <DetailBadge
                                                    label={car.year}
                                                    icon={
                                                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                                            <rect x="3" y="4" width="18" height="18" rx="2" />
                                                            <path d="M16 2v4M8 2v4M3 10h18" />
                                                        </svg>
                                                    }
                                                />
                                            )}

                                            {car.transmission && (
                                                <DetailBadge
                                                    label={car.transmission}
                                                    icon={
                                                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                                            <circle cx="5" cy="12" r="2" />
                                                            <circle cx="19" cy="5" r="2" />
                                                            <circle cx="19" cy="19" r="2" />
                                                            <path d="M5 14v4a2 2 0 002 2h10M5 10V6a2 2 0 012-2h10M19 7v10" />
                                                        </svg>
                                                    }
                                                />
                                            )}

                                            {car.fuelType && (
                                                <DetailBadge
                                                    label={car.fuelType}
                                                    icon={
                                                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                                            <path d="M3 22V8l6-6h6l2 2v2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2v6" />
                                                        </svg>
                                                    }
                                                />
                                            )}

                                            {car.mileage && (
                                                <DetailBadge
                                                    label={car.mileage}
                                                    icon={
                                                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                                            <circle cx="12" cy="12" r="9" />
                                                            <path d="M12 7v5l3 2" />
                                                        </svg>
                                                    }
                                                />
                                            )}

                                        </div>

                                        <button
                                            onClick={() => {
                                                setBookingModal(car)

                                                setBookingForm({
                                                    startDate: '',
                                                    endDate: ''
                                                })

                                                setBookingError('')
                                            }}
                                            className="w-full h-11 mt-5 rounded-xl bg-linear-to-r from-[#2563eb] via-[#1687f8] to-[#0ea5e9] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-500/15 hover:-translate-y-0.5 transition-all"
                                        >

                                            View Details

                                            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path d="M5 12h14M13 6l6 6-6 6" />
                                            </svg>

                                        </button>

                                    </div>

                                </div>
                            ))}

                        </div>
                    )}

                </section>

                <section className="mt-12 overflow-hidden rounded-2xl bg-linear-to-r from-[#08172a] via-[#0d2c4d] to-[#164b72] shadow-lg">

                    <div className="px-7 py-7 md:px-10 flex items-center justify-between gap-5 flex-wrap">

                        <div>

                            <h3 className="text-xl font-bold text-white">
                                Make Every Journey Extraordinary
                            </h3>

                            <p className="text-sm text-slate-300 mt-1">
                                Premium cars. Simple booking. Better journeys.
                            </p>

                        </div>

                        <button
                            onClick={() => window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            })}
                            className="px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold text-sm hover:bg-sky-50 transition shadow"
                        >
                            Explore Cars →
                        </button>

                    </div>

                </section>

                {bookingModal && (
                    <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">

                        <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">

                            {bookingModal.imageUrl && (
                                <div className="h-52 relative">

                                    <img
                                        src={bookingModal.imageUrl}
                                        alt={`${bookingModal.brand} ${bookingModal.model}`}
                                        className="w-full h-full object-cover"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 to-transparent" />

                                    <button
                                        onClick={() => {
                                            setBookingModal(null)
                                            setBookingError('')
                                        }}
                                        className="absolute top-4 right-4 size-9 rounded-full bg-slate-950/50 text-white flex items-center justify-center hover:bg-slate-950/70"
                                    >
                                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                    </button>

                                    <div className="absolute bottom-4 left-5">

                                        <h3 className="text-xl font-bold text-white">
                                            {bookingModal.brand} {bookingModal.model}
                                        </h3>

                                        <p className="text-xs text-slate-200 mt-1">
                                            {[bookingModal.city, bookingModal.country]
                                                .filter(Boolean)
                                                .join(', ')}
                                        </p>

                                    </div>

                                </div>
                            )}

                            <div className="p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-xs text-slate-400">
                                            Price Per Day
                                        </p>

                                        <p className="text-2xl font-bold text-blue-600">
                                            ${Number(bookingModal.pricePerDay).toLocaleString()}
                                        </p>

                                    </div>

                                    <span className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium">
                                        Available
                                    </span>

                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">

                                    <div>
                                        <label className={labelClass}>
                                            Pickup Date
                                        </label>

                                        <input
                                            type="date"
                                            value={bookingForm.startDate}
                                            onChange={e =>
                                                setBookingForm({
                                                    ...bookingForm,
                                                    startDate: e.target.value
                                                })
                                            }
                                            className={selectClass}
                                        />
                                    </div>

                                    <div>
                                        <label className={labelClass}>
                                            Return Date
                                        </label>

                                        <input
                                            type="date"
                                            value={bookingForm.endDate}
                                            onChange={e =>
                                                setBookingForm({
                                                    ...bookingForm,
                                                    endDate: e.target.value
                                                })
                                            }
                                            className={selectClass}
                                        />
                                    </div>

                                </div>

                                {bookingDays > 0 && (
                                    <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-100">

                                        <div className="flex justify-between text-sm text-slate-500">
                                            <span>Rental Duration</span>

                                            <span>
                                                {bookingDays} {bookingDays === 1 ? 'day' : 'days'}
                                            </span>
                                        </div>

                                        <div className="flex justify-between mt-3 pt-3 border-t border-slate-200">

                                            <span className="font-semibold text-slate-700">
                                                Estimated Total
                                            </span>

                                            <span className="text-xl font-bold text-blue-600">
                                                ${bookingTotal.toLocaleString()}
                                            </span>

                                        </div>

                                    </div>
                                )}

                                {bookingError && (
                                    <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                        {bookingError}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-3 mt-6">

                                    <button
                                        onClick={() => {
                                            setBookingModal(null)
                                            setBookingError('')
                                        }}
                                        className="h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        onClick={handleBook}
                                        className="h-11 rounded-xl bg-linear-to-r from-[#2563eb] via-[#1687f8] to-[#0ea5e9] text-white text-sm font-semibold shadow-md shadow-blue-500/20"
                                    >
                                        Send Request
                                    </button>

                                </div>

                            </div>

                        </div>

                    </div>
                )}

            </div>

        </div>
    )
}