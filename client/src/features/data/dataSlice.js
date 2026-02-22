import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../../utils/axios'

// Async thunks for data fetching
export const fetchPosts = createAsyncThunk(
  'data/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get('/posts')
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts')
    }
  }
)

export const fetchPost = createAsyncThunk(
  'data/fetchPost',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/posts/${id}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch post')
    }
  }
)

export const createPost = createAsyncThunk(
  'data/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('/posts', postData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post')
    }
  }
)

export const updatePost = createAsyncThunk(
  'data/updatePost',
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/posts/${id}`, postData)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update post')
    }
  }
)

export const deletePost = createAsyncThunk(
  'data/deletePost',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/posts/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete post')
    }
  }
)

export const fetchComments = createAsyncThunk(
  'data/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/comments/${postId}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments')
    }
  }
)

const initialState = {
  // Posts data
  posts: {
    items: [],
    currentPost: null,
    loading: false,
    error: null,
  },
  
  // Comments data
  comments: {
    items: [],
    loading: false,
    error: null,
  },
  
  // Filters and pagination
  filters: {
    search: '',
    category: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10,
  },
  
  // Cache
  cache: {
    posts: {},
    comments: {},
  },
}

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Filter actions
    setFilter: (state, action) => {
      const { filter, value } = action.payload
      state.filters[filter] = value
    },
    
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
    
    // Cache actions
    setCachedData: (state, action) => {
      const { key, data } = action.payload
      state.cache[key] = data
    },
    
    clearCache: (state) => {
      state.cache = initialState.cache
    },
    
    // Local data actions
    setCurrentPost: (state, action) => {
      state.posts.currentPost = action.payload
    },
    
    updateLocalPost: (state, action) => {
      const { id, data } = action.payload
      const index = state.posts.items.findIndex(post => post._id === id)
      if (index !== -1) {
        state.posts.items[index] = { ...state.posts.items[index], ...data }
      }
    },
    
    removePostFromList: (state, action) => {
      const id = action.payload
      state.posts.items = state.posts.items.filter(post => post._id !== id)
    },
    
    // Comments actions
    addComment: (state, action) => {
      state.comments.items.push(action.payload)
    },
    
    updateComment: (state, action) => {
      const { id, data } = action.payload
      const index = state.comments.items.findIndex(comment => comment._id === id)
      if (index !== -1) {
        state.comments.items[index] = { ...state.comments.items[index], ...data }
      }
    },
    
    removeComment: (state, action) => {
      const id = action.payload
      state.comments.items = state.comments.items.filter(comment => comment._id !== id)
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.posts.loading = true
        state.posts.error = null
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts.loading = false
        state.posts.items = action.payload
        state.posts.error = null
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.posts.loading = false
        state.posts.error = action.payload
      })
      
      // Fetch single post
      .addCase(fetchPost.pending, (state) => {
        state.posts.loading = true
        state.posts.error = null
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.posts.loading = false
        state.posts.currentPost = action.payload
        state.posts.error = null
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.posts.loading = false
        state.posts.error = action.payload
      })
      
      // Create post
      .addCase(createPost.pending, (state) => {
        state.posts.loading = true
        state.posts.error = null
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.loading = false
        state.posts.items.unshift(action.payload)
        state.posts.error = null
      })
      .addCase(createPost.rejected, (state, action) => {
        state.posts.loading = false
        state.posts.error = action.payload
      })
      
      // Update post
      .addCase(updatePost.pending, (state) => {
        state.posts.loading = true
        state.posts.error = null
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.posts.loading = false
        const index = state.posts.items.findIndex(post => post._id === action.payload._id)
        if (index !== -1) {
          state.posts.items[index] = action.payload
        }
        state.posts.error = null
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.posts.loading = false
        state.posts.error = action.payload
      })
      
      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.posts.loading = true
        state.posts.error = null
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts.loading = false
        state.posts.items = state.posts.items.filter(post => post._id !== action.payload)
        state.posts.error = null
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.posts.loading = false
        state.posts.error = action.payload
      })
      
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.comments.loading = true
        state.comments.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments.loading = false
        state.comments.items = action.payload
        state.comments.error = null
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.comments.loading = false
        state.comments.error = action.payload
      })
  },
})

export const {
  setFilter,
  updateFilters,
  resetFilters,
  setCachedData,
  clearCache,
  setCurrentPost,
  updateLocalPost,
  removePostFromList,
  addComment,
  updateComment,
  removeComment,
} = dataSlice.actions

// Selector for data state
export const selectData = (state) => state.data

export default dataSlice.reducer
