import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, AlertCircle, Clock, Zap } from 'lucide-react';

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
  const [isLoading, setIsLoading] = useState(true);

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
      } finally {
        setIsLoading(false);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 5000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div>
              <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-48 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-20 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getSignalIcon = (signalType: string) => {
    return signalType === 'BUY'
      ? <TrendingUp className="w-4 h-4 text-emerald-600" />
      : <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-emerald-600';
    if (confidence >= 0.8) return 'text-blue-600';
    if (confidence >= 0.7) return 'text-amber-600';
    return 'text-orange-600';
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.9) return 'bg-emerald-100 border-emerald-200';
    if (confidence >= 0.8) return 'bg-blue-100 border-blue-200';
    if (confidence >= 0.7) return 'bg-amber-100 border-amber-200';
    return 'bg-orange-100 border-orange-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Signal Analytics</h2>
            <p className="text-slate-500 text-sm">Real-time algorithm performance</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-emerald-600' : 'text-red-600'}`}>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4">
          <div className="text-blue-600 text-sm font-medium mb-1">Total Signals</div>
          <div className="text-2xl font-bold text-slate-900">{stats.total_signals}</div>
          <div className="text-blue-500 text-xs">All time</div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-xl p-4">
          <div className="text-emerald-600 text-sm font-medium mb-1">Buy Signals</div>
          <div className="text-2xl font-bold text-slate-900">{stats.buy_signals}</div>
          <div className="text-emerald-500 text-xs">Bullish</div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-xl p-4">
          <div className="text-red-600 text-sm font-medium mb-1">Sell Signals</div>
          <div className="text-2xl font-bold text-slate-900">{stats.sell_signals}</div>
          <div className="text-red-500 text-xs">Bearish</div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 rounded-xl p-4">
          <div className="text-amber-600 text-sm font-medium mb-1">Avg Confidence</div>
          <div className="text-2xl font-bold text-slate-900">{(stats.avg_confidence * 100).toFixed(1)}%</div>
          <div className="text-amber-500 text-xs">Accuracy</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-4">
          <div className="text-purple-600 text-sm font-medium mb-1">High Quality</div>
          <div className="text-2xl font-bold text-slate-900">{stats.high_confidence_signals}</div>
          <div className="text-purple-500 text-xs">90%+ conf</div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 rounded-xl p-4">
          <div className="text-teal-600 text-sm font-medium mb-1">Frequency</div>
          <div className="text-2xl font-bold text-slate-900">{stats.signals_per_minute.toFixed(1)}</div>
          <div className="text-teal-500 text-xs">per minute</div>
        </div>
      </div>

      {/* Recent Signals */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
        <div className="bg-white border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Recent Signals</h3>
            <div className="flex items-center space-x-2 text-slate-500 text-sm">
              <Zap className="w-4 h-4" />
              <span>Live Updates</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {signals.length > 0 ? (
            <div className="divide-y divide-slate-200">
              {signals.slice(0, 10).map((signal, index) => (
                <div key={signal.id || index} className="p-4 hover:bg-white transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Signal Type */}
                      <div className={`p-2 rounded-lg ${
                        signal.signal_type === 'BUY'
                          ? 'bg-emerald-100'
                          : 'bg-red-100'
                      }`}>
                        {getSignalIcon(signal.signal_type)}
                      </div>

                      {/* Signal Details */}
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className={`font-bold text-lg ${
                            signal.signal_type === 'BUY' ? 'text-emerald-600' : 'text-red-500'
                          }`}>
                            {signal.signal_type}
                          </span>
                          <span className="text-slate-900 font-medium">
                            {signal.symbol.replace('NSE:', '').substring(0, 20)}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceBg(signal.confidence)} ${getConfidenceColor(signal.confidence)}`}>
                            {signal.algorithm}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-slate-600">
                          <span className="font-medium">₹{signal.price.toFixed(2)}</span>
                          <span>VWAP: ₹{signal.vwap.toFixed(2)}</span>
                          <span>Dev: {signal.deviation.toFixed(2)}%</span>
                          <span>{new Date(signal.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Confidence Badge */}
                    <div className={`px-3 py-2 rounded-xl border text-center ${getConfidenceBg(signal.confidence)}`}>
                      <div className={`text-lg font-bold ${getConfidenceColor(signal.confidence)}`}>
                        {(signal.confidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-slate-600">confidence</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Target className="w-12 h-12 text-slate-300 mb-4" />
              <div className="text-slate-900 font-medium text-lg mb-2">No Signals Yet</div>
              <div className="text-slate-500 text-sm text-center max-w-md">
                VWAP and AMSA algorithms are monitoring market conditions.<br />
                Signals will appear when trading opportunities are detected.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4 text-slate-500">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>Updated: {new Date().toLocaleTimeString()}</span>
          </div>
          <span>•</span>
          <span>Auto-refresh: 5s</span>
        </div>
        <div className="text-slate-500">
          Powered by VWAP & AMSA algorithms
        </div>
      </div>
    </div>
  );
};