import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fullMatch, researchMatch, upsertStudent } from '../api/api'
import useMatchStore from '../stores/useMatchStore'
import { Sparkles, Upload, Loader2, BookOpen, Clock, ChevronRight, ArrowLeft } from 'lucide-react'

export default function Onboarding() {
  const navigate = useNavigate()
  const { setResults } = useMatchStore()
  const [skills, setSkills] = useState('')
  const [interests, setInterests] = useState('')
  const [availability, setAvailability] = useState('')
  const [academicLevel, setAcademicLevel] = useState('Undergraduate')
  const [loading, setLoading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [error, setError] = useState('')

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setParsing(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:8000/student/parse-resume', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to parse resume');

      const data = await res.json();

      if (data.skills && Array.isArray(data.skills)) {
        setSkills(prev => {
          const newSkills = data.skills.join(', ');
          return prev ? prev + ', ' + newSkills : newSkills;
        });
      }

      if (data.interests) {
        setInterests(prev => prev ? prev + '\n\n' + data.interests : data.interests);
      }

    } catch (err) {
      setError('Resume parsing failed. Please try again or fill manually.');
      console.error(err);
    } finally {
      setParsing(false);
    }
  };

  function buildStudent() {
    const valInterests = interests || '';
    return {
      student_id: `s-${Date.now()}`,
      skills: skills.split(',').map(s => s.trim()).filter(Boolean),
      methodologies: [],
      interests: valInterests,        // For StudentUpsert
      research_interest: valInterests, // For StudentInput
      goal: "Research collaboration",  // For StudentInput (required)
      availability: parseInt(availability) || 0,
      academic_level: academicLevel
    }
  }

  async function handleMatch(type) {
    setLoading(true); setError('')
    const student = buildStudent()

    try {
      await upsertStudent(student)
      let res;
      if (type === 'research') {
        res = await researchMatch(student)
      } else {
        res = await fullMatch(student)
      }
      setResults(res)
      navigate('/match')
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/student/dashboard')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
      </button>

      <div className="text-center mb-10">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">Find Your Research Mentor</h2>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Connect with faculty whose research aligns with your academic interests and career goals.
        </p>
      </div>

      <div className="glass-panel p-8 rounded-3xl mb-10 border-blue-100 bg-white/40 shadow-apple">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gray-900">✨ AI Resume Autofill</h3>
          <p className="text-sm text-gray-500 mb-6 max-w-md">
            Upload your resume (PDF) and let our AI extract your skills and research interests automatically.
          </p>

          <input
            type="file"
            accept="application/pdf"
            onChange={handleResumeUpload}
            className="hidden"
            id="resume-upload"
          />
          <label
            htmlFor="resume-upload"
            className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:shadow-apple transition-all cursor-pointer group"
          >
            {parsing ? (
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            ) : (
              <Upload className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            )}
            {parsing ? 'Analyzing PDF...' : 'Upload Resume'}
          </label>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1 flex items-center gap-2">
              <BookOpen className="h-4 w-4" /> Academic Level
            </label>
            <select
              value={academicLevel}
              onChange={e => setAcademicLevel(e.target.value)}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 shadow-sm"
            >
              <option>Undergraduate</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500 ml-1 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Availability (Hours/Week)
            </label>
            <input
              placeholder="e.g. 10"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
              className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-500 ml-1">Skills & Technologies</label>
          <input
            placeholder="Python, Machine Learning, React, Data Analysis..."
            value={skills}
            onChange={e => setSkills(e.target.value)}
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 shadow-sm"
          />
          <p className="text-xs text-gray-400 ml-1">Separate skills with commas (e.g., Python, AI, Research)</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-500 ml-1">Research Interests & Goals</label>
          <textarea
            placeholder="Describe what kind of research you are interested in. Be specific about topics..."
            value={interests}
            onChange={e => setInterests(e.target.value)}
            className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-900 shadow-sm min-h-[160px] resize-none"
          />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            onClick={() => handleMatch('research')}
            disabled={loading}
            className="flex-1 px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-3xl font-bold hover:bg-gray-50 hover:shadow-apple transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Quick Match'}
            {!loading && <ChevronRight className="h-5 w-5 text-gray-400 group-hover:translate-x-1 transition-transform" />}
          </button>
          <button
            onClick={() => handleMatch('full')}
            disabled={loading}
            className="flex-1 px-8 py-4 bg-primary text-white rounded-3xl font-bold hover:bg-primary-hover shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Full Match & Commit'}
          </button>
        </div>
      </form>
    </div>
  )
}
