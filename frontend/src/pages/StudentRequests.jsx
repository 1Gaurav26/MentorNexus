import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudentRequests } from '../api/api'
import useAuthStore from '../stores/useAuthStore'
import { ArrowLeft, Clock, CheckCircle2, XCircle, ChevronRight, User, MousePointer2 } from 'lucide-react'

export default function StudentRequests() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        async function loadRequests() {
            try {
                const data = await getStudentRequests(user.id)
                setRequests(data)
            } catch (err) {
                console.error('Failed to load requests:', err)
            } finally {
                setLoading(false)
            }
        }

        loadRequests()
    }, [user])

    const getStatusStyle = (status) => {
        switch (status) {
            case 'accepted': return 'bg-green-50 text-green-700 border-green-100'
            case 'declined': return 'bg-red-50 text-red-700 border-red-100'
            default: return 'bg-amber-50 text-amber-700 border-amber-100'
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'accepted': return <CheckCircle2 className="h-4 w-4" />
            case 'declined': return <XCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20 font-sans">
            <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 px-4 rounded-xl hover:bg-gray-50 -ml-4"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </button>
                    <h1 className="text-sm font-bold text-gray-900">Mentorship Requests</h1>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 pt-12">
                <div className="mb-12">
                    <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">My Requests</h2>
                    <p className="text-lg text-gray-500">Track the status of mentorship requests you've sent to faculty.</p>
                </div>

                {loading ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-apple animate-pulse">
                        <p className="text-gray-400 font-medium">Loading requests...</p>
                    </div>
                ) : requests.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center shadow-apple border border-gray-100">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MousePointer2 className="h-10 w-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No requests yet</h3>
                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Start searching for faculty matches and reach out to them to begin your research journey.</p>
                        <button
                            onClick={() => navigate('/onboarding')}
                            className="bg-primary text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-blue-200"
                        >
                            Find Faculty
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map((req) => (
                            <div key={req.request_id} className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100 group hover:shadow-apple-hover transition-all duration-300">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform">
                                            <User className="h-7 w-7 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-gray-900 mb-1">{req.faculty_name}</h4>
                                            <p className="text-sm text-gray-400 font-medium">Sent on {new Date(req.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className={`px-4 py-2 rounded-xl border text-sm font-bold flex items-center gap-2 self-start md:self-center capitalize ${getStatusStyle(req.status)}`}>
                                        {getStatusIcon(req.status)}
                                        {req.status}
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-50">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Your Message</h5>
                                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 bg-gray-50/50 p-6 rounded-2xl italic">
                                        "{req.message}"
                                    </p>

                                    {req.status === 'declined' && req.note && (
                                        <div className="mt-4 bg-red-50 p-4 rounded-xl border border-red-100">
                                            <h6 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Rejection Reason</h6>
                                            <p className="text-red-700 text-sm font-medium">"{req.note}"</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button
                                        onClick={() => navigate(`/faculty/${req.faculty_id}`)}
                                        className="flex items-center gap-2 text-primary font-bold text-sm group-hover:translate-x-1 transition-transform"
                                    >
                                        View Faculty Profile <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
