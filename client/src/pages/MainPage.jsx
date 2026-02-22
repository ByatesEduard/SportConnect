import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectUser, selectRole, selectPersonalInfo, selectIsAuthenticated } from '../redux/features/auth/authSlice'
import {
  PageLayout,
  WelcomeSection,
  Section,
  Card,
  CardContent,
  Button,
  ArrowRightIcon
} from '../components/ui'

export const MainPage = () => {
  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const role = useSelector(selectRole)
  const personalInfo = useSelector(selectPersonalInfo)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // Редірект: неавторизований користувач не має доступу до головної — повертаємо на стартову "Вітаємо"
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true })
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--green)]" />
        <p className="ml-4 text-[var(--muted)]">Завантаження...</p>
      </div>
    )
  }

  const getWelcomeMessage = () => {
    if (personalInfo?.fullName) {
      return `Вітаємо, ${personalInfo.fullName}`
    }
    if (user?.username) {
      return `Вітаємо, ${user.username}`
    }
    return 'Вітаємо'
  }

  const getWelcomeSubtitle = () => {
    if (!role) {
      return 'Оберіть вашу роль, щоб почати користуватися всіма функціями'
    }
    
    switch (role) {
      case 'athlete':
        return 'Готові до нових змагань та досягнень?'
      case 'coach':
        return 'Час тренувати чемпіонів!'
      case 'beginner':
        return 'Чудовий старт для нових досягнень'
      default:
        return 'Ласкаво просимо до SportPulse'
    }
  }

  const getRoleActions = () => {
    switch (role) {
      case 'athlete':
        return [
          { title: 'Мої змагання', desc: 'Переглянути майбутні та минулі змагання', link: '/posts' },
          { title: 'Статистика', desc: 'Аналіз прогресу та результатів', link: '/posts' },
          { title: 'Тренування', desc: 'Програми тренувань', link: '/posts' },
        ]
      case 'coach':
        return [
          { title: 'Спортсмени', desc: 'Керування командою та прогресом', link: '/posts' },
          { title: 'Тренувальні плани', desc: 'Програми тренувань', link: '/posts' },
          { title: 'Аналітика', desc: 'Статистика прогресу', link: '/posts' },
        ]
      case 'beginner':
        return [
          { title: 'Пости', desc: 'Переглянути контент спільноти', link: '/posts' },
          { title: 'Рекомендації', desc: 'Корисні матеріали', link: '/posts' },
        ]
      default:
        return []
    }
  }

  const isProfileComplete = () => {
    return user && role && personalInfo
  }

  if (!isProfileComplete()) {
    return (
      <PageLayout>
        <WelcomeSection 
          title={getWelcomeMessage()}
          subtitle={getWelcomeSubtitle()}
        />
        
        <Section title="Наступні кроки">
          <div className="flex flex-col gap-6 max-w-2xl">
            {!role && (
              <Card className="text-center p-8">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-[var(--text)] mb-2">Оберіть вашу роль</h3>
                  <p className="text-[var(--muted)] mb-6 leading-relaxed">Розкажіть, як ви плануєте використовувати платформу</p>
                  <Link to="/role">
                    <Button variant="primary" icon={<ArrowRightIcon />}>Обрати роль</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
            {role && !personalInfo && (
              <Card className="text-center p-8">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-[var(--text)] mb-2">Заповніть профіль</h3>
                  <p className="text-[var(--muted)] mb-6 leading-relaxed">Додайте особисту інформацію для персоналізації</p>
                  <Link to="/personal">
                    <Button variant="primary" icon={<ArrowRightIcon />}>Заповнити профіль</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </Section>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <WelcomeSection 
        title={getWelcomeMessage()}
        subtitle={getWelcomeSubtitle()}
      />
      
      <Section title="Швидкі дії">
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-5">
          {getRoleActions().map((action, index) => (
            <Card key={index}>
              <CardContent className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-[var(--text)]">{action.title}</h3>
                <p className="text-sm text-[var(--muted)] flex-1">{action.desc}</p>
                <Link to={action.link}>
                  <Button variant="ghost">Перейти</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section title="Останні новини">
        <Card>
          <CardContent>
            <p className="text-center py-10 text-[var(--muted)]">Тут будуть відображатися останні новини та оновлення</p>
          </CardContent>
        </Card>
      </Section>
    </PageLayout>
  )
}

export default MainPage
