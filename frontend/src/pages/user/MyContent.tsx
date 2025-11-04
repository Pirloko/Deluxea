import { Upload, Image, Video, Plus } from 'lucide-react'

export default function MyContent() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Contenido</h1>
          <p className="text-gray-600 mt-2">Gestiona tus fotos, reels e historias</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Subir Contenido
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-6">
          <button className="px-4 py-3 border-b-2 border-primary-600 text-primary-600 font-semibold">
            Fotos
          </button>
          <button className="px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Reels
          </button>
          <button className="px-4 py-3 border-b-2 border-transparent text-gray-600 hover:text-gray-900">
            Historias
          </button>
        </div>
      </div>

      {/* Contenido vacío */}
      <div className="card text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Image className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No tienes contenido todavía
        </h3>
        <p className="text-gray-600 mb-6">
          Comienza a subir fotos, videos e historias para compartir con tu audiencia
        </p>
        <button className="btn-primary flex items-center gap-2 mx-auto">
          <Upload className="w-5 h-5" />
          Subir Primer Contenido
        </button>
      </div>
    </div>
  )
}

