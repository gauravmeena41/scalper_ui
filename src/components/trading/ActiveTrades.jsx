import { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { tradingApi } from '../../services/tradingApi'
import { Activity, TrendingUp, TrendingDown, Clock, Target } from 'lucide-react'

export function ActiveTrades() {
  const [trades, setTrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchActiveTrades = async () => {
    try {
      const response = await tradingApi.getActiveTrades()
      setTrades(response?.active_trades || [])
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch active trades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchActiveTrades()
    // Refresh every 5 seconds for active trades
    const interval = setInterval(fetchActiveTrades, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A'
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const calculateDuration = (entryTime) => {
    if (!entryTime) return 'N/A'
    const duration = Date.now() - new Date(entryTime).getTime()
    const minutes = Math.floor(duration / 60000)
    const seconds = Math.floor((duration % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  if (loading) {
    return (
      <Card>
        <div className="flex items-center justify-center p-6">
          <LoadingSpinner />
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-400" />
            Active Trades
          </h3>
          <Badge variant={trades.length > 0 ? 'success' : 'secondary'}>
            {trades.length} Active
          </Badge>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {trades.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No active trades</p>
            <p className="text-xs mt-1">Paper trades will appear here when signals are generated</p>
          </div>
        ) : (
          <div className="space-y-3">
            {trades.map((trade, index) => (
              <div key={trade.trade_id || index} className="bg-gray-800 rounded-lg p-4">
                {/* Trade Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-white">
                      {trade.symbol || 'Unknown Symbol'}
                    </span>
                    <Badge
                      variant={trade.signal_type === 'BUY' ? 'success' : 'destructive'}
                      size="sm"
                    >
                      {trade.signal_type || 'N/A'}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {calculateDuration(trade.entry_time)}
                  </div>
                </div>

                {/* Trade Details */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="text-xs text-gray-400">Entry Price</div>
                    <div className="text-sm font-medium text-white">
                      ₹{trade.entry_price?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Current Price</div>
                    <div className="text-sm font-medium text-white">
                      ₹{trade.current_price?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Quantity</div>
                    <div className="text-sm font-medium text-white">
                      {trade.quantity || '0'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Current P&L</div>
                    <div className={`text-sm font-medium flex items-center ${
                      (trade.current_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {(trade.current_pnl || 0) >= 0 ?
                        <TrendingUp className="w-3 h-3 mr-1" /> :
                        <TrendingDown className="w-3 h-3 mr-1" />
                      }
                      ₹{trade.current_pnl?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>

                {/* Stop Loss and Target */}
                {(trade.stop_loss || trade.profit_target) && (
                  <div className="grid grid-cols-2 gap-3 mb-3 pt-2 border-t border-gray-700">
                    {trade.stop_loss && (
                      <div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Stop Loss
                        </div>
                        <div className="text-sm font-medium text-red-400">
                          ₹{trade.stop_loss.toFixed(2)}
                        </div>
                      </div>
                    )}
                    {trade.profit_target && (
                      <div>
                        <div className="text-xs text-gray-400 flex items-center">
                          <Target className="w-3 h-3 mr-1" />
                          Target
                        </div>
                        <div className="text-sm font-medium text-green-400">
                          ₹{trade.profit_target.toFixed(2)}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Entry Time */}
                <div className="text-xs text-gray-500">
                  Entry: {formatTime(trade.entry_time)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}