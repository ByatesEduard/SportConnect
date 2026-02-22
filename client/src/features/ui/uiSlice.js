import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Loading states
  loading: {
    auth: false,
    posts: false,
    profile: false,
    comments: false,
  },
  
  // Error states
  errors: {
    auth: null,
    posts: null,
    profile: null,
    comments: null,
  },
  
  // UI states
  sidebar: {
    isOpen: false,
  },
  
  // Form states
  forms: {
    register: {
      username: '',
      email: '',
      password: '',
      telephone: '',
    },
    login: {
      email: '',
      password: '',
    },
    profile: {
      firstName: '',
      lastName: '',
      birthdate: '',
      gender: '',
      address: '',
      height: '',
      weight: '',
      fitnessGoals: '',
      activityLevel: '',
    },
  },
  
  // Notifications
  notifications: [],
  
  // Modal states
  modals: {
    confirmDelete: false,
    editProfile: false,
    imageUpload: false,
  },
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Loading actions
    setLoading: (state, action) => {
      const { type, isLoading } = action.payload
      state.loading[type] = isLoading
    },
    
    // Error actions
    setError: (state, action) => {
      const { type, error } = action.payload
      state.errors[type] = error
    },
    
    clearError: (state, action) => {
      const { type } = action.payload
      state.errors[type] = null
    },
    
    clearAllErrors: (state) => {
      state.errors = initialState.errors
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.isOpen = !state.sidebar.isOpen
    },
    
    setSidebarOpen: (state, action) => {
      state.sidebar.isOpen = action.payload
    },
    
    // Form actions
    setFormField: (state, action) => {
      const { form, field, value } = action.payload
      if (state.forms[form]) {
        state.forms[form][field] = value
      }
    },
    
    updateForm: (state, action) => {
      const { form, data } = action.payload
      if (state.forms[form]) {
        state.forms[form] = { ...state.forms[form], ...data }
      }
    },
    
    resetForm: (state, action) => {
      const { form } = action.payload
      if (state.forms[form]) {
        state.forms[form] = initialState.forms[form]
      }
    },
    
    resetAllForms: (state) => {
      state.forms = initialState.forms
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now(),
        ...action.payload,
      }
      state.notifications.push(notification)
    },
    
    removeNotification: (state, action) => {
      const id = action.payload
      state.notifications = state.notifications.filter(n => n.id !== id)
    },
    
    clearNotifications: (state) => {
      state.notifications = []
    },
    
    // Modal actions
    openModal: (state, action) => {
      const { modal } = action.payload
      state.modals[modal] = true
    },
    
    closeModal: (state, action) => {
      const { modal } = action.payload
      state.modals[modal] = false
    },
    
    closeAllModals: (state) => {
      state.modals = initialState.modals
    },
  },
})

export const {
  setLoading,
  setError,
  clearError,
  clearAllErrors,
  toggleSidebar,
  setSidebarOpen,
  setFormField,
  updateForm,
  resetForm,
  resetAllForms,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
} = uiSlice.actions

export default uiSlice.reducer
