import { useState, useCallback } from 'react'

export const useValidation = (initialValues = {}) => {
  const [errors, setErrors] = useState({})

  const validateField = useCallback((name, value, rules) => {
    const fieldErrors = []

    if (rules.required && (!value || value.toString().trim() === '')) {
      fieldErrors.push(`${name} є обов'язковим полем`)
    }

    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`${name} має містити мінімум ${rules.minLength} символів`)
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`${name} має містити максимум ${rules.maxLength} символів`)
    }

    if (rules.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        fieldErrors.push('Невірний формат email')
      }
    }

    if (rules.phone && value) {
      const phoneRegex = /^\+?[0-9]{10,15}$/
      if (!phoneRegex.test(value.replace(/\s/g, ''))) {
        fieldErrors.push('Невірний формат телефону')
      }
    }

    if (rules.min && value && Number(value) < rules.min) {
      fieldErrors.push(`${name} має бути більше ${rules.min}`)
    }

    if (rules.max && value && Number(value) > rules.max) {
      fieldErrors.push(`${name} має бути менше ${rules.max}`)
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      fieldErrors.push(rules.message || 'Невірний формат')
    }

    return fieldErrors
  }, [])

  const validateForm = useCallback((data, validationRules) => {
    const newErrors = {}

    Object.keys(validationRules).forEach(field => {
      const value = data[field]
      const rules = validationRules[field]
      const fieldErrors = validateField(field, value, rules)
      
      if (fieldErrors.length > 0) {
        newErrors[field] = fieldErrors[0] // Take first error
      }
    })

    setErrors(newErrors)
    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors
    }
  }, [validateField])

  const clearError = useCallback((fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldName]
      return newErrors
    })
  }, [])

  const clearAllErrors = useCallback(() => {
    setErrors({})
  }, [])

  return {
    errors,
    validateForm,
    validateField,
    clearError,
    clearAllErrors
  }
}

export default useValidation
