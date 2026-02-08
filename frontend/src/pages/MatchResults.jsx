import React from 'react'
import { useNavigate } from 'react-router-dom'
import useMatchStore from '../stores/useMatchStore'
import ChatBox from '../components/ChatBox'
import SchedulingModal from '../components/SchedulingModal'
import { CheckCircle2, MessageCircle, Calendar, ChevronDown, ChevronRight, ShieldCheck, Filter, ArrowUpDown, ArrowLeft, Send } from 'lucide-react'

export default function MatchResults() {
  const navigate = useNavigate()
  const { results } = useMatchStore()
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

    return data
  }, [results, sortBy, filterVerified])

  if (!results || processedResults.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Filter className="h-10 w-10 text-gray-400" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">No Matches Found</h2>
      <p className="text-gray-500 max-w-md mx-auto mb-10">
        We couldn't find any perfect matches. Try adjusting your skills or broadening your research interests.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-8 py-3 bg-primary text-white rounded-2xl font-semibold hover:bg-primary-hover transition-all shadow-lg shadow-blue-200"
      >
        Try Again
      </button>
    </div>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/student/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
        <div>
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Recommended Mentors</h2>
          <p className="text-gray-500">Based on your research interests and technical skills.</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors shadow-sm">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              checked={filterVerified}
              onChange={e => setFilterVerified(e.target.checked)}
            />
            <ShieldCheck className="h-4 w-4 text-green-600" /> Verified Only
          </label>

          <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm">
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-gray-700 focus:ring-0 cursor-pointer pr-8"
            >
              {results && results.length > 0 && (results[0].final_score !== undefined || results[0].research_similarity !== undefined) && (
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

      {schedulingFaculty && (
        <SchedulingModal
          isOpen={true}
          onClose={() => setSchedulingFaculty(null)}
          facultyId={schedulingFaculty.faculty_id}
          facultyName={schedulingFaculty.name}
        />
      )}

      <div className="space-y-6">
        {processedResults.map((r, i) => {
          const uniqueId = `${r.faculty_id}-${r.project_id || i}`;
          const isExpanded = expandedId === uniqueId;

          return (
            <div key={uniqueId} className="bg-white rounded-3xl border border-gray-100 shadow-apple hover:shadow-apple-hover transition-all duration-500 overflow-hidden group">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900">{r.name}</h3>
                      {r.urgency && r.urgency !== 'low' && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${r.urgency === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                          }`}>
                          {r.urgency} Priority
                        </span>
                      )}
                    </div>
                    {r.project_title && (
                      <h4 className="text-lg font-medium text-gray-700 leading-snug group-hover:text-primary transition-colors">{r.project_title}</h4>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-2 text-right">
                    <span className="px-4 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs font-bold border border-gray-100 whitespace-nowrap">
                      {r.match_mode?.replace('_', ' ') || 'Research Match'}
                    </span>
                    {(r.final_score !== undefined || r.research_similarity !== undefined) && (
                      <div className="flex items-center gap-2">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Match Score</p>
                          <p className="text-3xl font-black text-primary leading-none mt-1">
                            {((r.final_score ?? r.research_similarity) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {r.match_id && (
                  <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-green-50/50 rounded-2xl border border-green-100 w-fit">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-bold text-green-700">Blockchain Verified Match</span>
                    <span className="text-[10px] text-green-500 font-mono tracking-tighter ml-2">{r.match_id.substring(0, 16)}...</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => toggleExpand(uniqueId)}
                    className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-50 text-gray-900 rounded-2xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-200 shadow-sm"
                  >
                    {isExpanded ? 'Hide Details' : 'View Profile'}
                    {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
                  </button>
                  <button
                    onClick={() => setChatRecipient({ id: r.faculty_id, name: r.name })}
                    className="flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-gray-200 text-gray-900 rounded-2xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4 text-primary" /> Chat
                  </button>
                  <button
                    onClick={() => setSchedulingFaculty(r)}
                    className="flex-1 min-w-[150px] flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-50 text-blue-600 rounded-2xl text-sm font-bold hover:bg-blue-100 transition-all shadow-sm"
                  >
                    <Calendar className="h-4 w-4" /> Schedule
                  </button>
                  <button
                    onClick={() => navigate(`/student/request-mentorship/${r.faculty_id}`)}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl text-sm font-bold hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all transform active:scale-95"
                  >
                    <Send className="h-4 w-4" /> Request Mentorship
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Academic info</h5>
                        <div className="space-y-3">
                          <p className="text-sm text-gray-700 flex justify-between">
                            <span className="font-semibold text-gray-500">Email</span>
                            <span>{r.email || 'Not listed'}</span>
                          </p>
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold text-gray-500 block mb-1">Research Areas</span>
                            <span className="leading-relaxed">{r.research_areas}</span>
                          </p>
                        </div>
                      </div>

                      {r.publications && (
                        <div>
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Key Publications</h5>
                          <p className="text-sm text-gray-600 italic leading-relaxed">{r.publications}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      {r.project_description && (
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                          <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Active Project</h5>
                          <p className="text-sm text-gray-700 leading-relaxed mb-4">{r.project_description}</p>
                          <div className="flex items-center gap-2 text-xs font-bold">
                            <span className="text-gray-400">Status:</span>
                            <span className={`px-2 py-0.5 rounded-full ${r.project_status === 'full' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                              }`}>
                              {r.project_status === 'full' ? 'All Seats Fulfilled' : 'Accepting Students'}
                            </span>
                          </div>
                        </div>
                      )}

                      {r.explanation && (
                        <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100/50">
                          <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">AI Match Logic</h5>
                          <div className="space-y-2">
                            {Array.isArray(r.explanation) ? (
                              <ul className="space-y-1.5">
                                {r.explanation.map((line, idx) => (
                                  <li key={idx} className="text-xs text-blue-700 flex gap-2">
                                    <span className="text-blue-300">•</span> {line}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-xs text-blue-700 leading-relaxed">{r.explanation}</p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {chatRecipient && (
        <ChatBox
          userId="Student"
          recipientName={chatRecipient.name}
          onClose={() => setChatRecipient(null)}
        />
      )}
    </div>
  )
}
