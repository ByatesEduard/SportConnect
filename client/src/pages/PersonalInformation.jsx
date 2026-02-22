import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  ThemeProvider,
  PageLayout,
  WelcomeSection,
  Section,
  Input,
  Textarea,
  Select,
  RadioGroup,
  Button,
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  ProgressBar
} from '../components/ui'
import {
  selectUser,
  selectPersonalInfo,
  updatePersonalInfo,
  selectIsAuthenticated
} from '../redux/features/auth/authSlice'

const GENDERS = [
  { value: 'male', label: 'Чоловік' },
  { value: 'female', label: 'Жінка' },
  { value: 'other', label: 'Інше' },
]

const OCCUPATIONS = [
  { value: 'student', label: 'Студент' },
  { value: 'professional_athlete', label: 'Професійний спортсмен' },
  { value: 'amateur_athlete', label: 'Аматор' },
  { value: 'coach', label: 'Тренер' },
  { value: 'other', label: 'Інше' },
]

const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Малорухливий' },
  { value: 'light', label: 'Легка активність' },
  { value: 'moderate', label: 'Помірна активність' },
  { value: 'active', label: 'Висока активність' },
  { value: 'very_active', label: 'Дуже висока активність' },
]

const STEPS = ['Особиста інформація', 'Спортивні цілі та дані', 'Згода']

const defaultFormData = () => ({
  fullName: '',
  email: '',
  birthdate: '',
  gender: '',
  address: '',
  city: '',
  occupation: '',
  height: '',
  weight: '',
  fitnessGoals: '',
  activityLevel: '',
  experienceYears: '',
  currentTraining: '',
  weeklyHours: '',
  achievements: '',
  consentTreatment: false,
  consentPrivacy: false,
  consentMarketing: false,
})

