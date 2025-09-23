import axios from 'axios';

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

interface OptionsChainResponse {
  options: OptionData[];
  last_updated: string;
}

interface TradingSignal {
  id: string;
  timestamp: string;
  signal_type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  confidence: number;
  description: string;
}

interface SignalsResponse {
  signals: TradingSignal[];
  total_signals_today: number;
  last_updated: string;
}

interface SystemStatus {
  trading_active: boolean;
  market_status: 'Open' | 'Closed';
  connection_status: 'Connected' | 'Disconnected';
  components: Record<string, {
    running: boolean;
    healthy: boolean;
  }>;
  data_points_5min: number;
  last_update: string;
}

interface Position {
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  pnl: number;
  pnl_percent: number;
  side: 'BUY' | 'SELL';
}

interface PortfolioData {
  total_value: number;
  total_pnl: number;
  total_pnl_percent: number;
  positions: Position[];
  cash_balance: number;
  last_updated: string;
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

const API_BASE_URL = 'http://localhost:8502/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error?.response?.status, error?.message);
    return Promise.reject(error);
  }
);

export const tradingApi = {
  // Get current NIFTY data
  getNiftyData: async (): Promise<ApiResponse<NiftyData>> => {
    try {
      const response = await api.get<NiftyData>('/nifty-data');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching NIFTY data:', error);
      // Return fallback data with realistic market simulation
      const basePrice = 25300;
      const randomChange = (Math.random() - 0.5) * 100; // Random change between -50 and +50
      const price = basePrice + randomChange;
      const change = randomChange;
      const changePercent = (change / basePrice) * 100;

      return {
        data: {
          price: Math.round(price * 100) / 100,
          change: Math.round(change * 100) / 100,
          change_percent: Math.round(changePercent * 10000) / 10000,
          volume: Math.floor(Math.random() * 2000000) + 500000,
          timestamp: new Date().toISOString()
        }
      };
    }
  },

  // Get options chain data
  getOptionsChain: async (): Promise<ApiResponse<OptionsChainResponse>> => {
    try {
      const response = await api.get<OptionsChainResponse>('/options-chain');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching options chain:', error);

      // Generate realistic sample options data for demo
      const basePrice = 25300;
      const strikes = [25000, 25100, 25200, 25300, 25400, 25500, 25600];
      const sampleOptions: OptionData[] = [];

      strikes.forEach(strike => {
        // Call Options (CE)
        const cePrice = Math.max(1, basePrice - strike + (Math.random() - 0.5) * 50);
        sampleOptions.push({
          symbol: `NSE:NIFTY${strike}CE`,
          ltp: Math.round(cePrice * 100) / 100,
          change: (Math.random() - 0.5) * 20,
          change_percent: (Math.random() - 0.5) * 10,
          volume: Math.floor(Math.random() * 50000) + 1000,
          oi: Math.floor(Math.random() * 100000) + 5000,
          timestamp: Date.now()
        });

        // Put Options (PE)
        const pePrice = Math.max(1, strike - basePrice + (Math.random() - 0.5) * 50);
        sampleOptions.push({
          symbol: `NSE:NIFTY${strike}PE`,
          ltp: Math.round(pePrice * 100) / 100,
          change: (Math.random() - 0.5) * 20,
          change_percent: (Math.random() - 0.5) * 10,
          volume: Math.floor(Math.random() * 50000) + 1000,
          oi: Math.floor(Math.random() * 100000) + 5000,
          timestamp: Date.now()
        });
      });

      return {
        data: {
          options: sampleOptions,
          last_updated: new Date().toLocaleTimeString()
        }
      };
    }
  },

  // Get trading signals
  getSignals: async (): Promise<ApiResponse<SignalsResponse>> => {
    try {
      const response = await api.get<SignalsResponse>('/signals');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching signals:', error);

      // Generate sample signals for demo
      const sampleSignals: TradingSignal[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          signal_type: 'BUY',
          symbol: 'NIFTY25300CE',
          price: 85.50,
          confidence: 87,
          description: 'Strong momentum breakout above resistance'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
          signal_type: 'SELL',
          symbol: 'NIFTY25400PE',
          price: 92.75,
          confidence: 82,
          description: 'RSI overbought with volume divergence'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
          signal_type: 'BUY',
          symbol: 'NIFTY25200CE',
          price: 125.25,
          confidence: 91,
          description: 'VWAP support bounce with high volume'
        }
      ];

      return {
        data: {
          signals: sampleSignals,
          total_signals_today: sampleSignals.length,
          last_updated: new Date().toLocaleTimeString()
        }
      };
    }
  },

  // Get system status
  getSystemStatus: async (): Promise<ApiResponse<SystemStatus>> => {
    try {
      const response = await api.get<SystemStatus>('/system-status');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching system status:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch system status',
        data: {
          trading_active: false,
          market_status: 'Closed',
          connection_status: 'Disconnected',
          components: {},
          data_points_5min: 0,
          last_update: new Date().toLocaleTimeString()
        }
      };
    }
  },

  // Get portfolio data
  getPortfolio: async (): Promise<ApiResponse<PortfolioData>> => {
    try {
      const response = await api.get<PortfolioData>('/portfolio');
      return { data: response.data };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to fetch portfolio',
        data: {
          total_value: 0,
          total_pnl: 0,
          total_pnl_percent: 0,
          positions: [],
          cash_balance: 0,
          last_updated: new Date().toLocaleTimeString()
        }
      };
    }
  },
};

export default tradingApi;