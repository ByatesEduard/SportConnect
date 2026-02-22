import React, { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser, selectIsAuthenticated } from '../redux/features/auth/authSlice'
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

const validateUsername = (v) => /^[a-zA-Z0-9_]+$/.test((v || '').trim())
const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || '').trim())

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
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
      newErrors.username = "Ім'я користувача обов'язкове"
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Тільки латинські літери, цифри та _'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email обов\'язковий'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Невірний формат email'
    }
    if (!formData.password) {
      newErrors.password = 'Пароль обов\'язковий'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Мінімум 6 символів'
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
      await dispatch(registerUser({
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      })).unwrap()
      toast.success('Реєстрація успішна')
      navigate('/role?step=role', { replace: true })
    } catch (error) {
      toast.error(error || 'Помилка реєстрації')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.username.trim() && formData.email.trim() && formData.password.length >= 6

  return (
    <ThemeProvider>
      <PageLayout>
        <WelcomeSection
          title="Створіть акаунт"
          subtitle="Введіть дані для реєстрації"
        />
        <Section title="Реєстрація">
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <Input
              label="Username (латиницею)"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              placeholder="john_doe"
              required
              autoComplete="username"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="example@email.com"
              required
              autoComplete="email"
            />
            <Input
              label="Пароль"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="Мінімум 6 символів"
              required
              autoComplete="new-password"
            />
            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={!isFormValid || loading}
                loading={loading}
                icon={<ArrowRightIcon />}
              >
                Зареєструватися
              </Button>
            </div>
          </form>
        </Section>
        <div className="mt-8 pt-6 border-t border-[var(--border)] text-center text-sm text-[var(--muted)]">
          Вже маєте акаунт?{' '}
          <Link to="/login" className="text-[var(--green)] font-medium hover:underline">
            Увійти
          </Link>
        </div>
      </PageLayout>
    </ThemeProvider>
  )
}

export default RegisterPage
