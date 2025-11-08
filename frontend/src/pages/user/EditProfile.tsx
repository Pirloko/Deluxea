import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/store/authStore'
import { Save, Upload } from 'lucide-react'

export default function EditProfile() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    title: '',
    description: '',
    category: '',
    contact_number: '',
  })

  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('') // Solo los 8 dígitos

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle() // Cambio de .single() a .maybeSingle() para manejar cuando no existe

      // Si el perfil existe, cargar los datos
      if (data) {
        setFormData({
          name: data.name || '',
          age: data.age?.toString() || '',
          title: data.title || '',
          description: data.description || '',
          category: data.category || '',
        })
        setTags(data.tags || [])
        
        // Extraer solo los últimos 8 dígitos del número chileno
        if (data.contact_number) {
          const cleanNumber = data.contact_number.replace(/[^0-9]/g, '')
          // Si tiene el formato completo (+56 9 xxxx xxxx), extraer últimos 8 dígitos
          if (cleanNumber.startsWith('569') && cleanNumber.length === 11) {
            setPhoneNumber(cleanNumber.slice(3)) // Obtiene los últimos 8 dígitos
          } else if (cleanNumber.length === 8) {
            setPhoneNumber(cleanNumber)
          }
        }
      }
      // Si no existe (data es null), los campos quedan vacíos y el usuario puede crear su perfil
      
      if (error) {
        console.error('Error cargando perfil:', error)
      }
    } catch (error) {
      console.error('Error inesperado:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Construir número completo chileno: +56 9 xxxx xxxx
      const fullPhoneNumber = phoneNumber.trim() 
        ? `+56 9 ${phoneNumber.slice(0, 4)} ${phoneNumber.slice(4)}`
        : null

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user?.id,
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : null,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          contact_number: fullPhoneNumber,
          tags: tags,
        }, {
          onConflict: 'user_id' // Especificar la columna de conflicto para que upsert funcione
        })

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        navigate('/user')
      }, 1500)
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Perfil</h1>
        <p className="text-gray-600 mt-2">Actualiza tu información pública</p>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Edad
            </label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="input-field"
              min="18"
              max="99"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título/Profesión
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-field"
            placeholder="Ej: Modelo, Artista, Influencer..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-field"
            rows={4}
            placeholder="Cuéntanos sobre ti..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-field"
            >
              <option value="">Seleccionar...</option>
              <option value="Escort">Escort</option>
              <option value="Trans">Trans</option>
              <option value="Hombres">Hombres</option>
              <option value="Masajes">Masajes</option>
              <option value="Venta de Contenido">Venta de Contenido</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Contacto (Chile)
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                +56 9
              </div>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '') // Solo números
                  if (value.length <= 8) {
                    setPhoneNumber(value)
                  }
                }}
                className="input-field flex-1"
                placeholder="1234 5678"
                maxLength={8}
              />
            </div>
            {phoneNumber && (
              <p className="text-xs text-gray-500 mt-1">
                Número completo: +56 9 {phoneNumber.slice(0, 4)} {phoneNumber.slice(4)}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div className="space-y-3">
            {/* Mostrar etiquetas existentes */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => setTags(tags.filter((_, i) => i !== index))}
                    className="hover:text-primary-900 ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span className="text-gray-400 text-sm">No hay etiquetas. Agrega una abajo.</span>
              )}
            </div>
            
            {/* Input para agregar nueva etiqueta */}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
                      setTags([...tags, currentTag.trim()])
                      setCurrentTag('')
                    }
                  }
                }}
                className="input-field flex-1"
                placeholder="Escribe una etiqueta y presiona Enter..."
              />
              <button
                type="button"
                onClick={() => {
                  if (currentTag.trim() && !tags.includes(currentTag.trim())) {
                    setTags([...tags, currentTag.trim()])
                    setCurrentTag('')
                  }
                }}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Agregar
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Escribe una etiqueta y presiona Enter o click en "Agregar"
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            ¡Perfil actualizado exitosamente! Redirigiendo...
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/user')}
            className="btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

