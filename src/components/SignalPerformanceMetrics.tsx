import React, { useState, useEffect } from 'react';
import { LineChart, BarChart3, TrendingUp, Target, Zap, Clock, Percent, Award } from 'lucide-react';

interface PerformanceMetrics {
  algorithm_performance: {
    vwap: {
      total_signals: number;
      avg_confidence: number;
      success_rate: number;
      avg_deviation: number;
      signals_per_hour: number;
    };
    amsa: {
      total_signals: number;
      avg_confidence: number;
      success_rate: number;
      avg_score: number;
      signals_per_hour: number;
    };
  };
  timeframe_analysis: {
    last_hour: number;
    last_4_hours: number;
    last_24_hours: number;
    success_rate_hourly: number[];
  };
  signal_quality: {
    high_confidence_signals: number;
    medium_confidence_signals: number;
    low_confidence_signals: number;
    avg_processing_time: number;
  };
  market_conditions: {
    volatility_index: number;
    liquidity_score: number;
    optimal_conditions: boolean;
  };
}

interface SignalTrend {
  hour: string;
  signals: number;
  success_rate: number;
  avg_confidence: number;
}

export const SignalPerformanceMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    algorithm_performance: {
      vwap: {
        total_signals: 847,
        avg_confidence: 0.89,
        success_rate: 73.2,
        avg_deviation: 5.67,
        signals_per_hour: 42.3
      },
      amsa: {
        total_signals: 234,
        avg_confidence: 0.91,
        success_rate: 78.5,
        avg_score: 8.7,
        signals_per_hour: 11.7
      }
    },
    timeframe_analysis: {
      last_hour: 38,
      last_4_hours: 152,
      last_24_hours: 847,
      success_rate_hourly: [78, 82, 75, 70, 85, 79, 73, 88]
    },
    signal_quality: {
      high_confidence_signals: 312,
      medium_confidence_signals: 456,
      low_confidence_signals: 79,
      avg_processing_time: 0.23
    },
    market_conditions: {
      volatility_index: 18.7,
      liquidity_score: 8.2,
      optimal_conditions: true
    }
  });

  const [trendData, setTrendData] = useState<SignalTrend[]>([
    { hour: '09:00', signals: 45, success_rate: 78, avg_confidence: 0.87 },
    { hour: '10:00', signals: 52, success_rate: 82, avg_confidence: 0.89 },
    { hour: '11:00', signals: 41, success_rate: 75, avg_confidence: 0.85 },
    { hour: '12:00', signals: 35, success_rate: 70, avg_confidence: 0.83 },
    { hour: '13:00', signals: 48, success_rate: 85, avg_confidence: 0.91 },
    { hour: '14:00', signals: 39, success_rate: 79, avg_confidence: 0.88 },
    { hour: '15:00', signals: 33, success_rate: 73, avg_confidence: 0.84 },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Mock data update - replace with real API calls
    const updateMetrics = () => {
      // In a real implementation, fetch from backend API
      setIsConnected(true);
      setIsLoading(false);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getQualityColor = (value: number, threshold1: number, threshold2: number) => {
    if (value >= threshold2) return 'text-emerald-600';
    if (value >= threshold1) return 'text-amber-600';
    return 'text-red-500';
  };

  const getQualityBg = (value: number, threshold1: number, threshold2: number) => {
    if (value >= threshold2) return 'bg-emerald-50 border-emerald-200';
    if (value >= threshold1) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            <div>
              <div className="h-6 w-40 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-56 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Signal Performance Metrics</h2>
            <p className="text-slate-500 text-sm">Algorithm efficiency and market analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-emerald-600' : 'text-red-600'}`}>
            {isConnected ? 'Live' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Algorithm Performance Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">VWAP Algorithm</h3>
              <p className="text-slate-600 text-sm">Volume-weighted analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{metrics.algorithm_performance.vwap.total_signals}</div>
              <div className="text-xs text-slate-500">Total Signals</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getQualityColor(metrics.algorithm_performance.vwap.success_rate, 60, 75)}`}>
                {metrics.algorithm_performance.vwap.success_rate.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {(metrics.algorithm_performance.vwap.avg_confidence * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {metrics.algorithm_performance.vwap.avg_deviation.toFixed(2)}%
              </div>
              <div className="text-xs text-slate-500">Avg Deviation</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">AMSA Algorithm</h3>
              <p className="text-slate-600 text-sm">Advanced multi-signal analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-900">{metrics.algorithm_performance.amsa.total_signals}</div>
              <div className="text-xs text-slate-500">Total Signals</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getQualityColor(metrics.algorithm_performance.amsa.success_rate, 60, 75)}`}>
                {metrics.algorithm_performance.amsa.success_rate.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {(metrics.algorithm_performance.amsa.avg_confidence * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-purple-600">
                {metrics.algorithm_performance.amsa.avg_score.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500">Quality Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Signal Quality Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
          <div className="text-emerald-600 text-sm font-medium">High Confidence</div>
          <div className="text-2xl font-bold text-slate-900">{metrics.signal_quality.high_confidence_signals}</div>
          <div className="text-xs text-emerald-500">≥90% confidence</div>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4">
          <div className="text-amber-600 text-sm font-medium">Medium Confidence</div>
          <div className="text-2xl font-bold text-slate-900">{metrics.signal_quality.medium_confidence_signals}</div>
          <div className="text-xs text-amber-500">70-89% confidence</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
          <div className="text-orange-600 text-sm font-medium">Low Confidence</div>
          <div className="text-2xl font-bold text-slate-900">{metrics.signal_quality.low_confidence_signals}</div>
          <div className="text-xs text-orange-500">&lt;70% confidence</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl p-4">
          <div className="text-cyan-600 text-sm font-medium">Processing Time</div>
          <div className="text-2xl font-bold text-slate-900">{metrics.signal_quality.avg_processing_time}s</div>
          <div className="text-xs text-cyan-500">Average latency</div>
        </div>
      </div>

      {/* Market Conditions & Performance Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Market Conditions */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-teal-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Market Conditions</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Volatility Index</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  metrics.market_conditions.volatility_index > 20 ? 'bg-red-500' :
                  metrics.market_conditions.volatility_index > 15 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}></div>
                <span className="text-slate-900 font-medium">{metrics.market_conditions.volatility_index}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Liquidity Score</span>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  metrics.market_conditions.liquidity_score > 7 ? 'bg-emerald-500' :
                  metrics.market_conditions.liquidity_score > 5 ? 'bg-amber-500' : 'bg-red-500'
                }`}></div>
                <span className="text-slate-900 font-medium">{metrics.market_conditions.liquidity_score}/10</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-600">Market Conditions</span>
              <div className="flex items-center space-x-2">
                {metrics.market_conditions.optimal_conditions ? (
                  <>
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Optimal</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span className="text-amber-600 font-medium">Suboptimal</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Hourly Performance Trends */}
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Zap className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Hourly Performance</h3>
          </div>

          <div className="space-y-3">
            {trendData.slice(0, 5).map((trend, index) => (
              <div key={trend.hour} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100">
                <div className="flex items-center space-x-3">
                  <span className="text-slate-500 text-sm font-mono">{trend.hour}</span>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-slate-900 font-medium">{trend.signals}</div>
                    <span className="text-xs text-slate-500">signals</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`text-sm font-medium ${getQualityColor(trend.success_rate, 60, 75)}`}>
                    {trend.success_rate}%
                  </div>
                  <div className="text-sm text-slate-600">
                    {(trend.avg_confidence * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-slate-500">
            <Percent className="w-4 h-4" />
            <span>Performance tracking active</span>
          </div>
          <div className="text-slate-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};