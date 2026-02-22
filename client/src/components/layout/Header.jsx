import React from 'react'
import { useSelector } from 'react-redux'
import { selectUser, selectRole } from '../../redux/features/auth/authSlice'

export const Header = ({ children }) => {
  const user = useSelector(selectUser)
  const role = useSelector(selectRole)

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="header-brand">
          <span className="brand-text">SportPulse</span>
        </div>
        
        <div className="header-nav">
          {children}
        </div>
        
        <div className="header-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.username || 'Користувач'}</span>
              <span className="user-role">
                {role === 'athlete' && 'Спортсмен'}
                {role === 'coach' && 'Тренер'}
                {role === 'organizer' && 'Організатор'}
                {role === 'fan' && 'Вболівальник'}
                {!role && 'Користувач'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
