import React, { useState, useEffect } from 'react';
import { AssetMap } from './AssetMap';
import { PredictiveAlerts } from './PredictiveAlerts';
import { KPICards } from './KPICards';
import { AssetPerformanceChart } from './AssetPerformanceChart';
import { dataService } from '../services/dataService';
import { demoDataService } from '../services/demoDataService';
import { Activity, TrendingUp, Zap, Users, Brain, Target, Cpu } from 'lucide-react';

interface DashboardProps {
  onAssetSelect: (asset: any) => void;
}

export function Dashboard({ onAssetSelect }: DashboardProps) {
  const [dashboardData, setDashboardData] = useState({
    kpis: {
      fleetReadiness: 94,
      criticalAlerts: 3,
      avgEfficiency: 87,
      avgResponseTime: 4,
      totalAssetValue: 12500000,
      potentialSavings: 2300000,
      completionRate: 89
    },
    alerts: [],
    performanceData: [],
    realtimeUpdates: [],
    categoryPerformance: [],
    trends: null
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Try to get enhanced demo data first
        const metricsResult = await demoDataService.getPerformanceMetrics().catch(() => null);
        
        // If we have enhanced demo data, use it
        if (metricsResult) {
          setDashboardData(prev => ({
            ...prev,
            ...metricsResult
          }));
        } else {
          // Fallback to basic data service calls
          // Note: These would need auth tokens in a real implementation
          const alertsResult = await dataService.getPredictiveAlerts('').catch(() => ({ alerts: [] }));
          const performanceResult = await dataService.getPerformanceOverview('').catch(() => ({ kpis: {} }));
          
          setDashboardData(prev => ({
            ...prev,
            alerts: alertsResult.alerts || [],
            kpis: {
              ...prev.kpis,
              ...(performanceResult.kpis || {})
            }
          }));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    const loadRealtimeUpdates = async () => {
      try {
        const updates = await demoDataService.getRealtimeUpdates();
        setDashboardData(prev => ({
          ...prev,
          realtimeUpdates: updates.updates || []
        }));
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading realtime updates:', error);
      }
    };

    loadDashboardData();
    
    // Setup realtime update interval for demo
    const realtimeInterval = setInterval(loadRealtimeUpdates, 15000);
    loadRealtimeUpdates(); // Initial load

    return () => clearInterval(realtimeInterval);
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 glass-puck elix-glow mb-6 flex items-center justify-center mx-auto">
            <Activity size={24} className="text-teal-400 animate-pulse" />
          </div>
          <h3 className="sf-title-3 text-white mb-2">Loading Intelligence</h3>
          <p className="sf-body text-white/60">Gathering real-time asset data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-8 animate-illuminate">
      {/* Command Center Header */}
      <div className="text-center mb-12">
        <div className="glass-puck p-6 mb-8 floating-layer-2">
          <h1 className="sf-large-title illuminated-text mb-4">Elix Command Center</h1>
          <p className="sf-title-3 text-white/70 mb-4">
            AI-Powered Asset Intelligence for MENA Region Operations
          </p>
          <div className="flex items-center justify-center space-x-6 text-white/60">
            <div className="flex items-center space-x-2">
              <Brain size={16} className="text-teal-400" />
              <span className="sf-callout">40+ Assets Monitored</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-green-400" />
              <span className="sf-callout">6 Active Sites</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu size={16} className="text-blue-400" />
              <span className="sf-callout">Real-time Analytics</span>
            </div>
          </div>
        </div>
        
        {/* Live Status Bar */}
        <div className="glass-pill px-6 py-3 inline-flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full status-success animate-pulse-glow"></div>
            <span className="sf-callout text-white/80">System Operational</span>
          </div>
          <div className="w-px h-4 bg-glass-border"></div>
          <span className="sf-caption-1 text-white/60">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Hero Asset Map */}
      <section className="mb-12">
        <div className="glass-puck p-8 floating-layer-2 animate-float">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center elix-glow">
              <Activity size={20} className="text-white" />
            </div>
            <h2 className="sf-title-2 text-white">Live Asset Intelligence</h2>
          </div>
          <AssetMap onAssetSelect={onAssetSelect} />
        </div>
      </section>

      {/* Operational Health Grid */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center status-success">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h2 className="sf-title-2 text-white">Operational Health Matrix</h2>
        </div>
        
        <KPICards kpis={dashboardData.kpis} />
      </section>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Predictive Intelligence */}
        <section className="xl:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center status-warning">
              <Zap size={20} className="text-white" />
            </div>
            <h2 className="sf-title-2 text-white">Predictive Intelligence</h2>
          </div>
          
          <div className="glass-puck p-6 floating-layer-1">
            <PredictiveAlerts alerts={dashboardData.alerts} />
          </div>
        </section>

        {/* Performance Analytics */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center status-primary">
              <Activity size={20} className="text-white" />
            </div>
            <h2 className="sf-title-2 text-white">Performance Analytics</h2>
          </div>
          
          <div className="glass-puck p-6 floating-layer-1">
            <AssetPerformanceChart data={dashboardData.performanceData} />
          </div>
        </section>
      </div>

      {/* Activity Intelligence */}
      <section className="mt-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center elix-glow">
            <Users size={20} className="text-white" />
          </div>
          <h2 className="sf-title-2 text-white">Live Activity Stream</h2>
        </div>
        
        <div className="glass-puck p-8 floating-layer-1">
          <div className="space-y-6">
            {[
              {
                time: '2 minutes ago',
                event: 'Generator GEN-001 maintenance optimization completed',
                status: 'success',
                location: 'Dubai Marina Complex',
                impact: 'Efficiency increased by 12%'
              },
              {
                time: '8 minutes ago',
                event: 'Excavator EXC-007 predictive alert triggered',
                status: 'warning',
                location: 'Al Ain Infrastructure Project',
                impact: 'Maintenance scheduled for tomorrow'
              },
              {
                time: '15 minutes ago',
                event: 'Crane CRN-003 performance threshold exceeded',
                status: 'success',
                location: 'Abu Dhabi Tower Complex',
                impact: 'Operating at 103% efficiency'
              },
              {
                time: '32 minutes ago',
                event: 'New asset registered: Loader LOD-012',
                status: 'info',
                location: 'Sharjah Industrial Zone',
                impact: 'Fleet capacity increased'
              }
            ].map((activity, index) => (
              <div key={index} className="group">
                <div className="glass-pill p-6 interactive-element">
                  <div className="flex items-start space-x-4">
                    <div className={`w-3 h-3 rounded-full mt-2 ${
                      activity.status === 'success' ? 'status-success' :
                      activity.status === 'warning' ? 'status-warning' :
                      activity.status === 'error' ? 'status-destructive' :
                      'status-primary'
                    }`} />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="sf-callout text-white font-medium">{activity.event}</h4>
                        <span className="sf-caption-1 text-white/50">{activity.time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-white/70">
                        <span className="sf-caption-1">📍 {activity.location}</span>
                        <span className="sf-caption-1">💡 {activity.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}