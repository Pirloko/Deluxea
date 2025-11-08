import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Heart, Star, Phone, MessageCircle } from 'lucide-react'

interface Profile {
  id: string
  user_id: string
  name: string
  title: string | null
  description: string | null
  avatar_url: string | null
  category: string | null
  tags: string[] | null
  contact_number: string | null
}

export default function HomePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const categories = ['all', 'Escort', 'Trans', 'Hombres', 'Masajes', 'Venta de Contenido']

  useEffect(() => {
    fetchProfiles()
  }, [selectedCategory])

  const fetchProfiles = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory)
      }

      const { data, error } = await query

      if (error) throw error
      setProfiles(data || [])
    } catch (error) {
      console.error('Error cargando perfiles:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-pink-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Bienvenido a Deluxea
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8">
            Descubre perfiles únicos, contenido exclusivo y experiencias premium
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Comenzar Ahora
            </Link>
            <Link to="/reels" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
              Explorar Reels
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'Todos' : category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Profiles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay perfiles disponibles en esta categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {profiles.map((profile) => (
              <div
                key={profile.id}
                className="card hover:shadow-lg transition-shadow group"
              >
                <Link to={`/profile/${profile.user_id}`}>
                  <div className="aspect-square rounded-lg bg-gradient-to-br from-primary-100 to-pink-100 mb-4 overflow-hidden">
                    {profile.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-primary-600">
                        {profile.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-1 group-hover:text-primary-600 transition-colors">
                    {profile.name}
                  </h3>
                  
                  {profile.title && (
                    <p className="text-sm text-gray-600 mb-2">{profile.title}</p>
                  )}
                  
                  {profile.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {profile.description}
                    </p>
                  )}
                  
                  {profile.tags && profile.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {profile.tags.slice(0, 3).map((tag, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
                
                {/* Botones de contacto */}
                {profile.contact_number && (
                  <div className="flex gap-2 mb-3">
                    <a
                      href={`tel:${profile.contact_number.replace(/[^0-9+]/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      Llamar
                    </a>
                    <a
                      href={`https://wa.me/${profile.contact_number.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      WhatsApp
                    </a>
                  </div>
                )}
                
                <div className="flex items-center gap-4 pt-3 border-t border-gray-100 text-gray-600">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">0</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-medium">5.0</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

