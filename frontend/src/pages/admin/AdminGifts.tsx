import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Gift, Plus, Edit, Trash2 } from 'lucide-react'

interface GiftItem {
  id: string
  name: string
  icon: string
  value: number
  is_active: boolean
  created_at: string
}

export default function AdminGifts() {
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchGifts()
  }, [])

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('value', { ascending: true })

      if (error) throw error
      setGifts(data || [])
    } catch (error) {
      console.error('Error cargando regalos:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Catálogo de Regalos</h1>
          <p className="text-gray-600 mt-2">Administra los regalos virtuales disponibles</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Crear Regalo
        </button>
      </div>

      {gifts.length === 0 ? (
        <div className="card text-center py-12">
          <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">No hay regalos configurados</p>
          <button className="btn-primary">Crear Primer Regalo</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gifts.map((gift) => (
            <div key={gift.id} className="card hover:shadow-lg transition-shadow">
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{gift.icon}</div>
                <h3 className="font-bold text-lg">{gift.name}</h3>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-primary-50 rounded-lg mb-4">
                <span className="text-sm font-medium text-gray-700">Valor:</span>
                <span className="text-xl font-bold text-primary-600">${gift.value}</span>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-sm flex items-center justify-center gap-1">
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {!gift.is_active && (
                <div className="mt-2 text-center text-xs text-gray-500">
                  (Inactivo)
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

