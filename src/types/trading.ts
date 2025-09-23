export interface NiftyData {
  price: number;
  change: number;
  change_percent: number;
  volume: number;
  timestamp: string;
}

export interface OptionData {
  symbol: string;
  ltp: number;
  change: number;
  change_percent: number;
  volume: number;
  oi: number;
  timestamp: number;
}

export interface OptionsChainResponse {
  options: OptionData[];
  last_updated: string;
}

export interface TradingSignal {
  id: string;
  timestamp: string;
  signal_type: 'BUY' | 'SELL';
  symbol: string;
  price: number;
  confidence: number;
  description: string;
}

export interface SignalsResponse {
  signals: TradingSignal[];
  total_signals_today: number;
  last_updated: string;
}

export interface SystemStatus {
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

export interface PortfolioData {
  total_value: number;
  total_pnl: number;
  total_pnl_percent: number;
  positions: Position[];
  cash_balance: number;
  last_updated: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  avg_price: number;
  current_price: number;
  pnl: number;
  pnl_percent: number;
  side: 'BUY' | 'SELL';
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export type PriceDirection = 'up' | 'down' | 'neutral';

export interface WebSocketMessage {
  type: 'price_update' | 'signal' | 'system_status';
  data: any;
  timestamp: number;
}