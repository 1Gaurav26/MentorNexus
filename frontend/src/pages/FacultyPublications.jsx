import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFaculty, updateFacultyProfile } from '../api/api'
import useAuthStore from '../stores/useAuthStore'
import { BookOpen, Save, Loader2, ArrowLeft } from 'lucide-react'

export default function FacultyPublications() {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [publications, setPublications] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!user || user.role !== 'faculty') {
            navigate('/login')
            return
        }

        const fetchPubs = async () => {
            try {
                const data = await getFaculty(user.id)
                if (data) {
                    setPublications(data.publications || '')
                }
            } catch (err) {
                console.error(err)
                setError('Failed to load publications')
            } finally {
                setLoading(false)
            }
        }
        fetchPubs()
    }, [user, navigate])

    const handleSave = async () => {
        setSaving(true)
        setSuccess(false)
        setError('')

        try {
            const payload = {
                faculty_id: user.id,
                publications: publications
            }
            await updateFacultyProfile(payload)
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } catch (err) {
            console.error(err)
            setError('Failed to save publications')
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
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Manage Publications</h1>
                    <p className="text-lg text-gray-500">
                        Showcase your research work. Enter each publication on a new line.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-apple border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="h-6 w-6 text-purple-600" />
                        <h2 className="text-xl font-bold text-gray-900">Publications List</h2>
                    </div>

                    <textarea
                        value={publications}
                        onChange={(e) => setPublications(e.target.value)}
                        placeholder="e.g. 'Advanced AI Systems (2026), Journal of AI'"
                        className="w-full h-96 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 font-mono text-sm focus:ring-4 focus:ring-purple-50 focus:border-purple-500 transition-all shadow-sm outline-none resize-none leading-relaxed"
                    />
                    <p className="mt-4 text-xs text-gray-400 font-bold uppercase tracking-widest text-center">
                        Simple text format: One publication per line recommended.
                    </p>
                </div>
                {success && <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-xl font-bold text-center">Publications Updated!</div>}
                {error && <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-xl font-bold text-center">{error}</div>}
            </div>
        </div>
    )
}
