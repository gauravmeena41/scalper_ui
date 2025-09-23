import React from 'react';
import { formatPrice, formatVolume, getPriceColorClass } from '../utils/formatting';
import { Target } from 'lucide-react';

interface OptionData {
  symbol: string;
  ltp: number;
  change: number;
  change_percent: number;
  volume: number;
  oi: number;
  timestamp: number;
}

interface OptionsChainProps {
  options: OptionData[];
  isLoading?: boolean;
}

export const OptionsChain: React.FC<OptionsChainProps> = ({
  options,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-4">
          <Target className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-bold text-white">Options Chain</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  // Separate and sort options
  const callOptions = options
    .filter(option => option.symbol.includes('CE'))
    .sort((a, b) => {
      const strikeA = parseFloat(a.symbol.match(/(\d+)CE/)?.[1] || '0');
      const strikeB = parseFloat(b.symbol.match(/(\d+)CE/)?.[1] || '0');
      return strikeA - strikeB;
    });

  const putOptions = options
    .filter(option => option.symbol.includes('PE'))
    .sort((a, b) => {
      const strikeA = parseFloat(a.symbol.match(/(\d+)PE/)?.[1] || '0');
      const strikeB = parseFloat(b.symbol.match(/(\d+)PE/)?.[1] || '0');
      return strikeA - strikeB;
    });

  const renderOptionRow = (option: OptionData) => {
    const colorClass = getPriceColorClass(option.change);
    const strike = option.symbol.match(/(\d+)(CE|PE)/)?.[1] || '';
    const optionType = option.symbol.includes('CE') ? 'CE' : 'PE';

    return (
      <div
        key={option.symbol}
        className="grid grid-cols-6 gap-4 py-4 px-6 border-b border-gray-700/30 hover:bg-gray-700/20 transition-colors"
      >
        <div className="text-sm font-bold text-white">
          {strike}
        </div>
        <div className={`text-sm font-bold ${colorClass}`}>
          ₹{formatPrice(option.ltp, 2)}
        </div>
        <div className={`text-sm font-medium ${colorClass}`}>
          {option.change >= 0 ? '+' : ''}{option.change_percent.toFixed(2)}%
        </div>
        <div className="text-sm text-gray-300">
          {formatVolume(option.volume)}
        </div>
        <div className="text-sm text-gray-300">
          {formatVolume(option.oi)}
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
            optionType === 'CE'
              ? 'bg-green-500/20 text-green-400 border border-green-500/30'
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {optionType}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-500/20 p-3 rounded-xl">
            <Target className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Options Chain</h2>
            <p className="text-gray-400 text-sm">Live market data</p>
          </div>
        </div>
        <div className="bg-gray-800/50 px-4 py-2 rounded-xl border border-gray-700/50">
          <div className="text-sm text-gray-400">Live Contracts</div>
          <div className="text-lg font-bold text-white">{options.length}</div>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 py-4 px-6 bg-gray-800/50 border-b border-gray-700/50">
          <div className="text-sm font-bold text-gray-300">Strike</div>
          <div className="text-sm font-bold text-gray-300">LTP</div>
          <div className="text-sm font-bold text-gray-300">Change%</div>
          <div className="text-sm font-bold text-gray-300">Volume</div>
          <div className="text-sm font-bold text-gray-300">OI</div>
          <div className="text-sm font-bold text-gray-300">Type</div>
        </div>

        {/* Options List */}
        <div className="max-h-80 overflow-y-auto">
          {options.length > 0 ? (
            options
              .sort((a, b) => {
                const strikeA = parseFloat(a.symbol.match(/(\d+)(CE|PE)/)?.[1] || '0');
                const strikeB = parseFloat(b.symbol.match(/(\d+)(CE|PE)/)?.[1] || '0');
                return strikeA - strikeB;
              })
              .map(renderOptionRow)
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <Target className="w-12 h-12 text-gray-500 mb-4" />
              <div className="text-gray-400 text-lg">No options data available</div>
              <div className="text-gray-500 text-sm">Waiting for market data...</div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Summary */}
      {options.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
            <div className="text-green-400 text-sm font-medium">Call Options (CE)</div>
            <div className="text-2xl font-bold text-white">{callOptions.length}</div>
            <div className="text-green-300 text-xs">Active contracts</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="text-red-400 text-sm font-medium">Put Options (PE)</div>
            <div className="text-2xl font-bold text-white">{putOptions.length}</div>
            <div className="text-red-300 text-xs">Active contracts</div>
          </div>
        </div>
      )}
    </div>
  );
};