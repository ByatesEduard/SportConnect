import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import { selectUser, selectIsAuthenticated } from '../features/auth/authSlice'
import { setCurrentPost, updateLocalPost } from '../features/data/dataSlice'
import { updateProfile } from '../features/auth/authSlice'

export const useUser = () => {
  const dispatch = useDispatch()
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // User profile actions
  const updateUserProfile = useCallback((profileData) => {
    return dispatch(updateProfile(profileData))
  }, [dispatch])

  // User preferences
  const updateUserPreferences = useCallback((preferences) => {
    // This would typically be stored in a separate userPreferences slice
    console.log('Update user preferences:', preferences)
  }, [])

  // User activity tracking
  const trackUserActivity = useCallback((activity) => {
    console.log('Track user activity:', activity)
  }, [])

  // Get user display name
  const getDisplayName = useCallback(() => {
    if (!user) return 'Guest'
    
    return user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.username || user.email || 'User'
  }, [user])

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role
  }, [user])

  // Check if user has specific permission
  const hasPermission = useCallback((permission) => {
    if (!user || !isAuthenticated) return false
    
    // Define permission logic based on user role
    const permissions = {
      admin: ['admin'],
      coach: ['admin', 'coach'],
      athlete: ['admin', 'coach', 'athlete'],
      beginner: ['admin', 'coach', 'athlete', 'beginner']
    }
    
    return permissions[user.role]?.includes(permission) || false
  }, [user, isAuthenticated])

  // Get user avatar
  const getAvatar = useCallback(() => {
    if (user?.profileImage) {
      return `http://localhost:3001/uploads/${user.profileImage}`
    }
    
    // Return default avatar based on gender or initials
    if (user?.gender) {
      const avatars = {
        male: '/assets/default-male-avatar.png',
        female: '/assets/default-female-avatar.png',
        other: '/assets/default-other-avatar.png'
      }
      return avatars[user.gender]
    }
    
    // Generate initials avatar
    const initials = getDisplayName()
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
    
    return `https://ui-avatars.com/api/?name=${initials}&background=random`
  }, [user])

  // User statistics
  const getUserStats = useCallback(() => {
    if (!user) return null
    
    return {
      postsCount: user.posts?.length || 0,
      joinDate: user.createdAt,
      lastActive: user.lastActive || new Date(),
      experience: user.experience || 0,
      achievements: user.achievements || []
    }
  }, [user])

  // Update user preferences
  const updatePreferences = useCallback((preferences) => {
    if (!user) return
    
    dispatch(updateUserProfile({
      preferences: {
        ...user.preferences,
        ...preferences
      }
    }))
  }, [dispatch, user])

  // Track user activity
  const trackActivity = useCallback((activity) => {
    if (!user) return
    
    dispatch(updateUserProfile({
      lastActive: new Date(),
      activityHistory: [
        ...(user.activityHistory || []),
        {
          type: activity.type,
          timestamp: new Date(),
          data: activity.data
        }
      ]
    }))
  }, [dispatch, user])

  // Format user data for display
  const formatUserData = useCallback(() => {
    if (!user) return null
    
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      displayName: getDisplayName(),
      avatar: getAvatar(),
      role: user.role,
      stats: getUserStats(),
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        birthdate: user.birthdate,
        gender: user.gender,
        address: user.address,
        height: user.height,
        weight: user.weight,
        fitnessGoals: user.fitnessGoals,
        activityLevel: user.activityLevel
      }
    }
  }, [user, getDisplayName, getAvatar, getUserStats])

  return {
    // State
    user,
    isAuthenticated,
    
    // Actions
    updateProfile: updateUserProfile,
    updatePreferences,
    trackActivity,
    
    // Getters
    getDisplayName,
    hasRole,
    hasPermission,
    getAvatar,
    getUserStats,
    formatUserData,
  }
}

export default useUser
