import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, Zap, Target, TrendingUp, TrendingDown, Activity, DollarSign, AlertCircle } from 'lucide-react';

interface ExecutionMetrics {
  avg_execution_time: number;
  total_slippage: number;
  avg_slippage: number;
  execution_success_rate: number;
  rejected_orders: number;
  partial_fills: number;
  total_executed_volume: number;
  avg_fill_price_deviation: number;
  best_execution_time: number;
  worst_execution_time: number;
}

interface LatencyBreakdown {
  signal_generation: number;
  order_validation: number;
  broker_transmission: number;
  market_execution: number;
  confirmation_receipt: number;
}

interface ExecutionDetail {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  order_type: 'MARKET' | 'LIMIT';
  quantity: number;
  expected_price: number;
  executed_price: number;
  slippage: number;
  execution_time: number;
  status: 'EXECUTED' | 'REJECTED' | 'PARTIAL';
  timestamp: Date;
  fill_percentage: number;
}

export const TradeExecutionAnalytics: React.FC = () => {
  const [metrics, setMetrics] = useState<ExecutionMetrics>({
    avg_execution_time: 0.15,
    total_slippage: -127.50,
    avg_slippage: -0.12,
    execution_success_rate: 96.8,
    rejected_orders: 8,
    partial_fills: 12,
    total_executed_volume: 28500000,
    avg_fill_price_deviation: 0.08,
    best_execution_time: 0.045,
    worst_execution_time: 0.890
  });

  const [latency, setLatency] = useState<LatencyBreakdown>({
    signal_generation: 0.023,
    order_validation: 0.012,
    broker_transmission: 0.067,
    market_execution: 0.034,
    confirmation_receipt: 0.014
  });

  const [recentExecutions, setRecentExecutions] = useState<ExecutionDetail[]>([
    {
      id: '1',
      symbol: 'NIFTY2592325200CE',
      side: 'BUY',
      order_type: 'MARKET',
      quantity: 100,
      expected_price: 25.50,
      executed_price: 25.48,
      slippage: -0.02,
      execution_time: 0.125,
      status: 'EXECUTED',
      timestamp: new Date(Date.now() - 300000),
      fill_percentage: 100
    },
    {
      id: '2',
      symbol: 'NIFTY2592325150PE',
      side: 'SELL',
      order_type: 'LIMIT',
      quantity: 75,
      expected_price: 42.25,
      executed_price: 42.28,
      slippage: 0.03,
      execution_time: 0.089,
      status: 'EXECUTED',
      timestamp: new Date(Date.now() - 600000),
      fill_percentage: 100
    },
    {
      id: '3',
      symbol: 'NIFTY2592325100CE',
      side: 'BUY',
      order_type: 'MARKET',
      quantity: 50,
      expected_price: 76.50,
      executed_price: 76.45,
      slippage: -0.05,
      execution_time: 0.167,
      status: 'PARTIAL',
      timestamp: new Date(Date.now() - 900000),
      fill_percentage: 80
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const fetchExecutionData = async () => {
      try {
        // Mock API call - replace with real endpoint
        const response = await fetch('http://localhost:8502/api/execution-analytics');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data.metrics || metrics);
          setLatency(data.latency || latency);
          setRecentExecutions(data.executions || recentExecutions);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Failed to fetch execution analytics:', error);
        setIsConnected(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutionData();
    const interval = setInterval(fetchExecutionData, 15000); // Update every 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatLatency = (ms: number) => `${(ms * 1000).toFixed(1)}ms`;
  const formatCurrency = (amount: number) => `₹${amount.toFixed(2)}`;
  const formatPercentage = (percent: number) => `${percent.toFixed(2)}%`;

  const getSlippageColor = (slippage: number) => {
    if (slippage > 0) return 'text-red-400';
    if (slippage < 0) return 'text-green-400';
    return 'text-gray-400';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'EXECUTED': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PARTIAL': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency > 0.1) return 'text-red-400';
    if (latency > 0.05) return 'text-yellow-400';
    return 'text-green-400';
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <Zap className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-bold text-white">Execution Analytics</h3>
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
          <div className="bg-cyan-500/20 p-3 rounded-xl">
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Trade Execution Analytics</h2>
            <p className="text-gray-400 text-sm">Order execution performance and latency analysis</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
          <span className={`text-sm font-medium ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Key Execution Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="text-blue-400 text-sm font-medium">Avg Execution Time</div>
          <div className={`text-2xl font-bold ${getLatencyColor(metrics.avg_execution_time)}`}>
            {formatLatency(metrics.avg_execution_time)}
          </div>
          <div className="flex items-center mt-1">
            <Clock className="w-4 h-4 text-blue-400 mr-1" />
            <span className="text-xs text-gray-400">Per order</span>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
          <div className="text-purple-400 text-sm font-medium">Success Rate</div>
          <div className="text-2xl font-bold text-white">{formatPercentage(metrics.execution_success_rate)}</div>
          <div className="flex items-center mt-1">
            <Target className="w-4 h-4 text-purple-400 mr-1" />
            <span className="text-xs text-gray-400">Executed</span>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-green-400 text-sm font-medium">Total Slippage</div>
          <div className={`text-2xl font-bold ${getSlippageColor(metrics.total_slippage)}`}>
            {formatCurrency(metrics.total_slippage)}
          </div>
          <div className="flex items-center mt-1">
            <DollarSign className="w-4 h-4 text-green-400 mr-1" />
            <span className="text-xs text-gray-400">Cumulative</span>
          </div>
        </div>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
          <div className="text-orange-400 text-sm font-medium">Avg Slippage</div>
          <div className={`text-2xl font-bold ${getSlippageColor(metrics.avg_slippage)}`}>
            {formatPercentage(metrics.avg_slippage)}
          </div>
          <div className="flex items-center mt-1">
            <Activity className="w-4 h-4 text-orange-400 mr-1" />
            <span className="text-xs text-gray-400">Per trade</span>
          </div>
        </div>
      </div>

      {/* Latency Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-indigo-500/20 p-2 rounded-lg">
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Execution Latency Breakdown</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Signal Generation</span>
              <span className={`text-sm font-medium ${getLatencyColor(latency.signal_generation)}`}>
                {formatLatency(latency.signal_generation)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Order Validation</span>
              <span className={`text-sm font-medium ${getLatencyColor(latency.order_validation)}`}>
                {formatLatency(latency.order_validation)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Broker Transmission</span>
              <span className={`text-sm font-medium ${getLatencyColor(latency.broker_transmission)}`}>
                {formatLatency(latency.broker_transmission)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Market Execution</span>
              <span className={`text-sm font-medium ${getLatencyColor(latency.market_execution)}`}>
                {formatLatency(latency.market_execution)}
              </span>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg">
              <span className="text-gray-300 text-sm">Confirmation Receipt</span>
              <span className={`text-sm font-medium ${getLatencyColor(latency.confirmation_receipt)}`}>
                {formatLatency(latency.confirmation_receipt)}
              </span>
            </div>
          </div>
        </div>

        {/* Execution Statistics */}
        <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-teal-500/20 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Execution Statistics</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Rejected Orders</span>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <span className="text-white font-medium">{metrics.rejected_orders}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Partial Fills</span>
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-medium">{metrics.partial_fills}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Total Volume</span>
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-white font-medium">₹{(metrics.total_executed_volume / 1000000).toFixed(1)}M</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Best Execution</span>
              <span className="text-green-400 font-medium">{formatLatency(metrics.best_execution_time)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Worst Execution</span>
              <span className="text-red-400 font-medium">{formatLatency(metrics.worst_execution_time)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Executions Table */}
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="bg-gray-800/50 border-b border-gray-700/50 p-4">
          <h3 className="text-lg font-bold text-white">Recent Executions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/30">
              <tr>
                <th className="text-left p-3 text-sm font-medium text-gray-300">Time</th>
                <th className="text-left p-3 text-sm font-medium text-gray-300">Symbol</th>
                <th className="text-left p-3 text-sm font-medium text-gray-300">Side</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Expected</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Executed</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Slippage</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Latency</th>
                <th className="text-left p-3 text-sm font-medium text-gray-300">Status</th>
                <th className="text-right p-3 text-sm font-medium text-gray-300">Fill %</th>
              </tr>
            </thead>
            <tbody>
              {recentExecutions.map((execution) => (
                <tr key={execution.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                  <td className="p-3 text-sm text-gray-300">
                    {execution.timestamp.toLocaleTimeString()}
                  </td>
                  <td className="p-3 text-sm text-white font-medium">
                    {execution.symbol.replace('NIFTY259232', '').substring(0, 8)}...
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      execution.side === 'BUY'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {execution.side}
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm text-white">
                    {formatCurrency(execution.expected_price)}
                  </td>
                  <td className="p-3 text-right text-sm text-white font-medium">
                    {formatCurrency(execution.executed_price)}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-sm font-bold ${getSlippageColor(execution.slippage)}`}>
                      {execution.slippage > 0 ? '+' : ''}{execution.slippage.toFixed(3)}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-sm font-medium ${getLatencyColor(execution.execution_time)}`}>
                      {formatLatency(execution.execution_time)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(execution.status)}`}>
                      {execution.status}
                    </span>
                  </td>
                  <td className="p-3 text-right text-sm text-white">
                    {execution.fill_percentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentExecutions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Zap className="w-12 h-12 text-gray-500 mb-4" />
            <div className="text-gray-400 text-lg">No execution data available</div>
            <div className="text-gray-500 text-sm">Trade executions will appear here</div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Activity className="w-4 h-4" />
            <span>Real-time execution monitoring</span>
          </div>
          <div className="text-gray-400">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  );
};