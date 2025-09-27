import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSystemStore = create(
  persist(
    (set, get) => ({
      // System status
      tradingActive: false,
      marketStatus: 'CLOSED', // OPEN, CLOSED, PRE_OPEN
      connectionStatus: 'DISCONNECTED', // CONNECTED, DISCONNECTED, CONNECTING
      lastUpdate: null,

      // Component health status
      components: {
        api_server: { running: false, healthy: false },
        signal_monitor: { running: false, healthy: false },
        realtime_data: { running: false, healthy: false },
        websocket: { running: false, healthy: false }
      },

      // Data flow metrics
      dataMetrics: {
        dataPoints5Min: 0,
        totalSignalsToday: 0,
        avgLatency: 0,
        errorRate: 0
      },

      // User preferences (persisted)
      preferences: {
        theme: 'dark',
        autoRefresh: true,
        refreshInterval: 5000, // 5 seconds
        notifications: true,
        soundAlerts: false,
        compactView: false
      },

      // App settings
      settings: {
        apiBaseUrl: 'http://localhost:8502/api',
        wsUrl: 'ws://localhost:8502',
        maxSignalsDisplay: 50,
        maxTradesDisplay: 100,
        defaultCapital: 100000
      },

      // Error tracking
      errors: [],
      lastError: null,

      // Actions
      updateSystemStatus: (data) => {
        // Transform backend component format to frontend format
        const transformedComponents = {}
        if (data.components) {
          Object.keys(data.components).forEach(key => {
            const status = data.components[key]
            if (typeof status === 'string') {
              // Backend returns strings like "running", "stopped"
              transformedComponents[key] = {
                running: status === 'running',
                healthy: status === 'running' // Assume healthy if running
              }
            } else if (typeof status === 'object') {
              // Backend returns objects (keep as-is)
              transformedComponents[key] = status
            }
          })
        }

        set({
          tradingActive: data.trading_active || false,
          marketStatus: data.market_status || 'CLOSED',
          connectionStatus: data.status === 'healthy' ? 'CONNECTED' : 'DISCONNECTED',
          lastUpdate: new Date().toISOString(),
          components: Object.keys(transformedComponents).length > 0 ? transformedComponents : get().components,
          dataMetrics: {
            ...get().dataMetrics,
            dataPoints5Min: data.data_points_5min || 0,
            ...data.metrics
          }
        })
      },

      setConnectionStatus: (status) => set({
        connectionStatus: status,
        lastUpdate: new Date().toISOString()
      }),

      updateComponent: (componentName, status) => set((state) => ({
        components: {
          ...state.components,
          [componentName]: status
        }
      })),

      // Error handling
      addError: (error) => set((state) => {
        const newError = {
          id: `error_${Date.now()}`,
          message: error.message || error,
          timestamp: new Date().toISOString(),
          type: error.type || 'ERROR',
          component: error.component || 'UNKNOWN'
        }

        return {
          errors: [newError, ...state.errors].slice(0, 100), // Keep last 100 errors
          lastError: newError
        }
      }),

      clearErrors: () => set({ errors: [], lastError: null }),

      // Preferences
      updatePreferences: (newPrefs) => set((state) => ({
        preferences: { ...state.preferences, ...newPrefs }
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      // Theme management
      toggleTheme: () => set((state) => ({
        preferences: {
          ...state.preferences,
          theme: state.preferences.theme === 'dark' ? 'light' : 'dark'
        }
      })),

      // Notifications
      notifications: [],
      addNotification: (notification) => set((state) => {
        const newNotification = {
          id: `notif_${Date.now()}`,
          message: notification.message,
          type: notification.type || 'info', // success, error, warning, info
          timestamp: new Date().toISOString(),
          read: false,
          duration: notification.duration || 5000
        }

        return {
          notifications: [newNotification, ...state.notifications].slice(0, 50)
        }
      }),

      markNotificationAsRead: (notificationId) => set((state) => ({
        notifications: state.notifications.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      })),

      clearNotifications: () => set({ notifications: [] }),

      // System health check
      getSystemHealth: () => {
        const state = get()
        const healthyComponents = Object.values(state.components).filter(c => c.healthy).length
        const totalComponents = Object.keys(state.components).length

        return {
          overall: healthyComponents === totalComponents ? 'HEALTHY' : 'DEGRADED',
          healthyComponents,
          totalComponents,
          healthPercentage: (healthyComponents / totalComponents) * 100,
          isConnected: state.connectionStatus === 'CONNECTED',
          isTradingActive: state.tradingActive && state.marketStatus === 'OPEN'
        }
      },

      // Reset system state
      resetSystemState: () => set({
        tradingActive: false,
        connectionStatus: 'DISCONNECTED',
        components: {
          api_server: { running: false, healthy: false },
          signal_monitor: { running: false, healthy: false },
          realtime_data: { running: false, healthy: false },
          websocket: { running: false, healthy: false }
        },
        dataMetrics: {
          dataPoints5Min: 0,
          totalSignalsToday: 0,
          avgLatency: 0,
          errorRate: 0
        },
        errors: [],
        lastError: null,
        notifications: []
      })
    }),
    {
      name: 'nifty-scalper-system', // Storage key
      partialize: (state) => ({
        preferences: state.preferences,
        settings: state.settings
      }) // Only persist preferences and settings
    }
  )
)