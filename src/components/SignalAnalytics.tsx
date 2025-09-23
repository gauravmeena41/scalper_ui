import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Target, AlertCircle, Clock, DollarSign } from 'lucide-react';

interface Signal {
  id: string;
  symbol: string;
  signal_type: 'BUY' | 'SELL';
  price: number;
  vwap: number;
  deviation: number;
  confidence: number;
  timestamp: string;
  algorithm: string;
}

interface SignalStats {
  total_signals: number;
  buy_signals: number;
  sell_signals: number;
  avg_confidence: number;
  high_confidence_signals: number;
  signals_per_minute: number;
}

export const SignalAnalytics: React.FC = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [stats, setStats] = useState<SignalStats>({
    total_signals: 0,
    buy_signals: 0,
    sell_signals: 0,
    avg_confidence: 0,
    high_confidence_signals: 0,
    signals_per_minute: 0
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await fetch('http://localhost:8502/api/signals');
        if (response.ok) {
          const data = await response.json();
          setSignals(data.signals || []);
          setStats(data.stats || stats);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to fetch signals:', error);
        setIsConnected(false);
      }
    };

    // Fetch immediately
    fetchSignals();

    // Set up polling every 5 seconds
    const interval = setInterval(fetchSignals, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSignalColorClass = (signalType: string) => {
    return signalType === 'BUY'
      ? 'text-green-400 bg-green-500/20 border-green-500/30'
      : 'text-red-400 bg-red-500/20 border-red-500/30';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-emerald-400';
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.7) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-500/20 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Signal Analytics</h2>
            <p className="text-gray-400 text-sm">Real-time algorithm performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-400 text-sm font-medium">Total Signals</div>
          <div className="text-2xl font-bold text-white">{stats.total_signals}</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-green-400 text-sm font-medium">Buy Signals</div>
          <div className="text-2xl font-bold text-white">{stats.buy_signals}</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="text-red-400 text-sm font-medium">Sell Signals</div>
          <div className="text-2xl font-bold text-white">{stats.sell_signals}</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="text-yellow-400 text-sm font-medium">Avg Confidence</div>
          <div className="text-2xl font-bold text-white">{(stats.avg_confidence * 100).toFixed(1)}%</div>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
          <div className="text-emerald-400 text-sm font-medium">High Confidence</div>
          <div className="text-2xl font-bold text-white">{stats.high_confidence_signals}</div>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="text-purple-400 text-sm font-medium">Signals/Min</div>
          <div className="text-2xl font-bold text-white">{stats.signals_per_minute.toFixed(1)}</div>
        </div>
      </div>

      {/* Recent Signals Table */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gray-800/50 border-b border-gray-700/50 p-4">
          <h3 className="text-lg font-bold text-white">Recent Signals</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/30">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-300">Time</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">Symbol</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">Type</th>
                <th className="text-right p-4 text-sm font-medium text-gray-300">Price</th>
                <th className="text-right p-4 text-sm font-medium text-gray-300">VWAP</th>
                <th className="text-right p-4 text-sm font-medium text-gray-300">Deviation</th>
                <th className="text-right p-4 text-sm font-medium text-gray-300">Confidence</th>
                <th className="text-left p-4 text-sm font-medium text-gray-300">Algorithm</th>
              </tr>
            </thead>
            <tbody>
              {signals.slice(0, 10).map((signal, index) => (
                <tr key={signal.id || index} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                  <td className="p-4 text-sm text-gray-300">
                    {new Date(signal.timestamp).toLocaleTimeString()}
                  </td>
                  <td className="p-4 text-sm text-white font-medium">
                    {signal.symbol.replace('NSE:', '').substring(0, 15)}...
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getSignalColorClass(signal.signal_type)}`}>
                      {signal.signal_type}
                    </span>
                  </td>
                  <td className="p-4 text-right text-sm text-white font-medium">
                    ₹{signal.price.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-sm text-gray-300">
                    ₹{signal.vwap.toFixed(2)}
                  </td>
                  <td className="p-4 text-right text-sm text-white font-medium">
                    {signal.deviation.toFixed(2)}%
                  </td>
                  <td className="p-4 text-right">
                    <span className={`text-sm font-bold ${getConfidenceColor(signal.confidence)}`}>
                      {(signal.confidence * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {signal.algorithm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {signals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Target className="w-12 h-12 text-gray-500 mb-4" />
            <div className="text-gray-400 text-lg">No signals available</div>
            <div className="text-gray-500 text-sm">Waiting for algorithm data...</div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-gray-800/50 px-3 py-1 rounded-lg">
            <div className="text-xs text-gray-400">Auto-refresh: 5s</div>
          </div>
        </div>
      </div>
    </div>
  );
};