import { useState, useEffect } from 'react'
import { Upload, Image, Video, Clock, X, Plus, Trash2, Eye, Heart, Camera, Lock, Crown } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { uploadFile, compressImage, isValidImage, isValidVideo, formatFileSize } from '@/lib/storage'

type ContentType = 'photos' | 'reels' | 'stories'

interface Photo {
  id: string
  user_id: string
  image_url: string
  caption?: string
  likes_count: number
  is_exclusive: boolean
  unlock_price?: number
  created_at: string
}

interface Reel {
  id: string
  user_id: string
  video_url: string
  caption?: string
  likes_count: number
  created_at: string
}

interface Story {
  id: string
  user_id: string
  media_url: string
  media_type: 'image' | 'video'
  expires_at: string
  created_at: string
  caption?: never
}

type Content = Photo | Reel | Story

export default function MyContent() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<ContentType>('photos')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [content, setContent] = useState<Content[]>([])
  
  // Estados del formulario
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [caption, setCaption] = useState('')
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [isExclusive, setIsExclusive] = useState(false)
  const [unlockPrice, setUnlockPrice] = useState('50')

  useEffect(() => {
    if (user) {
      fetchContent()
    }
  }, [user, activeTab])

  useEffect(() => {
    // Limpiar preview URL cuando se cierra el modal
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setContent(data || [])
    } catch (error) {
      console.error('Error cargando contenido:', error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (activeTab === 'photos' || (activeTab === 'stories' && mediaType === 'image')) {
      if (!isValidImage(file)) {
        alert('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)')
        return
      }
    } else if (activeTab === 'reels' || (activeTab === 'stories' && mediaType === 'video')) {
      if (!isValidVideo(file)) {
        alert('Por favor selecciona un video válido (MP4, MOV, WEBM)')
        return
      }
    }

    // Crear preview
    const preview = URL.createObjectURL(file)
    setPreviewUrl(preview)
    setSelectedFile(file)
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !user) return

    setLoading(true)
    setUploadProgress(0)

    try {
      // Comprimir imagen si es foto
      let fileToUpload = selectedFile
      if ((activeTab === 'photos' || (activeTab === 'stories' && mediaType === 'image')) && isValidImage(selectedFile)) {
        setUploadProgress(20)
        fileToUpload = await compressImage(selectedFile, 1920)
      }

      setUploadProgress(40)

      // Subir archivo a Supabase Storage
      const bucket = activeTab === 'photos' ? 'photos' : activeTab === 'reels' ? 'reels' : 'stories'
      const fileUrl = await uploadFile(fileToUpload, bucket, user.id)
      
      setUploadProgress(70)

      // Guardar en base de datos
      let newContent: any = {}

      if (activeTab === 'photos') {
        newContent = {
          user_id: user.id,
          image_url: fileUrl,
          caption: caption.trim() || null,
          likes_count: 0,
          is_exclusive: isExclusive,
          unlock_price: isExclusive ? parseInt(unlockPrice) : null
        }
      } else if (activeTab === 'reels') {
        newContent = {
          user_id: user.id,
          video_url: fileUrl,
          caption: caption.trim() || null,
          likes_count: 0
        }
      } else if (activeTab === 'stories') {
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)
        
        newContent = {
          user_id: user.id,
          media_url: fileUrl,
          media_type: mediaType,
          expires_at: expiresAt.toISOString()
        }
      }

      setUploadProgress(90)

      const { error } = await supabase
        .from(activeTab)
        .insert(newContent)

      if (error) throw error

      setUploadProgress(100)

      // Limpiar formulario
      setSelectedFile(null)
      setPreviewUrl('')
      setCaption('')
      setMediaType('image')
      setIsExclusive(false)
      setUnlockPrice('50')
      setShowUploadModal(false)
      setUploadProgress(0)
      
      // Recargar contenido
      fetchContent()
    } catch (error: any) {
      alert('Error al subir contenido: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este contenido?')) return

    try {
      const { error } = await supabase
        .from(activeTab)
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchContent()
    } catch (error: any) {
      alert('Error al eliminar: ' + error.message)
    }
  }

  const getTabConfig = (tab: ContentType) => {
    const configs = {
      photos: {
        icon: Image,
        label: 'Fotos',
        accept: 'image/*',
        description: 'Sube fotos para tu galería'
      },
      reels: {
        icon: Video,
        label: 'Reels',
        accept: 'video/*',
        description: 'Sube videos cortos tipo TikTok'
      },
      stories: {
        icon: Clock,
        label: 'Historias',
        accept: 'image/*,video/*',
        description: 'Sube historias que expiran en 24h'
      }
    }
    return configs[tab]
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Contenido</h1>
          <p className="text-gray-600 mt-2">Gestiona tus fotos, reels e historias</p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Subir Contenido</span>
          <span className="sm:hidden">Subir</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200 overflow-x-auto">
        <div className="flex gap-6">
          {(['photos', 'reels', 'stories'] as ContentType[]).map((tab) => {
            const config = getTabConfig(tab)
            const Icon = config.icon
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-primary-600 text-primary-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                {config.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Contenido */}
      {content.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {activeTab === 'photos' && <Image className="w-8 h-8 text-gray-400" />}
            {activeTab === 'reels' && <Video className="w-8 h-8 text-gray-400" />}
            {activeTab === 'stories' && <Clock className="w-8 h-8 text-gray-400" />}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No tienes {getTabConfig(activeTab).label.toLowerCase()} todavía
          </h3>
          <p className="text-gray-600 mb-6">
            {getTabConfig(activeTab).description}
          </p>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="btn-primary flex items-center gap-2 mx-auto"
          >
            <Camera className="w-5 h-5" />
            Subir Primer Contenido
          </button>
        </div>
      ) : (
        <div className={`grid gap-4 ${
          activeTab === 'photos' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :
          activeTab === 'reels' ? 'grid-cols-2 md:grid-cols-4 lg:grid-cols-5' :
          'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {content.map((item) => (
            <div key={item.id} className="card group relative overflow-hidden p-0">
              {/* Imagen/Video */}
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                {activeTab === 'reels' ? (
                  <div className="relative w-full h-full">
                    <video 
                      src={(item as Reel).video_url}
                      className="w-full h-full object-cover"
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Video className="w-12 h-12 text-white" />
                    </div>
                  </div>
                ) : (
                  <img 
                    src={
                      activeTab === 'photos' ? (item as Photo).image_url :
                      (item as Story).media_url
                    }
                    alt={item.caption || 'Contenido'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=Error'
                    }}
                  />
                )}
                
                {/* Badge de Exclusivo */}
                {activeTab === 'photos' && (item as Photo).is_exclusive && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                    <Crown className="w-3 h-3" />
                    {(item as Photo).unlock_price} 💎
                  </div>
                )}
                
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <a
                    href={
                      activeTab === 'photos' ? (item as Photo).image_url :
                      activeTab === 'reels' ? (item as Reel).video_url :
                      (item as Story).media_url
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Eye className="w-5 h-5 text-gray-700" />
                  </a>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>

              {/* Caption y Stats */}
              <div className="p-3">
                {activeTab !== 'stories' && item.caption && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.caption}
                  </p>
                )}

                {(activeTab === 'photos' || activeTab === 'reels') && 'likes_count' in item && (
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Heart className="w-3 h-3" />
                    <span>{item.likes_count} likes</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de subida */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Subir {getTabConfig(activeTab).label}
              </h2>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                  setPreviewUrl('')
                  setCaption('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              {/* Selector de archivo */}
              {!selectedFile ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Seleccionar {activeTab === 'photos' ? 'Imagen' : activeTab === 'reels' ? 'Video' : 'Contenido'}
                  </label>
                  
                  <div className="space-y-3">
                    {/* Botón para galería */}
                    <label className="block">
                      <input
                        type="file"
                        accept={getTabConfig(activeTab).accept}
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 hover:bg-primary-50 transition-colors">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium mb-1">
                          Click para seleccionar archivo
                        </p>
                        <p className="text-sm text-gray-500">
                          Desde tu galería o archivos
                        </p>
                      </div>
                    </label>

                    {/* Botón para cámara */}
                    {(activeTab === 'photos' || activeTab === 'stories') && (
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <div className="cursor-pointer border-2 border-primary-500 bg-primary-50 rounded-lg p-6 text-center hover:bg-primary-100 transition-colors">
                          <Camera className="w-10 h-10 text-primary-600 mx-auto mb-2" />
                          <p className="text-primary-700 font-medium">
                            Tomar Foto con Cámara
                          </p>
                        </div>
                      </label>
                    )}
                    
                    {activeTab === 'reels' && (
                      <label className="block">
                        <input
                          type="file"
                          accept="video/*"
                          capture="environment"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <div className="cursor-pointer border-2 border-primary-500 bg-primary-50 rounded-lg p-6 text-center hover:bg-primary-100 transition-colors">
                          <Video className="w-10 h-10 text-primary-600 mx-auto mb-2" />
                          <p className="text-primary-700 font-medium">
                            Grabar Video
                          </p>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Tipo de media para historias */}
                  {activeTab === 'stories' && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Contenido
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="image"
                            checked={mediaType === 'image'}
                            onChange={(e) => setMediaType(e.target.value as 'image')}
                            className="text-primary-600"
                          />
                          <span>Imagen</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            value="video"
                            checked={mediaType === 'video'}
                            onChange={(e) => setMediaType(e.target.value as 'video')}
                            className="text-primary-600"
                          />
                          <span>Video</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Preview del archivo seleccionado */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vista Previa
                    </label>
                    <div className="relative">
                      {activeTab === 'reels' || (activeTab === 'stories' && mediaType === 'video') ? (
                        <video 
                          src={previewUrl} 
                          controls
                          className="w-full aspect-video bg-gray-100 rounded-lg"
                        />
                      ) : (
                        <img 
                          src={previewUrl} 
                          alt="Preview"
                          className="w-full aspect-square object-cover bg-gray-100 rounded-lg"
                        />
                      )}
                      
                      {/* Botón para cambiar archivo */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          setPreviewUrl('')
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Info del archivo */}
                    <div className="mt-2 text-sm text-gray-600">
                      <p><strong>Archivo:</strong> {selectedFile.name}</p>
                      <p><strong>Tamaño:</strong> {formatFileSize(selectedFile.size)}</p>
                    </div>
                  </div>

              {/* Caption (no para historias) */}
              {activeTab !== 'stories' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción (Opcional)
                  </label>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="input-field"
                    rows={3}
                    placeholder="Escribe una descripción..."
                  />
                </div>
              )}

              {/* Contenido Exclusivo (solo para fotos) */}
              {activeTab === 'photos' && selectedFile && (
                <div className="border-2 border-primary-200 rounded-lg p-4 bg-primary-50">
                  <div className="flex items-start gap-3 mb-3">
                    <Crown className="w-5 h-5 text-primary-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-semibold text-gray-900">
                          Contenido Exclusivo
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsExclusive(!isExclusive)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            isExclusive ? 'bg-primary-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              isExclusive ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600">
                        {isExclusive 
                          ? '🔒 Los visitantes pagarán créditos para ver esta foto'
                          : '🌍 Esta foto será pública y gratis para todos'
                        }
                      </p>
                    </div>
                  </div>

                  {isExclusive && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio de Desbloqueo (Créditos)
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={unlockPrice}
                          onChange={(e) => setUnlockPrice(e.target.value)}
                          className="input-field flex-1"
                          min="10"
                          max="500"
                          step="10"
                          required={isExclusive}
                        />
                        <span className="text-sm text-gray-600 whitespace-nowrap">
                          créditos
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        💡 Sugerido: 50-150 créditos por foto
                      </p>
                    </div>
                  )}
                </div>
              )}

                  {/* Barra de progreso */}
                  {loading && (
                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                        <span>Subiendo...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary-600 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false)
                        setSelectedFile(null)
                        setPreviewUrl('')
                        setCaption('')
                      }}
                      disabled={loading}
                      className="btn-secondary flex-1"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !selectedFile}
                      className="btn-primary flex-1 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="w-5 h-5" />
                          Subir
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
