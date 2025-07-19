import React from 'react';
import { Shield, AlertTriangle, Users, DollarSign, TrendingUp, TrendingDown, Zap, Clock, Target, PiggyBank } from 'lucide-react';

interface KPICardsProps {
  kpis: {
    fleetReadiness: number;
    criticalAlerts: number;
    avgEfficiency?: number;
    avgResponseTime?: number;
    totalAssetValue?: number;
    potentialSavings?: number;
    completionRate?: number;
    fieldTeamUptime?: number;
    budgetVsActuals?: number;
  };
}

interface KPIMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: React.ElementType;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  color: 'success' | 'warning' | 'destructive' | 'primary';
  glowClass: string;
}

export function KPICards({ kpis }: KPICardsProps) {
  // Build metrics array based on available data
  const baseMetrics = [
    {
      id: 'fleet-readiness',
      label: 'Fleet Readiness',
      value: kpis.fleetReadiness,
      unit: '%',
      icon: Shield,
      trend: 'up' as const,
      trendValue: '+2.3%',
      color: kpis.fleetReadiness >= 90 ? 'success' : kpis.fleetReadiness >= 80 ? 'warning' : 'destructive' as const,
      glowClass: kpis.fleetReadiness >= 90 ? 'status-success' : kpis.fleetReadiness >= 80 ? 'status-warning' : 'status-destructive'
    },
    {
      id: 'critical-alerts',
      label: 'Critical Alerts',
      value: kpis.criticalAlerts,
      unit: '',
      icon: AlertTriangle,
      trend: 'down' as const,
      trendValue: '-40% this week',
      color: kpis.criticalAlerts === 0 ? 'success' : kpis.criticalAlerts <= 5 ? 'warning' : 'destructive' as const,
      glowClass: kpis.criticalAlerts === 0 ? 'status-success' : kpis.criticalAlerts <= 5 ? 'status-warning' : 'status-destructive'
    }
  ];

  // Add enhanced metrics if available
  const enhancedMetrics = [];
  
  if (kpis.avgEfficiency !== undefined) {
    enhancedMetrics.push({
      id: 'avg-efficiency',
      label: 'Avg Efficiency',
      value: kpis.avgEfficiency,
      unit: '%',
      icon: Target,
      trend: 'up' as const,
      trendValue: '+12% this month',
      color: kpis.avgEfficiency >= 85 ? 'success' : kpis.avgEfficiency >= 70 ? 'warning' : 'destructive' as const,
      glowClass: kpis.avgEfficiency >= 85 ? 'status-success' : kpis.avgEfficiency >= 70 ? 'status-warning' : 'status-destructive'
    });
  }

  if (kpis.avgResponseTime !== undefined) {
    enhancedMetrics.push({
      id: 'response-time',
      label: 'Avg Response Time',
      value: kpis.avgResponseTime,
      unit: 'hrs',
      icon: Clock,
      trend: 'down' as const,
      trendValue: '-60% faster',
      color: kpis.avgResponseTime <= 4 ? 'success' : kpis.avgResponseTime <= 8 ? 'warning' : 'destructive' as const,
      glowClass: kpis.avgResponseTime <= 4 ? 'status-success' : kpis.avgResponseTime <= 8 ? 'status-warning' : 'status-destructive'
    });
  }

  if (kpis.potentialSavings !== undefined) {
    enhancedMetrics.push({
      id: 'potential-savings',
      label: 'Predicted Savings',
      value: Math.round(kpis.potentialSavings / 1000000 * 10) / 10,
      unit: 'M AED',
      icon: PiggyBank,
      trend: 'up' as const,
      trendValue: '+15% vs target',
      color: 'success' as const,
      glowClass: 'status-success'
    });
  }

  // Add fallback metrics if not enough enhanced data
  if (enhancedMetrics.length < 2) {
    if (kpis.fieldTeamUptime !== undefined) {
      enhancedMetrics.push({
        id: 'field-team-uptime',
        label: 'Team Availability',
        value: kpis.fieldTeamUptime,
        unit: '%',
        icon: Users,
        trend: 'up' as const,
        trendValue: '+0.8%',
        color: kpis.fieldTeamUptime >= 95 ? 'success' : kpis.fieldTeamUptime >= 90 ? 'warning' : 'destructive' as const,
        glowClass: kpis.fieldTeamUptime >= 95 ? 'status-success' : kpis.fieldTeamUptime >= 90 ? 'status-warning' : 'status-destructive'
      });
    }

    if (kpis.budgetVsActuals !== undefined) {
      enhancedMetrics.push({
        id: 'budget-efficiency',
        label: 'Budget Efficiency',
        value: kpis.budgetVsActuals,
        unit: '%',
        icon: DollarSign,
        trend: 'up' as const,
        trendValue: '+5.2%',
        color: kpis.budgetVsActuals >= 85 ? 'success' : kpis.budgetVsActuals >= 70 ? 'warning' : 'destructive' as const,
        glowClass: kpis.budgetVsActuals >= 85 ? 'status-success' : kpis.budgetVsActuals >= 70 ? 'status-warning' : 'status-destructive'
      });
    }
  }

  const metrics = [...baseMetrics, ...enhancedMetrics.slice(0, 2)];

  return (
    <div className="kpi-cards grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const TrendIcon = metric.trend === 'up' ? TrendingUp : metric.trend === 'down' ? TrendingDown : null;

        return (
          <div
            key={metric.id}
            className="group glass-puck p-6 interactive-element floating-layer-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header with Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl ${metric.glowClass} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={24} className="text-white" />
              </div>
              
              {/* Trend Indicator */}
              {TrendIcon && (
                <div className="flex items-center space-x-1">
                  <TrendIcon 
                    size={16} 
                    className={`${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'} group-hover:scale-110 transition-transform duration-300`} 
                  />
                  <span className={`sf-caption-1 ${metric.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.trendValue}
                  </span>
                </div>
              )}
            </div>

            {/* Main Metric Display */}
            <div className="relative mb-4">
              {/* Illuminated Number */}
              <div className="flex items-baseline space-x-2 mb-2">
                <span className="sf-large-title illuminated-text group-hover:scale-105 transition-transform duration-300 spatial-text">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="sf-title-3 text-white/60">{metric.unit}</span>
                )}
              </div>
              
              {/* Metric Label */}
              <h4 className="sf-callout text-white/80 font-medium">{metric.label}</h4>
            </div>

            {/* Progress Visualization */}
            <div className="relative">
              {/* Background Ring */}
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                {/* Progress Fill with Gradient */}
                <div 
                  className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 rounded-full transition-all duration-1000 ease-out elix-glow"
                  style={{ 
                    width: `${Math.min(metric.value, 100)}%`,
                    boxShadow: '0 0 8px rgba(64, 224, 208, 0.6)'
                  }}
                />
              </div>
              
              {/* Status Pulse */}
              <div className="absolute -top-1 -right-1">
                <div className={`w-4 h-4 rounded-full ${metric.glowClass} animate-pulse-glow`} />
              </div>
            </div>

            {/* Micro Interaction Elements */}
            <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Zap size={12} className="text-teal-400" />
                  <span className="sf-caption-2 text-white/50">Live Data</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${metric.glowClass} animate-pulse`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}