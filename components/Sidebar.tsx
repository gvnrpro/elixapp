import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  BarChart3, 
  Settings,
  MapPin,
  Users,
  FileText,
  Shield,
  Zap
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  user: any;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
}

const primaryNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
  { id: 'assets', label: 'Asset Intelligence', icon: Package },
  { id: 'locations', label: 'Spatial Mapping', icon: MapPin },
  { id: 'analytics', label: 'Predictive Analytics', icon: BarChart3 },
];

const secondaryNavItems: NavItem[] = [
  { id: 'team', label: 'Field Teams', icon: Users },
  { id: 'reports', label: 'Intelligence Reports', icon: FileText },
  { id: 'settings', label: 'System Config', icon: Settings },
];

export function Sidebar({ currentView, onNavigate, user }: SidebarProps) {
  const handleNavigation = (view: string) => {
    onNavigate(view);
  };

  const SpatialNavPill = ({ item, isActive }: { item: NavItem; isActive: boolean }) => {
    const Icon = item.icon;
    
    return (
      <div className="relative group">
        <button
          onClick={() => handleNavigation(item.id)}
          className={`
            w-16 h-16 glass-pill flex items-center justify-center interactive-element
            ${isActive 
              ? 'active elix-glow-strong' 
              : 'hover:bg-white/10'
            }
          `}
        >
          <Icon 
            size={24} 
            className={`
              transition-all duration-300
              ${isActive 
                ? 'text-white drop-shadow-lg' 
                : 'text-white/70 group-hover:text-white/90'
              }
            `} 
          />
          
          {item.badge && (
            <div className="absolute -top-1 -right-1 w-5 h-5 status-destructive rounded-full flex items-center justify-center">
              <span className="sf-caption-2 text-white font-semibold">{item.badge}</span>
            </div>
          )}
        </button>
        
        {/* Floating Label */}
        <div className="absolute left-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
          <div className="glass-pill px-4 py-2 whitespace-nowrap floating-layer-3">
            <span className="sf-callout text-white/90">{item.label}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      {/* User Avatar Pill */}
      <div className="relative group">
        <div className="w-16 h-16 glass-pill flex items-center justify-center elix-glow">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center">
            <span className="sf-callout font-semibold text-white">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
        
        {/* User Info Popover */}
        <div className="absolute left-20 top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
          <div className="glass-puck p-4 min-w-48 floating-layer-3">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center">
                <span className="sf-footnote font-semibold text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="sf-callout text-white font-medium">{user.name}</p>
                <p className="sf-caption-1 text-white/60">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
              <Shield size={12} className="text-teal-400" />
              <p className="sf-caption-1 text-white/70 capitalize">
                {user.role?.replace('_', ' ') || 'Operations User'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <div className="space-y-4">
        {primaryNavItems.map((item) => (
          <SpatialNavPill
            key={item.id}
            item={item}
            isActive={currentView === item.id}
          />
        ))}
      </div>
      
      {/* Divider */}
      <div className="flex justify-center">
        <div className="w-8 h-px bg-glass-border"></div>
      </div>
      
      {/* Secondary Navigation */}
      <div className="space-y-4">
        {secondaryNavItems.map((item) => (
          <SpatialNavPill
            key={item.id}
            item={item}
            isActive={currentView === item.id}
          />
        ))}
      </div>

      {/* System Status Pill */}
      <div className="relative group mt-8">
        <div className="w-16 h-16 glass-pill flex items-center justify-center animate-pulse-glow">
          <Zap size={20} className="text-teal-400" />
        </div>
        
        {/* Status Info */}
        <div className="absolute left-20 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50">
          <div className="glass-puck p-4 min-w-48 floating-layer-3">
            <h4 className="sf-callout text-white font-medium mb-2">System Status</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="sf-caption-1 text-white/70">AI Engine</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full status-success"></div>
                  <span className="sf-caption-1 text-white/90">Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="sf-caption-1 text-white/70">Field Sync</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full status-success"></div>
                  <span className="sf-caption-1 text-white/90">Online</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="sf-caption-1 text-white/70">Data Flow</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 rounded-full status-success"></div>
                  <span className="sf-caption-1 text-white/90">Real-time</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}