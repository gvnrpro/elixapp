import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, CheckCircle } from 'lucide-react';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastSync, setLastSync] = useState(new Date());

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setLastSync(new Date());
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate sync updates when online
    const syncInterval = setInterval(() => {
      if (isOnline) {
        setLastSync(new Date());
      }
    }, 30000); // Update every 30 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
    };
  }, [isOnline]);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg border ${
        isOnline 
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}>
        {isOnline ? (
          <>
            <div className="flex items-center space-x-1">
              <Wifi size={16} />
              <CheckCircle size={14} />
            </div>
            <div className="text-xs">
              <div className="flex items-center space-x-1">
                <span>Online</span>
                <span>•</span>
                <span>Synced {formatTime(lastSync)}</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <WifiOff size={16} />
            <div className="text-xs">
              <div>Offline Mode</div>
              <div className="text-xs opacity-75">Last sync: {formatTime(lastSync)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}