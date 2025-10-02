import { useState } from 'react'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAppDispatch } from '../../app/store'
import { loginSuccess } from './slice'
import { isAxiosError } from 'axios'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginResponse = { accessToken: string }
type ApiErrorBody = { message?: string }

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [apiError, setApiError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError(null)

    const parsed = schema.safeParse({ email, password })
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      parsed.error.issues.forEach((i) => {
        const key = String(i.path[0] ?? '')
        fieldErrors[key] = i.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setPending(true)
    try {
      const res = await api.post<LoginResponse>('/auth/login', { email, password })
      const token = res.data?.accessToken
      if (!token) throw new Error('No token returned')
      dispatch(loginSuccess({ token, email }))
      navigate('/home')
    } catch (err: unknown) {
      if (isAxiosError<ApiErrorBody>(err)) {
        setApiError(err.response?.data?.message ?? 'Authentication failed')
      } else if (err instanceof Error) {
        setApiError(err.message)
      } else {
        setApiError('Authentication failed')
      }
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="card max-w-md w-full p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Sign in</h1>
        {apiError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {apiError}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">Email</label>
            <input
              id="email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <input
              id="password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>
          <button type="submit" className="btn-primary w-full mt-4" disabled={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
