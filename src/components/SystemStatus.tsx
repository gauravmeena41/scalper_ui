import React from 'react';
import { Activity, Server, Database, Wifi, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SystemStatusProps {
  isLoading?: boolean;
}

interface SystemComponent {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  lastUpdate: string;
  details: string;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  isLoading = false
}) => {
  // Mock system status data - in real app this would come from the backend
  const systemComponents: SystemComponent[] = [
    {
      name: 'Trading Server',
      status: 'healthy',
      lastUpdate: new Date().toLocaleTimeString(),
      details: 'Port 8502 - All endpoints responding'
    },
    {
      name: 'Fyers WebSocket',
      status: 'warning',
      lastUpdate: new Date(Date.now() - 30000).toLocaleTimeString(),
      details: 'Reconnection attempts ongoing'
    },
    {
      name: 'MongoDB',
      status: 'error',
      lastUpdate: new Date(Date.now() - 120000).toLocaleTimeString(),
      details: 'Connection timeout - using fallback data'
    },
    {
      name: 'Signal Generator',
      status: 'healthy',
      lastUpdate: new Date().toLocaleTimeString(),
      details: 'Active monitoring - 15 signals generated today'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-lg text-xs font-bold border";
    switch (status) {
      case 'healthy':
        return `${baseClasses} bg-green-500/20 text-green-400 border-green-500/30`;
      case 'warning':
        return `${baseClasses} bg-yellow-500/20 text-yellow-400 border-yellow-500/30`;
      case 'error':
        return `${baseClasses} bg-red-500/20 text-red-400 border-red-500/30`;
      default:
        return `${baseClasses} bg-gray-500/20 text-gray-400 border-gray-500/30`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
        <div className="flex items-center mb-4">
          <Server className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-bold text-white">System Status</h3>
        </div>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-600 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const healthyCount = systemComponents.filter(c => c.status === 'healthy').length;
  const warningCount = systemComponents.filter(c => c.status === 'warning').length;
  const errorCount = systemComponents.filter(c => c.status === 'error').length;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 border border-gray-600/50 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-500/20 p-3 rounded-xl">
            <Server className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">System Status</h2>
            <p className="text-gray-400 text-sm">Component health monitoring</p>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="text-green-400 text-sm font-medium">Healthy</div>
          <div className="text-2xl font-bold text-white">{healthyCount}</div>
        </div>
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
          <div className="text-yellow-400 text-sm font-medium">Warning</div>
          <div className="text-2xl font-bold text-white">{warningCount}</div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
          <div className="text-red-400 text-sm font-medium">Error</div>
          <div className="text-2xl font-bold text-white">{errorCount}</div>
        </div>
      </div>

      {/* Component List */}
      <div className="space-y-3">
        {systemComponents.map((component) => (
          <div
            key={component.name}
            className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 hover:bg-gray-700/20 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-3">
                {getStatusIcon(component.status)}
                <div className="text-white font-medium">{component.name}</div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={getStatusBadge(component.status)}>
                  {component.status.toUpperCase()}
                </span>
                <div className="text-xs text-gray-400">
                  {component.lastUpdate}
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-300 ml-8">
              {component.details}
            </div>
          </div>
        ))}
      </div>

      {/* System Health Footer */}
      <div className="mt-6 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-400">
            <Activity className="w-4 h-4" />
            <span>Auto-refresh: 30s</span>
          </div>
          <div className="flex items-center space-x-2">
            {errorCount === 0 && warningCount === 0 ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 font-medium">All Systems Operational</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-400 font-medium">Some Issues Detected</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};