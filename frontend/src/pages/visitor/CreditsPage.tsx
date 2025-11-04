import { DollarSign, CreditCard, Zap } from 'lucide-react'

export default function CreditsPage() {
  const creditPackages = [
    { credits: 100, price: 9.99, bonus: 0 },
    { credits: 500, price: 44.99, bonus: 50 },
    { credits: 1000, price: 79.99, bonus: 150 },
    { credits: 2500, price: 179.99, bonus: 500 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Comprar Créditos</h1>
        <p className="text-gray-600 mt-2">Recarga tu balance para enviar regalos</p>
      </div>

      {/* Balance actual */}
      <div className="card mb-8 bg-gradient-to-r from-primary-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-primary-100 mb-1">Balance Actual</p>
            <p className="text-4xl font-bold">0 créditos</p>
          </div>
          <div className="p-4 bg-white/20 rounded-full">
            <DollarSign className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Paquetes de créditos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {creditPackages.map((pkg, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow relative">
            {pkg.bonus > 0 && (
              <div className="absolute -top-3 -right-3 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" />
                +{pkg.bonus} Bonus
              </div>
            )}
            
            <div className="text-center mb-4">
              <div className="text-5xl font-bold text-primary-600 mb-2">
                {pkg.credits + pkg.bonus}
              </div>
              <p className="text-sm text-gray-600">créditos</p>
            </div>

            <div className="text-center mb-4">
              <span className="text-3xl font-bold">${pkg.price}</span>
            </div>

            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              Comprar
            </button>
          </div>
        ))}
      </div>

      {/* Información */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <DollarSign className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Sobre los Créditos</h3>
            <p className="text-sm text-blue-800">
              Los créditos te permiten enviar regalos virtuales a los perfiles que te gustan. 
              Los créditos no expiran y puedes usarlos en cualquier momento.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

