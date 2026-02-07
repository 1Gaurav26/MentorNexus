import React, { useState } from 'react'
import { fullMatch, researchMatch, upsertStudent } from '../api/api'

export default function Onboarding({ onShowResults }) {
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
      onShowResults(res)
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2>Find Your Research Mentor</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
          Connect with faculty whose research aligns with your academic interests.
        </p>
      </div>

      <div className="resume-upload-section" style={{
        background: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px dashed var(--primary)',
        marginBottom: '2rem',
        textAlign: 'center'
      }}>
        <h3 style={{ marginTop: 0, fontSize: '1rem', color: 'var(--primary)' }}>✨ AI Resume Autofill</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Upload your resume (PDF) and let our AI extract your skills and interests automatically.
        </p>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleResumeUpload}
          style={{ display: 'none' }}
          id="resume-upload"
        />
        <label htmlFor="resume-upload" className="primary" style={{
          display: 'inline-block',
          padding: '0.5rem 1rem',
          background: 'var(--bg-page)',
          color: 'var(--primary)',
          border: '1px solid var(--primary)',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontWeight: '500'
        }}>
          {parsing ? 'Analyzing PDF...' : '📂 Upload Resume'}
        </label>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="form-group">
            <label>Academic Level</label>
            <select value={academicLevel} onChange={e => setAcademicLevel(e.target.value)}>
              <option>Undergraduate</option>
              <option>Masters</option>
              <option>PhD</option>
            </select>
          </div>

          <div className="form-group">
            <label>Availability (Hours/Week)</label>
            <input
              placeholder="e.g. 10"
              value={availability}
              onChange={e => setAvailability(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Skills & Technologies</label>
          <input
            placeholder="Python, Machine Learning, React, Data Analysis..."
            value={skills}
            onChange={e => setSkills(e.target.value)}
          />
          <small style={{ color: 'var(--text-muted)' }}>Comma separated values</small>
        </div>

        <div className="form-group">
          <label>Research Interests & Goals</label>
          <textarea
            placeholder="Describe what kind of research you are interested in. Be specific about topics like 'autonomous drones', 'NLP', or 'bioinformatics'..."
            value={interests}
            onChange={e => setInterests(e.target.value)}
          />
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="actions" style={{ justifyContent: 'flex-end' }}>
          <button
            className="secondary"
            onClick={() => handleMatch('research')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Quick Research Match'}
          </button>
          <button
            className="primary"
            onClick={() => handleMatch('full')}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Full Match & Commit'}
          </button>
        </div>
      </form>
    </section>
  )
}
