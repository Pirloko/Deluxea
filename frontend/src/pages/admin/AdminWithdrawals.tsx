import { DollarSign, Clock, CheckCircle, XCircle } from 'lucide-react'

export default function AdminWithdrawals() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Retiros</h1>
        <p className="text-gray-600 mt-2">Administra las solicitudes de retiro de usuarios</p>
      </div>

      <div className="card text-center py-12">
        <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No hay solicitudes de retiro pendientes</p>
      </div>
    </div>
  )
}

