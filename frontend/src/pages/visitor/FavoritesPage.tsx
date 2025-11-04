import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function FavoritesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Favoritos</h1>
        <p className="text-gray-600 mt-2">Perfiles que has guardado</p>
      </div>

      <div className="card text-center py-16">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No tienes favoritos todavía
        </h3>
        <p className="text-gray-600 mb-6">
          Explora perfiles y guarda tus favoritos para acceder rápidamente
        </p>
        <Link to="/" className="btn-primary inline-block">
          Explorar Perfiles
        </Link>
      </div>
    </div>
  )
}

