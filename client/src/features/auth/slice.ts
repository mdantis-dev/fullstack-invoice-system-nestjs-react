import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type SimpleUser = { email: string | null }

export type AuthState = {
  token: string | null
  user: SimpleUser
}

export const initialAuthState: AuthState = {
  token: null,
  user: { email: null },
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuthState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ token: string; email: string }>) => {
      state.token = action.payload.token
      state.user.email = action.payload.email
    },
    logout: (state) => {
      state.token = null
      state.user.email = null
    },
  },
})

export const { loginSuccess, logout } = authSlice.actions
export default authSlice.reducer
