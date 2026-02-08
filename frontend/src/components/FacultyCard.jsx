import React, { useState } from 'react'
import { BookOpen, User, ChevronRight, ChevronDown, Projector as Project, Activity, ShieldCheck, MessageCircle, Calendar, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import SchedulingModal from './SchedulingModal'

export default function FacultyCard({ faculty }) {
  const navigate = useNavigate()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showScheduling, setShowScheduling] = useState(false)

  return (
    <>
      <article className="bg-white rounded-[2.5rem] border border-gray-100 shadow-apple hover:shadow-apple-hover transition-all duration-500 overflow-hidden group mb-6">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight uppercase">{faculty.name}</h3>
                {faculty.urgency && faculty.urgency !== 'low' && (
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${faculty.urgency === 'high' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                    }`}>
                    {faculty.urgency} Priority
                  </span>
                )}
              </div>
              <p className="text-lg font-bold text-primary leading-snug">
                {faculty.research_areas || 'Research and Innovation'}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 text-right">
              <span className="px-4 py-1.5 bg-gray-50 text-gray-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 whitespace-nowrap">
                Faculty Profile
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50/50 rounded-2xl border border-green-100">
              <ShieldCheck className="h-4 w-4 text-green-600 font-bold" />
              <span className="text-xs font-black text-green-700 uppercase tracking-tighter">Verified Mentor</span>
            </div>
            <div className="px-4 py-2 bg-blue-50/50 rounded-2xl border border-blue-100">
              <span className="text-xs font-black text-primary uppercase tracking-tighter">{(faculty.projects || []).length} Active Projects</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-50 text-gray-900 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-200"
            >
              {isExpanded ? 'Hide' : 'Details'}
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4 text-gray-400" />}
            </button>

            <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-gray-200 text-gray-900 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-all">
              <MessageCircle className="h-4 w-4 text-primary" /> Chat
            </button>

            <button
              onClick={() => setShowScheduling(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-blue-50 text-blue-600 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-blue-100 transition-all"
            >
              <Calendar className="h-4 w-4" /> Schedule
            </button>

            <button
              onClick={() => navigate(`/student/request-mentorship/${faculty.faculty_id}`)}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all transform active:scale-95">
              <Send className="h-4 w-4" /> Request
            </button>
          </div>

          {/* Expanded Content */}
          {isExpanded && (
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-8">
                <div>
                  <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Academic info</h5>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-400 uppercase tracking-tight">Email</span>
                      <span className="text-gray-900 font-medium">{faculty.email || 'Contact through portal'}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="font-bold text-gray-400 uppercase tracking-tight text-sm">Research Areas</span>
                      <p className="text-sm text-gray-900 font-medium leading-relaxed">{faculty.research_areas}</p>
                    </div>
                  </div>
                </div>

                {faculty.publications && (
                  <div>
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Key Publications</h5>
                    <p className="text-sm text-gray-600 italic leading-relaxed border-l-4 border-blue-50 pl-4">{faculty.publications}</p>
                  </div>
                )}

                <button
                  onClick={() => navigate(`/faculty/${faculty.faculty_id}`)}
                  className="text-primary text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all"
                >
                  View Full Professional Profile <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-6">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Available Projects</h5>
                {Array.isArray(faculty.projects) && faculty.projects.map((p, idx) => (
                  <div key={p.project_id || idx} className="p-6 bg-gray-50 rounded-3xl border border-gray-100 group/item hover:border-blue-100 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <h6 className="font-bold text-gray-900 group-hover/item:text-primary transition-colors">{p.title}</h6>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${p.status === 'full' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{p.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                      <span>Capacity: {p.current_students || 0} / {p.max_students || 5}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {showScheduling && (
        <SchedulingModal
          isOpen={true}
          onClose={() => setShowScheduling(false)}
          facultyId={faculty.faculty_id}
          facultyName={faculty.name}
        />
      )}
    </>
  )
}
