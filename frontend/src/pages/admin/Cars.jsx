import { useEffect, useState } from 'react'
import API from '../../api/axios'

const emptyForm = { brand: '', model: '', pricePerDay: '', availability: true }

export default function AdminCars() {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [editId, setEditId] = useState(null)
    const [msg, setMsg] = useState('')

    const fetchCars = () => {
        setLoading(true)
        API.get('/findAllCar')
            .then(r => setCars(r.data))
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchCars() }, []);

    const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true) }
    const openEdit = (car) => {
        setForm({ brand: car.brand, model: car.model, pricePerDay: car.pricePerDay, availability: car.availability })
        setEditId(car.id)
        setShowModal(true)
    }

    const handleSave = async () => {
        try {
            if (editId) await API.put(`/updateCar/${editId}`, form)
            else await API.post('/addCar', form)
            setShowModal(false)
            fetchCars()
        } catch {
            setMsg('Failed to save car')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this car?')) return

        try {
            await API.delete(`/deleteCar/${id}`);
            fetchCars()
        }
        catch {
            setMsg('Failed to delete')
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
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${car.availability ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400'}`}>
                                        {car.availability ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button onClick={() => openEdit(car)} className="flex-1 py-2 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">Edit</button>
                                    <button onClick={() => handleDelete(car.id)} className="flex-1 py-2 rounded-lg border border-red-100 dark:border-red-900/50 text-red-500 dark:text-red-400 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer">Delete</button>
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
                        {[['Brand', 'brand', 'text', 'e.g. Toyota'], ['Model', 'model', 'text', 'e.g. Corolla'], ['Price per day', 'pricePerDay', 'number', 'e.g. 50']].map(([label, key, type, ph]) => (
                            <div key={key} className="mb-4">
                                <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">{label}</label>
                                <input type={type} placeholder={ph} value={form[key]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-600 text-sm text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        ))}
                        <div className="mb-6 flex items-center gap-3">
                            <input type="checkbox" id="avail" checked={form.availability} onChange={e => setForm({ ...form, availability: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                            <label htmlFor="avail" className="text-sm text-slate-600 dark:text-slate-300 cursor-pointer">Available for booking</label>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer transition-colors">Cancel</button>
                            <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium cursor-pointer transition-colors">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}