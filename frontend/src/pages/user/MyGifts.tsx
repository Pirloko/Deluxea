import { Gift, DollarSign, TrendingUp } from 'lucide-react'

export default function MyGifts() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mis Regalos</h1>
        <p className="text-gray-600 mt-2">Gestiona los regalos que has recibido</p>
      </div>

      {/* Estadísticas de regalos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Total Regalos
              </p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-50">
              <Gift className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Valor Total
              </p>
              <p className="text-3xl font-bold text-gray-900">$0</p>
            </div>
            <div className="p-3 rounded-lg bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Este Mes
              </p>
              <p className="text-3xl font-bold text-gray-900">$0</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-50">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lista de regalos */}
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Historial de Regalos</h2>
        <div className="text-center py-12 text-gray-500">
          No has recibido regalos todavía
        </div>
      </div>
    </div>
  )
}

