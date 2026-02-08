import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFaculty, updateFacultyProfile } from '../api/api'
import useAuthStore from '../stores/useAuthStore'
import { User, BookOpen, Clock, Save, Loader2, ArrowLeft, Tag, Layers } from 'lucide-react'

export default function FacultyEditProfile() {
    const navigate = useNavigate()
    const { user, updateUser } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        research_areas: '',
        required_skills: '',
        methodologies: '',
        availability: '',
        academic_level: ''
    })

    useEffect(() => {
        if (!user || user.role !== 'faculty') {
            navigate('/login')
            return
        }

        const fetchProfile = async () => {
            try {
                const data = await getFaculty(user.id)
                if (data) {
                    setFormData({
                        name: data.name || user.name || '',
                        research_areas: data.research_areas || '',
                        required_skills: Array.isArray(data.required_skills) ? data.required_skills.join(', ') : (data.required_skills?.replace(/[\[\]']/g, '') || ''),
                        methodologies: data.methodologies || '',
                        availability: data.availability || 0,
                        academic_level: data.academic_level || 'phd'
                    })
                }
            } catch (err) {
                console.error('Failed to load profile', err)
                // Fallback to user store data if API fails (though API is needed for full fields)
                setFormData(prev => ({ ...prev, name: user.name || '' }))
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user, navigate])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError('')
        setSuccess(false)

        try {
            const payload = {
                faculty_id: user.id,
                name: formData.name,
                research_areas: formData.research_areas,
                required_skills: formData.required_skills.split(',').map(s => s.trim()).filter(Boolean),
                methodologies: formData.methodologies.split(',').map(s => s.trim()).filter(Boolean),
                availability: parseInt(formData.availability) || 0,
                academic_level: formData.academic_level,
            }

            await updateFacultyProfile(payload)

            setSuccess(true)
            updateUser({ name: formData.name }) // Update local auth store if name changed
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.error(err)
            setError(err.response?.data?.detail || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="min-h-screen flex justify-center items-center"><Loader2 className="animate-spin text-primary" /></div>

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20">
            <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/faculty/dashboard')}
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
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Edit Profile</h1>
                    <p className="text-lg text-gray-500">
                        Keep your research profile up-to-date to attract the best students.
                    </p>
                </div>

                <form onSubmit={handleSave} className="space-y-8">
                    {/* Basic Info */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <User className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-bold text-gray-900">Personal Details</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-bold focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Availability (Students)</label>
                                    <input
                                        name="availability"
                                        type="number"
                                        value={formData.availability}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Academic Level</label>
                                    <select
                                        name="academic_level"
                                        value={formData.academic_level}
                                        onChange={handleChange}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                    >
                                        <option value="phd">PhD</option>
                                        <option value="masters">Masters</option>
                                        <option value="bachelors">Bachelors</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Research & Skills */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                        <div className="flex items-center gap-3 mb-8">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <h2 className="text-xl font-bold text-gray-900">Research Focus</h2>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Research Areas</label>
                                <input
                                    name="research_areas"
                                    value={formData.research_areas}
                                    onChange={handleChange}
                                    placeholder="e.g. Artificial Intelligence, Data Mining"
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Required Skills (Comma separated)</label>
                                <input
                                    name="required_skills"
                                    value={formData.required_skills}
                                    onChange={handleChange}
                                    placeholder="e.g. Python, TensorFlow, PyTorch"
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Methodologies (Comma separated)</label>
                                <input
                                    name="methodologies"
                                    value={formData.methodologies}
                                    onChange={handleChange}
                                    placeholder="e.g. Deep Learning, Agile, Qualitative Analysis"
                                    className="w-full bg-white border border-gray-100 rounded-2xl px-5 py-4 text-gray-900 font-medium focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {success && <div className="p-4 bg-green-100 text-green-700 rounded-xl font-bold text-center">Profile Saved Successfully!</div>}
                    {error && <div className="p-4 bg-red-100 text-red-700 rounded-xl font-bold text-center">{error}</div>}

                </form>
            </div>
        </div>
    )
}
