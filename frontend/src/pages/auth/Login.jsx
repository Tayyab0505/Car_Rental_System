import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import API from '../../api/axios'

export default function Login() {
    const location = useLocation()
    const navigate = useNavigate()

    const { login } = useAuth()

    const [form, setForm] = useState({
        email: location.state?.email || '',
        password: ''
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            const res = await API.post('/login', form)

            login(
                res.data.token,
                res.data.user
            )

            const user = res.data.user
            const previousPage = location.state?.from

            if (previousPage) {
                navigate(previousPage, {
                    replace: true
                })

                return
            }

            if (user?.role === 'admin') {
                navigate('/dashboard/overview', {
                    replace: true
                })

                return
            }

            navigate('/dashboard/cars', {
                replace: true
            })

        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Invalid email or password'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-4 md:p-8">

            <div className="w-full max-w-6xl min-h-650px bg-white rounded-3xl border border-slate-200 shadow-2xl shadow-slate-300/40 overflow-hidden grid md:grid-cols-[1.05fr_1fr]">

                <div className="hidden md:block relative overflow-hidden bg-[#07172a]">

                    <img
                        src="/hero-car.jpg"
                        alt="DriveEase premium car"
                        className="absolute inset-0 size-full object-cover object-center"
                    />

                    <div className="absolute inset-0 bg-linear-to-r from-[#07172a]/95 via-[#07172a]/75 to-[#07172a]/30" />

                    <div className="absolute inset-0 bg-linear-to-t from-[#07172a]/90 via-transparent to-[#07172a]/20" />

                    <div className="relative z-10 h-full p-10 xl:p-12 flex flex-col justify-between">

                        <Link
                            to="/cars"
                            className="flex items-center gap-3 w-fit"
                        >

                            <div className="size-12 rounded-xl bg-linear-to-br from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">

                                <svg
                                    className="size-7 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={1.8}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 17H3a2 2 0 01-2-2V9a2 2 0 012-2h1l2-3h10l2 3h1a2 2 0 012 2v6a2 2 0 01-2 2h-2" />
                                    <circle cx="7" cy="17" r="2" />
                                    <circle cx="17" cy="17" r="2" />
                                    <path d="M5 9h14" />
                                </svg>

                            </div>

                            <div>
                                <h1 className="text-xl font-bold text-white">
                                    Drive<span className="text-cyan-400">Ease</span>
                                </h1>

                                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-300">
                                    Premium Rentals
                                </p>
                            </div>

                        </Link>

                        <div className="max-w-lg">

                            <p className="text-cyan-300 text-xs font-semibold tracking-[0.25em] uppercase">
                                Premium Car Rental
                            </p>

                            <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mt-4">
                                Your next journey
                                <span className="text-cyan-300">
                                    {' '}starts here.
                                </span>
                            </h2>

                            <p className="text-slate-200 leading-7 mt-5 max-w-md">
                                Sign in to book premium vehicles and manage all your rental requests from one place.
                            </p>

                            <div className="flex gap-3 mt-8">

                                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4">

                                    <p className="text-2xl font-bold text-white">
                                        Easy
                                    </p>

                                    <p className="text-xs text-slate-300 mt-1">
                                        Booking Process
                                    </p>

                                </div>

                                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-5 py-4">

                                    <p className="text-2xl font-bold text-white">
                                        Fast
                                    </p>

                                    <p className="text-xs text-slate-300 mt-1">
                                        Admin Approval
                                    </p>

                                </div>

                            </div>

                        </div>

                        <p className="text-xs text-slate-400">
                            DriveEase • Premium Rentals
                        </p>

                    </div>

                </div>

                <div className="flex items-center">

                    <div className="w-full max-w-xl mx-auto px-6 py-10 sm:px-10 xl:px-14">

                        <div className="md:hidden flex items-center justify-between mb-10">

                            <Link
                                to="/cars"
                                className="flex items-center gap-3"
                            >

                                <div className="size-11 rounded-xl bg-linear-to-br from-blue-600 to-cyan-400 flex items-center justify-center">

                                    <svg
                                        className="size-6 text-white"
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

                                <h1 className="text-lg font-bold text-[#0b1b30]">
                                    Drive<span className="text-cyan-500">Ease</span>
                                </h1>

                            </Link>

                        </div>

                        <Link
                            to="/cars"
                            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 transition"
                        >
                            <svg
                                className="size-4"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                viewBox="0 0 24 24"
                            >
                                <path d="M19 12H5M11 18l-6-6 6-6" />
                            </svg>

                            Back to cars
                        </Link>

                        <div className="mt-8">

                            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-blue-600">
                                Welcome Back
                            </p>

                            <h2 className="text-3xl md:text-4xl font-bold text-[#0b1b30] mt-2">
                                Sign in to DriveEase
                            </h2>

                            <p className="text-sm text-slate-500 mt-3">
                                Enter your account details to continue your booking journey.
                            </p>

                        </div>

                        {location.state?.message && (
                            <div className="mt-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                                {location.state.message}
                            </div>
                        )}

                        {error && (
                            <div className="mt-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="mt-7 space-y-5"
                        >

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M4 4h16v16H4z" />
                                        <path d="M4 6l8 6 8-6" />
                                    </svg>

                                    <input
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        value={form.email}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                email: e.target.value
                                            })
                                        }
                                        className="w-full h-13 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                                    />

                                </div>

                            </div>

                            <div>

                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <svg
                                        className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={1.8}
                                        viewBox="0 0 24 24"
                                    >
                                        <rect x="4" y="10" width="16" height="10" rx="2" />
                                        <path d="M8 10V7a4 4 0 018 0v3" />
                                    </svg>

                                    <input
                                        type="password"
                                        required
                                        placeholder="Enter your password"
                                        value={form.password}
                                        onChange={e =>
                                            setForm({
                                                ...form,
                                                password: e.target.value
                                            })
                                        }
                                        className="w-full h-13 pl-12 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition"
                                    />

                                </div>

                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-13 rounded-xl bg-linear-to-r from-[#2563eb] via-[#1687f8] to-[#0ea5e9] text-white text-sm font-semibold shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:translate-y-0"
                            >
                                {loading
                                    ? 'Signing in...'
                                    : 'Sign In'
                                }
                            </button>

                        </form>

                        <div className="flex items-center gap-4 my-7">

                            <div className="flex-1 border-t border-slate-200" />

                            <span className="text-xs text-slate-400">
                                New to DriveEase?
                            </span>

                            <div className="flex-1 border-t border-slate-200" />

                        </div>

                        <Link
                            to="/register"
                            className="w-full h-13 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold flex items-center justify-center hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50/40 transition"
                        >
                            Create an Account
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    )
}