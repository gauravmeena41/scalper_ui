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
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div>
              <div className="h-6 w-32 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-40 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
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
        className="grid grid-cols-6 gap-4 py-4 px-6 border-b border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <div className="text-sm font-bold text-slate-900">
          {strike}
        </div>
        <div className={`text-sm font-bold ${colorClass}`}>
          ₹{formatPrice(option.ltp, 2)}
        </div>
        <div className={`text-sm font-medium ${colorClass}`}>
          {option.change >= 0 ? '+' : ''}{option.change_percent.toFixed(2)}%
        </div>
        <div className="text-sm text-slate-600">
          {formatVolume(option.volume)}
        </div>
        <div className="text-sm text-slate-600">
          {formatVolume(option.oi)}
        </div>
        <div className="flex items-center">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
            optionType === 'CE'
              ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : 'bg-red-100 text-red-700 border-red-200'
          }`}>
            {optionType}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
            <Target className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Options Chain</h2>
            <p className="text-slate-500 text-sm">Live market data</p>
          </div>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <div className="text-sm text-slate-500">Live Contracts</div>
          <div className="text-lg font-bold text-slate-900">{options.length}</div>
        </div>
      </div>

      {/* Modern Table */}
      <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-6 gap-4 py-4 px-6 bg-white border-b border-slate-200">
          <div className="text-sm font-bold text-slate-600">Strike</div>
          <div className="text-sm font-bold text-slate-600">LTP</div>
          <div className="text-sm font-bold text-slate-600">Change%</div>
          <div className="text-sm font-bold text-slate-600">Volume</div>
          <div className="text-sm font-bold text-slate-600">OI</div>
          <div className="text-sm font-bold text-slate-600">Type</div>
        </div>

        {/* Options List */}
        <div className="max-h-80 overflow-y-auto bg-white">
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
              <Target className="w-12 h-12 text-slate-300 mb-4" />
              <div className="text-slate-900 font-medium text-lg">No options data available</div>
              <div className="text-slate-500 text-sm">Waiting for market data...</div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Summary */}
      {options.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
            <div className="text-emerald-600 text-sm font-medium">Call Options (CE)</div>
            <div className="text-2xl font-bold text-slate-900">{callOptions.length}</div>
            <div className="text-emerald-500 text-xs">Active contracts</div>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 rounded-xl p-4">
            <div className="text-red-600 text-sm font-medium">Put Options (PE)</div>
            <div className="text-2xl font-bold text-slate-900">{putOptions.length}</div>
            <div className="text-red-500 text-xs">Active contracts</div>
          </div>
        </div>
      )}
    </div>
  );
};