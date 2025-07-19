import React, { useState, useEffect } from 'react';
import { enterpriseAssetService } from '../services/enterpriseAssetService';
import { EnterpriseKPIs, AssetHierarchy, EnhancedPredictiveAlert } from '../types/assetTypes';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Zap, 
  Users, 
  Brain, 
  Target, 
  Cpu,
  Shield,
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Calendar,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, PieChart as RechartsPieChart, Cell, BarChart, Bar, AreaChart, Area } from 'recharts';

interface EnterpriseDashboardProps {
  onAssetSelect: (asset: any) => void;
  userRole: 'operations_director' | 'site_manager' | 'technician' | 'admin';
}

export function EnterpriseDashboard({ onAssetSelect, userRole }: EnterpriseDashboardProps) {
  const [dashboardData, setDashboardData] = useState<{
    kpis: EnterpriseKPIs | null;
    assetHierarchy: AssetHierarchy | null;
    criticalAlerts: EnhancedPredictiveAlert[];
    performanceTrends: any[];
    maintenanceSchedule: any[];
    realTimeUpdates: any[];
  }>({
    kpis: null,
    assetHierarchy: null,
    criticalAlerts: [],
    performanceTrends: [],
    maintenanceSchedule: [],
    realTimeUpdates: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadRealTimeUpdates, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [kpisResult, hierarchyResult, alertsResult, trendsResult] = await Promise.all([
        enterpriseAssetService.getEnterpriseKPIs(),
        enterpriseAssetService.getAssetHierarchy(),
        enterpriseAssetService.getEnhancedPredictiveAlerts({
          severity: ['critical', 'high'],
          status: ['active']
        }),
        enterpriseAssetService.getFleetPerformanceTrends({
          start: getDateRange(selectedTimeRange).start,
          end: getDateRange(selectedTimeRange).end
        })
      ]);

      setDashboardData(prev => ({
        ...prev,
        kpis: kpisResult.kpis || generateMockKPIs(),
        assetHierarchy: hierarchyResult.hierarchy || generateMockHierarchy(),
        criticalAlerts: alertsResult.alerts || generateMockAlerts(),
        performanceTrends: trendsResult.trends || generateMockTrends()
      }));

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Use mock data as fallback
      setDashboardData(prev => ({
        ...prev,
        kpis: generateMockKPIs(),
        assetHierarchy: generateMockHierarchy(),
        criticalAlerts: generateMockAlerts(),
        performanceTrends: generateMockTrends()
      }));
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeUpdates = async () => {
    try {
      // Simulate real-time updates
      const mockUpdates = [
        {
          type: 'asset_status',
          assetId: 'HM-001',
          assetName: 'Excavator CAT 320',
          change: 'efficiency_increase',
          value: '+3.2%',
          timestamp: new Date().toISOString()
        },
        {
          type: 'maintenance_completed',
          workOrderId: 'WO-12345',
          assetName: 'Crane Liebherr LTM',
          completion: 'ahead_of_schedule',
          timestamp: new Date().toISOString()
        }
      ];

      setDashboardData(prev => ({
        ...prev,
        realTimeUpdates: mockUpdates
      }));
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error loading real-time updates:', error);
    }
  };

  const getDateRange = (range: string) => {
    const end = new Date().toISOString().split('T')[0];
    const start = new Date(Date.now() - getDaysFromRange(range) * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    return { start, end };
  };

  const getDaysFromRange = (range: string): number => {
    switch (range) {
      case '24h': return 1;
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 7;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 glass-puck elix-glow mb-6 flex items-center justify-center mx-auto">
            <Brain size={24} className="text-teal-400 animate-pulse" />
          </div>
          <h3 className="sf-title-3 text-white mb-2">Loading Enterprise Intelligence</h3>
          <p className="sf-body text-white/60">Analyzing fleet performance and predictive insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-8 animate-illuminate">
      {/* Executive Command Center Header */}
      <div className="text-center mb-8">
        <div className="glass-puck p-8 floating-layer-2">
          <h1 className="sf-large-title illuminated-text mb-4">
            {userRole === 'operations_director' ? 'Executive Command Center' : 
             userRole === 'site_manager' ? 'Site Operations Dashboard' :
             'Field Operations Console'}
          </h1>
          <p className="sf-title-3 text-white/70 mb-6">
            Enterprise Asset Intelligence & Predictive Operations Management
          </p>
          
          {/* Live Status Bar */}
          <div className="flex items-center justify-center space-x-8 text-white/60">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full status-success animate-pulse-glow"></div>
              <span className="sf-callout">AI Engine Active</span>
            </div>
            <div className="flex items-center space-x-2">
              <Cpu size={16} className="text-blue-400" />
              <span className="sf-callout">{dashboardData.kpis?.fleetAvailability?.toFixed(1) || '94.2'}% Fleet Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target size={16} className="text-green-400" />
              <span className="sf-callout">{dashboardData.criticalAlerts.length} Critical Alerts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={16} className="text-teal-400" />
              <span className="sf-callout">Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            <span className="sf-caption-1 text-white/50">Analytics Period:</span>
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range)}
                className={`glass-pill px-4 py-2 sf-footnote transition-all ${
                  selectedTimeRange === range 
                    ? 'active elix-glow text-white' 
                    : 'text-white/70 hover:text-white/90'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Executive KPI Grid */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center status-success">
            <TrendingUp size={20} className="text-white" />
          </div>
          <h2 className="sf-title-2 text-white">Enterprise Performance Matrix</h2>
        </div>
        
        <EnterpriseKPIGrid kpis={dashboardData.kpis} />
      </section>

      {/* Critical Intelligence Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Asset Fleet Overview */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
              <BarChart3 size={20} className="text-white" />
            </div>
            <h2 className="sf-title-2 text-white">Fleet Performance Overview</h2>
          </div>
          
          <div className="glass-puck p-6 floating-layer-1">
            <FleetPerformanceChart data={dashboardData.performanceTrends} />
          </div>
        </section>

        {/* Critical Alerts & Predictions */}
        <section>
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center status-warning">
              <Zap size={20} className="text-white" />
            </div>
            <h2 className="sf-title-2 text-white">Critical Intelligence Alerts</h2>
          </div>
          
          <div className="glass-puck p-6 floating-layer-1">
            <CriticalAlertsPanel alerts={dashboardData.criticalAlerts} onAssetSelect={onAssetSelect} />
          </div>
        </section>
      </div>

      {/* Asset Hierarchy & Distribution */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <h2 className="sf-title-2 text-white">Asset Intelligence Hierarchy</h2>
        </div>
        
        <div className="glass-puck p-8 floating-layer-1">
          <AssetHierarchyView hierarchy={dashboardData.assetHierarchy} onAssetSelect={onAssetSelect} />
        </div>
      </section>

      {/* Maintenance Intelligence */}
      <section className="mb-12">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center">
            <Calendar size={20} className="text-white" />
          </div>
          <h2 className="sf-title-2 text-white">Predictive Maintenance Intelligence</h2>
        </div>
        
        <div className="glass-puck p-8 floating-layer-1">
          <MaintenanceIntelligencePanel />
        </div>
      </section>

      {/* Real-time Activity Stream */}
      <section>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center elix-glow">
            <Users size={20} className="text-white" />
          </div>
          <h2 className="sf-title-2 text-white">Live Operations Intelligence</h2>
        </div>
        
        <div className="glass-puck p-8 floating-layer-1">
          <RealTimeActivityStream updates={dashboardData.realTimeUpdates} />
        </div>
      </section>
    </div>
  );
}

// Enterprise KPI Grid Component
function EnterpriseKPIGrid({ kpis }: { kpis: EnterpriseKPIs | null }) {
  if (!kpis) return null;

  const kpiCards = [
    {
      title: 'Fleet Availability',
      value: `${kpis.fleetAvailability?.toFixed(1) || '94.2'}%`,
      change: '+2.3%',
      trend: 'up',
      icon: CheckCircle,
      color: 'success',
      target: 95,
      current: kpis.fleetAvailability || 94.2
    },
    {
      title: 'Overall Equipment Effectiveness',
      value: `${kpis.overallEquipmentEffectiveness?.toFixed(1) || '87.5'}%`,
      change: '+5.1%',
      trend: 'up',
      icon: Target,
      color: 'success',
      target: 90,
      current: kpis.overallEquipmentEffectiveness || 87.5
    },
    {
      title: 'Predictive Accuracy',
      value: `${kpis.predictiveMaintenanceAccuracy?.toFixed(1) || '91.2'}%`,
      change: '+1.8%',
      trend: 'up',
      icon: Brain,
      color: 'primary',
      target: 95,
      current: kpis.predictiveMaintenanceAccuracy || 91.2
    },
    {
      title: 'Cost Avoidance',
      value: `$${((kpis.costSavingsFromPredictive || 2300000) / 1000000).toFixed(1)}M`,
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'success',
      subtitle: 'This Quarter'
    },
    {
      title: 'Maintenance Backlog',
      value: `${(kpis.maintenanceBacklog || 1240).toLocaleString()} hrs`,
      change: '-8.2%',
      trend: 'down',
      icon: Clock,
      color: 'warning',
      target: 1000,
      current: kpis.maintenanceBacklog || 1240
    },
    {
      title: 'Safety Incident Rate',
      value: `${kpis.safetyIncidentRate?.toFixed(2) || '0.12'}`,
      change: '-15.3%',
      trend: 'down',
      icon: Shield,
      color: 'success',
      subtitle: 'per 1k hours'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {kpiCards.map((kpi, index) => (
        <div key={index} className="glass-puck p-6 interactive-element hover:elix-glow">
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${
              kpi.color === 'success' ? 'from-green-400 to-emerald-400' :
              kpi.color === 'warning' ? 'from-orange-400 to-amber-400' :
              kpi.color === 'primary' ? 'from-blue-400 to-cyan-400' :
              'from-teal-400 to-cyan-400'
            } flex items-center justify-center ${
              kpi.color === 'success' ? 'status-success' :
              kpi.color === 'warning' ? 'status-warning' :
              kpi.color === 'primary' ? 'status-primary' :
              'elix-glow'
            }`}>
              <kpi.icon size={24} className="text-white" />
            </div>
            
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
              kpi.trend === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {kpi.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span className="sf-caption-2 font-medium">{kpi.change}</span>
            </div>
          </div>
          
          <h3 className="sf-callout text-white/70 mb-2">{kpi.title}</h3>
          <div className="flex items-baseline space-x-2 mb-3">
            <span className="sf-title-1 text-white font-bold">{kpi.value}</span>
            {kpi.subtitle && (
              <span className="sf-caption-1 text-white/50">{kpi.subtitle}</span>
            )}
          </div>
          
          {kpi.target && kpi.current && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="sf-caption-1 text-white/50">Progress to Target</span>
                <span className="sf-caption-1 text-white/70">{kpi.target}%</span>
              </div>
              <Progress 
                value={(kpi.current / kpi.target) * 100} 
                className="h-2 bg-white/10"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Fleet Performance Chart Component
function FleetPerformanceChart({ data }: { data: any[] }) {
  const chartData = data.length > 0 ? data : generateMockTrends();

  return (
    <div className="h-80">
      <div className="flex items-center justify-between mb-6">
        <h3 className="sf-callout text-white font-medium">Fleet Efficiency Trends</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-teal-400"></div>
            <span className="sf-caption-1 text-white/70">Availability</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="sf-caption-1 text-white/70">Utilization</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="sf-caption-1 text-white/70">Efficiency</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.6)' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
            domain={[0, 100]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)'
            }}
          />
          <Area
            type="monotone"
            dataKey="availability"
            stackId="1"
            stroke="#2DD4BF"
            fill="rgba(45, 212, 191, 0.4)"
          />
          <Area
            type="monotone"
            dataKey="utilization"
            stackId="2"
            stroke="#3B82F6"
            fill="rgba(59, 130, 246, 0.4)"
          />
          <Area
            type="monotone"
            dataKey="efficiency"
            stackId="3"
            stroke="#10B981"
            fill="rgba(16, 185, 129, 0.4)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// Critical Alerts Panel Component
function CriticalAlertsPanel({ alerts, onAssetSelect }: { alerts: EnhancedPredictiveAlert[]; onAssetSelect: (asset: any) => void }) {
  const displayAlerts = alerts.length > 0 ? alerts : generateMockAlerts();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="sf-callout text-white font-medium">Critical Predictive Alerts</h3>
        <Badge variant="destructive" className="bg-red-500/20 text-red-400">
          {displayAlerts.filter(a => a.severity === 'critical').length} Critical
        </Badge>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto spatial-scroll">
        {displayAlerts.slice(0, 6).map((alert, index) => (
          <div key={alert.id || index} className="glass-pill p-4 interactive-element hover:elix-glow">
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                alert.severity === 'critical' ? 'bg-red-500 status-destructive' :
                alert.severity === 'high' ? 'bg-orange-500 status-warning' :
                'bg-yellow-500 status-warning'
              }`}>
                {alert.severity === 'critical' ? <XCircle size={20} className="text-white" /> :
                 <AlertTriangle size={20} className="text-white" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="sf-callout text-white font-medium truncate">{alert.title}</h4>
                  <span className="sf-caption-1 text-white/50">{alert.timeToAction}h</span>
                </div>
                
                <p className="sf-footnote text-white/70 mb-3">{alert.assetName}</p>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="sf-caption-1 text-white/50">Risk:</span>
                    <span className={`sf-caption-1 font-medium ${
                      alert.riskScore > 80 ? 'text-red-400' :
                      alert.riskScore > 60 ? 'text-orange-400' :
                      'text-yellow-400'
                    }`}>
                      {alert.riskScore}%
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="sf-caption-1 text-white/50">Confidence:</span>
                    <span className="sf-caption-1 text-green-400 font-medium">{alert.confidenceLevel}%</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onAssetSelect({ id: alert.assetId, name: alert.assetName })}
                    className="ml-auto glass-pill border-white/20 text-white/80 hover:text-white"
                  >
                    Investigate
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Asset Hierarchy View Component
function AssetHierarchyView({ hierarchy, onAssetSelect }: { hierarchy: AssetHierarchy | null; onAssetSelect: (asset: any) => void }) {
  const mockHierarchy = hierarchy || generateMockHierarchy();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="sf-callout text-white font-medium">Fleet Asset Distribution</h3>
        <div className="flex items-center space-x-2">
          <span className="sf-caption-1 text-white/50">Total Assets:</span>
          <span className="sf-callout text-white font-medium">{mockHierarchy.assetCount}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hierarchy Tree */}
        <div className="space-y-4">
          <h4 className="sf-footnote text-white/70 font-medium mb-4">Asset Categories</h4>
          <HierarchyTree node={mockHierarchy} onAssetSelect={onAssetSelect} />
        </div>
        
        {/* Performance Distribution */}
        <div>
          <h4 className="sf-footnote text-white/70 font-medium mb-4">Health Distribution</h4>
          <AssetHealthDistribution />
        </div>
      </div>
    </div>
  );
}

function HierarchyTree({ node, onAssetSelect, level = 0 }: { node: AssetHierarchy; onAssetSelect: (asset: any) => void; level?: number }) {
  return (
    <div className={`${level > 0 ? 'ml-6 border-l border-white/10 pl-4' : ''}`}>
      <div className="glass-pill p-3 mb-3 interactive-element hover:bg-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${
              level === 0 ? 'from-teal-400 to-cyan-400' :
              level === 1 ? 'from-blue-400 to-indigo-400' :
              'from-purple-400 to-pink-400'
            } flex items-center justify-center`}>
              <span className="sf-caption-1 text-white font-bold">{node.assetCount}</span>
            </div>
            <div>
              <h5 className="sf-footnote text-white font-medium">{node.name}</h5>
              <p className="sf-caption-1 text-white/50">Level {node.level}</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="sf-caption-1 text-white/70">Health: {node.averageHealth?.toFixed(1) || '92.5'}%</p>
            {node.criticalAlertsCount > 0 && (
              <p className="sf-caption-1 text-red-400">{node.criticalAlertsCount} alerts</p>
            )}
          </div>
        </div>
      </div>
      
      {node.children && node.children.map((child, index) => (
        <HierarchyTree 
          key={index} 
          node={child} 
          onAssetSelect={onAssetSelect} 
          level={level + 1} 
        />
      ))}
    </div>
  );
}

function AssetHealthDistribution() {
  const data = [
    { name: 'Excellent', value: 45, color: '#10B981' },
    { name: 'Good', value: 32, color: '#3B82F6' },
    { name: 'Fair', value: 18, color: '#F59E0B' },
    { name: 'Poor', value: 5, color: '#EF4444' }
  ];

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart>
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '12px',
              backdropFilter: 'blur(8px)'
            }}
          />
          <pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </pie>
        </RechartsPieChart>
      </ResponsiveContainer>
      
      <div className="flex items-center justify-center space-x-4 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className="sf-caption-1 text-white/70">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MaintenanceIntelligencePanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Upcoming Maintenance */}
      <div>
        <h4 className="sf-footnote text-white/70 font-medium mb-4">Critical Maintenance Schedule</h4>
        <div className="space-y-3">
          {[
            { asset: 'Crane CRN-003', type: 'Hydraulic System', due: '2 days', priority: 'high' },
            { asset: 'Generator GEN-001', type: 'Engine Service', due: '5 days', priority: 'medium' },
            { asset: 'Excavator EXC-007', type: 'Inspection', due: '1 week', priority: 'low' }
          ].map((item, index) => (
            <div key={index} className="glass-pill p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="sf-footnote text-white font-medium">{item.asset}</h5>
                <Badge 
                  variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'secondary'}
                  className={
                    item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }
                >
                  {item.priority}
                </Badge>
              </div>
              <p className="sf-caption-1 text-white/70">{item.type}</p>
              <p className="sf-caption-1 text-white/50">Due in {item.due}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Maintenance Metrics */}
      <div>
        <h4 className="sf-footnote text-white/70 font-medium mb-4">Maintenance Effectiveness</h4>
        <div className="space-y-4">
          <div className="glass-pill p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="sf-footnote text-white/70">Planned vs Reactive</span>
              <span className="sf-footnote text-green-400 font-medium">85% Planned</span>
            </div>
            <Progress value={85} className="h-2 bg-white/10" />
          </div>
          
          <div className="glass-pill p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="sf-footnote text-white/70">First Time Fix Rate</span>
              <span className="sf-footnote text-blue-400 font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2 bg-white/10" />
          </div>
          
          <div className="glass-pill p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="sf-footnote text-white/70">Technician Productivity</span>
              <span className="sf-footnote text-teal-400 font-medium">7.2 hrs/day</span>
            </div>
            <Progress value={90} className="h-2 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RealTimeActivityStream({ updates }: { updates: any[] }) {
  const mockUpdates = updates.length > 0 ? updates : [
    {
      type: 'asset_status',
      assetName: 'Excavator CAT 320',
      change: 'efficiency_increase',
      value: '+3.2%',
      timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
    },
    {
      type: 'maintenance_completed',
      assetName: 'Crane Liebherr LTM',
      completion: 'ahead_of_schedule',
      timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
    },
    {
      type: 'alert_generated',
      assetName: 'Generator GEN-001',
      alert: 'temperature_anomaly',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="sf-callout text-white font-medium mb-6">Real-time Operations Stream</h3>
      
      <div className="space-y-3 max-h-64 overflow-y-auto spatial-scroll">
        {mockUpdates.map((update, index) => (
          <div key={index} className="glass-pill p-4 interactive-element">
            <div className="flex items-center space-x-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                update.type === 'asset_status' ? 'bg-green-500 status-success' :
                update.type === 'maintenance_completed' ? 'bg-blue-500 status-primary' :
                'bg-orange-500 status-warning'
              }`}>
                {update.type === 'asset_status' ? <TrendingUp size={16} className="text-white" /> :
                 update.type === 'maintenance_completed' ? <CheckCircle size={16} className="text-white" /> :
                 <AlertTriangle size={16} className="text-white" />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="sf-footnote text-white font-medium">{update.assetName}</h5>
                  <span className="sf-caption-1 text-white/50">
                    {new Date(update.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="sf-caption-1 text-white/70">
                  {update.type === 'asset_status' ? `Efficiency ${update.value}` :
                   update.type === 'maintenance_completed' ? 'Maintenance completed ahead of schedule' :
                   'Temperature anomaly detected'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Mock data generators
function generateMockKPIs(): EnterpriseKPIs {
  return {
    fleetAvailability: 94.2,
    fleetUtilization: 87.5,
    overallEquipmentEffectiveness: 82.1,
    plannedMaintenancePercentage: 85.3,
    maintenanceBacklog: 1240,
    emergencyWorkPercentage: 8.7,
    maintenanceCostPerRevenue: 12.4,
    totalAssetValue: 125000000,
    depreciationRate: 8.5,
    maintenanceCostTrend: -5.2,
    costAvoidance: 2300000,
    complianceScore: 96.8,
    safetyIncidentRate: 0.12,
    environmentalComplianceScore: 98.1,
    predictiveMaintenanceAccuracy: 91.2,
    falsePositiveRate: 4.8,
    costSavingsFromPredictive: 1850000,
    earlyDetectionRate: 88.5,
    firstTimeFixRate: 92.1,
    wrenchTime: 68.5,
    technicianProductivity: 7.2,
    assetReliability: 94.7
  };
}

function generateMockHierarchy(): AssetHierarchy {
  return {
    id: 'root',
    name: 'MENA Fleet Operations',
    level: 0,
    assetCount: 127,
    totalValue: 125000000,
    averageHealth: 92.5,
    criticalAlertsCount: 3,
    children: [
      {
        id: 'heavy-machinery',
        name: 'Heavy Machinery',
        level: 1,
        assetCount: 45,
        totalValue: 85000000,
        averageHealth: 89.2,
        criticalAlertsCount: 2,
        children: []
      },
      {
        id: 'hvac-systems',
        name: 'HVAC Systems',
        level: 1,
        assetCount: 38,
        totalValue: 22000000,
        averageHealth: 94.1,
        criticalAlertsCount: 1,
        children: []
      },
      {
        id: 'generators',
        name: 'Power Generation',
        level: 1,
        assetCount: 28,
        totalValue: 12000000,
        averageHealth: 96.8,
        criticalAlertsCount: 0,
        children: []
      },
      {
        id: 'vehicles',
        name: 'Fleet Vehicles',
        level: 1,
        assetCount: 16,
        totalValue: 6000000,
        averageHealth: 91.3,
        criticalAlertsCount: 0,
        children: []
      }
    ]
  };
}

function generateMockAlerts(): EnhancedPredictiveAlert[] {
  return [
    {
      id: 'PA-001',
      assetId: 'HM-002',
      assetName: 'Crane Liebherr LTM',
      assetLocation: 'Abu Dhabi Complex',
      title: 'Critical Hydraulic System Failure Prediction',
      description: 'AI models predict hydraulic pump failure within 48 hours based on pressure anomalies',
      category: 'Heavy Machinery',
      alertType: 'failure_prediction',
      riskScore: 91,
      probability: 87,
      impact: 'critical',
      severity: 'critical',
      predictedFailureDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      confidenceLevel: 94,
      timeToAction: 48,
      modelUsed: 'Hydraulic System ML Model v2.1',
      modelVersion: '2.1',
      dataSourcesUsed: ['pressure_sensors', 'temperature_sensors', 'vibration_sensors'],
      triggeredBy: {
        sensors: ['PS-001', 'TS-002', 'VS-003'],
        thresholds: { pressure: 185, temperature: 78, vibration: 4.2 },
        patterns: ['pressure_fluctuation', 'temperature_spike']
      },
      estimatedDowntime: 24,
      estimatedCostImpact: 125000,
      affectedOperations: ['Tower Construction', 'Material Handling'],
      recommendations: [
        {
          id: 'R1',
          type: 'immediate',
          action: 'Schedule immediate hydraulic system inspection',
          reasoning: 'Pressure anomalies indicate imminent pump failure',
          estimatedCost: 5000,
          estimatedTimeframe: '4 hours',
          priority: 1,
          requiredSkills: ['hydraulic_specialist'],
          requiredParts: ['hydraulic_seals', 'pressure_valve']
        }
      ],
      suggestedActions: [
        {
          id: 'A1',
          action: 'Order replacement hydraulic pump',
          urgency: 'immediate',
          estimatedEffort: 2,
          skillsRequired: ['procurement'],
          toolsRequired: ['purchase_order_system'],
          safetyConsiderations: ['lockout_tagout']
        }
      ],
      status: 'active',
      priority: 'critical',
      similarAlertsCount: 3,
      lastSimilarAlert: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      trendingDirection: 'degrading',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notificationsSent: []
    },
    {
      id: 'PA-002',
      assetId: 'HVAC-001',
      assetName: 'Chiller Unit 1',
      assetLocation: 'Riyadh Operations',
      title: 'Compressor Efficiency Degradation Alert',
      description: 'Gradual efficiency decline detected, maintenance recommended within 7 days',
      category: 'HVAC Systems',
      alertType: 'performance',
      riskScore: 73,
      probability: 82,
      impact: 'medium',
      severity: 'warning',
      confidenceLevel: 89,
      timeToAction: 168,
      modelUsed: 'HVAC Performance Model v1.8',
      modelVersion: '1.8',
      dataSourcesUsed: ['energy_consumption', 'temperature_sensors', 'flow_meters'],
      triggeredBy: {
        sensors: ['EC-001', 'TS-004', 'FM-002'],
        thresholds: { efficiency: 85, energy_consumption: 1200 },
        patterns: ['efficiency_decline', 'energy_increase']
      },
      estimatedDowntime: 8,
      estimatedCostImpact: 45000,
      affectedOperations: ['Climate Control', 'Energy Management'],
      recommendations: [],
      suggestedActions: [],
      status: 'active',
      priority: 'medium',
      similarAlertsCount: 1,
      trendingDirection: 'degrading',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      notificationsSent: []
    }
  ];
}

function generateMockTrends(): any[] {
  const days = 30;
  const trends = [];
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    trends.push({
      date: date.toISOString().split('T')[0],
      availability: Math.round(92 + Math.random() * 6),
      utilization: Math.round(85 + Math.random() * 10),
      efficiency: Math.round(88 + Math.random() * 8)
    });
  }
  return trends;
}