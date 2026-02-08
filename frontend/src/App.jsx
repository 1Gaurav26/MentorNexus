import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import StudentDashboard from './pages/StudentDashboard'
import FacultyDashboard from './pages/FacultyDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import Onboarding from './pages/Onboarding' // Keep for migration reference/reuse if needed
import MatchResults from './pages/MatchResults'
import Search from './pages/Search'
import FacultyProfile from './pages/FacultyProfile'
import StudentProfile from './pages/StudentProfile'
import RequestMentorship from './pages/RequestMentorship'
import StudentRequests from './pages/StudentRequests'
import StudentSearch from './pages/StudentSearch'
import StudentPublicProfile from './pages/StudentPublicProfile'
import FacultyEditProfile from './pages/FacultyEditProfile'
import FacultyPublications from './pages/FacultyPublications'
import Landing from './pages/Landing' // New Landing page? Or just redirect to login

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Landing />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/match" element={<MatchResults />} />
          <Route path="/search" element={<Search />} />
          <Route path="/faculty/:id" element={<FacultyProfile />} />
          <Route path="/student/profile" element={<StudentProfile />} />
          <Route path="/student/requests" element={<StudentRequests />} />
          <Route path="/student/request-mentorship/:facultyId" element={<RequestMentorship />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/search-students" element={<StudentSearch />} />
          <Route path="/faculty/student/:id" element={<StudentPublicProfile />} />
          <Route path="/faculty/edit-profile" element={<FacultyEditProfile />} />
          <Route path="/faculty/publications" element={<FacultyPublications />} />
          {/* Add more faculty routes here */}
        </Route>

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

