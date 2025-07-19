import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { LoginForm } from './components/LoginForm';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AssetDetail } from './components/AssetDetail';
import { OfflineIndicator } from './components/OfflineIndicator';
import { DemoTour } from './components/DemoTour';
import { dataService } from './services/dataService';
import { demoDataService } from './services/demoDataService';
import { Button } from './components/ui/button';
import { LogOut, RefreshCw, Zap, Play } from 'lucide-react';
import elixLogo from 'figma:asset/11e609b1874b2a016ebd9df307f96ac57185e865.png';

function SpatialCommandCenter() {
  const { user, signOut, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [dataInitialized, setDataInitialized] = useState(false);
  const [initializingData, setInitializingData] = useState(false);

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    setCurrentView('asset-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedAsset(null);
  };

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  };

  const initializeSampleData = async (enhanced = false) => {
    setInitializingData(true);
    try {
      let result;
      if (enhanced) {
        result = await demoDataService.initializeEnhancedDemoData();
      } else {
        result = await dataService.initializeSampleData();
      }
      
      if (result.error || result.success === false) {
        console.error('Failed to initialize demo data:', result.error);
      } else {
        setDataInitialized(true);
        console.log('Demo data initialized successfully');
      }
    } catch (error) {
      console.error('Error initializing demo data:', error);
    } finally {
      setInitializingData(false);
    }
  };

  useEffect(() => {
    if (user && !dataInitialized) {
      initializeSampleData(true); // Use enhanced demo data
    }
  }, [user, dataInitialized]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center overflow-hidden">
        <div className="text-center animate-illuminate">
          <div className="w-24 h-24 glass-puck mb-8 flex items-center justify-center mx-auto elix-glow-strong">
            <img 
              src={elixLogo} 
              alt="Elix" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h1 className="sf-title-2 illuminated-text mb-4">Elix Command Center</h1>
          <p className="sf-body">Initializing spatial interface...</p>
          <div className="w-32 h-1 bg-glass-secondary rounded-full mx-auto mt-6 overflow-hidden">
            <div className="w-full h-full bg-gradient-to-r from-transparent via-current to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Spatial Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,_transparent_0deg,_rgba(64,224,208,0.1)_60deg,_transparent_120deg)]"></div>
      </div>

      {/* Floating Command Bar */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-50">
        <div className="glass-pill px-6 py-3 flex items-center space-x-6 floating-layer-3">
          {/* Elix Brand */}
          <div className="flex items-center space-x-3">
            <img 
              src={elixLogo} 
              alt="Elix" 
              className="w-8 h-8 object-contain"
            />
            <h1 className="sf-headline illuminated-text">Elix</h1>
          </div>

          <div className="w-px h-6 bg-glass-border"></div>

          {/* Current View Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full status-success animate-pulse-glow"></div>
            <span className="sf-callout text-white/80">
              {currentView === 'asset-detail' ? 'Asset Intelligence' : 
               currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </span>
          </div>

          <div className="w-px h-6 bg-glass-border"></div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center elix-glow">
              <span className="sf-footnote font-semibold text-white">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <span className="sf-callout text-white/80">{user.name}</span>
          </div>

          <div className="w-px h-6 bg-glass-border"></div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            {!dataInitialized && (
              <>
                <button
                  onClick={() => initializeSampleData(true)}
                  disabled={initializingData}
                  className="glass-pill px-4 py-2 flex items-center space-x-2 interactive-element bg-gradient-to-r from-teal-400/20 to-cyan-400/20"
                >
                  <Zap size={14} className={`${initializingData ? 'animate-spin' : ''} text-teal-400`} />
                  <span className="sf-footnote text-white/80">
                    {initializingData ? 'Loading Demo...' : 'Load Demo Data'}
                  </span>
                </button>
                <button
                  onClick={() => initializeSampleData(false)}
                  disabled={initializingData}
                  className="glass-pill px-4 py-2 flex items-center space-x-2 interactive-element"
                >
                  <RefreshCw size={14} className={`${initializingData ? 'animate-spin' : ''} text-white/70`} />
                  <span className="sf-footnote text-white/80">Basic Data</span>
                </button>
              </>
            )}
            
            <button 
              onClick={handleSignOut}
              className="glass-pill px-4 py-2 flex items-center space-x-2 interactive-element hover:bg-red-500/20"
            >
              <LogOut size={14} className="text-white/70" />
              <span className="sf-footnote text-white/80">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Spatial Interface */}
      <div className="h-full flex pt-24 pb-8 px-8">
        {/* Floating Sidebar */}
        <div className="floating-layer-2">
          <Sidebar 
            currentView={currentView} 
            onNavigate={setCurrentView}
            user={user}
          />
        </div>
        
        {/* Main Glass Canvas */}
        <main className="flex-1 ml-6 relative">
          <div className="h-full glass-canvas floating-layer-1 animate-illuminate overflow-hidden">
            {/* Content Area */}
            <div className="h-full p-8 spatial-scroll overflow-auto">
              {currentView === 'dashboard' && (
                <Dashboard onAssetSelect={handleAssetSelect} />
              )}
              {currentView === 'asset-detail' && selectedAsset && (
                <AssetDetail asset={selectedAsset} onBack={handleBackToDashboard} />
              )}
              {currentView !== 'dashboard' && currentView !== 'asset-detail' && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-md glass-puck p-12">
                    <div className="w-20 h-20 glass-puck flex items-center justify-center mx-auto mb-6 elix-glow">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-lg"></div>
                    </div>
                    <h3 className="sf-title-3 text-white mb-4">
                      {currentView.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </h3>
                    <p className="sf-body text-white/60">
                      This intelligence module is currently in development. Advanced capabilities coming soon.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      
      {/* Demo Tour */}
      <DemoTour 
        onViewChange={setCurrentView}
        onAssetSelect={handleAssetSelect}
      />
      
      {/* Spatial Offline Indicator */}
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SpatialCommandCenter />
    </AuthProvider>
  );
}