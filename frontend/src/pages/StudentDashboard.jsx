import React from 'react'
import useAuthStore from '../stores/useAuthStore'
import { LogOut, Search, User, PlusCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function StudentDashboard() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] font-sans">
            <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <span className="text-xl font-semibold tracking-tight text-gray-900">MentorNexus</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-500">Welcome, {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto py-10 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Student Dashboard</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-2xl shadow-apple hover:shadow-apple-hover transition-all duration-300 cursor-pointer group">
                            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Search className="h-6 w-6 text-[#0071E3]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find a Mentor</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Match your skills and interests with faculty research projects using our AI engine.
                            </p>
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="w-full bg-[#0071E3] text-white py-2.5 px-4 rounded-xl font-medium hover:bg-[#0077ED] transition-colors"
                            >
                                Start Search
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-apple hover:shadow-apple-hover transition-all duration-300 cursor-pointer group">
                            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <User className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Profile</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Update your academic details, skills, and research interests to get better matches.
                            </p>
                            <button
                                onClick={() => navigate('/student/profile')}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-apple hover:shadow-apple-hover transition-all duration-300 cursor-pointer group">
                            <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Search className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Keyword Search</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Quickly search for faculty members by name, research area, or keywords.
                            </p>
                            <button
                                onClick={() => navigate('/search')}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                            >
                                Open Search
                            </button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-apple hover:shadow-apple-hover transition-all duration-300 cursor-pointer group">
                            <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <PlusCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">My Requests</h3>
                            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                                Track the status of mentorship requests you've sent to faculty.
                            </p>
                            <button
                                onClick={() => navigate('/student/requests')}
                                className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                            >
                                View Status
                            </button>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-2xl shadow-apple border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xs">
                                        02
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold text-gray-900">Matches Generated</p>
                                        <p className="text-[9px] text-gray-400 font-medium">Last synced: Just now</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 font-bold text-xs">
                                        01
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[11px] font-bold text-gray-900">Active Requests</p>
                                        <p className="text-[9px] text-gray-400 font-medium">Awaiting faculty response</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
