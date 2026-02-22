import { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setLoading, setError, clearError, setCachedData } from '../features/ui/uiSlice'
import { fetchPosts, fetchPost, createPost, updatePost, deletePost, fetchComments } from '../features/data/dataSlice'
import axios from '../utils/axios'

export const useFetch = () => {
  const dispatch = useDispatch()
  const { loading, errors, cache } = useSelector((state) => state.ui)

  // Generic fetch function
  const executeFetch = useCallback(async (fetchFunction, ...args) => {
    try {
      dispatch(setLoading({ type: fetchFunction.name.replace('fetch', '').toLowerCase(), isLoading: true }))
      dispatch(clearError({ type: fetchFunction.name.replace('fetch', '').toLowerCase() }))
      
      const result = await dispatch(fetchFunction(...args)).unwrap()
      
      dispatch(setLoading({ type: fetchFunction.name.replace('fetch', '').toLowerCase(), isLoading: false }))
      return { data: result, error: null }
    } catch (error) {
      dispatch(setLoading({ type: fetchFunction.name.replace('fetch', '').toLowerCase(), isLoading: false }))
      dispatch(setError({ type: fetchFunction.name.replace('fetch', '').toLowerCase(), error: error.message || 'Request failed' }))
      return { data: null, error }
    }
  }, [dispatch])

  // Posts API
  const fetchAllPosts = useCallback(() => {
    return executeFetch(fetchPosts)
  }, [executeFetch])

  const getPostById = useCallback((id) => {
    return executeFetch(fetchPost, id)
  }, [executeFetch])

  const createNewPost = useCallback((postData) => {
    return executeFetch(createPost, postData)
  }, [executeFetch])

  const updatePostById = useCallback((id, postData) => {
    return executeFetch(updatePost, { id, postData })
  }, [executeFetch])

  const deletePostById = useCallback((id) => {
    return executeFetch(deletePost, id)
  }, [executeFetch])

  // Comments API
  const getCommentsByPostId = useCallback((postId) => {
    return executeFetch(fetchComments, postId)
  }, [executeFetch])

  // Custom fetch with caching
  const fetchWithCache = useCallback(async (key, fetchFunction, ...args) => {
    // Check cache first
    if (cache[key]) {
      return { data: cache[key], error: null, fromCache: true }
    }

    try {
      dispatch(setLoading({ type: 'data', isLoading: true }))
      const result = await dispatch(fetchFunction(...args)).unwrap()
      
      // Cache the result
      dispatch(setCachedData({ key, data: result }))
      dispatch(setLoading({ type: 'data', isLoading: false }))
      
      return { data: result, error: null, fromCache: false }
    } catch (error) {
      dispatch(setLoading({ type: 'data', isLoading: false }))
      dispatch(setError({ type: 'data', error: error.message || 'Request failed' }))
      return { data: null, error, fromCache: false }
    }
  }, [dispatch, cache])

  // Clear cache
  const clearCache = useCallback((key) => {
    dispatch(setCachedData({ key, data: null }))
  }, [dispatch])

  // Retry mechanism
  const retryFetch = useCallback(async (fetchFunction, maxRetries = 3, delay = 1000, ...args) => {
    let lastError = null
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await dispatch(fetchFunction(...args)).unwrap()
        return { data: result, error: null }
      } catch (error) {
        lastError = error
        
        if (i < maxRetries - 1) {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }
    
    return { data: null, error: lastError }
  }, [dispatch])

  return {
    // State
    loading,
    errors,
    
    // Posts methods
    fetchAllPosts,
    getPostById,
    createNewPost,
    updatePostById,
    deletePostById,
    
    // Comments methods
    getCommentsByPostId,
    
    // Generic methods
    executeFetch,
    fetchWithCache,
    clearCache,
    retryFetch,
  }
}

export default useFetch
