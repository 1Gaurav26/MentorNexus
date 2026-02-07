import React, { useState } from 'react'
import Onboarding from './pages/Onboarding'
import Search from './pages/Search'
import MatchResults from './pages/MatchResults'
import AdminDataEntry from './pages/AdminDataEntry'
import AnalyticsDashboard from './pages/AnalyticsDashboard'

export default function App() {
  const [view, setView] = useState('onboard')
  const [lastResults, setLastResults] = useState([])

  return (
    <div className="app">
      <header>
        <h1>MentorNexus</h1>
        <nav>
          <button onClick={() => setView('onboard')}>Student Onboarding</button>
          <button onClick={() => setView('search')}>Search Faculty</button>
          <button onClick={() => setView('results')}>Last Results</button>
          <button onClick={() => setView('analytics')}>Analytics</button>
          <button onClick={() => setView('admin')}>Contribute Data</button>
        </nav>
      </header>

      <main>
        {view === 'onboard' && (
          <Onboarding onShowResults={(res) => { setLastResults(res); setView('results') }} />
        )}

        {view === 'search' && (
          <Search onShowResults={(res) => { setLastResults(res); setView('results') }} />
        )}

        {view === 'results' && (
          <MatchResults results={lastResults} />
        )}

        {view === 'admin' && (
          <AdminDataEntry />
        )}

        {view === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </main>

    </div>
  )
}
