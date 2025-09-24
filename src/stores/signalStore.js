import { create } from 'zustand'

export const useSignalStore = create((set, get) => ({
  // Signal data state
  signals: [],
  activeSignals: [],
  totalSignalsToday: 0,
  signalStats: {
    total: 0,
    profitable: 0,
    loss: 0,
    pending: 0
  },

  // Actions
  addSignal: (signal) => set((state) => {
    const newSignal = {
      ...signal,
      id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: signal.timestamp || new Date().toISOString(),
      status: signal.status || 'ACTIVE'
    }

    const updatedSignals = [newSignal, ...state.signals].slice(0, 100) // Keep last 100 signals
    const updatedActiveSignals = newSignal.status === 'ACTIVE'
      ? [...state.activeSignals, newSignal]
      : state.activeSignals

    return {
      signals: updatedSignals,
      activeSignals: updatedActiveSignals,
      totalSignalsToday: state.totalSignalsToday + 1
    }
  }),

  updateSignal: (signalId, updates) => set((state) => {
    const updatedSignals = state.signals.map(signal =>
      signal.id === signalId ? { ...signal, ...updates } : signal
    )

    const updatedActiveSignals = state.activeSignals.map(signal =>
      signal.id === signalId ? { ...signal, ...updates } : signal
    ).filter(signal => signal.status === 'ACTIVE')

    return {
      signals: updatedSignals,
      activeSignals: updatedActiveSignals
    }
  }),

  closeSignal: (signalId, exitPrice, exitReason = 'MANUAL') => set((state) => {
    const signal = state.signals.find(s => s.id === signalId)
    if (!signal) return state

    const pnlPercent = ((exitPrice - signal.entry_price) / signal.entry_price) * 100
    const updatedSignal = {
      ...signal,
      exit_price: exitPrice,
      exit_time: new Date().toISOString(),
      pnl_percent: pnlPercent,
      status: exitReason,
      duration: Date.now() - new Date(signal.timestamp).getTime()
    }

    const updatedSignals = state.signals.map(s =>
      s.id === signalId ? updatedSignal : s
    )

    const updatedActiveSignals = state.activeSignals.filter(s => s.id !== signalId)

    // Update stats
    const newStats = { ...state.signalStats }
    if (pnlPercent > 0) {
      newStats.profitable += 1
    } else {
      newStats.loss += 1
    }
    newStats.pending = Math.max(0, newStats.pending - 1)

    return {
      signals: updatedSignals,
      activeSignals: updatedActiveSignals,
      signalStats: newStats
    }
  }),

  updateSignalStats: (stats) => set({ signalStats: stats }),

  // Bulk update from API
  setSignals: (apiSignals) => set({
    signals: apiSignals.map(signal => ({
      ...signal,
      id: signal.signal_id || `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    })),
    totalSignalsToday: apiSignals.length
  }),

  // Clear all signals
  clearSignals: () => set({
    signals: [],
    activeSignals: [],
    totalSignalsToday: 0,
    signalStats: {
      total: 0,
      profitable: 0,
      loss: 0,
      pending: 0
    }
  }),

  // Get signal by ID
  getSignalById: (signalId) => {
    const state = get()
    return state.signals.find(signal => signal.id === signalId)
  },

  // Get recent signals (last N)
  getRecentSignals: (count = 10) => {
    const state = get()
    return state.signals.slice(0, count)
  }
}))