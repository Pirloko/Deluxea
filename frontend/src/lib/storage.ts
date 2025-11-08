import { supabase } from './supabase'

/**
 * Servicio de subida de archivos a Supabase Storage
 */

// Configuración de buckets
export const STORAGE_BUCKETS = {
  photos: 'photos',
  reels: 'reels',
  stories: 'stories',
  avatars: 'avatars'
} as const

/**
 * Sube un archivo a Supabase Storage
 */
export async function uploadFile(
  file: File,
  bucket: keyof typeof STORAGE_BUCKETS,
  userId: string
): Promise<string> {
  try {
    // Validar tamaño
    const maxSize = bucket === 'reels' ? 100 * 1024 * 1024 : 10 * 1024 * 1024 // 100MB para videos, 10MB para imágenes
    if (file.size > maxSize) {
      throw new Error(`Archivo muy grande. Máximo: ${maxSize / 1024 / 1024}MB`)
    }

    // Generar nombre único
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
    
    // Subir a Supabase Storage
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Obtener URL pública
    const { data: { publicUrl } } = supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error: any) {
    console.error('Error subiendo archivo:', error)
    throw new Error(error.message || 'Error al subir archivo')
  }
}

/**
 * Elimina un archivo de Supabase Storage
 */
export async function deleteFile(url: string, bucket: keyof typeof STORAGE_BUCKETS): Promise<void> {
  try {
    // Extraer el path del archivo de la URL
    const path = url.split(`/${STORAGE_BUCKETS[bucket]}/`)[1]
    if (!path) return

    const { error } = await supabase.storage
      .from(STORAGE_BUCKETS[bucket])
      .remove([path])

    if (error) throw error
  } catch (error) {
    console.error('Error eliminando archivo:', error)
  }
}

/**
 * Comprime una imagen antes de subirla
 */
export async function compressImage(file: File, maxWidth: number = 1920): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (e) => {
      const img = new window.Image()
      img.src = e.target?.result as string
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height
        
        // Redimensionar si es muy grande
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Error comprimiendo imagen'))
            }
          },
          'image/jpeg',
          0.85 // Calidad 85%
        )
      }
      
      img.onerror = () => reject(new Error('Error cargando imagen'))
    }
    
    reader.onerror = () => reject(new Error('Error leyendo archivo'))
  })
}

/**
 * Valida si un archivo es una imagen válida
 */
export function isValidImage(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  return validTypes.includes(file.type)
}

/**
 * Valida si un archivo es un video válido
 */
export function isValidVideo(file: File): boolean {
  const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']
  return validTypes.includes(file.type)
}

/**
 * Formatea el tamaño de archivo en formato legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

