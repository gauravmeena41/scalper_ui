import { useEffect, useRef } from 'react'
import { tradingApi, fetchAllData } from '../services/tradingApi'
import { useMarketStore } from '../stores/marketStore'
import { usePortfolioStore } from '../stores/portfolioStore'
import { useSignalStore } from '../stores/signalStore'
import { useSystemStore } from '../stores/systemStore'

export const useRealTimeData = (options = {}) => {
  const {
    interval = 5000, // 5 seconds default
    enabled = true,
    onError = null
  } = options

  const intervalRef = useRef(null)
  const isPolling = useRef(false)

  // Store actions
  const updateMarketData = useMarketStore((state) => state.updateMarketData)
  const updateTopMovers = useMarketStore((state) => state.updateTopMovers)
  const setConnectionStatus = useMarketStore((state) => state.setConnectionStatus)

  const updatePortfolioData = usePortfolioStore((state) => state.updatePortfolioData)

  const setSignals = useSignalStore((state) => state.setSignals)

  const updateSystemStatus = useSystemStore((state) => state.updateSystemStatus)
  const addError = useSystemStore((state) => state.addError)

  const fetchData = async () => {
    if (isPolling.current) return // Prevent overlapping requests

    try {
      isPolling.current = true
      setConnectionStatus('CONNECTING')

      const result = await fetchAllData()

      // Update market data
      if (result.marketData) {
        updateMarketData(result.marketData)
      }

      // Update top movers
      if (result.topMovers) {
        updateTopMovers(result.topMovers)
      }

      // Update portfolio
      if (result.portfolio) {
        updatePortfolioData(result.portfolio)
      }

      // Update signals
      if (result.signals && result.signals.signals) {
        setSignals(result.signals.signals)
      }

      // Update system status
      if (result.systemStatus) {
        updateSystemStatus(result.systemStatus)
      }

      // Set connection as successful
      setConnectionStatus('CONNECTED')

      // Handle any errors from individual API calls
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(error => {
          addError({
            message: `API Error: ${error.message}`,
            type: 'API_ERROR',
            component: 'DATA_FETCH'
          })
        })
      }

    } catch (error) {
      console.error('Error fetching real-time data:', error)
      setConnectionStatus('DISCONNECTED')

      addError({
        message: `Connection failed: ${error.message}`,
        type: 'CONNECTION_ERROR',
        component: 'REAL_TIME_DATA'
      })

      if (onError) {
        onError(error)
      }
    } finally {
      isPolling.current = false
    }
  }

  const startPolling = () => {
    if (intervalRef.current) return // Already polling

    console.log(`Starting real-time data polling every ${interval}ms`)

    // Fetch immediately
    fetchData()

    // Then poll at intervals
    intervalRef.current = setInterval(fetchData, interval)
  }

  const stopPolling = () => {
    if (intervalRef.current) {
      console.log('Stopping real-time data polling')
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    if (enabled) {
      startPolling()
    } else {
      stopPolling()
    }

    return () => {
      stopPolling()
    }
  }, [enabled, interval])

  // Handle visibility change to pause/resume polling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page hidden, pausing real-time data')
        stopPolling()
      } else if (enabled) {
        console.log('Page visible, resuming real-time data')
        startPolling()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enabled])

  return {
    fetchData,
    startPolling,
    stopPolling,
    isPolling: !!intervalRef.current
  }
}

// Specialized hook for market data only (faster polling)
export const useMarketDataPolling = (interval = 2000) => {
  const intervalRef = useRef(null)
  const updateMarketData = useMarketStore((state) => state.updateMarketData)
  const setConnectionStatus = useMarketStore((state) => state.setConnectionStatus)

  const fetchMarketData = async () => {
    try {
      const data = await tradingApi.getMarketData()
      updateMarketData(data)
      setConnectionStatus('CONNECTED')
    } catch (error) {
      console.error('Error fetching market data:', error)
      setConnectionStatus('DISCONNECTED')
    }
  }

  useEffect(() => {
    fetchMarketData() // Initial fetch

    intervalRef.current = setInterval(fetchMarketData, interval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [interval])

  return { fetchMarketData }
}