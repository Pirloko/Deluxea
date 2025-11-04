import { Star, MessageCircle } from 'lucide-react'

export default function MyReviews() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Reseñas</h1>
        <p className="text-gray-600 mt-2">Ve lo que otros dicen sobre ti</p>
      </div>

      {/* Resumen de calificación */}
      <div className="card mb-8">
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-12 h-12 text-yellow-500 fill-yellow-500" />
            <span className="text-5xl font-bold">5.0</span>
          </div>
          <p className="text-gray-600">Basado en 0 reseñas</p>
        </div>
      </div>

      {/* Lista de reseñas */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="w-6 h-6 text-gray-600" />
          <h2 className="text-xl font-bold">Todas las Reseñas</h2>
        </div>
        
        <div className="text-center py-12 text-gray-500">
          Aún no tienes reseñas
        </div>
      </div>
    </div>
  )
}

