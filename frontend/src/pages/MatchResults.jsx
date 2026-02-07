import React from 'react'
import ChatBox from '../components/ChatBox'
import SchedulingModal from '../components/SchedulingModal'

export default function MatchResults({ results }) {
  const [expandedId, setExpandedId] = React.useState(null)
  const [sortBy, setSortBy] = React.useState('score')
  const [filterVerified, setFilterVerified] = React.useState(false)

  // Scheduling State
  const [schedulingFaculty, setSchedulingFaculty] = React.useState(null)
  const [chatRecipient, setChatRecipient] = React.useState(null) // { id, name }

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  // Sorting and Filtering Logic
  const processedResults = React.useMemo(() => {
    if (!results) return []

    let data = [...results]

    // Filter
    if (filterVerified) {
      data = data.filter(r => r.match_id)
    }

    // Sort
    data.sort((a, b) => {
      if (sortBy === 'score') {
        const scoreA = a.final_score ?? a.research_similarity ?? 0
        const scoreB = b.final_score ?? b.research_similarity ?? 0
        return scoreB - scoreA
      }
      if (sortBy === 'research') {
        return (b.research_similarity || 0) - (a.research_similarity || 0)
      }
      if (sortBy === 'urgency') {
        const urgencyOrder = { 'high': 3, 'medium': 2, 'low': 1 }
        const urgA = urgencyOrder[a.urgency?.toLowerCase()] || 0
        const urgB = urgencyOrder[b.urgency?.toLowerCase()] || 0
        return urgB - urgA
      }
      return 0
    })

    console.log("Sort By:", sortBy)
    console.log("First item scores:", data[0] ? {
      fs: data[0].final_score,
      rs: data[0].research_similarity,
      urg: data[0].urgency
    } : "No data")

    return data
  }, [results, sortBy, filterVerified])


  if (!results || processedResults.length === 0) return (
    <section>
      <h2>Match Results</h2>
      <p className="no-results">No matches found yet. Try adjusting your skills or interests.</p>
    </section>
  )

  return (
    <section>
      <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Match Results</h2>

        <div className="filter-controls" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={filterVerified}
              onChange={e => setFilterVerified(e.target.checked)}
            />
            Verified Only
          </label>

          <div className="sort-box">
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginRight: '0.5rem' }}>Sort by:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              style={{ padding: '0.4rem', fontSize: '0.9rem' }}
            >
              {/* Only show Score/Research options if data exists */}
              {results && results.length > 0 && results[0].final_score !== undefined && (
                <>
                  <option value="score">Highest Score</option>
                  <option value="research">Research Match</option>
                </>
              )}
              <option value="urgency">Urgency</option>
            </select>
          </div>
        </div>
      </div>

      {/* Scheduling Modal */}
      {schedulingFaculty && (
        <SchedulingModal
          isOpen={true}
          onClose={() => setSchedulingFaculty(null)}
          facultyId={schedulingFaculty.faculty_id}
          facultyName={schedulingFaculty.name}
        />
      )}
      <ul className="match-list">
        {processedResults.map((r, i) => {
          const uniqueId = `${r.faculty_id}-${r.project_id || i}`;
          const isExpanded = expandedId === uniqueId;

          return (
            <li key={uniqueId} className="match-item">
              <div className="match-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h3>{r.name}</h3>
                  {r.urgency && r.urgency !== 'low' && (
                    <span className={`urgency-tag ${r.urgency}`} style={{
                      fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', textTransform: 'uppercase', fontWeight: 'bold',
                      background: r.urgency === 'high' ? '#fee2e2' : '#ffedd5',
                      color: r.urgency === 'high' ? '#ef4444' : '#f97316'
                    }}>
                      {r.urgency} Priority
                    </span>
                  )}
                </div>
                <span className={`match-mode-badge ${r.match_mode}`}>
                  {r.match_mode?.replace('_', ' ') || (r.final_score !== undefined || r.research_similarity !== undefined ? 'Research Match' : 'Keyword Match')}
                </span>
              </div>

              {r.project_title && <h4 className="project-title">{r.project_title}</h4>}

              {(r.final_score !== undefined || r.research_similarity !== undefined) && (
                <div className="score-summary">
                  <div className="final-score">
                    <span className="label">Final Score</span>
                    <span className="value">{(r.final_score ?? r.research_similarity)?.toFixed(3)}</span>
                  </div>

                  {r.match_id && (
                    <div className="blockchain-verified">
                      <span className="icon">🔒</span>
                      <span className="text">Verified</span>
                      <span className="hash" title={r.match_id}>{r.match_id.substring(0, 8)}...</span>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button
                  className="toggle-details-btn"
                  onClick={() => toggleExpand(uniqueId)}
                  style={{ flex: 1 }}
                >
                  {isExpanded ? 'Hide Profile ▼' : 'View Profile ▶'}
                </button>
                <button
                  className="primary"
                  style={{ flex: 1, padding: '0.4rem' }}
                  onClick={() => setChatRecipient({ id: r.faculty_id, name: r.name })}
                >
                  💬 Chat
                </button>
                <button
                  className="primary"
                  style={{ flex: 1, padding: '0.4rem', backgroundColor: '#10b981' }}
                  onClick={() => setSchedulingFaculty(r)}
                >
                  📅 Schedule
                </button>
              </div>

              {isExpanded && (
                <div className="faculty-details">
                  <div className="detail-row"><strong>Email:</strong> {r.email || 'N/A'}</div>
                  <div className="detail-row"><strong>Research Areas:</strong> {r.research_areas}</div>
                  <div className="detail-row"><strong>Publications:</strong> {r.publications}</div>

                  {r.project_description && (
                    <div className="project-details-box">
                      <h5>Project Details</h5>
                      <p>{r.project_description}</p>
                      <div className="status-tag">
                        Status: <strong>{r.project_status}</strong>
                        {r.project_status === 'full' && (
                          <span style={{ marginLeft: '0.5rem', color: 'var(--error)', fontWeight: 'bold' }}>
                            (All Seats Fulfilled)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {r.projects && r.projects.length > 0 && (
                    <div className="related-projects">
                      <h5>Projects ({r.projects.length})</h5>
                      <ul>
                        {r.projects.map(p => (
                          <li key={p.project_id}>
                            <strong>{p.title}</strong>: {p.status}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {r.explanation && (
                <div className="explanation-box">
                  <h5>Match Analysis</h5>
                  {Array.isArray(r.explanation) ? (
                    <ul>
                      {r.explanation.map((line, idx) => <li key={idx}>{line}</li>)}
                    </ul>
                  ) : (
                    <p>{r.explanation}</p>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {chatRecipient && (
        <ChatBox
          userId="Student"
          recipientName={chatRecipient.name}
          onClose={() => setChatRecipient(null)}
        />
      )}
    </section>
  )
}
