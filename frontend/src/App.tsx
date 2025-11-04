import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

// Layouts
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages - Public
import HomePage from './pages/public/HomePage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProfilePage from './pages/public/ProfilePage'
import ReelsPage from './pages/public/ReelsPage'
import StoriesPage from './pages/public/StoriesPage'

// Pages - Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsers from './pages/admin/AdminUsers'
import AdminGifts from './pages/admin/AdminGifts'
import AdminWithdrawals from './pages/admin/AdminWithdrawals'

// Pages - User Profile
import UserDashboard from './pages/user/UserDashboard'
import EditProfile from './pages/user/EditProfile'
import MyContent from './pages/user/MyContent'
import MyGifts from './pages/user/MyGifts'
import MyReviews from './pages/user/MyReviews'

// Pages - Visitor
import VisitorDashboard from './pages/visitor/VisitorDashboard'
import FavoritesPage from './pages/visitor/FavoritesPage'
import CreditsPage from './pages/visitor/CreditsPage'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import ChangePasswordModal from './components/auth/ChangePasswordModal'

function App() {
  const { initialize, user, loading } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="profile/:userId" element={<ProfilePage />} />
          <Route path="reels" element={<ReelsPage />} />
          <Route path="stories" element={<StoriesPage />} />
        </Route>

        {/* Rutas de Administrador */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="gifts" element={<AdminGifts />} />
          <Route path="withdrawals" element={<AdminWithdrawals />} />
        </Route>

        {/* Rutas de Usuario con Perfil */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRoles={['profile_user']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="edit-profile" element={<EditProfile />} />
          <Route path="content" element={<MyContent />} />
          <Route path="gifts" element={<MyGifts />} />
          <Route path="reviews" element={<MyReviews />} />
        </Route>

        {/* Rutas de Visitante Registrado */}
        <Route
          path="/visitor"
          element={
            <ProtectedRoute allowedRoles={['visitor']}>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VisitorDashboard />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="credits" element={<CreditsPage />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Modal de cambio de contraseña obligatorio */}
      <ChangePasswordModal />
    </Router>
  )
}

export default App

