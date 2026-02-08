import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStudent, upsertStudent } from '../api/api'
import useAuthStore from '../stores/useAuthStore'
import { User, Mail, BookOpen, Clock, Loader2, ArrowLeft, Save, Sparkles, CheckCircle2 } from 'lucide-react'

export default function StudentProfile() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Form State
    const [skills, setSkills] = useState('')
    const [interests, setInterests] = useState('')
    const [availability, setAvailability] = useState('')
    const [academicLevel, setAcademicLevel] = useState('Undergraduate')

    useEffect(() => {
        if (!user || !user.id) {
            navigate('/login')
            return
        }

        async function loadProfile() {
            try {
                const data = await getStudent(user.id)
                if (data) {
                    setSkills(Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || ''))
                    setInterests(data.research_interest || data.interests || '')
                    setAvailability(data.availability?.toString() || '')
                    setAcademicLevel(data.academic_level || 'Undergraduate')
                }
            } catch (err) {
                // If 404, it means the profile doesn't exist yet in the CSV
                // but the auth user does. That's fine for editing.
                if (err.response?.status !== 404) {
                    console.error('Failed to load profile:', err)
                }
            } finally {
                setLoading(false)
            }
        }

        loadProfile()
    }, [user, navigate])

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess(false)

        const studentData = {
            student_id: user.id || `s-${Date.now()}`,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            methodologies: [], // Placeholder for now
            interests: interests,
            research_interest: interests,
            goal: "Research collaboration",
            availability: parseInt(availability) || 0,
            academic_level: academicLevel
        }

        try {
            await upsertStudent(studentData)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            setError(err.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/student/dashboard')}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors py-2 px-4 rounded-xl hover:bg-gray-50 -ml-4"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
                    </button>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-primary text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 pt-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">My Profile</h1>
                    <p className="text-lg text-gray-500">
                        Customize your academic profile to receive more accurate research matches.
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <User className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Display Name</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user?.name || ''}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-gray-900 font-medium cursor-not-allowed opacity-60"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Academic ID</label>
                                <input
                                    type="text"
                                    disabled
                                    value={user?.id || ''}
                                    className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-4 text-gray-900 font-medium cursor-not-allowed opacity-60"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Academic Level & Availability */}
                    <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-bold text-gray-900">Academic Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Sparkles className="h-3 w-3 text-primary" /> Academic Level
                                </label>
                                <select
                                    value={academicLevel}
                                    onChange={(e) => setAcademicLevel(e.target.value)}
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                >
                                    <option>Undergraduate</option>
                                    <option>Graduate (Master's)</option>
                                    <option>PhD Student</option>
                                    <option>Post-Doc</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-primary" /> Availability (hrs/wk)
                                </label>
                                <input
                                    type="number"
                                    placeholder="e.g. 10"
                                    value={availability}
                                    onChange={(e) => setAvailability(e.target.value)}
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Skills & Interests */}
                    <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <Sparkles className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-bold text-gray-900">Research Focus</h2>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    Skills & Technologies
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Python, Machine Learning, Data Visualization, etc."
                                    value={skills}
                                    onChange={(e) => setSkills(e.target.value)}
                                    className="w-full bg-white border border-gray-100 rounded-3xl px-6 py-5 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none resize-none leading-relaxed"
                                />
                                <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-2 italic">Separate skills with commas</p>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    Research Interests & Career Goals
                                </label>
                                <textarea
                                    rows="5"
                                    placeholder="Tell potential mentors what you are passionate about..."
                                    value={interests}
                                    onChange={(e) => setInterests(e.target.value)}
                                    className="w-full bg-white border border-gray-100 rounded-3xl px-6 py-5 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feedback states */}
                    {error && (
                        <div className="p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm">!</span>
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="p-6 bg-green-50 border border-green-100 rounded-3xl text-green-700 text-sm font-bold flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                            <CheckCircle2 className="h-6 w-6" />
                            Profile updated successfully!
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}
