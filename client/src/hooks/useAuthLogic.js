import { useState, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  selectUser,
  selectToken,
  selectIsAuthenticated,
  selectAuthLoading,
  loginUser,
  registerUser,
  logout,
  getMe,
  // ВИПРАВЛЕНО: перейменовуємо імпорт щоб уникнути конфлікту з локальною функцією
  updateProfile as updateProfileAction,
  updateUserRole,
  updatePersonalInfo
} from '../redux/features/auth/authSlice'

export const useAuthLogic = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const token = useSelector(selectToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    if (savedToken && !token && !isLoading) {
      dispatch({ type: 'auth/setToken', payload: savedToken })
      dispatch(getMe())
    }
  }, [dispatch, token, isLoading])

  // Login user
  const login = useCallback(async (credentials) => {
    try {
      const result = await dispatch(loginUser(credentials)).unwrap()
      return result
    } catch (error) {
      toast.error(error.message || 'Помилка входу')
      throw error
    }
  }, [dispatch])

  // Register user
  const register = useCallback(async (userData) => {
    try {
      const result = await dispatch(registerUser(userData)).unwrap()
      return result
    } catch (error) {
      toast.error(error.message || 'Помилка реєстрації')
      throw error
    }
  }, [dispatch])

  // Logout user
  const logoutUser = useCallback(() => {
    dispatch(logout())
    localStorage.removeItem('token')
    toast.success('Ви вийшли з системи')
  }, [dispatch])

  // Get current user data
  const getCurrentUser = useCallback(() => {
    dispatch(getMe())
  }, [dispatch])

  // ВИПРАВЛЕНО: використовуємо перейменований імпорт updateProfileAction
  // Раніше локальна const updateProfile перекривала імпорт з однаковим ім'ям,
  // через що dispatch(updateProfile(...)) викликав dispatch(undefined) — помилка в рантаймі
  const updateProfile = useCallback(async (profileData) => {
    try {
      const result = await dispatch(updateProfileAction(profileData)).unwrap()
      return result
    } catch (error) {
      toast.error(error.message || 'Помилка оновлення профілю')
      throw error
    }
  }, [dispatch])

  // Update user role
  const updateUserRoleAction = useCallback(async (role) => {
    try {
      const result = await dispatch(updateUserRole(role)).unwrap()
      return result
    } catch (error) {
      toast.error(error.message || 'Помилка оновлення ролі')
      throw error
    }
  }, [dispatch])

  // Update personal information
  const updatePersonalInfoAction = useCallback(async (personalInfo) => {
    try {
      const result = await dispatch(updatePersonalInfo(personalInfo)).unwrap()
      return result
    } catch (error) {
      toast.error(error.message || 'Помилка оновлення персональної інформації')
      throw error
    }
  }, [dispatch])

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,

    // Actions
    login,
    register,
    logout: logoutUser,
    getCurrentUser,
    updateProfile,
    updateUserRole: updateUserRoleAction,
    updatePersonalInfo: updatePersonalInfoAction,

    // Helpers
    dispatch
  }
}

export default useAuthLogic
