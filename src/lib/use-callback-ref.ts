'use client'
import { useCallback, useRef } from 'react'

type AnyFunction = (...args: any[]) => any

export const useCallbackRef = <T extends AnyFunction>(
  callback: T | undefined
) => {
  const ref = useRef(callback)
  ref.current = callback
  return useCallback((...args: Parameters<T>) => ref.current?.(...args), [])
}
