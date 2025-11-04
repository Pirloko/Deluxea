import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Users, Gift, DollarSign, TrendingUp, UserCheck, UserX } from 'lucide-react'

interface Stats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
  totalGifts: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalGifts: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Obtener estadísticas de usuarios
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('is_active')

      if (usersError) throw usersError

      const activeUsers = users?.filter(u => u.is_active).length || 0
      const inactiveUsers = users?.filter(u => !u.is_active).length || 0

      setStats({
        totalUsers: users?.length || 0,
        activeUsers,
        inactiveUsers,
        totalGifts: 0, // TODO: implementar conteo de regalos
        totalRevenue: 0, // TODO: implementar cálculo de ingresos
      })
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Usuarios',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Usuarios Activos',
      value: stats.activeUsers,
      icon: UserCheck,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Usuarios Inactivos',
      value: stats.inactiveUsers,
      icon: UserX,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Regalos Enviados',
      value: stats.totalGifts,
      icon: Gift,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Ingresos Totales',
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Tendencia',
      value: '+12%',
      icon: TrendingUp,
      color: 'bg-primary-500',
      textColor: 'text-primary-600',
      bgColor: 'bg-primary-50',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Resumen general de la plataforma</p>
      </div>

      {/* Tarjetas de estadísticas */}
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
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Actividad reciente */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <p className="text-gray-500 text-center py-8">
            No hay actividad reciente para mostrar
          </p>
        </div>
      </div>
    </div>
  )
}

