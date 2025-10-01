import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './features/auth/Login'
import InvoicesPage from './features/invoices/InvoicesPage'
import ProtectedRoute from './routes/ProtectedRoute'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/invoices" element={<InvoicesPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/invoices" replace />} />
        <Route path="*" element={<Navigate to="/invoices" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
