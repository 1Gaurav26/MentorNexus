import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'
import { Loader2, LogIn } from 'lucide-react'

export default function Login() {
    const [username, setUsername] = useState('student')
    const [password, setPassword] = useState('student123')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const navigate = useNavigate()
    const login = useAuthStore(state => state.login)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.detail || 'Login failed')

            login(data, data.token)

            if (data.role === 'student') navigate('/student/dashboard')
            else if (data.role === 'faculty') navigate('/faculty/dashboard')
            else navigate('/')

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-apple">
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                        Sign in
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Welcome back to MentorNexus
                    </p>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800 mb-4">
                    <p className="font-semibold mb-2">Demo Credentials:</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-blue-700">
                        <div>Student: <span className="font-mono">student</span></div>
                        <div>Pass: <span className="font-mono">student123</span></div>
                        <div>Faculty: <span className="font-mono">faculty</span></div>
                        <div>Pass: <span className="font-mono">faculty123</span></div>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-all sm:text-sm bg-gray-50 focus:bg-white"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071E3] focus:border-transparent transition-all sm:text-sm bg-gray-50 focus:bg-white"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-[#0071E3] hover:bg-[#0077ED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071E3] disabled:opacity-50 transition-all shadow-sm hover:shadow-lg transform active:scale-95"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin h-5 w-5" />
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{' '}
                            <Link to="/register" className="font-medium text-[#0071E3] hover:text-[#0077ED] transition-colors">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}
