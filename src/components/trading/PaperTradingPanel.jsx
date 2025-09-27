import { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { tradingApi } from '../../services/tradingApi'
import { Play, Square, RotateCcw, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

export function PaperTradingPanel() {
  const [status, setStatus] = useState(null)
  const [portfolio, setPortfolio] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    try {
      const [statusResponse, portfolioResponse] = await Promise.all([
        tradingApi.getPaperTradingStatus(),
        tradingApi.getPaperPortfolio()
      ])
      setStatus(statusResponse)
      setPortfolio(portfolioResponse?.portfolio)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch paper trading data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Refresh every 10 seconds
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleStart = async () => {
    setActionLoading(true)
    try {
      await tradingApi.startPaperTrading()
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to start paper trading')
    } finally {
      setActionLoading(false)
    }
  }

  const handleStop = async () => {
    setActionLoading(true)
    try {
      await tradingApi.stopPaperTrading()
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to stop paper trading')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReset = async () => {
    if (!confirm('Are you sure you want to reset the paper trading portfolio? This will clear all trades and reset the balance.')) {
      return
    }
    setActionLoading(true)
    try {
      await tradingApi.resetPaperTrading()
      await fetchData()
    } catch (err) {
      setError(err.message || 'Failed to reset paper trading')
    } finally {
      setActionLoading(false)
    }
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
            <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            Paper Trading
          </h3>
          <Badge variant={status?.is_active ? 'success' : 'secondary'}>
            {status?.is_active ? 'ACTIVE' : 'STOPPED'}
          </Badge>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={handleStart}
            disabled={actionLoading || status?.is_active}
            className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:opacity-50 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <Play className="w-4 h-4 mr-1" />
            Start Trading
          </button>
          <button
            onClick={handleStop}
            disabled={actionLoading || !status?.is_active}
            className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:opacity-50 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <Square className="w-4 h-4 mr-1" />
            Stop Trading
          </button>
          <button
            onClick={handleReset}
            disabled={actionLoading}
            className="flex items-center px-3 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:opacity-50 rounded-lg text-white text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset Portfolio
          </button>
        </div>

        {/* Portfolio Stats */}
        {portfolio && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Total Capital</div>
                <div className="text-sm font-medium text-white">
                  ₹{portfolio.total_capital?.toLocaleString('en-IN') || '0'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Available Cash</div>
                <div className="text-sm font-medium text-white">
                  ₹{portfolio.available_cash?.toLocaleString('en-IN') || '0'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Used Margin</div>
                <div className="text-sm font-medium text-white">
                  ₹{portfolio.used_margin?.toLocaleString('en-IN') || '0'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Total P&L</div>
                <div className={`text-sm font-medium flex items-center ${
                  (portfolio.total_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  <DollarSign className="w-3 h-3 mr-1" />
                  ₹{portfolio.total_pnl?.toLocaleString('en-IN') || '0'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Realized P&L</div>
                <div className={`text-sm font-medium flex items-center ${
                  (portfolio.realized_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(portfolio.realized_pnl || 0) >= 0 ?
                    <TrendingUp className="w-3 h-3 mr-1" /> :
                    <TrendingDown className="w-3 h-3 mr-1" />
                  }
                  ₹{portfolio.realized_pnl?.toLocaleString('en-IN') || '0'}
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">Unrealized P&L</div>
                <div className={`text-sm font-medium flex items-center ${
                  (portfolio.unrealized_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {(portfolio.unrealized_pnl || 0) >= 0 ?
                    <TrendingUp className="w-3 h-3 mr-1" /> :
                    <TrendingDown className="w-3 h-3 mr-1" />
                  }
                  ₹{portfolio.unrealized_pnl?.toLocaleString('en-IN') || '0'}
                </div>
              </div>
            </div>

            {status?.start_time && (
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-700">
                Started: {new Date(status.start_time).toLocaleString('en-IN')}
              </div>
            )}
          </div>
        )}

        {actionLoading && (
          <div className="mt-4 flex items-center justify-center">
            <LoadingSpinner size="sm" />
            <span className="ml-2 text-sm text-gray-400">Processing...</span>
          </div>
        )}
      </div>
    </Card>
  )
}