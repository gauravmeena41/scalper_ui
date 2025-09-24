import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useMarketStore } from '../../stores/marketStore'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export const NiftyPriceCard = () => {
  const {
    niftyPrice,
    change,
    changePercent,
    volume,
    isConnected,
    lastUpdate
  } = useMarketStore()

  const isPositive = change >= 0
  const isFlat = change === 0

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    }).format(price)
  }

  const formatVolume = (vol) => {
    if (vol >= 10000000) return `${(vol / 10000000).toFixed(1)}Cr`
    if (vol >= 100000) return `${(vol / 100000).toFixed(1)}L`
    if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`
    return vol.toString()
  }

  const getLastUpdateText = () => {
    if (!lastUpdate) return 'No data'
    const diff = Date.now() - new Date(lastUpdate).getTime()
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    return `${minutes}m ago`
  }

  return (
    <Card
      title="NIFTY 50"
      subtitle="National Stock Exchange"
      className="relative overflow-hidden"
      action={
        <Badge variant={isConnected ? 'connected' : 'disconnected'}>
          {isConnected ? (
            <>
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
              Live
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-400 rounded-full mr-1" />
              Offline
            </>
          )}
        </Badge>
      }
    >
      <div className="space-y-4">
        {/* Main Price */}
        <div className="text-center">
          <div className="text-4xl font-bold text-white mb-2">
            {formatPrice(niftyPrice).replace('₹', '₹ ')}
          </div>

          {/* Change & Percentage */}
          <div className={`flex items-center justify-center space-x-2 text-lg ${
            isFlat ? 'text-gray-400' :
            isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {isFlat ? (
              <Minus className="w-4 h-4" />
            ) : isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isPositive && !isFlat ? '+' : ''}{change.toFixed(2)}
            </span>
            <span>
              ({isPositive && !isFlat ? '+' : ''}{changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div>
            <p className="text-xs text-gray-400 mb-1">Volume</p>
            <p className="text-sm font-medium text-white">{formatVolume(volume)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Last Update</p>
            <p className="text-sm font-medium text-white">{getLastUpdateText()}</p>
          </div>
        </div>

        {/* Connection Status */}
        {!isConnected && (
          <div className="flex items-center justify-center space-x-2 pt-2">
            <LoadingSpinner size="sm" color="text-yellow-500" />
            <span className="text-xs text-yellow-400">Reconnecting...</span>
          </div>
        )}
      </div>

      {/* Animated background effect for live updates */}
      {isConnected && (
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 opacity-5 ${
            isFlat ? 'bg-gray-500' :
            isPositive ? 'bg-green-500' : 'bg-red-500'
          } animate-pulse`} />
        </div>
      )}
    </Card>
  )
}