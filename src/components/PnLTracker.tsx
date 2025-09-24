import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Target, DollarSign, PieChart, BarChart3, Activity, Wallet } from 'lucide-react';

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
    if (pnl > 0) return 'text-emerald-600';
    if (pnl < 0) return 'text-red-500';
    return 'text-slate-600';
  };

  const getPnLBg = (pnl: number) => {
    if (pnl > 0) return 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200';
    if (pnl < 0) return 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200';
    return 'bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div>
              <div className="h-6 w-24 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Portfolio Tracker</h2>
            <p className="text-slate-500 text-sm">Paper trading performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-emerald-600' : 'text-red-600'}`}>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Key P&L Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`rounded-xl p-4 border ${getPnLBg(pnlData.total_pnl)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-600 text-sm font-medium">Total P&L</div>
            {pnlData.total_pnl >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className={`text-2xl font-bold ${getPnLColor(pnlData.total_pnl)}`}>
            {formatCurrency(pnlData.total_pnl)}
          </div>
          <div className="text-xs text-slate-500 mt-1">All time</div>
        </div>

        <div className={`rounded-xl p-4 border ${getPnLBg(pnlData.day_pnl)}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-600 text-sm font-medium">Day P&L</div>
            {pnlData.day_pnl >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className={`text-2xl font-bold ${getPnLColor(pnlData.day_pnl)}`}>
            {formatCurrency(pnlData.day_pnl)}
          </div>
          <div className="text-xs text-slate-500 mt-1">Today</div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-blue-600 text-sm font-medium">Total Trades</div>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{pnlData.total_trades}</div>
          <div className="text-xs text-blue-500 mt-1">Executed</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-purple-600 text-sm font-medium">Win Rate</div>
            <Target className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{formatPercentage(pnlData.win_rate)}</div>
          <div className="text-xs text-purple-500 mt-1">Success rate</div>
        </div>
      </div>

      {/* Recent Trades */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Trades</h3>
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <BarChart3 className="w-4 h-4" />
              <span>Paper Trading</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {recentTrades.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="p-4 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Trade Side */}
                      <div className={`p-2 rounded-lg ${
                        trade.side === 'BUY'
                          ? 'bg-emerald-100'
                          : 'bg-red-100'
                      }`}>
                        {trade.side === 'BUY' ? (
                          <TrendingUp className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                      </div>

                      {/* Trade Details */}
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className={`font-bold text-lg ${
                            trade.side === 'BUY' ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                            {trade.side}
                          </span>
                          <span className="text-slate-900 font-medium">
                            {trade.symbol.replace('NIFTY259232', '').substring(0, 12)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trade.status === 'OPEN'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}>
                            {trade.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span>Entry: ₹{trade.entry_price.toFixed(2)}</span>
                          {trade.exit_price && <span>Exit: ₹{trade.exit_price.toFixed(2)}</span>}
                          <span>Qty: {trade.quantity}</span>
                          {trade.duration && <span>Duration: {trade.duration}m</span>}
                        </div>
                      </div>
                    </div>

                    {/* P&L */}
                    <div className={`px-3 py-2 rounded-xl border text-center ${
                      trade.pnl > 0
                        ? 'bg-emerald-50 border-emerald-200'
                        : trade.pnl < 0
                          ? 'bg-red-50 border-red-200'
                          : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className={`text-lg font-bold ${getPnLColor(trade.pnl)}`}>
                        {formatCurrency(trade.pnl)}
                      </div>
                      <div className="text-xs text-slate-600">P&L</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <PieChart className="w-12 h-12 text-slate-300 mb-4" />
              <div className="text-slate-900 font-medium text-lg mb-2">No Trades Yet</div>
              <div className="text-slate-500 text-sm text-center max-w-md">
                Paper trades will appear here when signals are generated and executed by the algorithms.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">WINNING TRADES</div>
            <div className="text-slate-900 font-semibold">
              {recentTrades.filter(t => t.pnl > 0).length}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">LOSING TRADES</div>
            <div className="text-slate-900 font-semibold">
              {recentTrades.filter(t => t.pnl < 0).length}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">OPEN POSITIONS</div>
            <div className="text-slate-900 font-semibold">
              {recentTrades.filter(t => t.status === 'OPEN').length}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">AVG DURATION</div>
            <div className="text-slate-900 font-semibold">
              {recentTrades.filter(t => t.duration).length > 0
                ? Math.round(recentTrades.filter(t => t.duration).reduce((acc, t) => acc + (t.duration || 0), 0) / recentTrades.filter(t => t.duration).length)
                : 0}m
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};