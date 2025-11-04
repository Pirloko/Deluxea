import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Heart, MessageCircle, Share2, Play } from 'lucide-react'

interface Reel {
  id: string
  user_id: string
  video_url: string
  caption: string | null
  created_at: string
  profile: {
    name: string
    avatar_url: string | null
  }
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReels()
  }, [])

  const fetchReels = async () => {
    try {
      const { data, error } = await supabase
        .from('reels')
        .select(`
          *,
          profile:profiles(name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      setReels(data || [])
    } catch (error) {
      console.error('Error cargando reels:', error)
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

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto">
        {reels.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-screen text-white">
            <Play className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl">No hay reels disponibles</p>
            <p className="text-sm text-gray-400 mt-2">Vuelve pronto para ver contenido nuevo</p>
          </div>
        ) : (
          <div className="space-y-1">
            {reels.map((reel) => (
              <div key={reel.id} className="relative h-screen snap-start">
                {/* Video de fondo */}
                <video
                  src={reel.video_url}
                  className="w-full h-full object-cover"
                  loop
                  muted
                  playsInline
                />

                {/* Overlay con información */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70">
                  {/* Información del perfil */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-pink-500 flex items-center justify-center font-bold">
                        {reel.profile?.avatar_url ? (
                          <img 
                            src={reel.profile.avatar_url} 
                            alt={reel.profile.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          reel.profile?.name?.charAt(0) || '?'
                        )}
                      </div>
                      <span className="font-semibold">{reel.profile?.name || 'Usuario'}</span>
                    </div>

                    {reel.caption && (
                      <p className="text-sm mb-4">{reel.caption}</p>
                    )}
                  </div>

                  {/* Botones de interacción */}
                  <div className="absolute right-4 bottom-20 flex flex-col gap-6">
                    <button className="flex flex-col items-center gap-1 text-white">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Heart className="w-6 h-6" />
                      </div>
                      <span className="text-xs">123</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-white">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs">45</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-white">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        <Share2 className="w-6 h-6" />
                      </div>
                      <span className="text-xs">Compartir</span>
                    </button>
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

