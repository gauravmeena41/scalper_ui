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
import { Activity, Wifi, WifiOff } from 'lucide-react';

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
      refetchInterval: 2000, // Refetch every 2 seconds
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

  // Fetch data on component mount and set interval
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">NIFTY Scalper Terminal</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isConnected
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
                <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>

              <div className="text-sm text-gray-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Top Row - NIFTY Price */}
        <div className="w-full">
          <NiftyPriceDisplay data={niftyData} isLoading={loading} />
        </div>

        {/* Signal Analytics Dashboard */}
        <div className="w-full">
          <SignalAnalytics />
        </div>

        {/* Signal Performance Metrics */}
        <div className="w-full">
          <SignalPerformanceMetrics />
        </div>

        {/* P&L Tracker */}
        <div className="w-full">
          <PnLTracker />
        </div>

        {/* Trade Execution Analytics */}
        <div className="w-full">
          <TradeExecutionAnalytics />
        </div>

        {/* Bottom Row - Options Chain */}
        <div className="w-full">
          <OptionsChain options={optionsData} isLoading={loading} />
        </div>

        {/* Additional Info Footer */}
        <footer className="mt-8 pt-4 border-t border-gray-700 text-center text-xs text-gray-400">
          <p>NIFTY 50 Scalping Terminal - Real-time data from Fyers API</p>
          <p>Connected to: localhost:8502 | Auto-refresh: 2s</p>
        </footer>
      </main>

      {/* Alert System - Fixed Position */}
      <AlertSystem />
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
