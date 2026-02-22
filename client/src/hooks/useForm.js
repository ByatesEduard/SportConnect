import { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setFormField, updateForm, resetForm } from '../features/ui/uiSlice'

export const useForm = (formName, initialValues = {}) => {
  const dispatch = useDispatch()
  const { forms } = useSelector((state) => state.ui)
  const formState = forms[formName] || {}

  // Initialize form with initial values if empty
  useEffect(() => {
    if (Object.keys(formState).length === 0) {
      dispatch(updateForm({ form: formName, data: initialValues }))
    }
  }, [formName, initialValues, dispatch])

  // Handle field changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    
    let fieldValue = value
    if (type === 'checkbox') {
      fieldValue = checked
    } else if (type === 'number') {
      fieldValue = Number(value)
    }

    dispatch(setFormField({ 
      form: formName, 
      field: name, 
      value: fieldValue 
    }))
  }, [dispatch])

  // Handle multiple field changes
  const updateFields = useCallback((data) => {
    dispatch(updateForm({ form: formName, data }))
  }, [dispatch])

  // Reset form
  const reset = useCallback(() => {
    dispatch(resetForm({ form: formName }))
  }, [dispatch])

  // Get field value
  const getFieldValue = useCallback((fieldName) => {
    return formState[fieldName] || ''
  }, [formState])

  // Get all form values
  const getFormValues = useCallback(() => {
    return formState
  }, [formState])

  // Validate form
  const validateForm = useCallback((validationRules) => {
    const errors = {}
    
    Object.keys(validationRules).forEach(field => {
      const value = formState[field]
      const rules = validationRules[field]
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} is required`
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        errors[field] = `${field} must be at least ${rules.minLength} characters`
      }
      
      if (rules.email && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) {
          errors[field] = 'Invalid email format'
        }
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }, [formState])

  return {
    // State
    formState,
    values: formState,
    
    // Actions
    handleChange,
    updateFields,
    reset,
    
    // Helpers
    getFieldValue,
    getFormValues,
    validateForm,
  }
}

export default useForm
