import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Wrench, 
  FileText, 
  TrendingUp,
  Activity,
  Clock,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Area, AreaChart } from 'recharts';

// Mock performance data for the asset
const performanceData = [
  { date: '2024-01', healthScore: 95, predictedFailure: 5 },
  { date: '2024-02', healthScore: 92, predictedFailure: 8 },
  { date: '2024-03', healthScore: 88, predictedFailure: 12 },
  { date: '2024-04', healthScore: 85, predictedFailure: 15 },
  { date: '2024-05', healthScore: 82, predictedFailure: 18 },
  { date: '2024-06', healthScore: 78, predictedFailure: 22 },
  { date: '2024-07', healthScore: 75, predictedFailure: 25 }
];

const maintenanceHistory = [
  {
    id: 'WO-001',
    date: '2024-06-15',
    type: 'Preventive Maintenance',
    technician: 'Mohammed Al-Rashid',
    status: 'Completed',
    notes: 'Oil change and filter replacement completed successfully'
  },
  {
    id: 'WO-002',
    date: '2024-05-20',
    type: 'Repair',
    technician: 'Sarah Abdullah',
    status: 'Completed',
    notes: 'Hydraulic seal replacement and system pressure test'
  },
  {
    id: 'WO-003',
    date: '2024-04-10',
    type: 'Inspection',
    technician: 'Ahmed Hassan',
    status: 'Completed',
    notes: 'Quarterly inspection - all systems operational'
  }
];

export function AssetDetail({ asset, onBack }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-100 text-emerald-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="h-full overflow-auto bg-slate-50">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl text-slate-900">{asset.name}</h1>
            <p className="text-slate-600">{asset.type} • Asset ID: {asset.id}</p>
          </div>
          <Badge className={getStatusColor(asset.status || 'healthy')}>
            {asset.status || 'Healthy'}
          </Badge>
        </div>

        {/* Asset Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Basic Information */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h3 className="text-lg text-slate-900 mb-4">Asset Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Model</span>
                <span className="text-sm text-slate-900">CAT 320GC</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Supplier</span>
                <span className="text-sm text-slate-900">Caterpillar Inc.</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Purchase Date</span>
                <span className="text-sm text-slate-900">March 15, 2022</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Serial Number</span>
                <span className="text-sm text-slate-900">CAT320-2024-001</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Warranty Status</span>
                <span className="text-sm text-emerald-600">Active (8 months left)</span>
              </div>
            </div>
          </Card>

          {/* Live Status & Location */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h3 className="text-lg text-slate-900 mb-4">Live Status & Location</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Activity className="text-emerald-500" size={20} />
                <div>
                  <p className="text-sm text-slate-900">Currently Active</p>
                  <p className="text-xs text-slate-600">Operating normally</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="text-blue-500" size={20} />
                <div>
                  <p className="text-sm text-slate-900">Dubai Industrial Zone</p>
                  <p className="text-xs text-slate-600">Section A, Bay 12</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Clock className="text-amber-500" size={20} />
                <div>
                  <p className="text-sm text-slate-900">Last Maintenance</p>
                  <p className="text-xs text-slate-600">June 15, 2024 (32 days ago)</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <TrendingUp className="text-purple-500" size={20} />
                <div>
                  <p className="text-sm text-slate-900">Health Score</p>
                  <p className="text-xs text-slate-600">75% (Declining trend)</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 bg-white border-0 shadow-sm">
            <h3 className="text-lg text-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Wrench size={16} className="mr-2" />
                Schedule Maintenance
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText size={16} className="mr-2" />
                View Documentation
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <User size={16} className="mr-2" />
                Assign Technician
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar size={16} className="mr-2" />
                View Schedule
              </Button>
            </div>
          </Card>
        </div>

        {/* AI Performance Trend */}
        <Card className="p-6 bg-white border-0 shadow-sm mb-6">
          <h3 className="text-lg text-slate-900 mb-4">AI Performance Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                          <p className="text-sm text-slate-900 mb-1">{label}</p>
                          <p className="text-xs text-emerald-600">
                            Health Score: {payload[0].value}%
                          </p>
                          <p className="text-xs text-red-600">
                            Failure Risk: {payload[1].value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="healthScore"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="predictedFailure"
                  stackId="2"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-emerald-500 rounded"></div>
              <span className="text-sm text-slate-600">Health Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span className="text-sm text-slate-600">Predicted Failure Risk</span>
            </div>
          </div>
        </Card>

        {/* Maintenance History */}
        <Card className="p-6 bg-white border-0 shadow-sm">
          <h3 className="text-lg text-slate-900 mb-4">Maintenance History</h3>
          <div className="space-y-4">
            {maintenanceHistory.map((record, index) => (
              <div key={record.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-sm text-slate-900">{record.type}</h4>
                    <p className="text-xs text-slate-600">Work Order: {record.id}</p>
                  </div>
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200">
                    {record.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-slate-600 mb-2">
                  <div className="flex items-center space-x-1">
                    <Calendar size={12} />
                    <span>{record.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User size={12} />
                    <span>{record.technician}</span>
                  </div>
                </div>
                
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded">
                  {record.notes}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}