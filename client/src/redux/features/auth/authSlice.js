import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../../utils/axios'

const initialState = {
  user: null,
  token: null,
  role: null,
  personalInfo: null,
  isLoading: false,
  status: null,
  error: null,
  isAuthenticated: false,
  registrationStep: 'complete',
}

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/register', {
        username,
        email,
        password,
      })
      return { ...data, registrationStep: 'role' }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/auth/login', { username, password })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/auth/me')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user data')
    }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/auth/profile', profileData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Profile update failed')
    }
  }
)

export const updateUserRole = createAsyncThunk(
  'auth/updateUserRole',
  async (role, { rejectWithValue }) => {
    try {
      const { data } = await axios.put('/auth/role', { role })
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update role')
    }
  }
)

export const updatePersonalInfo = createAsyncThunk(
  'auth/updatePersonalInfo',
  async (personalInfo, { rejectWithValue }) => {
    try {
      const res = await axios.put('/auth/personal-info', personalInfo)
      const data = res.data || {}
      if (res.status >= 400 || !data.personalInfo) {
        return rejectWithValue(data.message || 'Помилка збереження даних')
      }
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Помилка збереження даних')
    }
  }
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
    },
    clearStatus: (state) => {
      state.status = null
      state.error = null
    },
    setToken: (state, action) => {
      state.token = action.payload
      state.isAuthenticated = !!action.payload
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
    hydrateFromParams: (state, action) => {
      const { role, step } = action.payload
      if (role !== undefined) state.role = role
      if (step !== undefined) state.registrationStep = step
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.status = action.payload.message
        state.user = action.payload.user ?? action.payload.newUser
        state.token = action.payload.token
        state.isAuthenticated = !!action.payload.token
        state.registrationStep = action.payload.registrationStep || 'role'
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.status = action.payload.message
        state.user = action.payload.user
        state.token = action.payload.token
        state.role = action.payload.user?.role || state.role
        state.isAuthenticated = !!action.payload.token
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      .addCase(getMe.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload?.user
        state.token = action.payload?.token
        state.role = action.payload?.role
        state.personalInfo = action.payload?.personalInfo
        state.isAuthenticated = !!action.payload?.token
        state.error = null
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.token = null
        state.user = null
        state.role = null
        state.personalInfo = null
      })

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
  setLoading,
  hydrateFromParams,
} = authSlice.actions

export default authSlice.reducer
