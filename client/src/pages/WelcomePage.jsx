import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ThemeProvider, PageLayout, WelcomeSection, Button, ArrowRightIcon } from '../components/ui'
import { selectIsAuthenticated } from '../redux/features/auth/authSlice'

/**
 * Потік: Welcome → Register (зберегти юзера) → Role (оновити роль) → Personal (оновити профіль).
 * Тут: кнопка "Почати" веде на /register, "Увійти" — на /login.
 * Якщо вже авторизований — редірект на /home.
 */
export const WelcomePage = () => {
  const navigate = useNavigate()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (isAuthenticated) {
    return null
  }

  const handleStart = () => {
    navigate('/register', { replace: true })
  }

  return (
    <ThemeProvider>
      <PageLayout>
        <WelcomeSection
          title="Вітаємо у SportPulse"
          subtitle="Платформа для спортсменів та тренерів. Оберіть роль і заповніть профіль."
        />
        <div className="mt-10 flex flex-col items-center gap-6">
          <Button
            variant="primary"
            onClick={handleStart}
            icon={<ArrowRightIcon />}
            className="min-w-[220px]"
          >
            Почати
          </Button>
          <p className="text-sm text-[var(--muted)]">
            Вже маєте акаунт?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[var(--green)] font-medium hover:underline"
            >
              Увійти
            </button>
          </p>
        </div>
      </PageLayout>
    </ThemeProvider>
  )
}

export default WelcomePage
