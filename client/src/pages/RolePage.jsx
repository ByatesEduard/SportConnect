import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import {
  ThemeProvider,
  PageLayout,
  WelcomeSection,
  Section,
  Button,
  Card,
  CardContent,
  ArrowRightIcon,
  CheckIcon
} from '../components/ui'
import { selectUser, selectRole, selectIsAuthenticated, selectRegistrationStep, updateUserRole } from '../redux/features/auth/authSlice'

const ROLES = [
  { id: 'athlete', title: 'Спортсмен', description: 'Беру участь у тренуваннях та змаганнях', features: ['Особистий профіль', 'Реєстрація на заходи', 'Статистика'] },
  { id: 'coach', title: 'Тренер', description: 'Працюю зі спортсменами та веду тренування', features: ['Керування групами', 'Плани тренувань', 'Прогрес спортсменів'] },
  { id: 'beginner', title: 'Початківець', description: 'Тільки починаю займатися спортом', features: ['Рекомендації', 'Особистий кабінет', 'Спільнота'] },
]

export const RolePage = () => {
  const [selectedRole, setSelectedRoleState] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const reduxRole = useSelector(selectRole)
  const registrationStep = useSelector(selectRegistrationStep)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const initialSync = useRef(false)

  const roleFromUrl = searchParams.get('role') || ''

  // Редірект на головну тільки якщо користувач вже обрав роль (не після щойної реєстрації).
  // Після реєстрації registrationStep === 'role' — залишаємо на цій сторінці для вибору.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    if (reduxRole && registrationStep !== 'role') {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, reduxRole, registrationStep, navigate])

  useEffect(() => {
    if (initialSync.current) return
    initialSync.current = true
    if (roleFromUrl && ROLES.some((r) => r.id === roleFromUrl)) {
      setSelectedRoleState(roleFromUrl)
    } else if (reduxRole) {
      setSelectedRoleState(reduxRole)
    }
  }, [roleFromUrl, reduxRole])

  const handleRoleSelect = (roleId) => {
    setSelectedRoleState(roleId)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('role', roleId)
      return next
    }, { replace: true })
  }

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast.error('Оберіть роль')
      return
    }
    setLoading(true)
    try {
      await dispatch(updateUserRole(selectedRole)).unwrap()
      toast.success('Роль збережена')
      navigate('/personal?step=personal&pstep=0', { replace: true })
    } catch (error) {
      toast.error(error || 'Помилка збереження ролі')
    } finally {
      setLoading(false)
    }
  }

  return (
    <ThemeProvider>
      <PageLayout>
        <WelcomeSection
          title="Оберіть роль"
          subtitle="Як ви плануєте використовувати платформу?"
        />
        <Section title="Роль">
          <div className="flex flex-col gap-4 md:gap-6">
            {ROLES.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 border-2 ${selectedRole === role.id ? 'border-[var(--green)] bg-[var(--green-dim)]' : 'border-[var(--border)] hover:border-[var(--green)]/50'}`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-[var(--text)]">{role.title}</h3>
                      <p className="text-sm text-[var(--muted)] mt-1">{role.description}</p>
                      <ul className="mt-3 space-y-1 text-sm text-[var(--muted)]">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckIcon />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {selectedRole === role.id && (
                      <div className="flex items-center gap-2 text-[var(--green)] text-sm font-medium">
                        <CheckIcon />
                        Обрано
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
        <div className="flex justify-end mt-8 pt-6 border-t border-[var(--border)]">
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!selectedRole || loading}
            loading={loading}
            icon={<ArrowRightIcon />}
          >
            Далі
          </Button>
        </div>
      </PageLayout>
    </ThemeProvider>
  )
}

export default RolePage
