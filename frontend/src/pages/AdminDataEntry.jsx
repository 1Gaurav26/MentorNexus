
import React, { useState } from 'react';
import { upsertFaculty, upsertStudent } from '../api/api';

export default function AdminDataEntry() {
    const [mode, setMode] = useState('faculty'); // 'faculty' or 'student'
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Common State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    // Faculty State
    const [researchAreas, setResearchAreas] = useState('');
    const [requiredSkills, setRequiredSkills] = useState('');
    const [maxStudents, setMaxStudents] = useState(5);
    const [projectTitle, setProjectTitle] = useState('');
    const [projectDesc, setProjectDesc] = useState('');

    // Student State
    const [studentSkills, setStudentSkills] = useState('');
    const [interests, setInterests] = useState('');
    const [academicLevel, setAcademicLevel] = useState('Undergraduate');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); setError('');

        try {
            if (mode === 'faculty') {
                const payload = {
                    faculty_id: `F-${Date.now()}`, // Simple ID generation
                    name,
                    email,
                    research_areas: researchAreas,
                    required_skills: requiredSkills.split(',').map(s => s.trim()),
                    methodologies: [], // simplified
                    publications: "N/A", // simplified
                    urgency: "medium",
                    max_students: parseInt(maxStudents),
                    current_students: 0,
                    academic_level: "Any",
                    availability: 10,
                    is_visible: true,
                    projects: projectTitle ? [{
                        project_id: `P-${Date.now()}`,
                        title: projectTitle,
                        description: projectDesc,
                        status: "open",
                        max_students: parseInt(maxStudents),
                        current_students: 0
                    }] : []
                };
                await upsertFaculty(payload);
                setMessage('Faculty added successfully!');
            } else {
                const payload = {
                    student_id: `S-${Date.now()}`,
                    name,
                    // Email is not in StudentUpsert schema strictly but good to have in CSV if expanded
                    skills: studentSkills.split(',').map(s => s.trim()),
                    interests: interests,
                    research_interest: interests,
                    academic_level: academicLevel,
                    methodologies: [],
                    goal: "Research",
                    availability: 10
                };
                await upsertStudent(payload);
                setMessage('Student added successfully!');
            }

            // Clear form (optional)
            setName(''); setEmail('');
        } catch (err) {
            console.error(err);
            setError('Failed to save data. check console.');
        }
    };

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h2>Contribute Data</h2>
            <p style={{ color: 'var(--text-muted)' }}>Add new records to the system datasets.</p>

            <div className="tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    className={mode === 'faculty' ? 'primary' : 'secondary'}
                    onClick={() => setMode('faculty')}
                >
                    Add Faculty
                </button>
                <button
                    className={mode === 'student' ? 'primary' : 'secondary'}
                    onClick={() => setMode('student')}
                >
                    Add Student
                </button>
            </div>

            {message && <div style={{ padding: '1rem', background: '#d1fae5', color: '#065f46', borderRadius: '8px', marginBottom: '1rem' }}>{message}</div>}
            {error && <div style={{ padding: '1rem', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>

                <div className="form-group">
                    <label>Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} required />
                </div>

                {mode === 'faculty' && (
                    <>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label>Research Areas (comma separated)</label>
                            <input value={researchAreas} onChange={e => setResearchAreas(e.target.value)} placeholder="AI, Blockchain, IoT" required />
                        </div>
                        <div className="form-group">
                            <label>Required Skills (comma separated)</label>
                            <input value={requiredSkills} onChange={e => setRequiredSkills(e.target.value)} placeholder="Python, React, Solidity" />
                        </div>
                        <div className="form-group">
                            <label>Max Students (Capacity)</label>
                            <input type="number" value={maxStudents} onChange={e => setMaxStudents(e.target.value)} min="1" />
                        </div>

                        <h4 style={{ marginTop: '1.5rem' }}>Initial Project</h4>
                        <div className="form-group">
                            <label>Project Title</label>
                            <input value={projectTitle} onChange={e => setProjectTitle(e.target.value)} placeholder="Project Alpha" />
                        </div>
                        <div className="form-group">
                            <label>Project Description</label>
                            <textarea value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Description of the research project..." />
                        </div>
                    </>
                )}

                {mode === 'student' && (
                    <>
                        <div className="form-group">
                            <label>Academic Level</label>
                            <select value={academicLevel} onChange={e => setAcademicLevel(e.target.value)}>
                                <option>Undergraduate</option>
                                <option>Masters</option>
                                <option>PhD</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Skills (comma separated)</label>
                            <input value={studentSkills} onChange={e => setStudentSkills(e.target.value)} placeholder="Java, Python, Leadership" required />
                        </div>
                        <div className="form-group">
                            <label>Research Interests</label>
                            <textarea value={interests} onChange={e => setInterests(e.target.value)} placeholder="I am interested in..." required />
                        </div>
                    </>
                )}

                <button type="submit" className="primary" style={{ width: '100%', marginTop: '1rem' }}>
                    {mode === 'faculty' ? 'Add Faculty' : 'Add Student'}
                </button>

            </form>
        </div>
    );
}
