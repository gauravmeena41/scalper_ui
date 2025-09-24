import React, { useState, useEffect, useRef } from 'react';
import { Bell, BellRing, Volume2, VolumeX, Settings, X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface Alert {
  id: string;
  type: 'HIGH_CONFIDENCE' | 'PRICE_BREAKOUT' | 'VOLUME_SPIKE' | 'SIGNAL_CLUSTER';
  title: string;
  message: string;
  signal_type: 'BUY' | 'SELL';
  confidence: number;
  price: number;
  symbol: string;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  acknowledged: boolean;
}

interface AlertSettings {
  enabled: boolean;
  sound_enabled: boolean;
  min_confidence: number;
  alert_types: {
    high_confidence: boolean;
    price_breakout: boolean;
    volume_spike: boolean;
    signal_cluster: boolean;
  };
  sound_volume: number;
}

export const AlertSystem: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [settings, setSettings] = useState<AlertSettings>({
    enabled: true,
    sound_enabled: true,
    min_confidence: 0.85,
    alert_types: {
      high_confidence: true,
      price_breakout: true,
      volume_spike: false,
      signal_cluster: true
    },
    sound_volume: 0.7
  });
  const [showSettings, setShowSettings] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAlerts, setShowAlerts] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Mock alert generation - replace with real signal monitoring
  useEffect(() => {
    if (!settings.enabled) return;

    const generateAlert = () => {
      const alertTypes = ['HIGH_CONFIDENCE', 'PRICE_BREAKOUT', 'VOLUME_SPIKE', 'SIGNAL_CLUSTER'] as const;
      const signalTypes = ['BUY', 'SELL'] as const;
      const severities = ['MEDIUM', 'HIGH', 'CRITICAL'] as const;

      const mockAlerts: Partial<Alert>[] = [
        {
          type: 'HIGH_CONFIDENCE',
          title: 'High Confidence Signal',
          message: 'VWAP algorithm detected strong BUY signal with 94% confidence',
          signal_type: 'BUY',
          confidence: 0.94,
          price: 25234.50,
          symbol: 'NIFTY2592325200CE',
          severity: 'HIGH'
        },
        {
          type: 'SIGNAL_CLUSTER',
          title: 'Signal Cluster Detected',
          message: 'Multiple algorithms agree on SELL signal in tight price range',
          signal_type: 'SELL',
          confidence: 0.89,
          price: 25198.75,
          symbol: 'NIFTY2592325150PE',
          severity: 'CRITICAL'
        },
        {
          type: 'PRICE_BREAKOUT',
          title: 'Price Breakout Alert',
          message: 'NIFTY broke above key resistance level with volume confirmation',
          signal_type: 'BUY',
          confidence: 0.87,
          price: 25267.25,
          symbol: 'NIFTY50',
          severity: 'MEDIUM'
        }
      ];

      const randomAlert = mockAlerts[Math.floor(Math.random() * mockAlerts.length)];
      const newAlert: Alert = {
        id: `alert_${Date.now()}`,
        ...randomAlert,
        timestamp: new Date(),
        acknowledged: false
      } as Alert;

      // Check if alert meets criteria
      if (newAlert.confidence >= settings.min_confidence &&
          settings.alert_types[newAlert.type.toLowerCase() as keyof typeof settings.alert_types]) {

        setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts
        setUnreadCount(prev => prev + 1);

        // Play sound if enabled
        if (settings.sound_enabled && audioRef.current) {
          audioRef.current.volume = settings.sound_volume;
          audioRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
      }
    };

    // Generate alerts at random intervals (15-45 seconds)
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance to generate alert
        generateAlert();
      }
    }, Math.random() * 30000 + 15000);

    return () => clearInterval(interval);
  }, [settings]);

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllAlerts = () => {
    setAlerts([]);
    setUnreadCount(0);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'border-red-200 bg-red-50 text-red-700';
      case 'HIGH': return 'border-orange-200 bg-orange-50 text-orange-700';
      case 'MEDIUM': return 'border-amber-200 bg-amber-50 text-amber-700';
      default: return 'border-blue-200 bg-blue-50 text-blue-700';
    }
  };

  const getSignalIcon = (signalType: string) => {
    return signalType === 'BUY' ?
      <TrendingUp className="w-4 h-4 text-emerald-600" /> :
      <TrendingDown className="w-4 h-4 text-red-500" />;
  };

  return (
    <>
      {/* Hidden audio element for alert sounds */}
      <audio ref={audioRef} preload="auto">
        <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBT2S3fTddS8FNH3J8t2QQQcTXLPq7KhVFAgPAAAPA=" type="audio/wav" />
      </audio>

      {/* Alert Bell Icon */}
      <div className="fixed top-4 right-4 z-50">
        <div className="relative">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className={`p-3 rounded-full border transition-all duration-200 shadow-lg ${
              unreadCount > 0
                ? 'bg-red-100 border-red-300 text-red-600 animate-pulse'
                : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            {unreadCount > 0 ? <BellRing className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
          </button>

          {unreadCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold animate-bounce">
              {unreadCount > 99 ? '99+' : unreadCount}
            </div>
          )}
        </div>
      </div>

      {/* Alert Panel */}
      {showAlerts && (
        <div className="fixed top-16 right-4 w-96 max-h-96 bg-white border border-slate-200 rounded-xl shadow-2xl z-40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">Signal Alerts</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowAlerts(false)}
                className="p-1 text-slate-500 hover:text-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Enable Alerts</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Sound Alerts</span>
                  <button
                    onClick={() => setSettings(prev => ({ ...prev, sound_enabled: !prev.sound_enabled }))}
                    className={`p-1 rounded ${settings.sound_enabled ? 'text-blue-600' : 'text-slate-400'}`}
                  >
                    {settings.sound_enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                </div>

                <div>
                  <label className="text-sm text-slate-600">Min Confidence: {(settings.min_confidence * 100).toFixed(0)}%</label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={settings.min_confidence}
                    onChange={(e) => setSettings(prev => ({ ...prev, min_confidence: parseFloat(e.target.value) }))}
                    className="w-full mt-1 accent-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Alerts List */}
          <div className="max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Bell className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-slate-600 text-sm">No alerts yet</p>
                <p className="text-slate-500 text-xs">High-confidence signals will appear here</p>
              </div>
            ) : (
              <div className="space-y-2 p-2">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border transition-all duration-200 ${getSeverityColor(alert.severity)} ${
                      alert.acknowledged ? 'opacity-60' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {getSignalIcon(alert.signal_type)}
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                          <span className="text-xs opacity-75">
                            {(alert.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-xs opacity-90 mb-1">{alert.message}</p>
                        <div className="flex items-center justify-between text-xs opacity-75">
                          <span>{alert.symbol}</span>
                          <span>₹{alert.price.toFixed(2)}</span>
                          <span>{alert.timestamp.toLocaleTimeString()}</span>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="ml-2 text-xs opacity-75 hover:opacity-100 transition-opacity"
                        >
                          ✓
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {alerts.length > 0 && (
            <div className="p-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={clearAllAlerts}
                className="w-full text-xs text-slate-500 hover:text-slate-900 transition-colors"
              >
                Clear All Alerts
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};