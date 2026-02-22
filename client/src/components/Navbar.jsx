import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser, selectRole } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'

/**
 * Адаптивний навбар з сучасним дизайном:
 * - градієнтний фон, тіні, hover-ефекти, padding
 * - на мобільних: бургер-меню, згортання пунктів
 * - посилання "Головна" веде на /home для авторизованих
 */
export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = useSelector(selectUser)
  const role = useSelector(selectRole)
  const dispatch = useDispatch()

  const logoutHandler = () => {
    dispatch(logout())
    toast('Ви вийшли з системи')
  }

  const navLinks = [
    { to: '/home', label: 'Головна' },
    { to: '/posts', label: 'Пости' },
  ]

  const roleLabels = {
    athlete: 'Спортсмен',
    coach: 'Тренер',
    beginner: 'Початківець',
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-gradient-to-r from-[#0f1419] via-[#13161d] to-[#0f1419] border-b border-[var(--border)] shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/home"
            className="flex items-center gap-3 rounded-lg px-2 py-2 transition-all hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-[var(--green)]/50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--green)] to-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-900/30">
              SP
            </div>
            <span className="hidden sm:inline font-semibold text-[var(--text)] tracking-tight">
              SportPulse
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[var(--green)]/20 text-[var(--green)] shadow-inner'
                      : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* User block + mobile menu button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-white/5 px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--green)] text-white font-semibold text-sm">
                  {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-sm font-medium text-[var(--text)]">
                    {user?.username || 'Користувач'}
                  </div>
                  <div className="text-xs text-[var(--muted)]">
                    {roleLabels[role] || 'Користувач'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={logoutHandler}
                className="rounded-lg border border-[var(--border)] bg-white/5 px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-all hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-500/30"
              >
                Вийти
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2.5 text-[var(--muted)] hover:bg-white/10 hover:text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--green)]/50"
              aria-label="Меню"
            >
              {mobileOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[var(--border)] py-4 space-y-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive ? 'bg-[var(--green)]/20 text-[var(--green)]' : 'text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="flex items-center gap-3 px-4 py-3 mt-2 rounded-lg bg-white/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--green)] text-white font-semibold">
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text)] truncate">
                  {user?.username || 'Користувач'}
                </div>
                <div className="text-xs text-[var(--muted)]">
                  {roleLabels[role] || 'Користувач'}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  logoutHandler()
                  setMobileOpen(false)
                }}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10"
              >
                Вийти
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
