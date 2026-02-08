import React, { useState, useEffect } from 'react'
import { searchStudents } from '../api/api'
import StudentCard from '../components/StudentCard'
import { Search as SearchIcon, Loader2, ArrowLeft, Users, Filter } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function StudentSearch() {
    const navigate = useNavigate()
    const [q, setQ] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function doSearch(e) {
        if (e) e.preventDefault()
        if (!q.trim()) return
        setLoading(true)
        setError('')
        try {
            const res = await searchStudents(q)
            setResults(res)
        } catch (err) {
            setError(err.message || 'Search failed')
        } finally {
            setLoading(false)
        }
    }

    // Initial load or search on type could be added here
    // For now matching the screenshot: explicit search

    return (
        <div className="min-h-screen bg-[#F5F5F7] pb-20 font-sans">
            {/* Blue Header Section */}
            <div className="bg-primary text-white pt-12 pb-24 relative overflow-hidden">
                {/* Decorator Circles */}
                <div className="absolute top-[-10%] right-[-5%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-[-20%] left-[-5%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <button
                        onClick={() => navigate('/faculty/dashboard')}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
                    </button>

                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-5xl font-bold tracking-tight mb-4">Search for Students</h1>
                            <p className="text-blue-100 text-xl max-w-2xl font-medium">
                                Find students with research interests that match your expertise.
                            </p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
                                <Users className="h-12 w-12 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="max-w-4xl">
                        <form onSubmit={doSearch} className="relative group p-1 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl">
                            <div className="absolute inset-y-0 left-0 pl-7 flex items-center pointer-events-none">
                                <SearchIcon className="h-6 w-6 text-blue-200" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, interests, or skills..."
                                value={q}
                                onChange={e => setQ(e.target.value)}
                                className="block w-full pl-16 pr-44 py-7 bg-white rounded-[1.75rem] text-gray-900 text-lg placeholder-gray-400 focus:outline-none shadow-inner transition-all"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="absolute right-3 top-3 bottom-3 px-10 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-900/20 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-3"
                            >
                                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                    <>
                                        <SearchIcon className="h-5 w-5" />
                                        <span>Find Students</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                <div className="flex items-center justify-between mb-8 px-4">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                            Found <span className="text-gray-900">{results.length}</span> {results.length === 1 ? 'student' : 'students'}
                        </span>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-primary transition-colors bg-white px-5 py-2.5 rounded-xl shadow-apple border border-gray-100">
                        <Filter className="h-4 w-4" /> Filter
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl mb-12 flex items-center gap-3 font-bold shadow-sm">
                        <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-600 shadow-sm text-xs">!</span>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((student, idx) => (
                        <StudentCard key={student.student_id || idx} student={student} />
                    ))}

                    {results.length === 0 && !loading && (
                        <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-gray-100 shadow-apple">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SearchIcon className="h-12 w-12 text-gray-200" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {q ? `No students found for "${q}"` : "Ready to discover talent?"}
                            </h3>
                            <p className="text-gray-400 max-w-md mx-auto font-medium">
                                {q ? "Try adjusting your search terms or exploring broader research areas." : "Enter keywords like 'AI', 'Blockchain', or 'Physics' to start your search."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
