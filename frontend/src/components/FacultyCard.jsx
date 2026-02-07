import React from 'react'

export default function FacultyCard({ faculty }) {
  return (
    <article className="faculty-card">
      <h4>{faculty.name} ({faculty.faculty_id})</h4>
      <div>Research: {faculty.research || ''}</div>
      <div>Visible: {String(faculty.is_visible)}</div>
      <div className="projects">
        {Array.isArray(faculty.projects) && faculty.projects.map(p => (
          <div key={p.project_id} className={`project ${p.status === 'full' ? 'full' : ''}`}>
            <strong>{p.title}</strong>
            <div>{p.description}</div>
            <div>Status: {p.status}</div>
          </div>
        ))}
      </div>
    </article>
  )
}
