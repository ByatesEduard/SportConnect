import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

const initialState = {
  user: null,
  token: null,
  role: null,
  personalInfo: null,
  isLoading: false,
  status: null,
  error: null,
  isAuthenticated: false,
  registrationStep: 'complete', // 'complete' | 'role' | 'personal'
}

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password, telephone }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/register', {
        username,
        email,
        password,
        telephone,
      })
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      return { ...data, registrationStep: 'role' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  },
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/login', {
        email,
        password,
      })
      if (data.token) {
        localStorage.setItem('token', data.token)
      }
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  },
)

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/auth/me')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed')
    }
  },
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        return rejectWithValue(errorData.message || 'Profile update failed')
      }
      
      const data = await response.json()
      return data
    } catch (error) {
      return rejectWithValue(error.message || 'Profile update failed')
    }
  }
)

// Update user role
export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async (role, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/auth/role', { role })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role')
    }
  },
)

// Update personal information
export const updatePersonalInfo = createAsyncThunk(
  'auth/updatePersonalInfo',
  async (personalInfo, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/auth/personal-info', personalInfo)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update personal info')
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.role = null
      state.personalInfo = null
      state.isLoading = false
      state.status = null
      state.error = null
      state.isAuthenticated = false
      state.registrationStep = 'complete'
      localStorage.removeItem('token')
    },
    clearStatus: (state) => {
      state.status = null
      state.error = null
    },
    setToken: (state, action) => {
      const token = action.payload
      state.token = token
      state.isAuthenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      }
    },
    setUser: (state, action) => {
      state.user = action.payload
    },
    setRole: (state, action) => {
      state.role = action.payload
    },
    setPersonalInfo: (state, action) => {
      state.personalInfo = action.payload
    },
    setRegistrationStep: (state, action) => {
      state.registrationStep = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.status = action.payload.message
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Login user
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.status = action.payload.message
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload?.user
        state.token = action.payload?.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
        state.token = null
        state.user = null
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.status = action.payload.message
        state.user = action.payload.user
        state.error = null
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update Role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false
        state.role = action.payload.role
        state.registrationStep = 'personal'
        state.error = null
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Update Personal Info
      .addCase(updatePersonalInfo.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePersonalInfo.fulfilled, (state, action) => {
        state.isLoading = false
        state.personalInfo = action.payload.personalInfo
        state.registrationStep = 'complete'
        state.error = null
      })
      .addCase(updatePersonalInfo.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

// Selectors
export const selectAuth = (state) => state.auth
export const selectUser = (state) => state.auth.user
export const selectToken = (state) => state.auth.token
export const selectRole = (state) => state.auth.role
export const selectPersonalInfo = (state) => state.auth.personalInfo
export const selectRegistrationStep = (state) => state.auth.registrationStep
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading = (state) => state.auth.isLoading
export const selectAuthError = (state) => state.auth.error

export const checkIsAuth = (state) => Boolean(state.auth.token)

export const { 
  logout, 
  clearStatus, 
  setToken, 
  setUser, 
  setRole,
  setPersonalInfo,
  setRegistrationStep,
  setLoading 
} = authSlice.actions
export default authSlice.reducer
