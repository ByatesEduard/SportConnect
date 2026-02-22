import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-transparent"></div>
        </div>
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />
    }

    return children
}

export const PublicRoute = ({ children }) => {
    const { isAuthenticated } = useAuth()

    if (isAuthenticated) {
        return <Navigate to="/" />
    }

    return children
}

export default ProtectedRoute
