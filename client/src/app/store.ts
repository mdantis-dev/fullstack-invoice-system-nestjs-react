import { configureStore } from '@reduxjs/toolkit'
import authReducer, { initialAuthState } from '../features/auth/slice'
import type { AuthState } from '../features/auth/slice'
import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'

const STORAGE_KEY = 'auth'

function loadAuthFromStorage(): AuthState | undefined {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return undefined
    return JSON.parse(raw) as AuthState
  } catch {
    return undefined
  }
}

const preloadedAuth: AuthState = loadAuthFromStorage() ?? initialAuthState

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: {
    auth: preloadedAuth, // <-- always AuthState, not undefined
  },
})

// Persist auth to localStorage
store.subscribe(() => {
  try {
    const state = store.getState()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.auth))
  } catch {
    // ignore storage errors
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
