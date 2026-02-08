import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore'

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, user } = useAuthStore()

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to their appropriate dashboard if unauthorized for this route
        if (user.role === 'student') return <Navigate to="/student/dashboard" replace />
        if (user.role === 'faculty') return <Navigate to="/faculty/dashboard" replace />
        return <Navigate to="/" replace />
    }

    return <Outlet />
}

export default ProtectedRoute
