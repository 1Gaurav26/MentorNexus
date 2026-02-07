import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const client = axios.create({ baseURL: API_BASE })

export async function searchFaculty(q) {
  return client.get('/search/faculty', { params: { q } }).then(r => r.data)
}

export async function researchMatch(student) {
  return client.post('/match/research', student).then(r => r.data)
}

export async function fullMatch(student) {
  return client.post('/match/full', student).then(r => r.data)
}

export async function upsertStudent(student) {
  return client.post('/student/upsert', student).then(r => r.data)
}

export async function upsertFaculty(faculty) {
  return client.post('/faculty/upsert', faculty).then(r => r.data)
}

export async function getAnalytics() {
  return client.get('/analytics').then(r => r.data)
}

export default { searchFaculty, researchMatch, fullMatch, upsertStudent, upsertFaculty, getAnalytics }
