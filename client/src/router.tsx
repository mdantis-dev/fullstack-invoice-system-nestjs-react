import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/Login'
import InvoicesPage from './features/invoices/InvoicesPage'
import ProtectedRoute from './routes/ProtectedRoute'
import HomePage from './pages/HomePage'
import BillsPage from './pages/BillsPage'
import ExpensesPage from './pages/ExpensesPage'
import ReportsPage from './pages/ReportsPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/bills" element={<BillsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>

        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
