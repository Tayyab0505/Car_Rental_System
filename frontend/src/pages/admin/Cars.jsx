import { useEffect, useMemo, useState } from 'react'
import API from '../../api/axios'
import locations from '../../data/locations'

const emptyForm = {
    brand: '',
    model: '',
    pricePerDay: '',
    priceperhour: '',
    availability: true,
    status: 'available',
    imageUrl: '',
    imageUrl2: '',
    imageUrl3: '',
    country: '',
    city: '',
    year: '',
    transmission: '',
    fuelType: '',
    mileage: '',
    category: '',
    seats: ''
}

const countries = Object.keys(locations)
const categories = ['SUV', 'Sedan', 'Hatchback', 'Luxury', 'Coupe', 'Pickup', 'Van']

const imageSlots = [
    { fileKey: 'image', formKey: 'imageUrl', label: 'Main Photo' },
    { fileKey: 'image2', formKey: 'imageUrl2', label: 'Photo 2' },
    { fileKey: 'image3', formKey: 'imageUrl3', label: 'Photo 3' }
]

const statusConfig = {
    available: { label: 'Available', classes: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
    booked: { label: 'Booked', classes: 'bg-blue-50 text-blue-700 border-blue-100' },
    maintenance: { label: 'Maintenance', classes: 'bg-amber-50 text-amber-700 border-amber-100' }
}

const backendUrl = (API.defaults.baseURL || '').replace(/\/api\/?$/, '')

function getImageUrl(value) {
    if (!value) return ''

    if (
        value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('data:')
    ) {
        return value
    }

    return `${backendUrl}${value}`
}

function getCarId(car) {
    return car?.id || car?._id
}

function getPriceBounds(cars) {
    if (!cars.length) return { min: 0, max: 0 }

    const prices = cars.map(car => Number(car.pricePerDay) || 0)

    return {
        min: Math.min(...prices),
        max: Math.max(...prices)
    }
}

function FleetStat({ label, value, subtext, icon, iconClass }) {
    return (
        <div className="bg-white rounded-[24px] border border-slate-200/80 shadow-[0_10px_24px_rgba(15,23,42,0.04)] px-5 py-5">
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

function DetailBadge({ icon, label }) {
    return (
        <div className="flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-2.5 py-2">
            <span className="text-slate-400 shrink-0">{icon}</span>
            <span className="text-xs font-medium text-slate-600 truncate">{label}</span>
        </div>
    )
}

function CarSlider({ car }) {
    const images = [
        getImageUrl(car.imageUrl),
        getImageUrl(car.imageUrl2),
        getImageUrl(car.imageUrl3)
    ].filter(Boolean)

    const [current, setCurrent] = useState(0)
    const [errored, setErrored] = useState({})

    const validImages = images
        .map((src, index) => ({ src, index }))
        .filter(image => !errored[image.index])

    if (validImages.length === 0) {
        return (
            <div className="h-56 bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <svg className="size-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                    <circle cx="7" cy="17" r="2" />
                    <circle cx="17" cy="17" r="2" />
                    <path d="M5 9h14" />
                </svg>
            </div>
        )
    }

    const index = current % validImages.length

    const previousImage = e => {
        e.stopPropagation()
        setCurrent(value => (value - 1 + validImages.length) % validImages.length)
    }

    const nextImage = e => {
        e.stopPropagation()
        setCurrent(value => (value + 1) % validImages.length)
    }

    return (
        <div className="relative h-56 overflow-hidden bg-slate-100 group">
            <img
                src={validImages[index].src}
                alt={`${car.brand} ${car.model}`}
                onError={() => setErrored(currentErrors => ({
                    ...currentErrors,
                    [validImages[index].index]: true
                }))}
                className="size-full object-cover group-hover:scale-[1.03] transition duration-500"
            />

            <div className="absolute inset-0 bg-linear-to-t from-slate-950/50 via-slate-900/10 to-transparent" />

            {car.category && (
                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white text-[11px] font-semibold">
                    {car.category}
                </span>
            )}

            {validImages.length > 1 && (
                <>
                    <button onClick={previousImage} className="absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-slate-950/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
                    </button>

                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-slate-950/45 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1">
                        {validImages.map((image, imageIndex) => (
                            <button
                                key={image.index}
                                onClick={e => {
                                    e.stopPropagation()
                                    setCurrent(imageIndex)
                                }}
                                className={`h-1.5 rounded-full transition-all ${imageIndex === index ? 'w-5 bg-white' : 'w-1.5 bg-white/55'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}

export default function AdminCars() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)

    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [deleteModal, setDeleteModal] = useState(null)

    const [imageFiles, setImageFiles] = useState({
        image: null,
        image2: null,
        image3: null
    })

    const [imagePreviews, setImagePreviews] = useState({
        image: '',
        image2: '',
        image3: ''
    })

    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)

    const [message, setMessage] = useState({
        text: '',
        type: 'success'
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [filtersOpen, setFiltersOpen] = useState(false)

    const [brandFilter, setBrandFilter] = useState('all')
    const [countryFilter, setCountryFilter] = useState('all')
    const [cityFilter, setCityFilter] = useState('all')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('none')

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(0)
    const [sliderMin, setSliderMin] = useState(0)
    const [sliderMax, setSliderMax] = useState(0)

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await API.get('/findAllAdminCars')
                const data = Array.isArray(res.data) ? res.data : []
                const bounds = getPriceBounds(data)

                setCars(data)
                setMinPrice(bounds.min)
                setMaxPrice(bounds.max)
                setSliderMin(bounds.min)
                setSliderMax(bounds.max)
            } catch (error) {
                console.error('API Error:', error.response?.data || error.message)

                setMessage({
                    text: 'Failed to load cars. Check backend server.',
                    type: 'error'
                })
            } finally {
                setLoading(false)
            }
        }

        fetchCars()
    }, [])

    const brands = useMemo(() => {
        return ['all', ...new Set(cars.map(car => car.brand).filter(Boolean))]
    }, [cars])

    const availableCountries = useMemo(() => {
        return ['all', ...new Set(cars.map(car => car.country).filter(Boolean))]
    }, [cars])

    const availableCities = useMemo(() => {
        if (countryFilter === 'all') {
            return ['all', ...new Set(cars.map(car => car.city).filter(Boolean))]
        }

        return [
            'all',
            ...new Set(
                cars
                    .filter(car => car.country === countryFilter)
                    .map(car => car.city)
                    .filter(Boolean)
            )
        ]
    }, [cars, countryFilter])

    const stats = useMemo(() => ({
        total: cars.length,
        available: cars.filter(car => (car.status || 'available') === 'available').length,
        booked: cars.filter(car => car.status === 'booked').length,
        maintenance: cars.filter(car => car.status === 'maintenance').length
    }), [cars])

    const filtered = useMemo(() => {
        let list = [...cars]

        if (searchTerm.trim()) {
            const search = searchTerm.toLowerCase()

            list = list.filter(car => {
                const text = `${car.brand || ''} ${car.model || ''} ${car.category || ''} ${car.city || ''} ${car.country || ''}`.toLowerCase()
                return text.includes(search)
            })
        }

        if (brandFilter !== 'all') list = list.filter(car => car.brand === brandFilter)
        if (countryFilter !== 'all') list = list.filter(car => car.country === countryFilter)
        if (cityFilter !== 'all') list = list.filter(car => car.city === cityFilter)
        if (categoryFilter !== 'all') list = list.filter(car => car.category === categoryFilter)
        if (statusFilter !== 'all') list = list.filter(car => (car.status || 'available') === statusFilter)

        list = list.filter(car => {
            const price = Number(car.pricePerDay) || 0
            return price >= sliderMin && price <= sliderMax
        })

        if (sortOrder === 'asc') list.sort((a, b) => Number(a.pricePerDay) - Number(b.pricePerDay))
        if (sortOrder === 'desc') list.sort((a, b) => Number(b.pricePerDay) - Number(a.pricePerDay))

        return list
    }, [
        cars,
        searchTerm,
        brandFilter,
        countryFilter,
        cityFilter,
        categoryFilter,
        statusFilter,
        sliderMin,
        sliderMax,
        sortOrder
    ])

    const isFiltered =
        searchTerm !== '' ||
        brandFilter !== 'all' ||
        countryFilter !== 'all' ||
        cityFilter !== 'all' ||
        categoryFilter !== 'all' ||
        statusFilter !== 'all' ||
        sortOrder !== 'none' ||
        sliderMin !== minPrice ||
        sliderMax !== maxPrice

    const refreshCars = async () => {
        const res = await API.get('/findAllAdminCars')
        const data = Array.isArray(res.data) ? res.data : []
        const bounds = getPriceBounds(data)

        setCars(data)
        setMinPrice(bounds.min)
        setMaxPrice(bounds.max)
        setSliderMin(bounds.min)
        setSliderMax(bounds.max)
    }

    const showToast = (text, type = 'success') => {
        setMessage({ text, type })

        setTimeout(() => {
            setMessage({
                text: '',
                type: 'success'
            })
        }, 2500)
    }

    const resetFilters = () => {
        setSearchTerm('')
        setBrandFilter('all')
        setCountryFilter('all')
        setCityFilter('all')
        setCategoryFilter('all')
        setStatusFilter('all')
        setSortOrder('none')
        setSliderMin(minPrice)
        setSliderMax(maxPrice)
    }

    const openAdd = () => {
        setForm({ ...emptyForm })

        setImageFiles({
            image: null,
            image2: null,
            image3: null
        })

        setImagePreviews({
            image: '',
            image2: '',
            image3: ''
        })

        setEditId(null)
        setShowModal(true)
    }

    const openEdit = car => {
        setForm({
            brand: car.brand || '',
            model: car.model || '',
            pricePerDay: car.pricePerDay || '',
            priceperhour: car.priceperhour || '',
            availability: Boolean(car.availability),
            status: car.status || 'available',
            imageUrl: car.imageUrl || '',
            imageUrl2: car.imageUrl2 || '',
            imageUrl3: car.imageUrl3 || '',
            country: car.country || '',
            city: car.city || '',
            year: car.year || '',
            transmission: car.transmission || '',
            fuelType: car.fuelType || '',
            mileage: car.mileage || '',
            category: car.category || '',
            seats: car.seats || ''
        })

        setImageFiles({
            image: null,
            image2: null,
            image3: null
        })

        setImagePreviews({
            image: getImageUrl(car.imageUrl),
            image2: getImageUrl(car.imageUrl2),
            image3: getImageUrl(car.imageUrl3)
        })

        setEditId(getCarId(car))
        setShowModal(true)
    }

    const handleStatusChange = status => {
        setForm(current => ({
            ...current,
            status,
            availability: status === 'available'
        }))
    }

    const handleImageChange = (fileKey, file) => {
        if (!file) return

        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp'
        ]

        if (!allowedTypes.includes(file.type)) {
            showToast('Only JPG, PNG and WEBP images are allowed.', 'error')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            showToast('Image must be smaller than 5MB.', 'error')
            return
        }

        const reader = new FileReader()

        reader.onload = () => {
            setImagePreviews(current => ({
                ...current,
                [fileKey]: reader.result
            }))
        }

        reader.readAsDataURL(file)

        setImageFiles(current => ({
            ...current,
            [fileKey]: file
        }))
    }

    const removeImage = (fileKey, formKey) => {
        setImageFiles(current => ({
            ...current,
            [fileKey]: null
        }))

        setImagePreviews(current => ({
            ...current,
            [fileKey]: ''
        }))

        setForm(current => ({
            ...current,
            [formKey]: ''
        }))
    }

    const handleSave = async () => {
        if (
            !form.brand.trim() ||
            !form.model.trim() ||
            !form.pricePerDay ||
            !form.category ||
            !form.country ||
            !form.city
        ) {
            showToast('Please complete all required car details.', 'error')
            return
        }

        if (!form.imageUrl && !imageFiles.image) {
            showToast('Please select a main car photo.', 'error')
            return
        }

        const data = new FormData()

        Object.entries(form).forEach(([key, value]) => {
            data.append(key, value ?? '')
        })

        Object.entries(imageFiles).forEach(([key, file]) => {
            if (file) data.append(key, file)
        })

        setSaving(true)

        try {
            if (editId) {
                await API.put(`/updateCar/${editId}`, data)
            } else {
                await API.post('/addCar', data)
            }

            await refreshCars()
            setShowModal(false)

            showToast(
                editId
                    ? 'Car updated successfully.'
                    : 'Car added successfully.'
            )
        } catch (error) {
            showToast(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to save car.',
                'error'
            )
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteModal) return

        setDeleting(true)

        try {
            await API.delete(`/deleteCar/${getCarId(deleteModal)}`)
            await refreshCars()

            setDeleteModal(null)
            showToast('Car deleted successfully.')
        } catch (error) {
            showToast(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Failed to delete car.',
                'error'
            )
        } finally {
            setDeleting(false)
        }
    }

    const handleSliderMin = value => {
        setSliderMin(Math.max(minPrice, Math.min(Number(value), sliderMax - 1)))
    }

    const handleSliderMax = value => {
        setSliderMax(Math.min(maxPrice, Math.max(Number(value), sliderMin + 1)))
    }

    const range = maxPrice - minPrice || 1
    const leftPct = ((sliderMin - minPrice) / range) * 100
    const rightPct = 100 - ((sliderMax - minPrice) / range) * 100

    const inputClass = 'w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition'
    const selectClass = 'w-full h-11 px-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/10 transition'
    const labelClass = 'block text-xs font-medium text-slate-500 mb-2'

    return (
        <div className="min-h-full bg-[#f4f7fb]">
            <div className="max-w-screen-2xl mx-auto px-5 py-6 md:px-8 md:py-7">
                <section className="relative overflow-hidden rounded-[30px] border border-slate-200/70 bg-linear-to-r from-[#0f172a] via-[#1e293b] to-[#334155] px-6 py-6 md:px-8 md:py-7 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
                    <div className="absolute -top-20 right-10 size-56 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-20 left-1/3 size-60 rounded-full bg-sky-400/10 blur-3xl" />

                    <div className="relative flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="text-[12px] font-semibold tracking-[0.28em] uppercase text-sky-300">Fleet Management</p>
                            <h1 className="text-3xl md:text-[40px] leading-tight font-bold text-white mt-3">Manage Your Fleet</h1>
                            <p className="text-[15px] leading-7 text-slate-300 mt-3 max-w-xl">
                                Add vehicles, update specifications and manage availability across your premium rental collection.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="min-w-28 rounded-[22px] border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4">
                                    <p className="text-2xl font-bold text-white">{stats.available}</p>
                                    <p className="text-sm text-slate-300 mt-1">Cars Available</p>
                                </div>

                                <div className="min-w-28 rounded-[22px] border border-white/10 bg-white/10 backdrop-blur-md px-4 py-4">
                                    <p className="text-2xl font-bold text-white">{stats.booked}</p>
                                    <p className="text-sm text-slate-300 mt-1">Currently Booked</p>
                                </div>
                            </div>

                            <button onClick={openAdd} className="h-12 px-5 rounded-2xl bg-white text-slate-900 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-black/10 hover:-translate-y-0.5 transition">
                                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                                Add New Car
                            </button>
                        </div>
                    </div>
                </section>

                {message.text && (
                    <div className={`mt-5 rounded-2xl border px-4 py-3.5 text-sm ${message.type === 'error' ? 'bg-red-50 border-red-200 text-red-600' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                        {message.text}
                    </div>
                )}

                <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
                    <FleetStat
                        label="Total Cars"
                        value={stats.total}
                        subtext="Entire fleet inventory"
                        iconClass="bg-indigo-50 text-indigo-600"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.9} viewBox="0 0 24 24"><path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>}
                    />

                    <FleetStat
                        label="Available"
                        value={stats.available}
                        subtext="Ready for new bookings"
                        iconClass="bg-emerald-50 text-emerald-600"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2.1} viewBox="0 0 24 24"><path d="M5 12l4 4L19 6" /></svg>}
                    />

                    <FleetStat
                        label="Booked"
                        value={stats.booked}
                        subtext="Assigned to customers"
                        iconClass="bg-blue-50 text-blue-600"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>}
                    />

                    <FleetStat
                        label="Maintenance"
                        value={stats.maintenance}
                        subtext="Needs service attention"
                        iconClass="bg-amber-50 text-amber-600"
                        icon={<svg className="size-5" fill="none" stroke="currentColor" strokeWidth={1.9} viewBox="0 0 24 24"><path d="M14.7 6.3a4 4 0 01-5 5L4 17l3 3 5.7-5.7a4 4 0 005-5l-2.4 2.4-3-3z" /></svg>}
                    />
                </section>

                <section className="mt-6 rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.04)] overflow-hidden">
                    <div className="p-5 md:p-6">
                        <div className="flex flex-col xl:flex-row xl:items-center gap-3">
                            <div className="relative flex-1">
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>

                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    placeholder="Search brand, model, category or location"
                                    className="w-full h-13 pl-12 pr-4 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-700 outline-none focus:bg-white focus:border-sky-400 focus:ring-2 focus:ring-sky-500/10 transition"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={() => setFiltersOpen(current => !current)} className={`h-13 px-5 rounded-2xl border text-sm font-semibold flex items-center gap-2 transition ${filtersOpen || isFiltered ? 'bg-sky-50 text-sky-700 border-sky-100' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-200 hover:text-sky-600'}`}>
                                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 6h18M6 12h12M10 18h4" /></svg>
                                    Filters
                                    {isFiltered && <span className="size-2 rounded-full bg-sky-500" />}
                                </button>

                                {isFiltered && (
                                    <button onClick={resetFilters} className="h-13 px-4 rounded-2xl text-sm font-medium text-slate-500 hover:text-sky-600 hover:bg-sky-50 transition">
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        {filtersOpen && (
                            <div className="mt-5 pt-5 border-t border-slate-100">
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                    <div>
                                        <label className={labelClass}>Brand</label>
                                        <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)} className={selectClass}>
                                            {brands.map(brand => <option key={brand} value={brand}>{brand === 'all' ? 'All brands' : brand}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Category</label>
                                        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className={selectClass}>
                                            <option value="all">All categories</option>
                                            {categories.map(category => <option key={category} value={category}>{category}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Status</label>
                                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={selectClass}>
                                            <option value="all">All statuses</option>
                                            <option value="available">Available</option>
                                            <option value="booked">Booked</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Country</label>
                                        <select
                                            value={countryFilter}
                                            onChange={e => {
                                                setCountryFilter(e.target.value)
                                                setCityFilter('all')
                                            }}
                                            className={selectClass}
                                        >
                                            {availableCountries.map(country => <option key={country} value={country}>{country === 'all' ? 'All countries' : country}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>City</label>
                                        <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} disabled={availableCities.length <= 1} className={`${selectClass} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                            {availableCities.map(city => <option key={city} value={city}>{city === 'all' ? 'All cities' : city}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Sort by price</label>
                                        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} className={selectClass}>
                                            <option value="none">Default</option>
                                            <option value="asc">Low to high</option>
                                            <option value="desc">High to low</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2 xl:col-span-3">
                                        <div className="flex items-center justify-between gap-4 mb-3">
                                            <label className="text-xs font-medium text-slate-500">Price Range</label>
                                            <span className="text-sm font-semibold text-sky-600">${sliderMin.toLocaleString()} – ${sliderMax.toLocaleString()}</span>
                                        </div>

                                        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center mb-4">
                                            <input type="number" value={sliderMin} onChange={e => handleSliderMin(e.target.value)} className={inputClass} placeholder="Min" />
                                            <span className="text-slate-300">—</span>
                                            <input type="number" value={sliderMax} onChange={e => handleSliderMax(e.target.value)} className={inputClass} placeholder="Max" />
                                        </div>

                                        {maxPrice > minPrice && (
                                            <>
                                                <div className="relative h-5 flex items-center">
                                                    <div className="absolute w-full h-1.5 rounded-full bg-slate-200">
                                                        <div className="absolute h-1.5 rounded-full bg-linear-to-r from-sky-500 to-blue-500" style={{ left: `${leftPct}%`, right: `${rightPct}%` }} />
                                                    </div>

                                                    <input
                                                        type="range"
                                                        min={minPrice}
                                                        max={maxPrice}
                                                        value={sliderMin}
                                                        step={1}
                                                        onChange={e => handleSliderMin(e.target.value)}
                                                        className="absolute w-full h-1.5 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-sky-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                                                        style={{ zIndex: sliderMin > maxPrice - 100 ? 5 : 3 }}
                                                    />

                                                    <input
                                                        type="range"
                                                        min={minPrice}
                                                        max={maxPrice}
                                                        value={sliderMax}
                                                        step={1}
                                                        onChange={e => handleSliderMax(e.target.value)}
                                                        className="absolute w-full h-1.5 appearance-none bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
                                                        style={{ zIndex: 4 }}
                                                    />
                                                </div>

                                                <div className="flex justify-between mt-1">
                                                    <span className="text-xs text-slate-400">${minPrice.toLocaleString()}</span>
                                                    <span className="text-xs text-slate-400">${maxPrice.toLocaleString()}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </section>

                <div className="flex items-end justify-between gap-4 mt-7 mb-5">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.22em] text-sky-600 uppercase">Fleet Collection</p>
                        <h2 className="text-[30px] leading-tight font-bold text-slate-900 mt-2">Vehicles</h2>
                    </div>

                    <p className="text-sm text-slate-500">
                        <span className="font-semibold text-slate-800">{filtered.length}</span> of {cars.length} cars
                    </p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-[28px] border border-slate-200 py-24 flex items-center justify-center gap-3">
                        <div className="size-7 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-slate-400">Loading cars...</span>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="bg-white rounded-[28px] border border-slate-200 py-24 text-center">
                        <div className="size-16 rounded-2xl bg-sky-50 text-sky-300 flex items-center justify-center mx-auto">
                            <svg className="size-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                                <circle cx="7" cy="17" r="2" />
                                <circle cx="17" cy="17" r="2" />
                            </svg>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-700 mt-5">No cars found</h3>
                        <p className="text-sm text-slate-400 mt-1">Try changing your search or filters.</p>

                        <button onClick={resetFilters} className="mt-4 text-sm font-semibold text-sky-600 hover:text-sky-500">
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filtered.map(car => {
                            const carStatus = car.status || 'available'
                            const status = statusConfig[carStatus] || statusConfig.available

                            return (
                                <div key={getCarId(car)} className="bg-white rounded-[28px] border border-slate-200/80 overflow-hidden shadow-[0_12px_34px_rgba(15,23,42,0.05)] hover:shadow-[0_20px_45px_rgba(15,23,42,0.10)] hover:-translate-y-1 transition duration-300">
                                    <CarSlider car={car} />

                                    <div className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <h3 className="text-[24px] leading-tight font-bold text-slate-900 truncate">{car.brand} {car.model}</h3>

                                                {(car.city || car.country) && (
                                                    <div className="flex items-center gap-1.5 mt-2">
                                                        <svg className="size-3.5 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5 1.12 2.5 2.5 2.5z" /></svg>
                                                        <span className="text-xs text-slate-400 truncate">{[car.city, car.country].filter(Boolean).join(', ')}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <span className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-semibold ${status.classes}`}>
                                                {status.label}
                                            </span>
                                        </div>

                                        <div className="flex items-end justify-between gap-3 mt-4">
                                            <div className="flex items-baseline gap-2">
                                                <p className="text-[30px] leading-none font-bold text-slate-900">${Number(car.pricePerDay || 0).toLocaleString()}</p>
                                                <span className="text-sm text-slate-400 mb-1">/day</span>
                                            </div>

                                            {car.priceperhour && (
                                                <p className="text-sm font-medium text-slate-500">
                                                    ${Number(car.priceperhour).toLocaleString()}
                                                    <span className="text-xs text-slate-400">/hr</span>
                                                </p>
                                            )}
                                        </div>

                                        {(car.year || car.transmission || car.fuelType || car.mileage || car.seats) && (
                                            <div className="grid grid-cols-2 gap-2 mt-5">
                                                {car.year && <DetailBadge label={car.year} icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>} />}
                                                {car.transmission && <DetailBadge label={car.transmission} icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="5" cy="12" r="2" /><circle cx="19" cy="5" r="2" /><circle cx="19" cy="19" r="2" /><path d="M5 14v4a2 2 0 002 2h10M5 10V6a2 2 0 012-2h10M19 7v10" /></svg>} />}
                                                {car.fuelType && <DetailBadge label={car.fuelType} icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 22V8l6-6h6l2 2v2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2v6" /><path d="M9 2v6H3" /></svg>} />}
                                                {car.mileage && <DetailBadge label={car.mileage} icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>} />}
                                                {car.seats && <DetailBadge label={`${car.seats} seats`} icon={<svg className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>} />}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-2 mt-5 pt-5 border-t border-slate-100">
                                            <button onClick={() => openEdit(car)} className="h-11 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition">
                                                Edit Details
                                            </button>

                                            <button onClick={() => setDeleteModal(car)} className="h-11 rounded-xl border border-red-100 text-red-500 text-sm font-semibold hover:bg-red-50 hover:border-red-200 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {showModal && (
                    <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-[28px] shadow-2xl overflow-hidden flex flex-col">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
                                <div>
                                    <p className="text-xs font-semibold text-sky-600 tracking-[0.18em] uppercase">Fleet Management</p>
                                    <h3 className="text-2xl font-bold text-slate-900 mt-1">{editId ? 'Edit Car' : 'Add New Car'}</h3>
                                </div>

                                <button onClick={() => setShowModal(false)} className="size-10 rounded-xl border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50">
                                    <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M18 6L6 18M6 6l12 12" /></svg>
                                </button>
                            </div>

                            <div className="overflow-y-auto p-6">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-4">Basic Information</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Brand *</label>
                                        <input type="text" placeholder="e.g. Toyota" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className={inputClass} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Model *</label>
                                        <input type="text" placeholder="e.g. Corolla" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className={inputClass} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Category *</label>
                                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={selectClass}>
                                            <option value="">Select category</option>
                                            {categories.map(category => <option key={category} value={category}>{category}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Status</label>
                                        <select value={form.status} onChange={e => handleStatusChange(e.target.value)} className={selectClass}>
                                            <option value="available">Available</option>
                                            <option value="booked">Booked</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </div>
                                </div>

                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-4 mt-7">Pricing</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Price Per Day ($) *</label>
                                        <input type="number" min="0" placeholder="e.g. 100" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: e.target.value })} className={inputClass} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Price Per Hour ($)</label>
                                        <input type="number" min="0" placeholder="e.g. 15" value={form.priceperhour} onChange={e => setForm({ ...form, priceperhour: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-4 mt-7">Car Photos</p>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {imageSlots.map(slot => (
                                        <div key={slot.fileKey}>
                                            <p className="text-xs font-medium text-slate-500 mb-2">
                                                {slot.label}{slot.fileKey === 'image' && ' *'}
                                            </p>

                                            <div className="relative h-36 rounded-2xl border border-dashed border-slate-300 bg-slate-50 overflow-hidden group">
                                                {imagePreviews[slot.fileKey] ? (
                                                    <>
                                                        <img src={imagePreviews[slot.fileKey]} alt={slot.label} className="size-full object-cover" />

                                                        <div className="absolute inset-0 bg-slate-950/55 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                                            <label htmlFor={slot.fileKey} className="h-9 px-3 rounded-xl bg-white text-slate-700 text-xs font-semibold flex items-center justify-center cursor-pointer">
                                                                Replace
                                                            </label>

                                                            <button type="button" onClick={() => removeImage(slot.fileKey, slot.formKey)} className="h-9 px-3 rounded-xl bg-red-500 text-white text-xs font-semibold">
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <label htmlFor={slot.fileKey} className="size-full flex flex-col items-center justify-center cursor-pointer hover:bg-sky-50 transition">
                                                        <div className="size-10 rounded-xl bg-white border border-slate-200 text-sky-600 flex items-center justify-center shadow-sm">
                                                            <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                                                        </div>

                                                        <p className="text-xs font-semibold text-slate-600 mt-3">Choose Photo</p>
                                                        <p className="text-[10px] text-slate-400 mt-1">JPG, PNG or WEBP</p>
                                                    </label>
                                                )}

                                                <input
                                                    id={slot.fileKey}
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={e => {
                                                        handleImageChange(slot.fileKey, e.target.files?.[0])
                                                        e.target.value = ''
                                                    }}
                                                    className="hidden"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-[11px] text-slate-400 mt-3">
                                    Upload up to 3 photos. Maximum size is 5MB per image.
                                </p>

                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-4 mt-7">Specifications</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Year</label>
                                        <input type="number" placeholder="e.g. 2026" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className={inputClass} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Seats</label>
                                        <input type="number" min="1" placeholder="e.g. 5" value={form.seats} onChange={e => setForm({ ...form, seats: e.target.value })} className={inputClass} />
                                    </div>

                                    <div>
                                        <label className={labelClass}>Transmission</label>
                                        <select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })} className={selectClass}>
                                            <option value="">Select transmission</option>
                                            <option value="Automatic">Automatic</option>
                                            <option value="Manual">Manual</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>Fuel Type</label>
                                        <select value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })} className={selectClass}>
                                            <option value="">Select fuel type</option>
                                            <option value="Petrol">Petrol</option>
                                            <option value="Diesel">Diesel</option>
                                            <option value="Electric">Electric</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="CNG">CNG</option>
                                        </select>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>Mileage</label>
                                        <input type="text" placeholder="e.g. 15,000 km" value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} className={inputClass} />
                                    </div>
                                </div>

                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-[0.18em] mb-4 mt-7">Location</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>Country *</label>
                                        <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value, city: '' })} className={selectClass}>
                                            <option value="">Select country</option>
                                            {countries.map(country => <option key={country} value={country}>{country}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className={labelClass}>City *</label>
                                        <select value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} disabled={!form.country} className={`${selectClass} disabled:opacity-50 disabled:cursor-not-allowed`}>
                                            <option value="">{form.country ? 'Select city' : 'Select country first'}</option>
                                            {form.country && locations[form.country]?.map(city => <option key={city} value={city}>{city}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                                    <label className="flex items-center gap-3">
                                        <input type="checkbox" checked={form.availability} disabled={form.status !== 'available'} onChange={e => setForm({ ...form, availability: e.target.checked })} className="size-4 accent-sky-600 disabled:opacity-50" />

                                        <div>
                                            <p className="text-sm font-medium text-slate-700">Available for booking</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Only vehicles with available status can be shown as bookable.</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="px-6 py-5 border-t border-slate-100 bg-white flex gap-3 shrink-0">
                                <button onClick={() => setShowModal(false)} disabled={saving} className="flex-1 h-12 rounded-2xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 disabled:opacity-50">
                                    Cancel
                                </button>

                                <button onClick={handleSave} disabled={saving} className="flex-1 h-12 rounded-2xl bg-linear-to-r from-sky-600 to-blue-600 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 hover:-translate-y-0.5 transition disabled:opacity-60 disabled:translate-y-0">
                                    {saving ? 'Saving...' : editId ? 'Save Changes' : 'Add Car'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {deleteModal && (
                    <div className="fixed inset-0 z-[60] bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl p-6">
                            <div className="size-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mt-5">Delete Car?</h3>

                            <p className="text-sm text-slate-500 mt-2 leading-6">
                                Are you sure you want to delete{' '}
                                <span className="font-semibold text-slate-700">{deleteModal.brand} {deleteModal.model}</span>?
                                {' '}This action cannot be undone.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button onClick={() => setDeleteModal(null)} disabled={deleting} className="h-11 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold disabled:opacity-50">
                                    Keep Car
                                </button>

                                <button onClick={handleDelete} disabled={deleting} className="h-11 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 disabled:opacity-60">
                                    {deleting ? 'Deleting...' : 'Yes, Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}