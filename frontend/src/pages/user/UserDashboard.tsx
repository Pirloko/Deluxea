import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { Gift, Heart, MessageCircle, Eye, DollarSign, Star } from 'lucide-react'

export default function UserDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalGifts: 0,
    totalValue: 0,
    totalViews: 0,
    totalLikes: 0,
    totalReviews: 0,
    averageRating: 0,
  })

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    // TODO: Implementar estadísticas reales
    setStats({
      totalGifts: 0,
      totalValue: 0,
      totalViews: 0,
      totalLikes: 0,
      totalReviews: 0,
      averageRating: 5.0,
    })
  }

  const statCards = [
    {
      title: 'Regalos Recibidos',
      value: stats.totalGifts,
      icon: Gift,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Valor Total',
      value: `$${stats.totalValue}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Visitas al Perfil',
      value: stats.totalViews,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Me Gusta',
      value: stats.totalLikes,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Reseñas',
      value: stats.totalReviews,
      icon: MessageCircle,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Calificación',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Dashboard</h1>
        <p className="text-gray-600 mt-2">Bienvenido de vuelta, aquí está tu resumen</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link to="/user/edit-profile" className="card hover:shadow-lg transition-shadow text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Edit className="w-6 h-6 text-primary-600" />
            </div>
            <h3 className="font-semibold">Editar Perfil</h3>
          </div>
        </Link>

        <Link to="/user/content" className="card hover:shadow-lg transition-shadow text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Image className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold">Mi Contenido</h3>
          </div>
        </Link>

        <Link to="/user/gifts" className="card hover:shadow-lg transition-shadow text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold">Mis Regalos</h3>
          </div>
        </Link>

        <Link to="/user/reviews" className="card hover:shadow-lg transition-shadow text-center">
          <div className="p-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="font-semibold">Reseñas</h3>
          </div>
        </Link>
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

import { Edit, Image } from 'lucide-react'

