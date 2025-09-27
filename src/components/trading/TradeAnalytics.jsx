import { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { tradingApi } from '../../services/tradingApi'
import { BarChart3, TrendingUp, TrendingDown, Target, AlertTriangle, PieChart, Activity } from 'lucide-react'

export function TradeAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchAnalytics = async () => {
    try {
      const response = await tradingApi.getTradeAnalytics()
      setAnalytics(response?.analytics)
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to fetch trade analytics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return `${value.toFixed(2)}%`
  }

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '₹0'
    return `₹${value.toLocaleString('en-IN')}`
  }

  const formatRatio = (value) => {
    if (value === null || value === undefined) return 'N/A'
    return value.toFixed(3)
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
        <div className="flex items-center mb-6">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Trade Analytics</h3>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        {!analytics ? (
          <div className="text-center py-8 text-gray-400">
            <PieChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No analytics data available</p>
            <p className="text-xs mt-1">Execute some trades to see analytics</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Performance Overview */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Performance Overview
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Total Trades</div>
                  <div className="text-lg font-semibold text-white">
                    {analytics.total_trades || 0}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Win Rate</div>
                  <div className={`text-lg font-semibold ${
                    (analytics.win_rate || 0) >= 50 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatPercentage(analytics.win_rate)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Total P&L</div>
                  <div className={`text-lg font-semibold flex items-center ${
                    (analytics.total_pnl || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(analytics.total_pnl || 0) >= 0 ?
                      <TrendingUp className="w-4 h-4 mr-1" /> :
                      <TrendingDown className="w-4 h-4 mr-1" />
                    }
                    {formatCurrency(analytics.total_pnl)}
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Metrics */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Risk Metrics
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Sharpe Ratio</div>
                  <div className={`text-sm font-medium ${
                    (analytics.sharpe_ratio || 0) >= 1 ? 'text-green-400' :
                    (analytics.sharpe_ratio || 0) >= 0.5 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatRatio(analytics.sharpe_ratio)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Sortino Ratio</div>
                  <div className={`text-sm font-medium ${
                    (analytics.sortino_ratio || 0) >= 1 ? 'text-green-400' :
                    (analytics.sortino_ratio || 0) >= 0.5 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatRatio(analytics.sortino_ratio)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Max Drawdown</div>
                  <div className="text-sm font-medium text-red-400">
                    {formatPercentage(analytics.max_drawdown)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">VaR (95%)</div>
                  <div className="text-sm font-medium text-orange-400">
                    {formatCurrency(analytics.var_95)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Profit Factor</div>
                  <div className={`text-sm font-medium ${
                    (analytics.profit_factor || 0) >= 1.5 ? 'text-green-400' :
                    (analytics.profit_factor || 0) >= 1 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatRatio(analytics.profit_factor)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Calmar Ratio</div>
                  <div className={`text-sm font-medium ${
                    (analytics.calmar_ratio || 0) >= 1 ? 'text-green-400' :
                    (analytics.calmar_ratio || 0) >= 0.5 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatRatio(analytics.calmar_ratio)}
                  </div>
                </div>
              </div>
            </div>

            {/* Trade Statistics */}
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-1" />
                Trade Statistics
              </h4>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Avg P&L per Trade</div>
                  <div className={`text-sm font-medium ${
                    (analytics.average_pnl_per_trade || 0) >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(analytics.average_pnl_per_trade)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Best Trade</div>
                  <div className="text-sm font-medium text-green-400">
                    {formatCurrency(analytics.best_trade)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Worst Trade</div>
                  <div className="text-sm font-medium text-red-400">
                    {formatCurrency(analytics.worst_trade)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Avg Trade Duration</div>
                  <div className="text-sm font-medium text-white">
                    {analytics.average_trade_duration ?
                      `${Math.round(analytics.average_trade_duration)}min` : 'N/A'
                    }
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Winning Trades</div>
                  <div className="text-sm font-medium text-green-400">
                    {analytics.winning_trades || 0}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">Losing Trades</div>
                  <div className="text-sm font-medium text-red-400">
                    {analytics.losing_trades || 0}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Metrics */}
            {analytics.recovery_factor && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-3">Additional Metrics</h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Recovery Factor</div>
                    <div className="text-sm font-medium text-blue-400">
                      {formatRatio(analytics.recovery_factor)}
                    </div>
                  </div>
                  {analytics.expectancy && (
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="text-xs text-gray-400 mb-1">Expectancy</div>
                      <div className="text-sm font-medium text-purple-400">
                        {formatCurrency(analytics.expectancy)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}