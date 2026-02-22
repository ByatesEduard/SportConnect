import { useState, useCallback } from 'react'
import { toast } from 'react-toastify'

// ВИПРАВЛЕНО: невалідний regex для email замінено на коректний
const VALIDATION_RULES = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Невірний формат email'
  },
  password: {
    required: true,
    minLength: 6,
    message: 'Пароль має містити мінімум 6 символів'
  },
  username: {
    required: true,
    minLength: 3,
    message: "Ім'я користувача має містити мінімум 3 символи"
  },
  telephone: {
    required: true,
    pattern: /^\+?[0-9]{10,15}$/,
    message: 'Невірний формат телефону'
  }
}

// Form validation function
export const validateForm = (data, rules = {}) => {
  const errors = {}

  Object.keys(rules).forEach(field => {
    const value = data[field]
    const rule = rules[field]

    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${field} є обов'язковим полем`
      return
    }

    if (value && rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.message || `${field} має містити мінімум ${rule.minLength} символів`
      return
    }

    if (value && rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.message
    }
  })

  return errors
}

// Generic form hook
export const useFormLogic = (initialValues = {}, validationRules = {}) => {
  const [formData, setFormData] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }))

    // Clear error when user starts typing
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }, [touched])

  const handleBlur = useCallback((e) => {
    const { name } = e.target
    setTouched(prev => ({
      ...prev,
      [name]: true
    }))

    const fieldErrors = validateForm(
      { [name]: formData[name] },
      { [name]: validationRules[name] }
    )
    setErrors(prev => ({
      ...prev,
      ...fieldErrors
    }))
  }, [formData, validationRules])

  const validateAll = useCallback(() => {
    const allErrors = validateForm(formData, validationRules)
    setErrors(allErrors)
    return Object.keys(allErrors).length === 0
  }, [formData, validationRules])

  const resetForm = useCallback(() => {
    setFormData(initialValues)
    setErrors({})
    setTouched({})
  }, [initialValues])

  const setFieldValue = useCallback((name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }, [])

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    setLoading,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
    setFieldValue,
    isValid: Object.keys(validateForm(formData, validationRules)).length === 0
  }
}

// Auth form hook with validation
export const useAuthForm = (initialValues = {}, onSubmit) => {
  const {
    formData, setFormData, errors, setErrors,
    loading, setLoading, handleChange, handleBlur,
    validateAll, resetForm
  } = useFormLogic(initialValues, {
    email: VALIDATION_RULES.email,
    password: VALIDATION_RULES.password,
    username: VALIDATION_RULES.username,
    telephone: VALIDATION_RULES.telephone
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateAll()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
      resetForm()
    } catch (error) {
      toast.error(error.message || 'Помилка при відправці форми')
    } finally {
      setLoading(false)
    }
  }

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    loading,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    isValid: Object.keys(validateForm(formData, VALIDATION_RULES)).length === 0
  }
}

// Registration form specific
export const useRegistrationForm = () => {
  return useAuthForm(
    { username: '', email: '', password: '', telephone: '' },
    async (formData) => {
      console.log('Registration data:', formData)
    }
  )
}

// Login form specific
export const useLoginForm = () => {
  return useAuthForm(
    { email: '', password: '' },
    async (formData) => {
      console.log('Login data:', formData)
    }
  )
}

export default useFormLogic
