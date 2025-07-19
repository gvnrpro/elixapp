import React, { useState } from 'react';
import { AlertTriangle, Clock, MapPin, Wrench, CheckCircle, ChevronRight, Zap, Brain } from 'lucide-react';
import { Button } from './ui/button';

interface Alert {
  id: string;
  assetName: string;
  assetType: string;
  riskLevel: 'high' | 'medium' | 'low';
  riskPercentage: number;
  description: string;
  location: string;
  recommendedAction: string;
  estimatedCost: number;
  timeToFailure: string;
}

interface PredictiveAlertsProps {
  alerts: Alert[];
}

export function PredictiveAlerts({ alerts }: PredictiveAlertsProps) {
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  // Enhanced sample data for spatial interface
  const sampleAlerts: Alert[] = [
    {
      id: '1',
      assetName: 'Generator GEN-045',
      assetType: 'Power Generation',
      riskLevel: 'high',
      riskPercentage: 87,
      description: 'AI analysis detected coolant system degradation with increasing thermal variance patterns',
      location: 'Dubai Marina Construction Site',
      recommendedAction: 'Replace coolant system and perform thermal recalibration',
      estimatedCost: 15000,
      timeToFailure: '3-5 days'
    },
    {
      id: '2',
      assetName: 'Excavator EXC-112',
      assetType: 'Heavy Machinery',
      riskLevel: 'medium',
      riskPercentage: 64,
      description: 'Machine learning algorithms identified hydraulic pressure anomalies in boom operation cycles',
      location: 'Al Ain Infrastructure Project',
      recommendedAction: 'Inspect hydraulic seals and replace deteriorated components',
      estimatedCost: 8500,
      timeToFailure: '1-2 weeks'
    },
    {
      id: '3',
      assetName: 'Crane CRN-089',
      assetType: 'Lifting Equipment',
      riskLevel: 'medium',
      riskPercentage: 58,
      description: 'Predictive analytics show accelerated wear patterns in cable tension systems',
      location: 'Abu Dhabi Tower Complex',
      recommendedAction: 'Schedule wire rope replacement and comprehensive load testing',
      estimatedCost: 12000,
      timeToFailure: '2-3 weeks'
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : sampleAlerts;

  const getRiskIndicator = (level: string, percentage: number) => {
    switch (level) {
      case 'high':
        return {
          glowClass: 'status-destructive',
          bgClass: 'bg-red-500/20',
          textClass: 'text-red-400',
          pulseClass: 'animate-pulse-glow'
        };
      case 'medium':
        return {
          glowClass: 'status-warning',
          bgClass: 'bg-orange-500/20',
          textClass: 'text-orange-400',
          pulseClass: 'animate-pulse-glow'
        };
      case 'low':
        return {
          glowClass: 'status-success',
          bgClass: 'bg-green-500/20',
          textClass: 'text-green-400',
          pulseClass: ''
        };
      default:
        return {
          glowClass: 'status-primary',
          bgClass: 'bg-blue-500/20',
          textClass: 'text-blue-400',
          pulseClass: ''
        };
    }
  };

  const handleCreateWorkOrder = (alert: Alert) => {
    console.log('Creating work order for:', alert.assetName);
  };

  if (displayAlerts.length === 0) {
    return (
      <div className="glass-puck p-12 text-center floating-layer-1">
        <div className="w-20 h-20 glass-puck elix-glow flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-teal-400" />
        </div>
        <h4 className="sf-title-3 text-white mb-4">All Systems Optimal</h4>
        <p className="sf-body text-white/60 mb-4">
          AI-powered predictive analytics show no critical threats detected.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full status-success animate-pulse"></div>
          <span className="sf-caption-1 text-green-400">Intelligence Engine Active</span>
        </div>
      </div>
    );
  }

  return (
    <div className="predictive-alerts space-y-4">
      {/* Intelligence Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center status-warning">
          <Brain size={20} className="text-white" />
        </div>
        <div>
          <h3 className="sf-headline text-white">AI Risk Assessment</h3>
          <p className="sf-caption-1 text-white/60">Powered by machine learning analytics</p>
        </div>
      </div>

      {displayAlerts.map((alert, index) => {
        const risk = getRiskIndicator(alert.riskLevel, alert.riskPercentage);
        const isExpanded = expandedAlert === alert.id;

        return (
          <div
            key={alert.id}
            className={`glass-puck floating-layer-1 interactive-element transition-all duration-500 ${
              isExpanded ? 'ring-2 ring-teal-400/30 elix-glow' : ''
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Main Alert Row */}
            <div 
              className="p-6 cursor-pointer"
              onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
            >
              <div className="flex items-center space-x-4">
                {/* Risk Visualization */}
                <div className="flex items-center space-x-4">
                  {/* Pulsing Risk Indicator */}
                  <div className={`w-4 h-4 rounded-full ${risk.glowClass} ${risk.pulseClass}`} />
                  
                  {/* Risk Percentage */}
                  <div className={`glass-pill px-4 py-2 ${risk.bgClass}`}>
                    <span className={`sf-callout font-semibold ${risk.textClass}`}>
                      {alert.riskPercentage}%
                    </span>
                  </div>
                </div>

                {/* Asset Information */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="sf-headline text-white font-semibold">{alert.assetName}</h4>
                    <ChevronRight 
                      size={18} 
                      className={`text-white/50 transition-transform duration-300 ${
                        isExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className="sf-callout text-white/70">{alert.assetType}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin size={14} className="text-white/50" />
                      <span className="sf-caption-1 text-white/60">{alert.location}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Action */}
                <div className="glass-pill px-4 py-2 interactive-element hover:elix-glow"
                     onClick={(e) => {
                       e.stopPropagation();
                       handleCreateWorkOrder(alert);
                     }}>
                  <div className="flex items-center space-x-2">
                    <Wrench size={16} className="text-teal-400" />
                    <span className="sf-callout text-white/80">Dispatch</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Intelligence Panel */}
            {isExpanded && (
              <div className="border-t border-white/10 px-6 pb-6">
                <div className="pt-6 space-y-6 animate-illuminate">
                  {/* AI Analysis */}
                  <div className="glass-pill p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center elix-glow">
                        <Brain size={16} className="text-white" />
                      </div>
                      <div>
                        <h5 className="sf-callout text-white font-medium mb-2">AI Analysis</h5>
                        <p className="sf-body text-white/70">{alert.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Intelligence Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Time to Failure */}
                    <div className="glass-pill p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock size={16} className="text-orange-400" />
                        <span className="sf-callout text-white font-medium">Critical Window</span>
                      </div>
                      <p className="sf-body text-white/70">{alert.timeToFailure}</p>
                    </div>

                    {/* Recommended Action */}
                    <div className="glass-pill p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Wrench size={16} className="text-blue-400" />
                        <span className="sf-callout text-white font-medium">Recommended Action</span>
                      </div>
                      <p className="sf-body text-white/70">{alert.recommendedAction}</p>
                    </div>

                    {/* Cost Impact */}
                    <div className="glass-pill p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Zap size={16} className="text-green-400" />
                        <span className="sf-callout text-white font-medium">Cost Impact</span>
                      </div>
                      <p className="sf-body text-white/70">${alert.estimatedCost.toLocaleString()} AED</p>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center space-x-3 pt-4">
                    <button
                      onClick={() => handleCreateWorkOrder(alert)}
                      className="glass-pill px-6 py-3 interactive-element elix-glow"
                    >
                      <div className="flex items-center space-x-2">
                        <Wrench size={16} className="text-white" />
                        <span className="sf-callout text-white font-medium">Create Work Order</span>
                      </div>
                    </button>
                    
                    <button className="glass-pill px-6 py-3 interactive-element">
                      <span className="sf-callout text-white/80">View Asset Twin</span>
                    </button>
                    
                    <button className="glass-pill px-4 py-3 interactive-element hover:bg-red-500/20">
                      <span className="sf-callout text-white/60">Dismiss</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}