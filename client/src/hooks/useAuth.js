import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { 
  selectAuth, 
  selectUser, 
  selectToken, 
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  loginUser,
  registerUser,
  logout,
  clearStatus,
  getMe,
  updateProfile
} from '../features/auth/authSlice'
import { setFormField, resetForm } from '../features/ui/uiSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const token = useSelector(selectToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isLoading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  // Authentication actions
  const handleLogin = useCallback((credentials) => {
    return dispatch(loginUser(credentials))
  }, [dispatch])

  const handleRegister = useCallback((userData) => {
    return dispatch(registerUser(userData))
  }, [dispatch])

  const handleLogout = useCallback(() => {
    dispatch(logout())
    dispatch(resetForm({ form: 'login' }))
    dispatch(resetForm({ form: 'register' }))
  }, [dispatch])

  const handleGetMe = useCallback(() => {
    return dispatch(getMe())
  }, [dispatch])

  const handleUpdateProfile = useCallback((profileData) => {
    return dispatch(updateProfile(profileData))
  }, [dispatch])

  const clearAuthStatus = useCallback(() => {
    dispatch(clearStatus())
  }, [dispatch])

  // Form field actions
  const setAuthFormField = useCallback((form, field, value) => {
    dispatch(setFormField({ form, field, value }))
  }, [dispatch])

  const resetAuthForm = useCallback((form) => {
    dispatch(resetForm({ form }))
  }, [dispatch])

  return {
    // State
    auth,
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    getMe: handleGetMe,
    updateProfile: handleUpdateProfile,
    clearStatus: clearAuthStatus,
    
    // Form helpers
    setFormField: setAuthFormField,
    resetForm: resetAuthForm,
  }
}

export default useAuth
