import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, selectIsAuthenticated } from '../redux/features/auth/authSlice'
import { toast } from 'react-toastify'
import {
  ThemeProvider,
  PageLayout,
  WelcomeSection,
  Section,
  Input,
  Button,
  ArrowRightIcon
} from '../components/ui'

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const validateForm = useCallback(() => {
    const newErrors = {}
    if (!formData.username.trim()) {
      newErrors.username = "Username обов'язковий"
    }
    if (!formData.password) {
      newErrors.password = "Пароль обов'язковий"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setLoading(true)
    try {
      await dispatch(loginUser({
        username: formData.username.trim(),
        password: formData.password,
      })).unwrap()
      toast.success('Вітаємо, ви успішно увійшли')
      navigate('/home', { replace: true })
    } catch (error) {
      toast.error(error || 'Помилка входу')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/home', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const isFormValid = formData.username.trim() && formData.password

  return (
    <ThemeProvider>
      <PageLayout>
        <WelcomeSection
          title="Вхід"
          subtitle="Увійдіть до вашого акаунту"
        />
        <Section title="Вхід">
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <Input
              label="Username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="Ваш username"
              required
              autoComplete="username"
            />
            <Input
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Пароль"
              required
              autoComplete="current-password"
            />
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid || loading}
                loading={loading}
                icon={<ArrowRightIcon />}
              >
                Увійти
              </Button>
            </div>
          </form>
        </Section>
        <div className="mt-12 pt-8 border-t border-[var(--border)] text-center text-sm text-[var(--muted)]">
          Немає акаунту?{' '}
          <Link to="/register" className="text-[var(--green)] font-medium hover:underline">
            Реєстрація
          </Link>
        </div>
      </PageLayout>
    </ThemeProvider>
  )
}

export default LoginPage
