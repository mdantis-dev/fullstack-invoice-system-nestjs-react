import { NavLink, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/store'
import { logout } from '../features/auth/slice'
import { Menu, Search, Bell, Settings, Moon, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export default function ProtectedRoute() {
  // allow fallback to persisted localStorage token if redux not hydrated yet
  const persisted = (() => {
    try { return JSON.parse(localStorage.getItem('auth') || 'null') } catch { return null }
  })()
  const token = useAppSelector((s) => s.auth.token) ?? persisted?.token
  const location = useLocation()

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="flex min-h-screen flex-col">
        <Topbar />
        <main className="container-p py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Sidebar() {
  const linkBase = 'block pl-4 py-2 text-sm transition border-l-2';
  const active = 'border-indigo-500 text-gray-900 font-semibold';
  const inactive = 'border-transparent text-gray-700 hover:text-gray-900 hover:border-indigo-300';

  return (
    <aside className="sidebar">
      <div>
        <div className="logo">LOGO</div>

        <nav className="mt-6 space-y-1">
          <NavLink to="/home" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            Home
          </NavLink>
          <NavLink to="/invoices" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            Invoices
          </NavLink>
          <NavLink to="/bills" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            Bills
          </NavLink>
          <NavLink to="/expenses" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            Expenses
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}>
            Reports
          </NavLink>
        </nav>
      </div>

      <div className="px-1 text-xs text-gray-500">Menu</div>
    </aside>
  )
}

function Topbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const email = useAppSelector((s) => s.auth.user.email)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const location = useLocation()

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  const onLogout = () => {
    setOpen(false)
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  // page title from path
  const map: Record<string, string> = {
    '/home': 'Home',
    '/invoices': 'Invoices',
    '/bills': 'Bills',
    '/expenses': 'Expenses',
    '/reports': 'Reports',
  }
  const current = map[location.pathname] ?? 'Home'

  const initial = (email?.[0] ?? 'U').toUpperCase()

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Left: menu + title/breadcrumb */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 grid place-items-center">
            <Menu className="h-5 w-5 text-gray-600" aria-hidden="true" />
          </div>

          {/* xs: short title */}
          <span className="sm:hidden text-sm font-medium text-gray-800">{current}</span>

          {/* sm+: full breadcrumb */}
          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600">
            <span>Home</span>
            <span>/</span>
            <span className="font-medium text-gray-800">{current}</span>
          </div>
        </div>

        {/* Right: search + actions + avatar */}
        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="input w-72 pl-9 rounded-xl"
              placeholder="Search"
              aria-label="Search"
            />
          </div>

          <button className="icon-btn" title="Notifications" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </button>
          <button className="icon-btn" title="Settings" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
          <button className="icon-btn" title="Toggle theme" aria-label="Toggle theme">
            <Moon className="h-5 w-5" />
          </button>

          {/* Avatar + menu */}
          <div ref={containerRef} className="relative ml-2">
            <button
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={open}
              className="h-9 w-9 rounded-full grid place-items-center ring-1 ring-gray-300
                         bg-gradient-to-br from-indigo-200 to-purple-200
                         hover:from-indigo-300 hover:to-purple-300 transition"
            >
              <span className="text-sm font-medium text-gray-800">{initial}</span>
            </button>

            {open && (
              <div
                role="menu"
                aria-label="User menu"
                className="absolute right-0 mt-2 w-64 rounded-xl border border-gray-200 bg-white p-3 text-sm shadow-lg"
              >
                <div className="mb-2 truncate font-medium text-gray-900">
                  {email ?? 'user@example.com'}
                </div>
                <button onClick={onLogout} className="btn-secondary w-full justify-center" role="menuitem">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

