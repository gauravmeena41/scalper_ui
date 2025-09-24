import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { LoadingSpinner } from '../ui/LoadingSpinner'
import { useSystemStore } from '../../stores/systemStore'
import {
  Activity,
  Wifi,
  Server,
  Database,
  TrendingUp,
  Clock,
  AlertTriangle
} from 'lucide-react'

export const SystemStatus = () => {
  const {
    tradingActive,
    marketStatus,
    connectionStatus,
    components,
    dataMetrics,
    lastUpdate,
    getSystemHealth
  } = useSystemStore()

  const health = getSystemHealth()

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Never'
    return new Date(timestamp).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const getStatusIcon = (isHealthy, isRunning = true) => {
    if (!isRunning) return <AlertTriangle className="w-4 h-4 text-yellow-400" />
    return isHealthy ? (
      <div className="w-4 h-4 bg-green-400 rounded-full" />
    ) : (
      <div className="w-4 h-4 bg-red-400 rounded-full" />
    )
  }

  const getMarketStatusBadge = () => {
    switch (marketStatus) {
      case 'OPEN':
        return <Badge variant="success">Market Open</Badge>
      case 'PRE_OPEN':
        return <Badge variant="warning">Pre-Open</Badge>
      case 'CLOSED':
        return <Badge variant="error">Market Closed</Badge>
      default:
        return <Badge variant="default">Unknown</Badge>
    }
  }

  return (
    <Card
      title="System Status"
      subtitle="Real-time health monitoring"
      action={getMarketStatusBadge()}
    >
      <div className="space-y-6">
        {/* Overall Health */}
        <div className="text-center">
          <div className={`text-2xl font-bold mb-2 ${
            health.overall === 'HEALTHY' ? 'text-green-400' : 'text-yellow-400'
          }`}>
            {health.overall}
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <Activity className="w-4 h-4" />
            <span>{health.healthyComponents}/{health.totalComponents} Components</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-between py-3 border-y border-gray-800">
          <div className="flex items-center space-x-2">
            <Wifi className={`w-4 h-4 ${
              connectionStatus === 'CONNECTED' ? 'text-green-400' : 'text-red-400'
            }`} />
            <span className="text-sm text-white">Connection</span>
          </div>
          <Badge variant={connectionStatus === 'CONNECTED' ? 'connected' : 'disconnected'}>
            {connectionStatus === 'CONNECTING' ? (
              <>
                <LoadingSpinner size="xs" className="mr-1" />
                Connecting
              </>
            ) : connectionStatus}
          </Badge>
        </div>

        {/* Components Status */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-300">Components</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(components.api_server?.healthy, components.api_server?.running)}
                <span className="text-sm text-white">API Server</span>
              </div>
              <Badge variant={components.api_server?.healthy ? 'success' : 'error'} size="xs">
                {components.api_server?.running ? 'Running' : 'Stopped'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(components.signal_monitor?.healthy, components.signal_monitor?.running)}
                <span className="text-sm text-white">Signal Monitor</span>
              </div>
              <Badge variant={components.signal_monitor?.healthy ? 'success' : 'error'} size="xs">
                {components.signal_monitor?.running ? 'Running' : 'Stopped'}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getStatusIcon(components.realtime_data?.healthy, components.realtime_data?.running)}
                <span className="text-sm text-white">Real-time Data</span>
              </div>
              <Badge variant={components.realtime_data?.healthy ? 'success' : 'error'} size="xs">
                {components.realtime_data?.running ? 'Running' : 'Stopped'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Data Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <Database className="w-3 h-3 text-blue-400" />
              <span className="text-xs text-gray-400">Data Points (5min)</span>
            </div>
            <p className="text-sm font-medium text-white">{dataMetrics.dataPoints5Min}</p>
          </div>

          <div>
            <div className="flex items-center space-x-1 mb-1">
              <TrendingUp className="w-3 h-3 text-green-400" />
              <span className="text-xs text-gray-400">Signals Today</span>
            </div>
            <p className="text-sm font-medium text-white">{dataMetrics.totalSignalsToday}</p>
          </div>
        </div>

        {/* Last Update */}
        <div className="pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Last Update</span>
            </div>
            <span className="text-xs text-white">{formatTime(lastUpdate)}</span>
          </div>
        </div>

        {/* Trading Status */}
        <div className="pt-3 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Trading Active</span>
            <Badge variant={tradingActive ? 'success' : 'error'}>
              {tradingActive ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  )
}