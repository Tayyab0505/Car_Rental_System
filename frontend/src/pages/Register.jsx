import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api/axios'

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match'); return
        }
        setLoading(true)
        try {
            await API.post('/register', { name: form.name, email: form.email, password: form.password })
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl">

                {/* LEFT PANEL */}
                <div className="hidden md:flex w-5/12 bg-[#0f3460] flex-col justify-between p-10 relative overflow-hidden">
                    <div className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full bg-blue-500/10" />
                    <div className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full bg-blue-700/20" />
                    <div className="absolute bottom-24 right-8 w-32 h-32 rounded-full bg-blue-500/10" />

                    <div className="flex items-center gap-3 z-10">
                        <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <span className="text-white font-semibold text-lg tracking-wide" style={{ fontFamily: 'Outfit,sans-serif' }}>DriveEase</span>
                    </div>

                    <div className="z-10">
                        <p className="text-blue-300 text-xs font-medium tracking-widest uppercase mb-3">Join DriveEase</p>
                        <h2 className="text-white text-3xl font-semibold leading-snug mb-3" style={{ fontFamily: 'Outfit,sans-serif' }}>
                            Start your journey<br />with us today
                        </h2>
                        <p className="text-blue-300 text-sm leading-relaxed">
                            Create an account and get access to hundreds of premium cars ready to book instantly.
                        </p>
                    </div>

                    <div className="flex gap-4 z-10">
                        {[['Free', 'To register'], ['24/7', 'Support']].map(([num, lbl]) => (
                            <div key={lbl} className="bg-blue-500/20 border border-blue-300/20 rounded-xl px-4 py-3">
                                <div className="text-white text-xl font-semibold" style={{ fontFamily: 'Outfit,sans-serif' }}>{num}</div>
                                <div className="text-blue-300 text-xs mt-0.5">{lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex-1 bg-white flex flex-col justify-center px-10 py-12">
                    <div className="flex bg-slate-100 rounded-xl p-1 mb-8">
                        <Link to="/login" className="flex-1 text-center py-2 text-slate-500 text-sm hover:text-slate-700 transition-colors" style={{ fontFamily: 'Outfit,sans-serif' }}>
                            Sign in
                        </Link>
                        <div className="flex-1 text-center py-2 rounded-lg bg-white text-blue-700 font-medium text-sm shadow-sm border border-slate-200" style={{ fontFamily: 'Outfit,sans-serif' }}>
                            Create account
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-slate-800 mb-1" style={{ fontFamily: 'Outfit,sans-serif' }}>Create your account</h2>
                    <p className="text-slate-500 text-sm mb-7">Fill in your details to get started</p>

                    {error && (
                        <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Full name</label>
                            <input
                                type="text" required placeholder="John Doe"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-1.5">Email address</label>
                            <input
                                type="email" required placeholder="you@example.com"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Password</label>
                                <input
                                    type="password" required placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5">Confirm password</label>
                                <input
                                    type="password" required placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit" disabled={loading}
                            className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 mt-2"
                            style={{ fontFamily: 'Outfit,sans-serif' }}
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-slate-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}