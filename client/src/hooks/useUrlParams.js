import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

/**
 * Sync a single param to URL. Returns [value, setValue].
 * setValue updates URL without adding to history (replace).
 */
export function useUrlParam(name, defaultValue = '') {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = searchParams.get(name) ?? defaultValue

  const setValue = useCallback(
    (newVal) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (newVal === undefined || newVal === '' || newVal === null) {
            next.delete(name)
          } else {
            next.set(name, String(newVal))
          }
          return next
        },
        { replace: true }
      )
    },
    [name, setSearchParams]
  )

  return [value, setValue]
}

/**
 * Read number from URL param (e.g. pstep).
 */
export function useUrlParamNumber(name, defaultValue = 0) {
  const [str, setStr] = useUrlParam(name, String(defaultValue))
  const num = parseInt(str, 10)
  const value = isNaN(num) ? defaultValue : num
  const setValue = useCallback(
    (n) => setStr(String(n)),
    [setStr]
  )
  return [value, setValue]
}
