import { Link } from 'react-router-dom'
import { Heart, DollarSign, Star, History } from 'lucide-react'

export default function VisitorDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
        <p className="text-gray-600 mt-2">Gestiona tu actividad en Deluxea</p>
      </div>

      {/* Balance de créditos */}
      <div className="card mb-8 bg-gradient-to-r from-primary-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 mb-1">Balance de Créditos</p>
            <p className="text-4xl font-bold">0 créditos</p>
          </div>
          <div className="p-4 bg-white/20 rounded-full">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
        <Link to="/visitor/credits" className="mt-4 inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
          Comprar Créditos
        </Link>
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/visitor/favorites" className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Mis Favoritos</h3>
              <p className="text-sm text-gray-600">0 perfiles guardados</p>
            </div>
          </div>
        </Link>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Mis Reseñas</h3>
              <p className="text-sm text-gray-600">0 reseñas escritas</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <History className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Actividad</h3>
              <p className="text-sm text-gray-600">Ver historial</p>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
        <div className="text-center py-12 text-gray-500">
          No hay actividad reciente
        </div>
      </div>
    </div>
  )
}

