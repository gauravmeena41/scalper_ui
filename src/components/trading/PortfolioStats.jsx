import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { usePortfolioStore } from '../../stores/portfolioStore'
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react'

export const PortfolioStats = () => {
  const {
    totalPnL,
    dayPnL,
    totalTrades,
    winRate,
    currentPositions,
    getPortfolioSummary
  } = usePortfolioStore()

  const summary = getPortfolioSummary()

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(1)}%`
  }

  return (
    <Card
      title="Portfolio Performance"
      subtitle="Real-time P&L tracking"
      action={
        <Badge variant={currentPositions.length > 0 ? 'warning' : 'default'}>
          {currentPositions.length} Active
        </Badge>
      }
    >
      <div className="space-y-6">
        {/* Total P&L */}
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">Total P&L</p>
          <div className={`text-3xl font-bold ${
            totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(totalPnL)}
          </div>
          <div className={`text-sm flex items-center justify-center mt-1 ${
            totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {totalPnL >= 0 ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {formatPercent((totalPnL / summary.totalValue) * 100)}
          </div>
        </div>

        {/* Day P&L */}
        <div className="text-center py-3 border-y border-gray-800">
          <p className="text-sm text-gray-400 mb-1">Today's P&L</p>
          <div className={`text-2xl font-bold ${
            dayPnL >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatCurrency(dayPnL)}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-4 h-4 text-blue-400 mr-1" />
              <p className="text-xs text-gray-400">Total Trades</p>
            </div>
            <p className="text-lg font-bold text-white">{totalTrades}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-4 h-4 text-green-400 mr-1" />
              <p className="text-xs text-gray-400">Win Rate</p>
            </div>
            <p className="text-lg font-bold text-white">{winRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Capital Utilization */}
        <div className="pt-3 border-t border-gray-800">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400">Capital Used</span>
            <span className="text-xs text-white">
              {formatPercent(summary.capitalUtilization)}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                summary.capitalUtilization > 80 ? 'bg-red-500' :
                summary.capitalUtilization > 60 ? 'bg-yellow-500' :
                'bg-green-500'
              }`}
              style={{ width: `${Math.min(summary.capitalUtilization, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatCurrency(summary.totalValue - summary.totalPnL - summary.unrealizedPnL)}</span>
            <span>{formatCurrency(summary.totalValue)}</span>
          </div>
        </div>

        {/* Unrealized P&L if there are active positions */}
        {summary.unrealizedPnL !== 0 && (
          <div className="pt-3 border-t border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Unrealized P&L</span>
              <span className={`text-sm font-medium ${
                summary.unrealizedPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(summary.unrealizedPnL)}
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}