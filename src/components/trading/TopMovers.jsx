import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { useMarketStore } from '../../stores/marketStore'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

export const TopMovers = () => {
  const { topGainers, topLosers } = useMarketStore()

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const formatPercentage = (percent) => {
    const sign = percent >= 0 ? '+' : ''
    return `${sign}${percent.toFixed(2)}%`
  }

  return (
    <Card
      title="Top Movers"
      subtitle="Market leaders & laggers"
      action={
        <Badge variant="info" size="xs">
          Live Data
        </Badge>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Gainers */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h3 className="text-sm font-medium text-green-400">Top Gainers</h3>
          </div>

          <div className="space-y-3">
            {topGainers.length === 0 ? (
              <div className="text-center py-4">
                <BarChart3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">No gainers data</p>
              </div>
            ) : (
              topGainers.slice(0, 5).map((stock, index) => (
                <div
                  key={stock.symbol || index}
                  className="flex items-center justify-between p-2 rounded-lg bg-green-900/10 border border-green-800/20"
                >
                  <div>
                    <div className="text-sm font-medium text-white">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatPrice(stock.price || stock.ltp)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-green-400">
                      {formatPercentage(stock.changePercent || stock.change_percent)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {stock.change && formatPrice(Math.abs(stock.change))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Losers */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="text-sm font-medium text-red-400">Top Losers</h3>
          </div>

          <div className="space-y-3">
            {topLosers.length === 0 ? (
              <div className="text-center py-4">
                <BarChart3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-gray-400 text-xs">No losers data</p>
              </div>
            ) : (
              topLosers.slice(0, 5).map((stock, index) => (
                <div
                  key={stock.symbol || index}
                  className="flex items-center justify-between p-2 rounded-lg bg-red-900/10 border border-red-800/20"
                >
                  <div>
                    <div className="text-sm font-medium text-white">
                      {stock.symbol}
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatPrice(stock.price || stock.ltp)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-medium text-red-400">
                      {formatPercentage(stock.changePercent || stock.change_percent)}
                    </div>
                    <div className="text-xs text-gray-400">
                      {stock.change && formatPrice(Math.abs(stock.change))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Market Summary */}
      {(topGainers.length > 0 || topLosers.length > 0) && (
        <div className="pt-4 mt-4 border-t border-gray-800">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-400">{topGainers.length}</p>
              <p className="text-xs text-gray-400">Gainers</p>
            </div>
            <div>
              <p className="text-lg font-bold text-red-400">{topLosers.length}</p>
              <p className="text-xs text-gray-400">Losers</p>
            </div>
            <div>
              <p className="text-lg font-bold text-gray-400">
                {topGainers.length + topLosers.length}
              </p>
              <p className="text-xs text-gray-400">Total</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}