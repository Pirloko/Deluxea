import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface Story {
  id: string
  user_id: string
  media_url: string
  media_type: 'image' | 'video'
  created_at: string
  expires_at: string
  profile: {
    name: string
    avatar_url: string | null
  }
}

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    fetchStories()
  }, [])

  const fetchStories = async () => {
    try {
      // Obtener solo historias que no han expirado (24 horas)
      const twentyFourHoursAgo = new Date()
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)

      const { data, error } = await supabase
        .from('stories')
        .select(`
          *,
          profile:profiles(name, avatar_url)
        `)
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error
      setStories(data || [])
    } catch (error) {
      console.error('Error cargando historias:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (stories.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-xl mb-2">No hay historias disponibles</p>
          <p className="text-sm text-gray-400">Las historias expiran después de 24 horas</p>
        </div>
      </div>
    )
  }

  const currentStory = stories[currentIndex]

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto h-screen relative">
        {/* Barra de progreso */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-white transition-all duration-300 ${
                  idx === currentIndex ? 'w-full' : idx < currentIndex ? 'w-full' : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-4 left-0 right-0 z-20 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center font-bold text-white">
              {currentStory.profile?.avatar_url ? (
                <img 
                  src={currentStory.profile.avatar_url} 
                  alt={currentStory.profile.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                currentStory.profile?.name?.charAt(0) || '?'
              )}
            </div>
            <div className="text-white">
              <p className="font-semibold">{currentStory.profile?.name || 'Usuario'}</p>
              <p className="text-xs text-gray-300">
                {formatDistanceToNow(new Date(currentStory.created_at), { 
                  addSuffix: true, 
                  locale: es 
                })}
              </p>
            </div>
          </div>

          <Link to="/" className="text-white">
            <X className="w-6 h-6" />
          </Link>
        </div>

        {/* Contenido de la historia */}
        <div className="w-full h-full">
          {currentStory.media_type === 'image' ? (
            <img
              src={currentStory.media_url}
              alt="Historia"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              src={currentStory.media_url}
              className="w-full h-full object-contain"
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </div>

        {/* Áreas de navegación invisible */}
        <div className="absolute inset-0 z-10 flex">
          <button
            onClick={handlePrevious}
            className="flex-1"
            disabled={currentIndex === 0}
          />
          <button
            onClick={handleNext}
            className="flex-1"
            disabled={currentIndex === stories.length - 1}
          />
        </div>
      </div>
    </div>
  )
}

