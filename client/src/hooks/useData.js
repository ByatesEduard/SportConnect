import { useSelector, useDispatch } from 'react-redux'
import { useCallback } from 'react'
import {
  setCurrentPost,
  updateLocalPost,
  removePostFromList,
  addComment,
  updateComment,
  removeComment,
  setFilter,
  updateFilters,
  resetFilters,
  setCachedData,
  clearCache
} from '../features/data/dataSlice.js'

export const useData = () => {
  const dispatch = useDispatch()

  const data = useSelector((state) => state.data || {})
  const posts = data.posts?.items || []
  const comments = data.comments?.items || []
  const loading = useSelector((state) => state.post?.isLoading || false)
  const errors = useSelector((state) => state.post?.error || null)

  const filters = data.filters || {
    search: '',
    category: 'all',
    sortBy: 'createdAt'
  }
  const cache = data.cache || {}

  // ВИПРАВЛЕНО: у залежностях використовуємо posts (масив), а не posts.items (undefined).
  // Раніше [posts.items, filters] — posts вже є масивом після ?.items || [],
  // тому posts.items завжди undefined, і useCallback не оновлювався при зміні постів.
  const getFilteredPosts = useCallback(() => {
    let filteredPosts = [...posts]

    if (filters.search) {
      filteredPosts = filteredPosts.filter(post =>
        post.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        post.text.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.category !== 'all') {
      filteredPosts = filteredPosts.filter(post => post.category === filters.category)
    }

    filteredPosts.sort((a, b) => {
      const aValue = a[filters.sortBy]
      const bValue = b[filters.sortBy]

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    return filteredPosts
  }, [posts, filters]) // ВИПРАВЛЕНО: posts замість posts.items

  const getPaginatedPosts = useCallback((page = 1, limit = 10) => {
    const filtered = getFilteredPosts()
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return {
      posts: filtered.slice(startIndex, endIndex),
      currentPage: page,
      totalPages: Math.ceil(filtered.length / limit),
      hasNext: endIndex < filtered.length,
      hasPrevious: page > 1
    }
  }, [getFilteredPosts])

  const searchPosts = useCallback((query) => {
    dispatch(setFilter({ filter: 'search', value: query }))
  }, [dispatch])

  const sortPosts = useCallback((sortBy, sortOrder = 'desc') => {
    dispatch(updateFilters({ sortBy, sortOrder }))
  }, [dispatch])

  const filterByCategory = useCallback((category) => {
    dispatch(setFilter({ filter: 'category', value: category }))
  }, [dispatch])

  const clearFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  const addCommentToPost = useCallback((postId, comment) => {
    dispatch(addComment({ postId, ...comment }))
  }, [dispatch])

  const updateCommentById = useCallback((commentId, updates) => {
    dispatch(updateComment({ id: commentId, data: updates }))
  }, [dispatch])

  const deleteCommentById = useCallback((commentId) => {
    dispatch(removeComment(commentId))
  }, [dispatch])

  const getCachedData = useCallback((key) => {
    return cache[key]
  }, [cache])

  const cacheData = useCallback((key, data) => {
    dispatch(setCachedData({ key, data }))
  }, [dispatch])

  const clearDataCache = useCallback((key) => {
    if (key) {
      dispatch(setCachedData({ key, data: null }))
    } else {
      dispatch(clearCache())
    }
  }, [dispatch])

  const isLoading = useCallback(() => {
    return loading || false
  }, [loading])

  const getError = useCallback(() => {
    return errors || null
  }, [errors])

  const clearDataError = useCallback(() => {
    // dispatch action to clear errors if needed
  }, [dispatch])

  const getDataStats = useCallback(() => {
    return {
      totalPosts: posts.length,
      totalComments: comments.length,
      cachedItems: Object.keys(cache).length,
      filteredPosts: getFilteredPosts().length
    }
  }, [posts, comments, cache, getFilteredPosts])

  return {
    // State
    posts,
    comments,
    filters,
    cache,

    // Posts methods
    getFilteredPosts,
    getPaginatedPosts,
    searchPosts,
    sortPosts,
    filterByCategory,
    clearFilters,

    // Comments methods
    addCommentToPost,
    updateCommentById,
    deleteCommentById,

    // Cache methods
    getCachedData,
    cacheData,
    clearDataCache,

    // Helpers
    isLoading,
    getError,
    clearDataError,
    getDataStats,
  }
}

export default useData
