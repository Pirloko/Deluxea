import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/lib/supabase'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles: UserRole[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, userData, loading } = useAuthStore()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user || !userData) {
    return <Navigate to="/login" replace />
  }

  if (!userData.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Cuenta Desactivada</h2>
          <p className="text-gray-600">Tu cuenta ha sido desactivada. Contacta al administrador.</p>
        </div>
      </div>
    )
  }

  if (!allowedRoles.includes(userData.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}

