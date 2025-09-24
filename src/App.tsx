import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NiftyPriceDisplay } from './components/NiftyPriceDisplay';
import { OptionsChain } from './components/OptionsChain';
import { SignalAnalytics } from './components/SignalAnalytics';
import { PnLTracker } from './components/PnLTracker';
import { SignalPerformanceMetrics } from './components/SignalPerformanceMetrics';
import { AlertSystem } from './components/AlertSystem';
import { TradeExecutionAnalytics } from './components/TradeExecutionAnalytics';
import { tradingApi } from './services/api';
import { TrendingUp, Wifi, WifiOff, BarChart3, Clock, Settings } from 'lucide-react';

interface NiftyData {
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  timestamp: string;
}

interface OptionData {
  symbol: string;
  ltp: number;
  change: number;
  change_percent: number;
  volume: number;
  oi: number;
  timestamp: number;
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 2000,
      refetchOnWindowFocus: false,
    },
  },
});

function TradingDashboard() {
  const [niftyData, setNiftyData] = useState<NiftyData>({
    price: 25300,
    change: 50,
    change_percent: 0.2,
    volume: 1000000,
    timestamp: new Date().toISOString()
  });

  const [optionsData, setOptionsData] = useState<OptionData[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch NIFTY data
      const niftyResponse = await tradingApi.getNiftyData();
      if (niftyResponse.data) {
        setNiftyData(niftyResponse.data);
        setIsConnected(true);
      }

      // Fetch Options data
      const optionsResponse = await tradingApi.getOptionsChain();
      if (optionsResponse.data) {
        setOptionsData(optionsResponse.data.options);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsConnected(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">NIFTY Scalper</h1>
                <p className="text-xs text-slate-500 hidden sm:block">Live Trading Dashboard</p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className={`hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                isConnected
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span className="hidden md:inline">{isConnected ? 'Live' : 'Disconnected'}</span>
              </div>

              {/* Time */}
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>{new Date().toLocaleTimeString()}</span>
              </div>

              {/* Settings */}
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Top Section - Price Display */}
        <div className="w-full">
          <NiftyPriceDisplay data={niftyData} isLoading={loading} />
        </div>

        {/* Dashboard Grid - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <SignalAnalytics />
            <PnLTracker />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SignalPerformanceMetrics />
            <TradeExecutionAnalytics />
          </div>
        </div>

        {/* Full Width Sections */}
        <div className="w-full">
          <OptionsChain options={optionsData} isLoading={loading} />
        </div>
      </main>

      {/* Alert System - Fixed Position */}
      <AlertSystem />

      {/* Modern Footer */}
      <footer className="mt-12 py-6 border-t border-slate-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-slate-500">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>NIFTY 50 Algorithmic Trading System</span>
            </div>
            <div className="mt-2 sm:mt-0 flex items-center space-x-4">
              <span>API: localhost:8502</span>
              <span className="hidden sm:inline">•</span>
              <span>Refresh: 2s</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TradingDashboard />
    </QueryClientProvider>
  );
}

export default App;