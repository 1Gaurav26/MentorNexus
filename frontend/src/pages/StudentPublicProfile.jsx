import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getStudent } from '../api/api'
import { User, Mail, BookOpen, Sparkles, ArrowLeft, GraduationCap, Clock } from 'lucide-react'

export default function StudentPublicProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [student, setStudent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadProfile() {
            try {
                const data = await getStudent(id)
                setStudent(data)
            } catch (err) {
                console.error('Failed to load profile:', err)
                setError('Failed to load student profile')
            } finally {
                setLoading(false)
            }
        }
        loadProfile()
    }, [id])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
    )

    if (error || !student) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F7]">
            <p className="text-red-500 font-bold mb-4">{error || 'Student not found'}</p>
            <button onClick={() => navigate(-1)} className="text-primary hover:underline">Go Back</button>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20 font-sans">
            <nav className="bg-white/70 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 px-4 rounded-xl hover:bg-gray-50 -ml-4"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-4 pt-12">
                {/* Header Card */}
                <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-apple border border-gray-100 mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center shadow-sm">
                            <User className="h-10 w-10 text-primary" />
                        </div>
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">
                                {student.name || student.student_name || 'Student Name'}
                            </h1>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="px-4 py-1.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                                    {student.student_id}
                                </span>
                                {student.academic_level && (
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                        <GraduationCap className="h-3 w-3" /> {student.academic_level}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Details */}
                    <div className="md:col-span-2 space-y-8">
                        {/* Research Interests */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-purple-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Research Interests</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {student.research_interest || student.interests || 'No research interests listed.'}
                            </p>
                        </div>

                        {/* Message/Goal (if available) */}
                        {student.goal && (
                            <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                        <User className="h-5 w-5 text-green-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">Objective</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    {student.goal}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Stats/Skills */}
                    <div className="space-y-8">
                        {/* Availability */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock className="h-3 w-3" /> Availability
                            </h3>
                            <div className="text-3xl font-black text-gray-900">
                                {student.availability || 0} <span className="text-sm text-gray-400 font-medium">hrs/week</span>
                            </div>
                        </div>

                        {/* Skills */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles className="h-3 w-3" /> Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {student.skills && (Array.isArray(student.skills) ? student.skills : student.skills.split(',')).map((skill, idx) => (
                                    <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                                        {skill.trim()}
                                    </span>
                                ))}
                                {!student.skills && <span className="text-gray-400 text-sm italic">No skills listed</span>}
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Mail className="h-3 w-3" /> Contact
                            </h3>
                            <p className="text-sm font-medium text-gray-900 break-words">
                                {student.email || 'No email provided'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
