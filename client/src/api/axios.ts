import axios, {
  AxiosHeaders,
  isAxiosError,
} from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { store } from '../app/store'
import type { RootState } from '../app/store'
import { logout } from '../features/auth/slice'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const state = store.getState() as RootState
  let token = state.auth.token

  if (!token) {
    try {
      const raw = localStorage.getItem('auth')
      token = raw ? (JSON.parse(raw).token as string | null) : null
    } catch {
      token = null
    }
  }

  if (token) {
    // Ensure headers is an AxiosHeaders instance, then set Authorization
    if (!config.headers) {
      config.headers = new AxiosHeaders()
    } else if (!(config.headers instanceof AxiosHeaders)) {
      config.headers = new AxiosHeaders(config.headers)
    }
    ;(config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
  }

  return config
})

api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401) {
      store.dispatch(logout())
    }
    return Promise.reject(error)
  }
)

export default api
