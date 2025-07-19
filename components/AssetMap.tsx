import React, { useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, Zap, AlertTriangle, CheckCircle } from 'lucide-react';

const assetClusters = [
  {
    id: 1,
    name: 'Dubai Industrial Zone',
    location: { x: 65, y: 45 },
    assets: 24,
    status: 'healthy',
    alerts: 0
  },
  {
    id: 2,
    name: 'Abu Dhabi Complex',
    location: { x: 45, y: 55 },
    assets: 18,
    status: 'warning',
    alerts: 2
  },
  {
    id: 3,
    name: 'Riyadh Operations',
    location: { x: 35, y: 35 },
    assets: 31,
    status: 'healthy',
    alerts: 0
  },
  {
    id: 4,
    name: 'Doha Facility',
    location: { x: 55, y: 40 },
    assets: 12,
    status: 'critical',
    alerts: 1
  },
  {
    id: 5,
    name: 'Kuwait Operations',
    location: { x: 40, y: 25 },
    assets: 8,
    status: 'healthy',
    alerts: 0
  }
];

const mockAssets = [
  { id: 'HM-001', name: 'Excavator CAT 320', type: 'Heavy Machinery', status: 'healthy' },
  { id: 'HM-002', name: 'Crane Liebherr LTM', type: 'Heavy Machinery', status: 'warning' },
  { id: 'HVAC-001', name: 'Chiller Unit 1', type: 'HVAC', status: 'critical' },
];

export function AssetMap({ onAssetSelect }) {
  const [selectedCluster, setSelectedCluster] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="text-white" size={16} />;
      case 'warning': return <AlertTriangle className="text-white" size={16} />;
      case 'critical': return <Zap className="text-white" size={16} />;
      default: return <MapPin className="text-white" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="asset-map h-96 w-full relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="sf-headline text-white">MENA Region Operations</h3>
        <div className="glass-pill px-4 py-2">
          <span className="sf-callout text-white/80">
            {assetClusters.reduce((sum, cluster) => sum + cluster.assets, 0)} Assets Monitored
          </span>
        </div>
      </div>

      <div className="relative h-full glass-puck bg-gradient-to-br from-slate-900/50 via-teal-900/20 to-slate-900/50 rounded-2xl overflow-hidden">
        {/* Spatial background with depth */}
        <div className="absolute inset-0 opacity-30">
          <div className="w-full h-full bg-gradient-to-br from-teal-500/20 via-cyan-400/10 to-slate-600/20"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(0,0,0,0.2)_100%)]"></div>
        </div>

        {/* Asset clusters */}
        {assetClusters.map((cluster) => (
          <div
            key={cluster.id}
            className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
            style={{ 
              left: `${cluster.location.x}%`, 
              top: `${cluster.location.y}%` 
            }}
            onClick={() => setSelectedCluster(selectedCluster === cluster.id ? null : cluster.id)}
          >
            {/* Spatial cluster indicator */}
            <div className={`w-6 h-6 ${getStatusColor(cluster.status)} rounded-full border-2 border-white/50 shadow-lg group-hover:scale-125 transition-transform interactive-element`}
                 style={{ 
                   boxShadow: `0 0 20px ${cluster.status === 'critical' ? 'rgba(239, 68, 68, 0.6)' : 
                                        cluster.status === 'warning' ? 'rgba(245, 158, 11, 0.6)' : 
                                        'rgba(16, 185, 129, 0.6)'}, 0 4px 12px rgba(0,0,0,0.3)` 
                 }}>
              {cluster.alerts > 0 && (
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center status-destructive">
                  {cluster.alerts}
                </div>
              )}
            </div>

            {/* Spatial cluster popup */}
            {selectedCluster === cluster.id && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 glass-puck floating-layer-3 p-4 z-20 animate-illuminate">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-8 h-8 rounded-xl ${getStatusColor(cluster.status)} flex items-center justify-center shadow-lg`}>
                    {getStatusIcon(cluster.status)}
                  </div>
                  <div>
                    <h4 className="sf-callout text-white font-medium">{cluster.name}</h4>
                    <p className="sf-caption-1 text-white/60">{cluster.assets} active assets</p>
                  </div>
                </div>
                
                {/* Asset preview */}
                <div className="space-y-2">
                  {mockAssets.slice(0, 2).map((asset) => (
                    <button
                      key={asset.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAssetSelect(asset);
                      }}
                      className="w-full text-left glass-pill p-3 interactive-element hover:elix-glow"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="sf-footnote text-white/90">{asset.name}</span>
                          <p className="sf-caption-2 text-white/60">{asset.type}</p>
                        </div>
                        {getStatusIcon(asset.status)}
                      </div>
                    </button>
                  ))}
                  <button className="w-full sf-footnote text-teal-400 hover:text-teal-300 text-left p-2 interactive-element">
                    View all {cluster.assets} assets →
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Spatial legend */}
        <div className="absolute bottom-4 left-4 glass-pill p-4 floating-layer-2">
          <h4 className="sf-caption-1 text-white/70 mb-3">Asset Status</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-emerald-500 rounded-full status-success"></div>
              <span className="sf-caption-1 text-white/80">Operational</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full status-warning"></div>
              <span className="sf-caption-1 text-white/80">Attention</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full status-destructive"></div>
              <span className="sf-caption-1 text-white/80">Critical</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}