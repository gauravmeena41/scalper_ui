import React from 'react';
import { formatTime, formatPrice, getPriceColorClass } from '../utils/formatting';
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from 'lucide-react';

interface TradingSignal {
  id: string;
  timestamp: string;
  signal_type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  confidence: number;
  description: string;
}

interface TradingSignalsProps {
  signals: TradingSignal[];
  isLoading?: boolean;
}

export const TradingSignals: React.FC<TradingSignalsProps> = ({
  signals,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <Zap className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-bold text-white">Trading Signals</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const getSignalIcon = (signal_type: string, confidence: number) => {
    if (signal_type === 'BUY') {
      return confidence >= 80 ?
        <TrendingUp className="w-4 h-4 text-green-400" /> :
        <TrendingUp className="w-4 h-4 text-green-300" />;
    } else {
      return confidence >= 80 ?
        <TrendingDown className="w-4 h-4 text-red-400" /> :
        <TrendingDown className="w-4 h-4 text-red-300" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 75) return 'text-yellow-400';
    if (confidence >= 60) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSignalTypeStyle = (signal_type: string) => {
    return signal_type === 'BUY'
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const renderSignal = (signal: TradingSignal) => {
    return (
      <div
        key={signal.id}
        className="border border-gray-700 rounded-lg p-4 hover:bg-gray-750/50 transition-colors"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {getSignalIcon(signal.signal_type, signal.confidence)}
            <span className="font-semibold text-white">{signal.symbol}</span>
            <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSignalTypeStyle(signal.signal_type)}`}>
              {signal.signal_type}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              {formatTime(signal.timestamp)}
            </div>
            <div className={`text-sm font-semibold ${getConfidenceColor(signal.confidence)}`}>
              {signal.confidence}% confidence
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-300">
            {signal.description}
          </div>
          <div className="text-white font-semibold">
            ₹{signal.price.toFixed(2)}
          </div>
        </div>
      </div>
    );
  };

  // Get today's signals count and performance
  const todaySignals = signals.filter(signal => {
    const signalDate = new Date(signal.timestamp).toDateString();
    const today = new Date().toDateString();
    return signalDate === today;
  });

  const highConfidenceSignals = signals.filter(signal => signal.confidence >= 80);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-yellow-500 mr-2" />
          <h3 className="text-lg font-bold text-white">Trading Signals</h3>
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-gray-400">
            Today: <span className="text-white font-semibold">{todaySignals.length}</span>
          </div>
          <div className="text-gray-400">
            High Confidence: <span className="text-green-400 font-semibold">{highConfidenceSignals.length}</span>
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {signals.length > 0 ? (
          signals
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 10) // Show last 10 signals
            .map(renderSignal)
        ) : (
          <div className="text-center py-8">
            <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-gray-400">No trading signals available</div>
            <div className="text-xs text-gray-500 mt-1">
              Signals will appear when market conditions are favorable
            </div>
          </div>
        )}
      </div>

      {/* Signal Performance Summary */}
      {signals.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="text-center">
              <div className="text-gray-400">Total Signals</div>
              <div className="text-white font-semibold text-lg">{signals.length}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Avg Confidence</div>
              <div className="text-white font-semibold text-lg">
                {Math.round(signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length)}%
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">BUY/SELL</div>
              <div className="text-white font-semibold text-lg">
                {signals.filter(s => s.signal_type === 'BUY').length}/
                {signals.filter(s => s.signal_type === 'SELL').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};