import { Navigate, Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/store'
import { logout } from '../features/auth/slice'

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
        <main className="container-p">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <div>
        <div className="logo">LOGO</div>
        <nav className="nav">
          <NavLink to="#" className={({ isActive }) => isActive ? 'active' : undefined}>Home</NavLink>
          <NavLink to="/invoices" className={({ isActive }) => isActive ? 'active' : undefined}>Invoices</NavLink>
          <NavLink to="#" className={({ isActive }) => isActive ? 'active' : undefined}>Bills</NavLink>
          <NavLink to="#" className={({ isActive }) => isActive ? 'active' : undefined}>Expenses</NavLink>
          <NavLink to="#" className={({ isActive }) => isActive ? 'active' : undefined}>Reports</NavLink>
        </nav>
      </div>
      <div className="text-xs text-gray-500 px-1">Menu</div>
    </aside>
  )
}

function Topbar() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const email = useAppSelector((s) => s.auth.user.email)

  const onLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <header className="topbar">
      <div className="container-p flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <button className="icon-btn" title="Menu">
            <span className="sr-only">Menu</span>
            ☰
          </button>
          <span>Home</span>
          <span>/</span>
          <span className="font-medium text-gray-800">Invoices</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <input className="input w-64" placeholder="Search" />
          </div>
          <button className="icon-btn" title="Notifications">🔔</button>
          <button className="icon-btn" title="Theme">🌙</button>
          <div className="ml-2 hidden items-center gap-2 sm:flex">
            {email && <span className="text-sm text-gray-600">{email}</span>}
            <button className="btn-secondary" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </div>
    </header>
  )
}
