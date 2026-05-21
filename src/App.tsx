import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import LoginPage          from '@/pages/LoginPage'
import RegisterPage       from '@/pages/RegisterPage'
import ForgotPasswordPage from '@/pages/ForgotPasswordPage'
import ResetPasswordPage  from '@/pages/ResetPasswordPage'
import ShowcasePage       from '@/pages/ShowcasePage'
import DashboardPage      from '@/pages/DashboardPage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  if (!profile) return <Navigate to="/login" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading } = useAuth()
  if (loading) return null
  if (profile) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"           element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register"        element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password"  element={<ResetPasswordPage />} />
      <Route path="/showcase"        element={<ShowcasePage />} />
      <Route path="/dashboard"       element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/"                element={<Navigate to="/showcase" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
