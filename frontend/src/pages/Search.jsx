import React, { useState } from 'react'
import { searchFaculty } from '../api/api'
import FacultyCard from '../components/FacultyCard'
import { Search as SearchIcon, Loader2, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Search({ onShowResults }) {
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function doSearch(e) {
    e && e.preventDefault()
    if (!q.trim()) return
    setLoading(true); setError('')
    try {
      const res = await searchFaculty(q)
      setResults(res)
      if (onShowResults) onShowResults(res)
    } catch (err) {
      setError(err.message || 'Search failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back
      </button>

      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">Explore Faculty</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Search for mentors, research projects, and departments using keywords.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-16">
        <form onSubmit={doSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by name, area (e.g. AI, Physics), or project..."
            value={q}
            onChange={e => setQ(e.target.value)}
            className="block w-full pl-12 pr-32 py-5 bg-white border border-gray-200 rounded-3xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-primary transition-all shadow-apple"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-3 top-3 bottom-3 px-8 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Search'}
          </button>
        </form>
        {error && <p className="mt-4 text-center text-red-500 text-sm font-medium">{error}</p>}
      </div>

      <div className="max-w-5xl mx-auto space-y-8">
        {results.map(f => (
          <FacultyCard key={f.faculty_id} faculty={f} />
        ))}
        {results.length === 0 && !loading && q && (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="h-10 w-10 text-gray-300" />
            </div>
            <p className="text-gray-400 font-medium">No mentors found for "{q}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
