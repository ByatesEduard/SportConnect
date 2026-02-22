import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectRole } from '../../redux/features/auth/authSlice'

export const Sidebar = ({ items }) => {
  const role = useSelector(selectRole)

  const getNavItems = () => {
    const baseItems = [
      { to: '/', label: 'Головна', icon: '🏠' },
      { to: '/posts', label: 'Пости', icon: '📝' },
    ]

    const roleItems = {
      athlete: [
        { to: '/competitions', label: 'Змагання', icon: '🏆' },
        { to: '/training', label: 'Тренування', icon: '💪' },
        { to: '/stats', label: 'Статистика', icon: '📊' },
      ],
      coach: [
        { to: '/athletes', label: 'Спортсмени', icon: '👥' },
        { to: '/plans', label: 'Плани', icon: '📋' },
        { to: '/analytics', label: 'Аналітика', icon: '📈' },
      ],
      organizer: [
        { to: '/events', label: 'Заходи', icon: '📅' },
        { to: '/create-event', label: 'Створити захід', icon: '➕' },
        { to: '/registrations', label: 'Реєстрації', icon: '📝' },
      ],
      fan: [
        { to: '/news', label: 'Новини', icon: '📰' },
        { to: '/events', label: 'Заходи', icon: '📅' },
        { to: '/athletes', label: 'Спортсмени', icon: '👥' },
      ],
    }

    return [...baseItems, ...(roleItems[role] || [])]
  }

  return (
    <aside className="app-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">SP</span>
            <span className="logo-text">SportPulse</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {getNavItems().map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 
                `nav-item ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
