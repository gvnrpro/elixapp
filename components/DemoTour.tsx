import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Play, Pause, SkipForward, X, Info, Zap, TrendingUp, Shield } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: () => void;
  duration: number;
  highlight?: boolean;
}

interface DemoTourProps {
  onViewChange?: (view: string) => void;
  onAssetSelect?: (asset: any) => void;
}

export function DemoTour({ onViewChange, onAssetSelect }: DemoTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Elix Spatial Command Center',
      description: 'Experience the future of asset management with our revolutionary spatial computing interface. This demo showcases AI-powered predictive maintenance across MENA region operations.',
      position: 'center',
      duration: 5000,
      highlight: true
    },
    {
      id: 'overview',
      title: 'Executive Dashboard Overview',
      description: 'Real-time operational intelligence at your fingertips. Monitor 40+ assets across 6 facilities with 94% fleet readiness and predictive insights preventing $2.3M in potential failures.',
      position: 'center',
      duration: 6000,
      action: () => onViewChange?.('dashboard')
    },
    {
      id: 'kpis',
      title: 'Intelligent KPI Monitoring',
      description: 'AI-driven performance metrics provide instant insights into fleet health, operational efficiency, and predictive maintenance opportunities. Notice the spatial glass design that reduces cognitive load.',
      target: '.kpi-cards',
      position: 'bottom',
      duration: 5000
    },
    {
      id: 'alerts',
      title: 'Predictive Analytics Engine',
      description: 'Our machine learning algorithms analyze sensor data in real-time to predict failures before they happen. Critical alerts are prioritized with confidence levels and cost impact analysis.',
      target: '.predictive-alerts',
      position: 'left',
      duration: 6000
    },
    {
      id: 'spatial-map',
      title: 'Spatial Asset Visualization',
      description: 'Interactive 3D map showing real-time asset locations across MENA region. Each asset\'s status is visualized with our signature spatial depth and glow effects.',
      target: '.asset-map',
      position: 'top',
      duration: 5000
    },
    {
      id: 'asset-detail',
      title: 'AI-Powered Asset Intelligence',
      description: 'Deep dive into individual asset performance with predictive maintenance recommendations, sensor data analysis, and automated work order generation.',
      position: 'center',
      duration: 6000,
      action: () => {
        // Select a critical asset for demonstration
        const criticalAsset = {
          id: 'HVAC-001',
          name: 'Chiller Unit 1',
          status: 'critical',
          efficiency: 45,
          riskPercentage: 91
        };
        onAssetSelect?.(criticalAsset);
      }
    },
    {
      id: 'spatial-ui',
      title: 'Revolutionary Spatial Interface',
      description: 'Notice how every element floats in 3D space with realistic shadows and glass materials. This visionOS-inspired design reduces visual fatigue and improves decision-making speed by 40%.',
      position: 'center',
      duration: 5000,
      highlight: true
    },
    {
      id: 'roi',
      title: 'Proven Business Impact',
      description: 'Elix delivers measurable results: 25% reduction in maintenance costs, 15% improvement in asset uptime, and 60% faster emergency response times. Ready to transform your operations?',
      position: 'center',
      duration: 6000,
      highlight: true
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying && isActive) {
      const currentStepData = tourSteps[currentStep];
      const stepDuration = currentStepData.duration;
      const updateInterval = 100;
      
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (updateInterval / stepDuration) * 100;
          
          if (newProgress >= 100) {
            // Move to next step
            if (currentStep < tourSteps.length - 1) {
              setCurrentStep(prev => prev + 1);
              return 0;
            } else {
              // Tour completed
              setIsPlaying(false);
              setIsActive(false);
              return 100;
            }
          }
          
          return newProgress;
        });
      }, updateInterval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, isActive, currentStep]);

  useEffect(() => {
    // Execute step action when step changes
    const currentStepData = tourSteps[currentStep];
    if (currentStepData.action) {
      setTimeout(() => {
        currentStepData.action?.();
      }, 500);
    }
  }, [currentStep]);

  const startTour = () => {
    setIsActive(true);
    setCurrentStep(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const pauseTour = () => {
    setIsPlaying(!isPlaying);
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setProgress(0);
    }
  };

  const closeTour = () => {
    setIsActive(false);
    setIsPlaying(false);
    setCurrentStep(0);
    setProgress(0);
  };

  const currentStepData = tourSteps[currentStep];

  if (!isActive) {
    return (
      <div className="fixed bottom-8 left-8 z-50">
        <Button
          onClick={startTour}
          className="glass-pill px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 interactive-element elix-glow"
        >
          <Play size={18} className="mr-2" />
          Start Demo Tour
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Tour Overlay */}
      <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm">
        {/* Spotlight effect for highlighted elements */}
        {currentStepData.target && (
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at center, transparent 150px, rgba(0,0,0,0.7) 300px)`
            }}
          />
        )}
      </div>

      {/* Tour Content */}
      <div className={`fixed z-50 ${
        currentStepData.position === 'center' ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' :
        currentStepData.position === 'top' ? 'top-8 left-1/2 transform -translate-x-1/2' :
        currentStepData.position === 'bottom' ? 'bottom-8 left-1/2 transform -translate-x-1/2' :
        currentStepData.position === 'left' ? 'left-8 top-1/2 transform -translate-y-1/2' :
        'right-8 top-1/2 transform -translate-y-1/2'
      }`}>
        <div className={`glass-canvas p-8 max-w-md floating-layer-3 animate-illuminate ${
          currentStepData.highlight ? 'elix-glow-strong' : ''
        }`}>
          {/* Step Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 glass-pill bg-gradient-to-r from-teal-400 to-cyan-400 flex items-center justify-center">
                <span className="sf-footnote font-semibold text-white">
                  {currentStep + 1}
                </span>
              </div>
              <div>
                <h3 className="sf-title-3 text-white">{currentStepData.title}</h3>
                <p className="sf-caption-1 text-white/50">
                  Step {currentStep + 1} of {tourSteps.length}
                </p>
              </div>
            </div>
            <button
              onClick={closeTour}
              className="text-white/50 hover:text-white/80 interactive-element"
            >
              <X size={20} />
            </button>
          </div>

          {/* Step Content */}
          <div className="mb-6">
            <p className="sf-body text-white/80 leading-relaxed">
              {currentStepData.description}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full h-1 bg-glass-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Tour Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={pauseTour}
                className="glass-pill p-2 interactive-element"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button
                onClick={nextStep}
                disabled={currentStep >= tourSteps.length - 1}
                className="glass-pill p-2 interactive-element disabled:opacity-50"
              >
                <SkipForward size={16} />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Feature Highlights */}
              {currentStepData.id === 'alerts' && (
                <div className="flex items-center space-x-1">
                  <Zap size={14} className="text-yellow-400" />
                  <span className="sf-caption-1 text-yellow-400">AI Powered</span>
                </div>
              )}
              {currentStepData.id === 'spatial-ui' && (
                <div className="flex items-center space-x-1">
                  <TrendingUp size={14} className="text-green-400" />
                  <span className="sf-caption-1 text-green-400">40% Faster</span>
                </div>
              )}
              {currentStepData.id === 'roi' && (
                <div className="flex items-center space-x-1">
                  <Shield size={14} className="text-blue-400" />
                  <span className="sf-caption-1 text-blue-400">Proven ROI</span>
                </div>
              )}
              
              <span className="sf-caption-1 text-white/50">
                {Math.round((currentStep + 1) / tourSteps.length * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Progress Indicator */}
      <div className="fixed top-8 right-8 z-50">
        <div className="glass-pill px-4 py-2 flex items-center space-x-3">
          <Info size={16} className="text-teal-400" />
          <span className="sf-callout text-white">Demo Tour Active</span>
          <div className="w-16 h-1 bg-glass-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </>
  );
}