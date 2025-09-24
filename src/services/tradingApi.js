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