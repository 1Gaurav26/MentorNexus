import React, { useState } from 'react'
import { searchFaculty } from '../api/api'
import FacultyCard from '../components/FacultyCard'

export default function Search({ onShowResults }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function doSearch(e) {
    e && e.preventDefault()
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
    <section>
      <h2>Search Faculty</h2>
      <form onSubmit={doSearch}>
        <input placeholder="Search query" value={q} onChange={e => setQ(e.target.value)} />
        <button type="submit" disabled={loading}>Search</button>
      </form>

      {error && <div className="error">{error}</div>}

      <div className="results">
        {results.length === 0 && <p>No results</p>}
        {results.map(f => (
          <FacultyCard key={f.faculty_id} faculty={f} />
        ))}
      </div>
    </section>
  )
}
