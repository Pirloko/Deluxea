import { Crown, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-pink-600 bg-clip-text text-transparent">
                Deluxea
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              La plataforma premium para conectar con personas increíbles. 
              Experiencias únicas, contenido exclusivo y conexiones auténticas.
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/" className="hover:text-primary-600 transition-colors">Inicio</Link></li>
              <li><Link to="/reels" className="hover:text-primary-600 transition-colors">Reels</Link></li>
              <li><Link to="/stories" className="hover:text-primary-600 transition-colors">Historias</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-primary-600 transition-colors">Términos y Condiciones</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-primary-600 transition-colors">Contacto</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2025 Deluxea. Todos los derechos reservados.
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> para mayores de edad
          </p>
        </div>
      </div>
    </footer>
  )
}

