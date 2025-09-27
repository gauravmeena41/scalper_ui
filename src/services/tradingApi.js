import api from './api'

export const tradingApi = {
  // Market data endpoints
  getMarketData: async () => {
    try {
      const response = await api.get('/market-data')
      return response.data
    } catch (error) {
      console.error('Error fetching market data:', error)
      throw error
    }
  },

  getNiftyData: async () => {
    try {
      const response = await api.get('/nifty-data')
      return response.data
    } catch (error) {
      console.error('Error fetching NIFTY data:', error)
      throw error
    }
  },

  getTopMovers: async () => {
    try {
      const response = await api.get('/top-movers')
      return response.data
    } catch (error) {
      console.error('Error fetching top movers:', error)
      throw error
    }
  },

  getSectorPerformance: async () => {
    try {
      const response = await api.get('/sector-performance')
      return response.data
    } catch (error) {
      console.error('Error fetching sector performance:', error)
      throw error
    }
  },

  // Portfolio endpoints
  getPortfolio: async () => {
    try {
      const response = await api.get('/portfolio')
      return response.data
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      throw error
    }
  },

  // Trading signals endpoints
  getSignals: async () => {
    try {
      const response = await api.get('/signals')
      return response.data
    } catch (error) {
      console.error('Error fetching signals:', error)
      throw error
    }
  },

  // Options chain endpoints
  getOptionsChain: async () => {
    try {
      const response = await api.get('/options-chain')
      return response.data
    } catch (error) {
      console.error('Error fetching options chain:', error)
      throw error
    }
  },

  // System status endpoints
  getSystemStatus: async () => {
    try {
      const response = await api.get('/system-status')
      return response.data
    } catch (error) {
      console.error('Error fetching system status:', error)
      throw error
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health', { timeout: 5000 })
      return response.data
    } catch (error) {
      console.error('Health check failed:', error)
      return { status: 'error', message: error.message }
    }
  },

  // Paper Trading endpoints
  getPaperTradingStatus: async () => {
    try {
      const response = await api.get('/paper-trading/status')
      return response.data
    } catch (error) {
      console.error('Error fetching paper trading status:', error)
      throw error
    }
  },

  startPaperTrading: async () => {
    try {
      const response = await api.post('/paper-trading/start')
      return response.data
    } catch (error) {
      console.error('Error starting paper trading:', error)
      throw error
    }
  },

  stopPaperTrading: async () => {
    try {
      const response = await api.post('/paper-trading/stop')
      return response.data
    } catch (error) {
      console.error('Error stopping paper trading:', error)
      throw error
    }
  },

  resetPaperTrading: async () => {
    try {
      const response = await api.post('/paper-trading/reset')
      return response.data
    } catch (error) {
      console.error('Error resetting paper trading:', error)
      throw error
    }
  },

  getPaperPortfolio: async () => {
    try {
      const response = await api.get('/paper-trading/portfolio')
      return response.data
    } catch (error) {
      console.error('Error fetching paper portfolio:', error)
      throw error
    }
  },

  getActiveTrades: async () => {
    try {
      const response = await api.get('/paper-trading/active-trades')
      return response.data
    } catch (error) {
      console.error('Error fetching active trades:', error)
      throw error
    }
  },

  getTradeHistory: async (limit = 50) => {
    try {
      const response = await api.get(`/paper-trading/trade-history?limit=${limit}`)
      return response.data
    } catch (error) {
      console.error('Error fetching trade history:', error)
      throw error
    }
  },

  // Analytics endpoints
  getTradeAnalytics: async () => {
    try {
      const response = await api.get('/analytics/comprehensive')
      return response.data
    } catch (error) {
      console.error('Error fetching trade analytics:', error)
      throw error
    }
  },

  getPerformanceMetrics: async () => {
    try {
      const response = await api.get('/analytics/performance')
      return response.data
    } catch (error) {
      console.error('Error fetching performance metrics:', error)
      throw error
    }
  },

  getSignalAnalytics: async () => {
    try {
      const response = await api.get('/analytics/signals')
      return response.data
    } catch (error) {
      console.error('Error fetching signal analytics:', error)
      throw error
    }
  },

  getRealtimeAnalytics: async () => {
    try {
      const response = await api.get('/analytics/realtime')
      return response.data
    } catch (error) {
      console.error('Error fetching realtime analytics:', error)
      throw error
    }
  },

  getTradeTimeline: async () => {
    try {
      const response = await api.get('/analytics/trade-timeline')
      return response.data
    } catch (error) {
      console.error('Error fetching trade timeline:', error)
      throw error
    }
  },

  getRiskAnalytics: async () => {
    try {
      const response = await api.get('/analytics/risk')
      return response.data
    } catch (error) {
      console.error('Error fetching risk analytics:', error)
      throw error
    }
  },

  getHourlyAnalytics: async () => {
    try {
      const response = await api.get('/analytics/hourly')
      return response.data
    } catch (error) {
      console.error('Error fetching hourly analytics:', error)
      throw error
    }
  },

  // Live signals
  getLiveSignals: async () => {
    try {
      const response = await api.get('/live-signals')
      return response.data
    } catch (error) {
      console.error('Error fetching live signals:', error)
      throw error
    }
  }
}

// Utility function to fetch all data at once
export const fetchAllData = async () => {
  try {
    const [
      marketData,
      portfolio,
      signals,
      systemStatus,
      topMovers
    ] = await Promise.allSettled([
      tradingApi.getMarketData(),
      tradingApi.getPortfolio(),
      tradingApi.getSignals(),
      tradingApi.getSystemStatus(),
      tradingApi.getTopMovers()
    ])

    return {
      marketData: marketData.status === 'fulfilled' ? marketData.value : null,
      portfolio: portfolio.status === 'fulfilled' ? portfolio.value : null,
      signals: signals.status === 'fulfilled' ? signals.value : null,
      systemStatus: systemStatus.status === 'fulfilled' ? systemStatus.value : null,
      topMovers: topMovers.status === 'fulfilled' ? topMovers.value : null,
      errors: [
        marketData.status === 'rejected' ? marketData.reason : null,
        portfolio.status === 'rejected' ? portfolio.reason : null,
        signals.status === 'rejected' ? signals.reason : null,
        systemStatus.status === 'rejected' ? systemStatus.reason : null,
        topMovers.status === 'rejected' ? topMovers.reason : null
      ].filter(Boolean)
    }
  } catch (error) {
    console.error('Error fetching all data:', error)
    throw error
  }
}