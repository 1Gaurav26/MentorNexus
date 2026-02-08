import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getFaculty } from '../api/api'
import { ArrowLeft, Mail, BookOpen, GraduationCap, Calendar, MessageCircle, ShieldCheck, User } from 'lucide-react'
import useAuthStore from '../stores/useAuthStore'

export default function FacultyProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [faculty, setFaculty] = useState(null)
    const [loading, setLoading] = useState(true)
    const { user } = useAuthStore()

    useEffect(() => {
        async function load() {
            try {
                const data = await getFaculty(id)
                setFaculty(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )

    if (!faculty) return (
        <div className="max-w-4xl mx-auto py-20 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Faculty Not Found</h2>
            <button onClick={() => navigate(-1)} className="text-primary font-bold">Return to Search</button>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 px-4 rounded-xl hover:bg-gray-50 -ml-4"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                            <Mail className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pt-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Essential Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mb-6">
                                <User className="h-12 w-12 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-1">{faculty.name}</h1>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">{faculty.faculty_id}</p>

                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${faculty.urgency === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-primary border border-blue-100'
                                    }`}>
                                    {faculty.urgency === 'high' ? 'High Priority' : 'Active Mentor'}
                                </span>
                                <span className="px-3 py-1 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-wider border border-gray-100">
                                    Faculty
                                </span>
                            </div>

                            <div className="w-full space-y-3 pt-6 border-t border-gray-50">
                                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                    <MessageCircle className="h-4 w-4" /> Send Message
                                </button>
                                <button className="w-full py-4 bg-white border border-gray-200 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                    <Calendar className="h-4 w-4 text-primary" /> Book Consultation
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Contact & Details</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                        <p className="text-sm font-bold text-gray-900">{faculty.email || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <GraduationCap className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Department</p>
                                        <p className="text-sm font-bold text-gray-900">Research & Innovation</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-10 shadow-apple border border-gray-100">
                            <div className="flex items-center gap-3 mb-8">
                                <BookOpen className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-bold text-gray-900">Research Overview</h2>
                            </div>
                            <p className="text-lg text-gray-700 leading-relaxed mb-10">
                                {faculty.research_areas}
                            </p>

                            {faculty.publications && (
                                <div className="pt-10 border-t border-gray-100">
                                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Featured Publications</h3>
                                    <p className="text-gray-600 leading-relaxed italic border-l-4 border-blue-50 pl-6 py-2">
                                        {faculty.publications}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-3xl p-10 shadow-apple border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="h-6 w-6 text-primary" />
                                    <h2 className="text-2xl font-bold text-gray-900">Active Projects</h2>
                                </div>
                                <span className="px-4 py-1.5 bg-blue-50 text-primary text-xs font-bold rounded-full border border-blue-100">
                                    {(faculty.projects || []).length} Opportunities
                                </span>
                            </div>

                            <div className="space-y-6">
                                {(faculty.projects || []).map((p, idx) => (
                                    <div key={p.project_id || idx} className="p-8 rounded-3xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/20 transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{p.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.status === 'full' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'
                                                }`}>
                                                {p.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-6">
                                            {p.description || 'Detailed project description coming soon.'}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="text-xs">
                                                    <span className="text-gray-400 font-medium">Capacity:</span>
                                                    <span className="ml-2 font-bold text-gray-900">{p.current_students || 0} / {p.max_students || 5}</span>
                                                </div>
                                            </div>
                                            <button
                                                disabled={p.status === 'full'}
                                                className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 disabled:opacity-50 transition-all"
                                            >
                                                {p.status === 'full' ? 'Full Capacity' : 'Apply Now'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
