import { useRealTimeData } from './hooks/useRealTimeData'
import { NiftyPriceCard } from './components/trading/NiftyPriceCard'
import { PortfolioStats } from './components/trading/PortfolioStats'
import { SignalCard } from './components/trading/SignalCard'
import { SystemStatus } from './components/trading/SystemStatus'
import { TopMovers } from './components/trading/TopMovers'
import { useSystemStore } from './stores/systemStore'
import { useMarketStore } from './stores/marketStore'
import { AlertCircle, Wifi, WifiOff } from 'lucide-react'

function App() {
  const connectionStatus = useMarketStore((state) => state.connectionStatus)
  const errors = useSystemStore((state) => state.errors)

  // Initialize real-time data polling
  useRealTimeData({
    interval: 5000,
    enabled: true,
    onError: (error) => {
      console.error('Real-time data error:', error)
    }
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">NIFTY Scalper</h1>
              <span className="ml-3 text-sm text-gray-400">Real-time Trading Dashboard</span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                {connectionStatus === 'CONNECTED' ? (
                  <Wifi className="w-5 h-5 text-green-400" />
                ) : connectionStatus === 'CONNECTING' ? (
                  <div className="w-5 h-5">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
                  </div>
                ) : (
                  <WifiOff className="w-5 h-5 text-red-400" />
                )}
                <span className={`text-sm font-medium ${
                  connectionStatus === 'CONNECTED' ? 'text-green-400' :
                  connectionStatus === 'CONNECTING' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {connectionStatus}
                </span>
              </div>

              <div className="text-sm text-gray-400">
                {new Date().toLocaleTimeString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {errors.length > 0 && (
        <div className="bg-red-900/20 border-b border-red-800/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-3">
              {errors.slice(0, 3).map((error, index) => (
                <div key={index} className="flex items-center space-x-2 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Data */}
          <div className="lg:col-span-8 space-y-6">
            {/* Price Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <NiftyPriceCard />
              <PortfolioStats />
            </div>

            {/* Signals Card */}
            <SignalCard />

            {/* Top Movers */}
            <TopMovers />
          </div>

          {/* Right Column - System Status */}
          <div className="lg:col-span-4">
            <SystemStatus />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 text-center text-sm text-gray-400">
            <p>NIFTY Scalper Trading System • Real-time Market Data</p>
            <p className="mt-1">For educational purposes only. Trade responsibly.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
