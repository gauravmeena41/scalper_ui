import React from 'react';
import { formatPrice, formatChange, formatPercentage, getPriceColorClass } from '../utils/formatting';
import { TrendingUp, TrendingDown, Activity, Volume2, Clock } from 'lucide-react';

interface NiftyData {
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  timestamp: string;
}

interface NiftyPriceDisplayProps {
  data: NiftyData;
  isLoading?: boolean;
}

export const NiftyPriceDisplay: React.FC<NiftyPriceDisplayProps> = ({
  data,
  isLoading = false
}) => {
  const isPositive = data.change >= 0;
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div>
              <div className="h-8 w-32 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="h-12 w-24 bg-slate-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="h-16 w-48 bg-slate-200 rounded mb-4"></div>
            <div className="h-8 w-64 bg-slate-200 rounded"></div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="h-20 bg-slate-200 rounded-xl"></div>
            <div className="h-20 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">NIFTY 50</h1>
            <p className="text-slate-500 text-sm">National Stock Exchange</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 rounded-lg">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="text-sm text-slate-600 font-medium">
            {new Date(data.timestamp).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Price Section */}
        <div className="lg:col-span-2">
          <div className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 ${
            isPositive ? 'text-emerald-600' : 'text-red-500'
          }`}>
            ₹{formatPrice(data.price)}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 ${
              isPositive
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <TrendIcon className="w-5 h-5" />
              <span className="text-lg font-bold">
                {formatChange(data.change)}
              </span>
              <span className="text-lg font-bold">
                ({formatPercentage(data.change_percent)})
              </span>
            </div>

            <div className="px-3 py-1 bg-slate-100 rounded-full">
              <span className="text-sm font-medium text-slate-600">
                {isPositive ? 'UP' : 'DOWN'}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Volume Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center space-x-2 mb-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 text-sm font-medium">Volume</span>
            </div>
            <div className="text-slate-900 text-xl font-bold">
              {(data.volume / 1000000).toFixed(1)}M
            </div>
            <div className="text-blue-600 text-xs font-medium mt-1">
              Shares traded
            </div>
          </div>

          {/* Market Status Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-emerald-600 text-sm font-medium">Market Status</span>
            </div>
            <div className="text-emerald-700 text-xl font-bold">
              Live
            </div>
            <div className="text-emerald-600 text-xs font-medium mt-1">
              Real-time data
            </div>
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">52W HIGH</div>
            <div className="text-slate-900 font-semibold">₹26,277</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">52W LOW</div>
            <div className="text-slate-900 font-semibold">₹21,281</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">MARKET CAP</div>
            <div className="text-slate-900 font-semibold">₹31.2L Cr</div>
          </div>
          <div>
            <div className="text-slate-500 text-xs font-medium mb-1">P/E RATIO</div>
            <div className="text-slate-900 font-semibold">23.4</div>
          </div>
        </div>
      </div>
    </div>
  );
};