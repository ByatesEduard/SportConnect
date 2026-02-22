import React from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '../redux/features/auth/authSlice'
import { Navbar } from './Navbar'

export const Layout = ({ children }) => {
    const isAuthenticated = useSelector(selectIsAuthenticated)

    return (
        <div className="app-layout">
            {isAuthenticated && <Navbar />}
            <main className={`app-main ${isAuthenticated ? 'with-navbar' : ''}`}>
                {children}
            </main>
        </div>
    )
}

export default Layout
