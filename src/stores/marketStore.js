import { create } from 'zustand'

export const useMarketStore = create((set, get) => ({
  // Market data state
  niftyPrice: 25000,
  change: 0,
  changePercent: 0,
  volume: 0,
  timestamp: null,
  isConnected: false,
  lastUpdate: null,

  // Top movers data
  topGainers: [],
  topLosers: [],

  // Actions
  updateMarketData: (data) => set({
    niftyPrice: data.nifty_price || data.price,
    change: data.change || 0,
    changePercent: data.change_percent || 0,
    volume: data.volume || 0,
    timestamp: data.timestamp,
    lastUpdate: new Date().toISOString(),
    isConnected: true
  }),

  updateTopMovers: (data) => set({
    topGainers: data.top_gainers || [],
    topLosers: data.top_losers || []
  }),

  setConnectionStatus: (status) => set({
    isConnected: status,
    lastUpdate: status ? new Date().toISOString() : get().lastUpdate
  }),

  // Reset market data
  resetMarketData: () => set({
    niftyPrice: 25000,
    change: 0,
    changePercent: 0,
    volume: 0,
    timestamp: null,
    isConnected: false,
    lastUpdate: null,
    topGainers: [],
    topLosers: []
  })
}))