import React from 'react'
import { User, Mail, BookOpen, Sparkles, ChevronRight } from 'lucide-react'

export default function StudentCard({ student }) {
    // Helper to get academic year label
    const getYearLabel = (level) => {
        if (level?.includes('Undergraduate')) return 'Year 3 • Computer Science' // Mocking for aesthetic match
        if (level?.includes('Graduate')) return 'Year 1 • Master\'s'
        return level || 'Enrolled Student'
    }

    return (
        <div className="bg-white rounded-3xl p-8 shadow-apple border border-gray-100 group hover:shadow-apple-hover transition-all duration-300">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <User className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary transition-colors">
                                {student.student_id ? student.student_id.split('-').slice(0, 2).join(' ') : 'Student Name'}
                            </h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                {getYearLabel(student.academic_level)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div className="flex items-center gap-2 mb-6 text-sm text-gray-500 font-medium">
                    <Mail className="h-4 w-4 text-gray-300" />
                    <span>{student.email || 'student@university.edu'}</span>
                </div>

                {/* Interests */}
                <div className="mb-6">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <BookOpen className="h-3 w-3" /> Research Interests
                    </h5>
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                        {student.interests || 'Machine Learning, NLP, Data Science'}
                    </p>
                </div>

                {/* Skills */}
                <div className="mb-8 flex-grow">
                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> Skills
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(student.skills) && student.skills.slice(0, 4).map((skill, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1 bg-blue-50 text-primary text-[10px] font-bold rounded-full border border-blue-100/50 capitalize"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Action */}
                <button className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:bg-primary-hover active:scale-[0.98] transition-all flex items-center justify-center gap-2 group/btn">
                    View Full Profile
                    <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    )
}
