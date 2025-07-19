import React from 'react';
import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';

const performanceData = [
  { category: 'Heavy Machinery', uptime: 94, total: 45, operational: 42 },
  { category: 'HVAC Systems', uptime: 89, total: 28, operational: 25 },
  { category: 'IT Equipment', uptime: 97, total: 32, operational: 31 },
  { category: 'Power Systems', uptime: 91, total: 18, operational: 16 },
  { category: 'Security Systems', uptime: 98, total: 15, operational: 15 },
  { category: 'Lighting Systems', uptime: 96, total: 22, operational: 21 }
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="text-sm text-slate-900 mb-1">{label}</p>
        <p className="text-xs text-slate-600">
          Uptime: <span className="font-medium text-slate-900">{data.uptime}%</span>
        </p>
        <p className="text-xs text-slate-600">
          Operational: <span className="font-medium text-slate-900">{data.operational}/{data.total}</span> assets
        </p>
      </div>
    );
  }
  return null;
};

export function AssetPerformanceChart() {
  return (
    <Card className="p-6 bg-white border-0 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg text-slate-900 mb-1">Asset Uptime by Category</h3>
          <p className="text-sm text-slate-600">Performance overview across all asset types</p>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-slate-600">Uptime %</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="category" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="uptime" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
              className="hover:opacity-80 transition-opacity"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
        <div className="text-center">
          <p className="text-2xl text-slate-900">94.2%</p>
          <p className="text-xs text-slate-600">Average Uptime</p>
        </div>
        <div className="text-center">
          <p className="text-2xl text-slate-900">160</p>
          <p className="text-xs text-slate-600">Total Assets</p>
        </div>
        <div className="text-center">
          <p className="text-2xl text-slate-900">150</p>
          <p className="text-xs text-slate-600">Operational</p>
        </div>
      </div>
    </Card>
  );
}