export const PersonalInformation = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const user = useSelector(selectUser)
  const personalInfo = useSelector(selectPersonalInfo)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  const pstepFromUrl = parseInt(searchParams.get('pstep') || '0', 10)
  const safeStep = Math.min(Math.max(0, isNaN(pstepFromUrl) ? 0 : pstepFromUrl), STEPS.length - 1)

  const [currentStep, setCurrentStepState] = useState(safeStep)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState(defaultFormData())
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const hydrated = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
  }, [isAuthenticated, navigate])

  useEffect(() => {
    setCurrentStepState(safeStep)
  }, [safeStep])

  useEffect(() => {
    if (hydrated.current) return
    hydrated.current = true
    const base = {
      ...defaultFormData(),
      email: user?.email || '',
      fullName: user?.username || '',
    }
    if (personalInfo && typeof personalInfo === 'object') {
      setFormData((prev) => ({
        ...base,
        ...prev,
        ...personalInfo,
        birthdate: personalInfo.birthdate ? (typeof personalInfo.birthdate === 'string' ? personalInfo.birthdate.slice(0, 10) : '') : '',
      }))
    } else {
      setFormData((prev) => ({ ...base, ...prev }))
    }
  }, [user, personalInfo])

  const setCurrentStep = useCallback((step) => {
    const s = Math.min(Math.max(0, step), STEPS.length - 1)
    setCurrentStepState(s)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('pstep', String(s))
      return next
    }, { replace: true })
  }, [setSearchParams])

  const validateStep = useCallback((step) => {
    const newErrors = {}
    if (step === 0) {
      if (!formData.fullName?.trim()) newErrors.fullName = "Ім'я обов'язкове"
      if (!formData.birthdate) newErrors.birthdate = 'Дата народження обов\'язкова'
      if (!formData.gender) newErrors.gender = 'Оберіть стать'
      if (!formData.city?.trim()) newErrors.city = 'Місто обов\'язкове'
    }
    if (step === 1) {
      if (!formData.height || Number(formData.height) <= 0) newErrors.height = 'Вкажіть зріст'
      if (!formData.weight || Number(formData.weight) <= 0) newErrors.weight = 'Вкажіть вагу'
      if (!formData.fitnessGoals?.trim()) newErrors.fitnessGoals = 'Спортивні цілі обов\'язкові'
      if (!formData.activityLevel) newErrors.activityLevel = 'Оберіть рівень активності'
    }
    if (step === 2) {
      if (!formData.consentTreatment) newErrors.consentTreatment = 'Потрібна згода на участь'
      if (!formData.consentPrivacy) newErrors.consentPrivacy = 'Потрібна згода на обробку даних'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleNext = async () => {
    if (!validateStep(currentStep)) return
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        birthdate: formData.birthdate,
        gender: formData.gender,
        city: formData.city,
        address: formData.address,
        height: formData.height ? Number(formData.height) : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        fitnessGoals: formData.fitnessGoals,
        activityLevel: formData.activityLevel,
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
        achievements: formData.achievements ? [formData.achievements] : undefined,
      }
      await dispatch(updatePersonalInfo(payload)).unwrap()
      setIsSubmitted(true)
      toast.success('Дані збережено')
    } catch (error) {
      toast.error(error || 'Помилка збереження')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((currentStep + 1) / STEPS.length) * 100

  if (isSubmitted) {
    return (
      <ThemeProvider>
        <PageLayout>
          <div className="flex flex-col items-center justify-center text-center min-h-[70vh] gap-5 animate-fade-in">
            <div className="w-20 h-20 rounded-full border-2 border-[var(--green)] bg-[var(--green-dim)] flex items-center justify-center text-2xl font-bold text-[var(--green)]">
              <CheckIcon />
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">Реєстрацію завершено</h2>
            <p className="text-[var(--muted)] text-sm max-w-sm leading-relaxed">
              Профіль створено. Можете користуватися всіма функціями.
            </p>
            <Button variant="primary" onClick={() => navigate('/home')}>
              Перейти до головної
            </Button>
          </div>
        </PageLayout>
      </ThemeProvider>
    )
  }

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="personal-form-step space-y-4">
          <Input label="Повне ім'я" name="fullName" value={formData.fullName} onChange={handleChange} error={errors.fullName} placeholder="Іван Іваненко" required />
          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled placeholder="example@email.com" />
          <Input label="Дата народження" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} error={errors.birthdate} required />
          <div>
            <label className="field-label">Стать</label>
            <RadioGroup name="gender" options={GENDERS} value={formData.gender} onChange={handleChange} error={errors.gender} />
          </div>
          <Input label="Місто" name="city" value={formData.city} onChange={handleChange} error={errors.city} placeholder="Київ" required />
          <Input label="Адреса" name="address" value={formData.address} onChange={handleChange} placeholder="вул. Примерна, 1" />
          <Select label="Рід діяльності" name="occupation" options={OCCUPATIONS} value={formData.occupation} onChange={handleChange} />
        </div>
      )
    }
    if (currentStep === 1) {
      return (
        <div className="personal-form-step space-y-4">
          <Input label="Зріст (см)" name="height" type="number" value={formData.height} onChange={handleChange} error={errors.height} placeholder="175" required />
          <Input label="Вага (кг)" name="weight" type="number" value={formData.weight} onChange={handleChange} error={errors.weight} placeholder="70" required />
          <Select label="Рівень активності" name="activityLevel" options={ACTIVITY_LEVELS} value={formData.activityLevel} onChange={handleChange} error={errors.activityLevel} required />
          <Input label="Досвід (років)" name="experienceYears" type="number" value={formData.experienceYears} onChange={handleChange} placeholder="0" min="0" />
          <Textarea label="Спортивні цілі" name="fitnessGoals" value={formData.fitnessGoals} onChange={handleChange} error={errors.fitnessGoals} placeholder="Наприклад: марафон, сила, витривалість..." rows={3} required />
          <Textarea label="Поточна програма тренувань" name="currentTraining" value={formData.currentTraining} onChange={handleChange} placeholder="Опишіть програму..." rows={2} />
          <Input label="Годин на тиждень" name="weeklyHours" type="number" value={formData.weeklyHours} onChange={handleChange} placeholder="0" min="0" />
          <Textarea label="Досягнення" name="achievements" value={formData.achievements} onChange={handleChange} placeholder="Основні досягнення..." rows={2} />
        </div>
      )
    }
    if (currentStep === 2) {
      return (
        <div className="personal-form-step space-y-4">
          <label className={`flex gap-4 p-5 border rounded-xl cursor-pointer transition-all ${formData.consentTreatment ? 'border-[var(--green)] bg-[var(--green-dim)]' : 'border-[var(--border)] hover:border-[var(--green)]/50'}`}>
            <input type="checkbox" name="consentTreatment" checked={formData.consentTreatment} onChange={handleChange} className="hidden" />
            <div>
              <h4 className="text-base font-semibold text-[var(--text)] mb-1">Згода на участь</h4>
              <p className="text-sm text-[var(--muted)]">Погоджуюся брати участь у заходах та тренуваннях.</p>
            </div>
          </label>
          <label className={`flex gap-4 p-5 border rounded-xl cursor-pointer transition-all ${formData.consentPrivacy ? 'border-[var(--green)] bg-[var(--green-dim)]' : 'border-[var(--border)] hover:border-[var(--green)]/50'}`}>
            <input type="checkbox" name="consentPrivacy" checked={formData.consentPrivacy} onChange={handleChange} className="hidden" />
            <div>
              <h4 className="text-base font-semibold text-[var(--text)] mb-1">Обробка даних</h4>
              <p className="text-sm text-[var(--muted)]">Погоджуюся на обробку персональних даних.</p>
            </div>
          </label>
          <label className={`flex gap-4 p-5 border rounded-xl cursor-pointer transition-all ${formData.consentMarketing ? 'border-[var(--green)] bg-[var(--green-dim)]' : 'border-[var(--border)] hover:border-[var(--green)]/50'}`}>
            <input type="checkbox" name="consentMarketing" checked={formData.consentMarketing} onChange={handleChange} className="hidden" />
            <div>
              <h4 className="text-base font-semibold text-[var(--text)] mb-1">Новини</h4>
              <p className="text-sm text-[var(--muted)]">Погоджуюся отримувати новини та пропозиції.</p>
            </div>
          </label>
          {errors.consentTreatment && <p className="field-error">{errors.consentTreatment}</p>}
          {errors.consentPrivacy && <p className="field-error">{errors.consentPrivacy}</p>}
        </div>
      )
    }
    return null
  }

  return (
    <ThemeProvider>
      <PageLayout>
        <WelcomeSection title="Персональна інформація" subtitle="Заповніть профіль для персоналізації" />
        <ProgressBar progress={progress} />
        <Section title={STEPS[currentStep]}>
          <div className="personal-step-content transition-all duration-300">
            {renderStepContent()}
          </div>
        </Section>
        <div className="flex justify-between items-center mt-12 pt-7 border-t border-[var(--border)]">
          <Button variant="ghost" onClick={handlePrevious} disabled={currentStep === 0} icon={<ArrowLeftIcon />}>
            Назад
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={loading} loading={loading} icon={currentStep === STEPS.length - 1 ? <CheckIcon /> : <ArrowRightIcon />}>
            {currentStep === STEPS.length - 1 ? 'Завершити' : 'Далі'}
          </Button>
        </div>
      </PageLayout>
    </ThemeProvider>
  )
}

export default PersonalInformation
