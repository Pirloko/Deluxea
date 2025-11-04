import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { 
  Home, 
  Video, 
  PlayCircle, 
  Heart, 
  User, 
  LogIn, 
  LogOut,
  Menu,
  X,
  Crown
} from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const { user, userData, logout } = useAuthStore()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
    setMobileMenuOpen(false)
  }

  const getDashboardLink = () => {
    if (!userData) return '/'
    
    switch (userData.role) {
      case 'admin':
        return '/admin'
      case 'profile_user':
        return '/user'
      case 'visitor':
        return '/visitor'
      default:
        return '/'
    }
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-primary-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
              Deluxea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </Link>
            <Link to="/reels" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
              <Video className="w-5 h-5" />
              <span>Reels</span>
            </Link>
            <Link to="/stories" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
              <PlayCircle className="w-5 h-5" />
              <span>Historias</span>
            </Link>
            {user && userData?.role === 'visitor' && (
              <Link to="/visitor/favorites" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                <Heart className="w-5 h-5" />
                <span>Favoritos</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>
                    {userData?.role === 'admin' ? 'Admin' : 
                     userData?.role === 'profile_user' ? 'Mi Perfil' : 
                     'Mi Cuenta'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Salir</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Iniciar Sesión
                </Link>
                <Link to="/register" className="btn-primary">
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Inicio</span>
              </Link>
              <Link 
                to="/reels" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Video className="w-5 h-5" />
                <span>Reels</span>
              </Link>
              <Link 
                to="/stories" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <PlayCircle className="w-5 h-5" />
                <span>Historias</span>
              </Link>
              
              {user ? (
                <>
                  {userData?.role === 'visitor' && (
                    <Link 
                      to="/visitor/favorites" 
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Favoritos</span>
                    </Link>
                  )}
                  <Link 
                    to={getDashboardLink()} 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>
                      {userData?.role === 'admin' ? 'Panel Admin' : 
                       userData?.role === 'profile_user' ? 'Mi Perfil' : 
                       'Mi Cuenta'}
                    </span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 px-4">
                  <Link 
                    to="/login" 
                    className="btn-secondary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn-primary text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Registrarse
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

