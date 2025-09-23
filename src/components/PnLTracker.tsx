import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign, PieChart, BarChart3, Activity } from 'lucide-react';

interface PnLData {
  total_pnl: number;
  day_pnl: number;
  total_trades: number;
  win_rate: number;
  current_positions: any[];
  max_drawdown?: number;
  profit_factor?: number;
  sharpe_ratio?: number;
  best_trade?: number;
  worst_trade?: number;
  avg_profit?: number;
  avg_loss?: number;
}

interface Trade {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  entry_price: number;
  exit_price?: number;
  quantity: number;
  pnl: number;
  status: 'OPEN' | 'CLOSED';
  entry_time: string;
  exit_time?: string;
  duration?: number;
}

export const PnLTracker: React.FC = () => {
  const [pnlData, setPnlData] = useState<PnLData>({
    total_pnl: 0,
    day_pnl: 0,
    total_trades: 0,
    win_rate: 0,
    current_positions: []
  });
  const [recentTrades, setRecentTrades] = useState<Trade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchPnLData = async () => {
      try {
        const response = await fetch('http://localhost:8502/api/portfolio');
        if (response.ok) {
          const data = await response.json();
          setPnlData(data);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to fetch P&L data:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Mock recent trades data - replace with real API call
    const mockTrades: Trade[] = [
      {
        id: '1',
        symbol: 'NIFTY2592325200CE',
        side: 'BUY',
        entry_price: 25.50,
        exit_price: 28.75,
        quantity: 100,
        pnl: 325.00,
        status: 'CLOSED',
        entry_time: new Date(Date.now() - 3600000).toISOString(),
        exit_time: new Date(Date.now() - 1800000).toISOString(),
        duration: 30
      },
      {
        id: '2',
        symbol: 'NIFTY2592325150PE',
        side: 'SELL',
        entry_price: 42.25,
        exit_price: 38.90,
        quantity: 50,
        pnl: 167.50,
        status: 'CLOSED',
        entry_time: new Date(Date.now() - 7200000).toISOString(),
        exit_time: new Date(Date.now() - 3600000).toISOString(),
        duration: 60
      },
      {
        id: '3',
        symbol: 'NIFTY2592325100CE',
        side: 'BUY',
        entry_price: 76.50,
        quantity: 25,
        pnl: -87.50,
        status: 'OPEN',
        entry_time: new Date(Date.now() - 900000).toISOString()
      }
    ];

    setRecentTrades(mockTrades);
    fetchPnLData();

    // Set up polling every 10 seconds
    const interval = setInterval(fetchPnLData, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (percent: number) => {
    return `${percent.toFixed(2)}%`;
  };

  const getPnLColor = (pnl: number) => {
    if (pnl > 0) return 'text-green-400';
    if (pnl < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getPnLBgColor = (pnl: number) => {
    if (pnl > 0) return 'bg-green-500/10 border-green-500/20';
    if (pnl < 0) return 'bg-red-500/10 border-red-500/20';
    return 'bg-gray-500/10 border-gray-500/20';
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <DollarSign className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-bold text-white">P&L Tracker</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/20 p-3 rounded-xl">
            <DollarSign className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">P&L Tracker</h2>
            <p className="text-gray-400 text-sm">Paper trading performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Key P&L Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl p-4 border ${getPnLBgColor(pnlData.total_pnl)}`}>
          <div className="text-gray-400 text-sm font-medium">Total P&L</div>
          <div className={`text-2xl font-bold ${getPnLColor(pnlData.total_pnl)}`}>
            {formatCurrency(pnlData.total_pnl)}
          </div>
          <div className="flex items-center mt-1">
            {pnlData.total_pnl >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
            )}
            <span className="text-xs text-gray-400">All time</span>
          </div>
        </div>

        <div className={`rounded-xl p-4 border ${getPnLBgColor(pnlData.day_pnl)}`}>
          <div className="text-gray-400 text-sm font-medium">Day P&L</div>
          <div className={`text-2xl font-bold ${getPnLColor(pnlData.day_pnl)}`}>
            {formatCurrency(pnlData.day_pnl)}
          </div>
          <div className="flex items-center mt-1">
            {pnlData.day_pnl >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400 mr-1" />
            )}
            <span className="text-xs text-gray-400">Today</span>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-400 text-sm font-medium">Total Trades</div>
          <div className="text-2xl font-bold text-white">{pnlData.total_trades}</div>
          <div className="flex items-center mt-1">
            <Activity className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-xs text-gray-400">Executed</span>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="text-purple-400 text-sm font-medium">Win Rate</div>
          <div className="text-2xl font-bold text-white">{formatPercentage(pnlData.win_rate)}</div>
          <div className="flex items-center mt-1">
            <Target className="w-4 h-4 text-purple-400 mr-1" />
            <span className="text-xs text-gray-400">Success</span>
          </div>
        </div>
      </div>

      {/* Advanced Metrics */}
      {(pnlData.max_drawdown !== undefined || pnlData.profit_factor !== undefined) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {pnlData.max_drawdown !== undefined && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
              <div className="text-orange-400 text-sm font-medium">Max Drawdown</div>
              <div className="text-lg font-bold text-white">{formatPercentage(pnlData.max_drawdown)}</div>
            </div>
          )}
          {pnlData.profit_factor !== undefined && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3">
              <div className="text-cyan-400 text-sm font-medium">Profit Factor</div>
              <div className="text-lg font-bold text-white">{pnlData.profit_factor.toFixed(2)}</div>
            </div>
          )}
          {pnlData.sharpe_ratio !== undefined && (
            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
              <div className="text-indigo-400 text-sm font-medium">Sharpe Ratio</div>
              <div className="text-lg font-bold text-white">{pnlData.sharpe_ratio.toFixed(2)}</div>
            </div>
          )}
          {pnlData.avg_profit !== undefined && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
              <div className="text-green-400 text-sm font-medium">Avg Profit</div>
              <div className="text-lg font-bold text-white">{formatCurrency(pnlData.avg_profit)}</div>
            </div>
          )}
        </div>
      )}

      {/* Recent Trades Table */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gray-800/50 border-b border-gray-700/50 p-4">
          <h3 className="text-lg font-bold text-white">Recent Trades</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/30">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-300">Symbol</th>
                <th className="text-left p-3 text-sm font-medium text-gray-300">Side</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Entry</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Exit</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Qty</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">P&L</th>
                <th className="text-left p-3 text-sm font-medium text-gray-300">Status</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Duration</th>
              </tr>
            </thead>
            <tbody>
              {recentTrades.map((trade) => (
                <tr key={trade.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                  <td className="p-3 text-sm text-white font-medium">
                    {trade.symbol.replace('NIFTY259232', '').substring(0, 8)}...
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.side === 'BUY'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.side}
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm text-white">₹{trade.entry_price.toFixed(2)}</td>
                  <td className="p-3 text-right text-sm text-gray-300">
                    {trade.exit_price ? `₹${trade.exit_price.toFixed(2)}` : '-'}
                  </td>
                  <td className="p-3 text-right text-sm text-white">{trade.quantity}</td>
                  <td className="p-3 text-right">
                    <span className={`text-sm font-bold ${getPnLColor(trade.pnl)}`}>
                      {formatCurrency(trade.pnl)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      trade.status === 'OPEN'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {trade.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm text-gray-400">
                    {trade.duration ? `${trade.duration}m` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentTrades.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <PieChart className="w-12 h-12 text-gray-500 mb-4" />
            <div className="text-gray-400 text-lg">No trades available</div>
            <div className="text-gray-500 text-sm">Paper trades will appear here</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <BarChart3 className="w-4 h-4" />
            <span>Paper Trading Mode</span>
          </div>
          <div className="text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};