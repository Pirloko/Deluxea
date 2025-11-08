import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Heart, Star, Phone, MapPin, MessageCircle } from 'lucide-react'

interface Profile {
  id: string
  user_id: string
  name: string
  age: number | null
  title: string | null
  description: string | null
  tags: string[] | null
  category: string | null
  contact_number: string | null
  avatar_url: string | null
}

export default function ProfilePage() {
  const { userId } = useParams()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'photos' | 'reels' | 'reviews'>('photos')

  useEffect(() => {
    if (userId) {
      fetchProfile()
    }
  }, [userId])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error cargando perfil:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Perfil no encontrado</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      {/* Header del perfil */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary-200 to-pink-200 flex items-center justify-center text-5xl font-bold text-primary-600 overflow-hidden">
                {profile.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  profile.name.charAt(0)
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-1">{profile.name}</h1>
                  {profile.title && (
                    <p className="text-lg text-gray-600">{profile.title}</p>
                  )}
                  {profile.age && (
                    <p className="text-sm text-gray-500">{profile.age} años</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-5 h-5 fill-yellow-500" />
                    <span className="font-semibold">5.0</span>
                  </div>
                </div>
              </div>

              {profile.description && (
                <p className="text-gray-700 mb-4">{profile.description}</p>
              )}

              {profile.tags && profile.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {profile.tags.map((tag, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {profile.category && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.category}</span>
                  </div>
                )}
                {profile.contact_number && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{profile.contact_number}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                {profile.contact_number && (
                  <>
                    <a 
                      href={`tel:${profile.contact_number}`}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Phone className="w-5 h-5" />
                      Llamar
                    </a>
                    <a
                      href={`https://wa.me/${profile.contact_number.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp
                    </a>
                  </>
                )}
                <button className="btn-secondary flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Favorito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('photos')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'photos'
                  ? 'border-primary-600 text-primary-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Fotos
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'reels'
                  ? 'border-primary-600 text-primary-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Reels
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 border-b-2 transition-colors ${
                activeTab === 'reviews'
                  ? 'border-primary-600 text-primary-600 font-semibold'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Reseñas
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {activeTab === 'photos' && (
          <div className="grid grid-cols-3 gap-2">
            {/* Aquí irían las fotos del perfil */}
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
              No hay fotos
            </div>
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="text-center py-12 text-gray-500">
            No hay reels disponibles
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {/* Aquí irían las reseñas */}
            <div className="text-center py-12 text-gray-500">
              No hay reseñas todavía
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

