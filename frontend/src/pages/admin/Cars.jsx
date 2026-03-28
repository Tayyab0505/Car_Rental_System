import { useEffect, useState } from 'react'
import API from '../../api/axios'

const emptyForm = { brand: '', model: '', pricePerDay: '', availability: true, imageUrl: '' }

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

export default function AdminCars() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [deleteModal, setDeleteModal] = useState(null)
    const [msg, setMsg] = useState('')

    useEffect(() => {
        const fetchCars = () => {
            setLoading(true)
            API.get('/findAllCar')
                .then(r => setCars(r.data))
                .finally(() => setLoading(false))
        }
        fetchCars()
    }, [])

    const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
    const openEdit = (car) => {
        setForm({
            brand: car.brand,
            model: car.model,
            pricePerDay: car.pricePerDay,
            availability: car.availability,
            imageUrl: car.imageUrl || ''
        })
        setEditId(car.id)
        setShowModal(true)
    }

    const handleSave = async () => {
        try {
            if (editId) await API.put(`/updateCar/${editId}`, form)
            else await API.post('/addCar', form)
            setShowModal(false)
            const response = await API.get('/findAllCar')
            setCars(response.data)
            setMsg(editId ? 'Car updated successfully' : 'Car added successfully')
            setTimeout(() => setMsg(''), 3000)
        } catch {
            setMsg('Failed to save car')
            setTimeout(() => setMsg(''), 3000)
        }
    }

    const handleDelete = async () => {
        try {
            await API.delete(`/deleteCar/${deleteModal}`);
            setDeleteModal(null)
            const response = await API.get('/findAllCar')
            setCars(response.data)
            setMsg('Car deleted')
            setTimeout(() => setMsg(''), 2000)
        }
        catch {
            setMsg('Failed to delete')
            setTimeout(() => setMsg(''), 2000)
        }
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Outfit,sans-serif' }}>Cars management</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Add, edit or remove cars from the fleet</p>
                </div>
                <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add car
                </button>
            </div>

            {msg && <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl text-sm">{msg}</div>}

            {loading ? (
                <div className="flex items-center justify-center py-20 gap-3">
                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-slate-400 dark:text-slate-500 text-sm">Loading cars...</span>
                </div>

            ) : cars.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                            <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                            <circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" />
                        </svg>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">No cars yet</p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Click "Add car" to get started</p>
                </div>

            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${car.availability ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400'}`}>
                                        {car.availability ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>

                                {car.imageUrl && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate mb-3" title={car.imageUrl}> 🔗 {car.imageUrl} </p>
                                )}

                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => openEdit(car)} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">Edit</button>

                                    <button onClick={() => setDeleteModal(car.id)} className="flex-1 py-2 rounded-lg border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-100 dark:border-slate-700">

                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-5" style={{ fontFamily: 'Outfit,sans-serif' }}>{editId ? 'Edit car' : 'Add new car'}</h3>

                        {form.imageUrl && (
                            <div className="mb-4 rounded-xl overflow-hidden h-36 bg-slate-100 dark:bg-slate-700">
                                <img src={form.imageUrl} alt="preview" onError={e => e.target.style.display = 'none'} className="w-full h-full object-cover" />
                            </div>
                        )}

                        {[['Brand', 'brand', 'text', 'e.g. Toyota'], ['Model', 'model', 'text', 'e.g. Corolla'], ['Price per day', 'pricePerDay', 'number', 'e.g. 50'], ['Image URL', 'imageUrl', 'text', 'https://...']].map(([label, key, type, ph]) => (
                            <div key={key} className="mb-4">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
                                <input
                                    type={type}
                                    placeholder={ph}
                                    value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        ))}

                        <div className="mb-6 flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="avail"
                                checked={form.availability}
                                onChange={e => setForm({ ...form, availability: e.target.checked })}
                                className="w-4 h-4 accent-blue-600"
                            />
                            <label htmlFor="avail" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer">Available for booking</label>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium cursor-pointer transition-colors"> {editId ? 'Save changes' : 'Add car'} </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-slate-100 dark:border-slate-700">
                        <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 text-center mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>Delete this car?</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeleteModal(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">Cancel</button>
                            <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium cursor-pointer transition-colors">Yes, delete it</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}