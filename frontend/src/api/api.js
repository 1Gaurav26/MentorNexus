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

export async function getStudent(id) {
  return client.get(`/student/${id}`).then(r => r.data)
}

export async function sendMentorshipRequest(data) {
  return client.post('/mentorship/request', data).then(r => r.data)
}

export async function getStudentRequests(id) {
  return client.get(`/mentorship/student/${id}`).then(r => r.data)
}

export async function getFacultyRequests(id) {
  return client.get(`/mentorship/faculty/${id}`).then(r => r.data)
}

export async function updateRequestStatus(requestId, status, note = null) {
  return client.patch('/mentorship/status', { request_id: requestId, status, note }).then(r => r.data)
}

export async function searchStudents(q) {
  return client.get(`/search/student?q=${q}`).then(r => r.data)
}

export default {
  searchFaculty,
  researchMatch,
  fullMatch,
  upsertStudent,
  upsertFaculty,
  getAnalytics,
  getStudent,
  sendMentorshipRequest,
  getStudentRequests,
  getFacultyRequests,
  updateRequestStatus,
  searchStudents
}
// Faculty management
export const getFaculty = async (facultyId) => {
  try {
    const res = await client.get(`/faculty/profile/${facultyId}`)
    return res.data
  } catch (err) {
    console.error("Fetch faculty error", err)
    throw err
  }
}

export const updateFacultyProfile = async (data) => {
  try {
    const res = await client.post('/faculty/update', data)
    return res.data
  } catch (err) {
    throw err
  }
}
