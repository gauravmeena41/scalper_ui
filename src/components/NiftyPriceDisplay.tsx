import React from 'react';
import { formatPrice, formatChange, formatPercentage, getPriceColorClass } from '../utils/formatting';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';

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
  const colorClass = getPriceColorClass(data.change);
  const isPositive = data.change >= 0;

  const TrendIcon = isPositive ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <div className="trading-card animate-pulse">
        <div className="text-center">
          <div className="h-8 bg-gray-600 rounded mb-2"></div>
          <div className="h-12 bg-gray-600 rounded mb-2"></div>
          <div className="h-6 bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">NIFTY 50</h1>
            <p className="text-gray-400 text-sm">NSE Index</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-400">Last Update</div>
          <div className="text-white font-medium">
            {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Price Section */}
        <div className="md:col-span-2">
          <div className={`text-6xl font-bold mb-4 ${colorClass}`}>
            ₹{formatPrice(data.price)}
          </div>

          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
              isPositive ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}>
              <TrendIcon className={`w-6 h-6 ${colorClass}`} />
              <span className={`text-xl font-bold ${colorClass}`}>
                {formatChange(data.change)}
              </span>
              <span className={`text-xl font-bold ${colorClass}`}>
                ({formatPercentage(data.change_percent)})
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Volume</div>
            <div className="text-white text-2xl font-bold">
              {(data.volume / 1000000).toFixed(2)}M
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="text-gray-400 text-sm mb-1">Market Status</div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div className="text-green-400 font-semibold">Live</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};