import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useSignalStore } from '../../stores/signalStore'
import { ArrowUpRight, ArrowDownRight, Clock, Zap } from 'lucide-react'

export const SignalCard = () => {
  const { signals, activeSignals, totalSignalsToday } = useSignalStore()

  const recentSignals = signals.slice(0, 5) // Show last 5 signals

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price)
  }

  const getSignalIcon = (signalType) => {
    return signalType === 'BUY' ? (
      <ArrowUpRight className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-400" />
    )
  }

  const getSignalBadgeVariant = (signalType) => {
    return signalType === 'BUY' ? 'success' : 'error'
  }

  return (
    <Card
      title="Trading Signals"
      subtitle="Real-time VWAP signals"
      action={
        <div className="flex items-center space-x-2">
          <Badge variant="info" size="xs">
            {totalSignalsToday} Today
          </Badge>
          <Badge variant={activeSignals.length > 0 ? 'warning' : 'default'} size="xs">
            {activeSignals.length} Active
          </Badge>
        </div>
      }
    >
      <div className="space-y-4">
        {recentSignals.length === 0 ? (
          <div className="text-center py-8">
            <Zap className="w-8 h-8 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No signals yet</p>
            <p className="text-gray-500 text-xs mt-1">
              Waiting for market conditions...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSignals.map((signal, index) => (
              <div
                key={signal.id || index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  signal.status === 'ACTIVE'
                    ? 'bg-gray-800 border-gray-700'
                    : signal.status === 'PROFIT' || signal.status === 'TARGET_HIT'
                    ? 'bg-green-900/20 border-green-800/30'
                    : 'bg-red-900/20 border-red-800/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getSignalIcon(signal.signal_type)}
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={getSignalBadgeVariant(signal.signal_type)}
                        size="xs"
                      >
                        {signal.signal_type}
                      </Badge>
                      <span className="text-sm font-medium text-white">
                        {signal.recommended_option || signal.symbol}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatTime(signal.timestamp)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ₹{formatPrice(signal.entry_price || signal.current_price)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-medium text-white">
                    {signal.confidence
                      ? `${(signal.confidence * 100).toFixed(0)}%`
                      : 'N/A'
                    }
                  </div>
                  <div className="text-xs text-gray-400">
                    Confidence
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Signal Summary */}
        {totalSignalsToday > 0 && (
          <div className="pt-4 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-white">{totalSignalsToday}</p>
                <p className="text-xs text-gray-400">Total</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-400">
                  {signals.filter(s => s.signal_type === 'BUY').length}
                </p>
                <p className="text-xs text-gray-400">Buy</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-400">
                  {signals.filter(s => s.signal_type === 'SELL').length}
                </p>
                <p className="text-xs text-gray-400">Sell</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}