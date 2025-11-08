import { useState, useEffect } from 'react'
import { Lock, Crown, Eye, X, CreditCard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'

interface ExclusivePhotoProps {
  photoId: string
  imageUrl: string
  caption?: string
  isExclusive: boolean
  unlockPrice?: number
  ownerId: string
  className?: string
}

export default function ExclusivePhoto({
  photoId,
  imageUrl,
  caption,
  isExclusive,
  unlockPrice,
  ownerId,
  className = ''
}: ExclusivePhotoProps) {
  const { user, userData } = useAuthStore()
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userCredits, setUserCredits] = useState(0)

  useEffect(() => {
    if (user) {
      checkUnlockStatus()
      fetchUserCredits()
    }
  }, [user, photoId])

  const checkUnlockStatus = async () => {
    try {
      // Si es el dueño, siempre puede ver
      if (user?.id === ownerId) {
        setIsUnlocked(true)
        return
      }

      // Verificar si ya desbloqueó esta foto
      const { data, error } = await supabase
        .from('photo_unlocks')
        .select('id')
        .eq('photo_id', photoId)
        .eq('user_id', user?.id)
        .maybeSingle()

      if (data) {
        setIsUnlocked(true)
      }
    } catch (error) {
      console.error('Error verificando desbloqueo:', error)
    }
  }

  const fetchUserCredits = async () => {
    try {
      const { data } = await supabase
        .from('credits')
        .select('balance')
        .eq('user_id', user?.id)
        .single()

      if (data) {
        setUserCredits(data.balance)
      }
    } catch (error) {
      console.error('Error obteniendo créditos:', error)
    }
  }

  const handleUnlock = async () => {
    if (!user || !unlockPrice) return

    setLoading(true)
    try {
      // Llamar a la función de desbloqueo en Supabase
      const { data, error } = await supabase
        .rpc('unlock_photo', {
          photo_id_param: photoId,
          user_id_param: user.id
        })

      if (error) throw error

      if (data.success) {
        setIsUnlocked(true)
        setShowUnlockModal(false)
        setUserCredits(data.credits_remaining)
        alert('¡Foto desbloqueada! Ahora puedes verla cuando quieras')
      } else {
        alert(data.error || 'Error al desbloquear')
      }
    } catch (error: any) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Si no es exclusiva, mostrar normal
  if (!isExclusive) {
    return (
      <img 
        src={imageUrl} 
        alt={caption || 'Foto'}
        className={className}
      />
    )
  }

  // Si es el dueño o ya la desbloqueó, mostrar normal
  if (isUnlocked) {
    return (
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={caption || 'Foto'}
          className={className}
        />
        {user?.id === ownerId && (
          <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Exclusiva
          </div>
        )}
      </div>
    )
  }

  // Si es exclusiva y no está desbloqueada, mostrar blur con lock
  return (
    <>
      <div 
        className={`relative cursor-pointer group ${className}`}
        onClick={() => setShowUnlockModal(true)}
      >
        {/* Imagen con blur */}
        <img 
          src={imageUrl} 
          alt="Contenido bloqueado"
          className="w-full h-full object-cover filter blur-xl"
        />
        
        {/* Overlay con lock */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80 flex flex-col items-center justify-center text-white">
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 p-4 rounded-full mb-4 shadow-2xl group-hover:scale-110 transition-transform">
            <Lock className="w-8 h-8" />
          </div>
          <div className="text-center px-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold">Contenido Exclusivo</span>
            </div>
            <p className="text-lg font-semibold mb-1">
              {unlockPrice} 💎 Créditos
            </p>
            <p className="text-sm text-gray-200">
              Click para desbloquear
            </p>
          </div>
        </div>
      </div>

      {/* Modal de desbloqueo */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="w-6 h-6 text-primary-600" />
                Desbloquear Foto
              </h3>
              <button
                onClick={() => setShowUnlockModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Preview blur de la foto */}
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Preview"
                className="w-full aspect-square object-cover filter blur-lg"
              />
            </div>

            {/* Información */}
            <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-700 font-medium">Precio:</span>
                <span className="text-2xl font-bold text-primary-600 flex items-center gap-1">
                  <Crown className="w-5 h-5" />
                  {unlockPrice} 💎
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Tus créditos:</span>
                <span className={`font-semibold ${userCredits >= (unlockPrice || 0) ? 'text-green-600' : 'text-red-600'}`}>
                  {userCredits} 💎
                </span>
              </div>
            </div>

            {/* Mensaje */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Acceso permanente:</strong> Paga una sola vez y podrás ver esta foto cuando quieras.
              </p>
            </div>

            {userCredits < (unlockPrice || 0) ? (
              <div>
                <p className="text-center text-red-600 mb-4">
                  ⚠️ No tienes suficientes créditos
                </p>
                <button
                  onClick={() => window.location.href = '/visitor/credits'}
                  className="w-full btn-primary"
                >
                  Comprar Créditos
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUnlock}
                  disabled={loading}
                  className="flex-1 btn-primary disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Desbloquear
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

