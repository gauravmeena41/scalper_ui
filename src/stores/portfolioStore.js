import { create } from 'zustand'

export const usePortfolioStore = create((set, get) => ({
  // Portfolio data state
  totalPnL: 0,
  dayPnL: 0,
  totalTrades: 0,
  winRate: 0,
  currentPositions: [],
  totalCapital: 100000, // Default 1L capital
  availableCapital: 100000,
  usedCapital: 0,

  // Performance metrics
  performance: {
    avgProfit: 0,
    avgLoss: 0,
    maxDrawdown: 0,
    profitFactor: 0,
    sharpeRatio: 0,
    winningTrades: 0,
    losingTrades: 0
  },

  // Recent trades
  recentTrades: [],

  // Actions
  updatePortfolioData: (data) => set({
    totalPnL: data.total_pnl || 0,
    dayPnL: data.day_pnl || 0,
    totalTrades: data.total_trades || 0,
    winRate: data.win_rate || 0,
    currentPositions: data.current_positions || []
  }),

  addPosition: (position) => set((state) => {
    const newPosition = {
      ...position,
      id: `pos_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      entryTime: position.entryTime || new Date().toISOString(),
      status: 'ACTIVE',
      unrealizedPnL: 0
    }

    const positionValue = newPosition.quantity * newPosition.entryPrice * 75 // NIFTY lot size

    return {
      currentPositions: [...state.currentPositions, newPosition],
      usedCapital: state.usedCapital + positionValue,
      availableCapital: state.availableCapital - positionValue
    }
  }),

  updatePosition: (positionId, updates) => set((state) => {
    const updatedPositions = state.currentPositions.map(position =>
      position.id === positionId ? { ...position, ...updates } : position
    )

    return {
      currentPositions: updatedPositions
    }
  }),

  closePosition: (positionId, exitPrice, exitReason = 'MANUAL') => set((state) => {
    const position = state.currentPositions.find(p => p.id === positionId)
    if (!position) return state

    const pnl = (exitPrice - position.entryPrice) * position.quantity * 75
    const pnlPercent = ((exitPrice - position.entryPrice) / position.entryPrice) * 100

    const closedTrade = {
      ...position,
      exitPrice,
      exitTime: new Date().toISOString(),
      pnl,
      pnlPercent,
      status: exitReason,
      duration: Date.now() - new Date(position.entryTime).getTime()
    }

    const positionValue = position.quantity * position.entryPrice * 75

    const updatedPositions = state.currentPositions.filter(p => p.id !== positionId)
    const updatedRecentTrades = [closedTrade, ...state.recentTrades].slice(0, 50)

    // Update performance metrics
    const newTotalPnL = state.totalPnL + pnl
    const newDayPnL = state.dayPnL + pnl
    const newTotalTrades = state.totalTrades + 1

    const profitableTrades = updatedRecentTrades.filter(t => t.pnl > 0).length
    const newWinRate = updatedRecentTrades.length > 0
      ? (profitableTrades / updatedRecentTrades.length) * 100
      : 0

    // Update performance stats
    const newPerformance = { ...state.performance }
    if (pnl > 0) {
      newPerformance.winningTrades += 1
      newPerformance.avgProfit = ((newPerformance.avgProfit * (newPerformance.winningTrades - 1)) + pnl) / newPerformance.winningTrades
    } else {
      newPerformance.losingTrades += 1
      newPerformance.avgLoss = ((newPerformance.avgLoss * (newPerformance.losingTrades - 1)) + Math.abs(pnl)) / newPerformance.losingTrades
    }

    return {
      currentPositions: updatedPositions,
      recentTrades: updatedRecentTrades,
      totalPnL: newTotalPnL,
      dayPnL: newDayPnL,
      totalTrades: newTotalTrades,
      winRate: newWinRate,
      usedCapital: state.usedCapital - positionValue,
      availableCapital: state.availableCapital + positionValue,
      performance: newPerformance
    }
  }),

  // Update unrealized P&L for active positions based on current prices
  updateUnrealizedPnL: (currentPrices) => set((state) => {
    const updatedPositions = state.currentPositions.map(position => {
      const currentPrice = currentPrices[position.symbol]
      if (currentPrice) {
        const unrealizedPnL = (currentPrice - position.entryPrice) * position.quantity * 75
        const unrealizedPnLPercent = ((currentPrice - position.entryPrice) / position.entryPrice) * 100
        return {
          ...position,
          currentPrice,
          unrealizedPnL,
          unrealizedPnLPercent
        }
      }
      return position
    })

    return {
      currentPositions: updatedPositions
    }
  }),

  setCapital: (amount) => set((state) => ({
    totalCapital: amount,
    availableCapital: amount - state.usedCapital
  })),

  // Reset portfolio (for new day)
  resetDayPnL: () => set({
    dayPnL: 0
  }),

  // Get portfolio summary
  getPortfolioSummary: () => {
    const state = get()
    const totalUnrealizedPnL = state.currentPositions.reduce(
      (sum, pos) => sum + (pos.unrealizedPnL || 0), 0
    )

    return {
      totalValue: state.totalCapital + state.totalPnL + totalUnrealizedPnL,
      totalPnL: state.totalPnL,
      dayPnL: state.dayPnL,
      unrealizedPnL: totalUnrealizedPnL,
      totalTrades: state.totalTrades,
      winRate: state.winRate,
      activePositions: state.currentPositions.length,
      capitalUtilization: (state.usedCapital / state.totalCapital) * 100
    }
  }
}))