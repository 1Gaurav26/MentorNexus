import React, { useState, useEffect } from 'react'
import useAuthStore from '../stores/useAuthStore'
import { LogOut, PlusCircle, LayoutList, User, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFacultyRequests, updateRequestStatus } from '../api/api'

export default function FacultyDashboard() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)

    const loadRequests = async () => {
        if (!user) return
        setLoading(true)
        try {
            const data = await getFacultyRequests(user.id)
            setRequests(data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
        } catch (err) {
            console.error('Failed to load inquiries:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadRequests()
    }, [user])

    const handleStatusUpdate = async (reqId, newStatus, note = null) => {
        try {
            await updateRequestStatus(reqId, newStatus, note)
            setRequests(prev => prev.map(r => r.request_id === reqId ? { ...r, status: newStatus, note } : r))
        } catch (err) {
            alert('Failed to update request status')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20 font-sans">
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-black tracking-tighter text-gray-900">MentorNexus <span className="text-gray-400 font-medium">— Faculty Dashboard</span></h1>
                        </div>
                        <div className="flex items-center gap-6 font-medium">
                            <span className="text-gray-500 text-sm italic"> {user?.name}</span>
                            <button
                                onClick={handleLogout}
                                className="text-red-500 hover:text-red-600 transition-colors text-sm font-bold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="bg-blue-50/50 rounded-[2.5rem] p-12 mb-12 border border-blue-100/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
                        <p className="text-blue-600/80 font-medium">Manage your research profile and mentor student inquiries.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {/* Edit Profile */}
                    <div
                        onClick={() => navigate('/faculty/edit-profile')}
                        className="bg-white p-8 rounded-[2rem] shadow-apple border-l-4 border-blue-500 hover:shadow-apple-hover transition-all cursor-pointer group"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Edit Profile</h3>
                        <p className="text-sm text-gray-500">Update your research interests and availability</p>
                    </div>

                    {/* Find Students */}
                    <div
                        onClick={() => navigate('/faculty/search-students')}
                        className="bg-white p-8 rounded-[2rem] shadow-apple border-l-4 border-green-500 hover:shadow-apple-hover transition-all cursor-pointer group"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">Find Students</h3>
                        <p className="text-sm text-gray-500">Search and browse students in your field</p>
                    </div>

                    {/* Publications */}
                    <div
                        onClick={() => navigate('/faculty/publications')}
                        className="bg-white p-8 rounded-[2rem] shadow-apple border-l-4 border-purple-500 hover:shadow-apple-hover transition-all cursor-pointer group"
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Publications</h3>
                        <p className="text-sm text-gray-500">Manage and import publications</p>
                    </div>

                    {/* Inbox / Requests */}
                    <div className="bg-white overflow-hidden shadow-apple rounded-[2rem] border border-gray-100 p-10 col-span-1 lg:col-span-2">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900">Incoming Student Requests</h3>
                            <button
                                onClick={loadRequests}
                                className="bg-blue-50 text-blue-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-colors"
                            >
                                Refresh
                            </button>
                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                <p className="text-gray-400 text-center py-12 font-medium">Loading requests...</p>
                            ) : requests.length === 0 ? (
                                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border border-dashed border-gray-200">
                                    <p className="text-gray-400 font-medium">No pending requests at the moment.</p>
                                </div>
                            ) : (
                                requests.map(req => (
                                    <div key={req.request_id} className="p-8 bg-gray-50 rounded-[1.5rem] border border-gray-100 group">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <h4
                                                        className="font-bold text-gray-900 hover:text-primary cursor-pointer transition-colors"
                                                        onClick={() => navigate(`/faculty/student/${req.student_id}`)}
                                                    >
                                                        {req.student_name}
                                                    </h4>
                                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                                                        {new Date(req.created_at).toLocaleDateString()} • {req.student_id}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {req.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => handleStatusUpdate(req.request_id, 'accepted')}
                                                            className="bg-green-600 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all active:scale-95"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                const reason = prompt("Reason for Rejection (Optional):")
                                                                // If user cancelled prompt (reason is null), do nothing or proceed? 
                                                                // Usually prompt returns null on cancel. 
                                                                // Let's assume emptiness is fine if they just hit enter, 
                                                                // but if they cancel (null), we abort.
                                                                if (reason !== null) {
                                                                    handleStatusUpdate(req.request_id, 'declined', reason)
                                                                }
                                                            }}
                                                            className="bg-white border border-red-100 text-red-500 px-5 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-all active:scale-95"
                                                        >
                                                            Decline
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] ${req.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {req.status}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-white/60 p-6 rounded-2xl border border-white shadow-sm">
                                            <p className="text-sm text-gray-600 leading-relaxed italic">
                                                "{req.message}"
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
