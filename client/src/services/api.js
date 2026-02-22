import axios from '../utils/axios'

// Auth API
export const authAPI = {
  login: (credentials) => axios.post('/auth/login', credentials),
  register: (userData) => axios.post('/auth/register', userData),
  getMe: () => axios.get('/auth/me'),
  updateRole: (role) => axios.put('/auth/role', { role }),
  updatePersonalInfo: (personalInfo) => axios.put('/auth/personal-info', personalInfo),
  logout: () => axios.post('/auth/logout'),
}

// Posts API
export const postsAPI = {
  getAll: (params) => axios.get('/posts', { params }),
  getById: (id) => axios.get(`/posts/${id}`),
  create: (postData) => axios.post('/posts', postData),
  update: (id, postData) => axios.put(`/posts/${id}`, postData),
  delete: (id) => axios.delete(`/posts/${id}`),
  getMyPosts: () => axios.get('/posts/user/me'),
}

// Comments API
export const commentsAPI = {
  getByPostId: (postId) => axios.get(`/comments/post/${postId}`),
  create: (commentData) => axios.post('/comments', commentData),
  update: (id, commentData) => axios.put(`/comments/${id}`, commentData),
  delete: (id) => axios.delete(`/comments/${id}`),
}

// Events API (for future features)
export const eventsAPI = {
  getAll: (params) => axios.get('/events', { params }),
  getById: (id) => axios.get(`/events/${id}`),
  create: (eventData) => axios.post('/events', eventData),
  register: (eventId) => axios.post(`/events/${eventId}/register`),
}

// Users API
export const usersAPI = {
  getProfile: () => axios.get('/users/profile'),
  updateProfile: (profileData) => axios.put('/users/profile', profileData),
  uploadAvatar: (file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return axios.post('/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
}

export default {
  auth: authAPI,
  posts: postsAPI,
  comments: commentsAPI,
  events: eventsAPI,
  users: usersAPI,
}
