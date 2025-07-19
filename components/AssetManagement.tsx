import React, { useState, useEffect } from 'react';
import { enterpriseAssetService } from '../services/enterpriseAssetService';
import { EnterpriseAsset, MaintenancePlan, EnhancedWorkOrder, AssetStatus } from '../types/assetTypes';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Wrench,
  FileText,
  Download,
  Upload,
  Settings,
  MapPin,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Zap
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

interface AssetManagementProps {
  onAssetSelect: (asset: EnterpriseAsset) => void;
}

export function AssetManagement({ onAssetSelect }: AssetManagementProps) {
  const [assets, setAssets] = useState<EnterpriseAsset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<EnterpriseAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'all',
    category: 'all',
    location: 'all',
    criticality: 'all'
  });
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0
  });

  useEffect(() => {
    loadAssets();
  }, [pagination.page, pagination.limit, selectedFilters]);

  useEffect(() => {
    filterAssets();
  }, [assets, searchTerm, selectedFilters]);

  const loadAssets = async () => {
    try {
      setLoading(true);
      
      const filters = {
        ...(selectedFilters.status !== 'all' && { status: [selectedFilters.status as AssetStatus] }),
        ...(selectedFilters.category !== 'all' && { category: [selectedFilters.category] }),
        ...(selectedFilters.location !== 'all' && { location: [selectedFilters.location] }),
        ...(selectedFilters.criticality !== 'all' && { criticality: [selectedFilters.criticality] }),
        page: pagination.page,
        limit: pagination.limit
      };

      const result = await enterpriseAssetService.getEnterpriseAssets(filters);
      
      if (result.assets) {
        setAssets(result.assets);
        setPagination(prev => ({ ...prev, total: result.total || 0 }));
      } else {
        // Fallback to mock data
        const mockAssets = generateMockAssets();
        setAssets(mockAssets);
        setPagination(prev => ({ ...prev, total: mockAssets.length }));
      }
    } catch (error) {
      console.error('Error loading assets:', error);
      const mockAssets = generateMockAssets();
      setAssets(mockAssets);
      setPagination(prev => ({ ...prev, total: mockAssets.length }));
    } finally {
      setLoading(false);
    }
  };

  const filterAssets = () => {
    let filtered = assets;

    if (searchTerm) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.assetNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.location.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredAssets(filtered);
  };

  const getStatusColor = (status: AssetStatus) => {
    switch (status) {
      case 'operational': return 'bg-green-500/20 text-green-400';
      case 'warning': return 'bg-yellow-500/20 text-yellow-400';
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'maintenance': return 'bg-blue-500/20 text-blue-400';
      case 'offline': return 'bg-gray-500/20 text-gray-400';
      case 'retired': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'critical': return 'bg-red-500/20 text-red-400';
      case 'high': return 'bg-orange-500/20 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'low': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedAssets.length === 0) return;

    switch (action) {
      case 'export':
        // Export selected assets
        break;
      case 'maintenance':
        // Schedule maintenance for selected assets
        break;
      case 'update_status':
        // Update status for selected assets
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 glass-puck elix-glow mb-6 flex items-center justify-center mx-auto">
            <Package size={24} className="text-teal-400 animate-pulse" />
          </div>
          <h3 className="sf-title-3 text-white mb-2">Loading Asset Intelligence</h3>
          <p className="sf-body text-white/60">Analyzing enterprise asset portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 animate-illuminate">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="sf-title-1 illuminated-text mb-2">Asset Intelligence Management</h1>
          <p className="sf-body text-white/70">
            Comprehensive lifecycle management for {filteredAssets.length.toLocaleString()} enterprise assets
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="glass-pill bg-gradient-to-r from-teal-400/20 to-cyan-400/20 border-teal-400/30"
          >
            <Plus size={16} className="mr-2" />
            Add Asset
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="glass-pill border-white/20">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="glass-puck border-white/20">
              <DropdownMenuItem onClick={() => handleBulkAction('export')}>
                <Download size={16} className="mr-2" />
                Export Assets
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload size={16} className="mr-2" />
                Import Assets
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings size={16} className="mr-2" />
                Asset Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-puck p-6 floating-layer-1">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            <Input
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-pill border-white/20 bg-white/5"
            />
          </div>

          {/* Status Filter */}
          <Select value={selectedFilters.status} onValueChange={(value) => 
            setSelectedFilters(prev => ({ ...prev, status: value }))
          }>
            <SelectTrigger className="glass-pill border-white/20 bg-white/5">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent className="glass-puck border-white/20">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="operational">Operational</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={selectedFilters.category} onValueChange={(value) => 
            setSelectedFilters(prev => ({ ...prev, category: value }))
          }>
            <SelectTrigger className="glass-pill border-white/20 bg-white/5">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent className="glass-puck border-white/20">
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Heavy Machinery">Heavy Machinery</SelectItem>
              <SelectItem value="HVAC Systems">HVAC Systems</SelectItem>
              <SelectItem value="Power Generation">Power Generation</SelectItem>
              <SelectItem value="Fleet Vehicles">Fleet Vehicles</SelectItem>
            </SelectContent>
          </Select>

          {/* Location Filter */}
          <Select value={selectedFilters.location} onValueChange={(value) => 
            setSelectedFilters(prev => ({ ...prev, location: value }))
          }>
            <SelectTrigger className="glass-pill border-white/20 bg-white/5">
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent className="glass-puck border-white/20">
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="Dubai Industrial Zone">Dubai</SelectItem>
              <SelectItem value="Abu Dhabi Complex">Abu Dhabi</SelectItem>
              <SelectItem value="Riyadh Operations">Riyadh</SelectItem>
              <SelectItem value="Doha Facility">Doha</SelectItem>
            </SelectContent>
          </Select>

          {/* Criticality Filter */}
          <Select value={selectedFilters.criticality} onValueChange={(value) => 
            setSelectedFilters(prev => ({ ...prev, criticality: value }))
          }>
            <SelectTrigger className="glass-pill border-white/20 bg-white/5">
              <SelectValue placeholder="All Criticality" />
            </SelectTrigger>
            <SelectContent className="glass-puck border-white/20">
              <SelectItem value="all">All Criticality</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedAssets.length > 0 && (
          <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-white/10">
            <span className="sf-footnote text-white/70">
              {selectedAssets.length} asset{selectedAssets.length > 1 ? 's' : ''} selected
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('maintenance')}
              className="glass-pill border-white/20"
            >
              <Wrench size={14} className="mr-2" />
              Schedule Maintenance
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction('export')}
              className="glass-pill border-white/20"
            >
              <Download size={14} className="mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Asset Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AssetSummaryCard
          title="Total Assets"
          value={filteredAssets.length.toLocaleString()}
          icon={Package}
          color="teal"
          trend="+5.2%"
        />
        <AssetSummaryCard
          title="Operational"
          value={filteredAssets.filter(a => a.status === 'operational').length.toLocaleString()}
          icon={CheckCircle}
          color="green"
          trend="+2.1%"
        />
        <AssetSummaryCard
          title="Critical Alerts"
          value={filteredAssets.filter(a => a.status === 'critical').length.toLocaleString()}
          icon={AlertTriangle}
          color="red"
          trend="-12.5%"
        />
        <AssetSummaryCard
          title="Total Value"
          value={`$${(filteredAssets.reduce((sum, a) => sum + (a.financials?.currentValue || 0), 0) / 1000000).toFixed(1)}M`}
          icon={DollarSign}
          color="blue"
          trend="+8.3%"
        />
      </div>

      {/* Asset Table */}
      <div className="glass-puck p-6 floating-layer-1">
        <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead className="text-white/70">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAssets(filteredAssets.map(a => a.id));
                      } else {
                        setSelectedAssets([]);
                      }
                    }}
                    className="rounded"
                  />
                </TableHead>
                <TableHead className="text-white/70">Asset</TableHead>
                <TableHead className="text-white/70">Status</TableHead>
                <TableHead className="text-white/70">Location</TableHead>
                <TableHead className="text-white/70">Health</TableHead>
                <TableHead className="text-white/70">Criticality</TableHead>
                <TableHead className="text-white/70">Last Maintenance</TableHead>
                <TableHead className="text-white/70">Value</TableHead>
                <TableHead className="text-white/70">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssets.slice(
                (pagination.page - 1) * pagination.limit,
                pagination.page * pagination.limit
              ).map((asset) => (
                <TableRow key={asset.id} className="border-white/10 hover:bg-white/5">
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssets(prev => [...prev, asset.id]);
                        } else {
                          setSelectedAssets(prev => prev.filter(id => id !== asset.id));
                        }
                      }}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-400 flex items-center justify-center">
                        <Package size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="sf-footnote text-white font-medium">{asset.name}</p>
                        <p className="sf-caption-1 text-white/60">{asset.assetNumber}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(asset.status)}>
                      {asset.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin size={14} className="text-white/50" />
                      <span className="sf-footnote text-white/80">{asset.location.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1">
                        <Progress 
                          value={asset.operationalStatus?.efficiency || 85} 
                          className="h-2 bg-white/10"
                        />
                      </div>
                      <span className="sf-caption-1 text-white/70 min-w-10">
                        {asset.operationalStatus?.efficiency || 85}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCriticalityColor(asset.criticality)}>
                      {asset.criticality}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} className="text-white/50" />
                      <span className="sf-footnote text-white/80">
                        {asset.maintenanceInfo?.lastMaintenance 
                          ? new Date(asset.maintenanceInfo.lastMaintenance).toLocaleDateString()
                          : 'No data'
                        }
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="sf-footnote text-white/80">
                      ${((asset.financials?.currentValue || 0) / 1000).toFixed(0)}K
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onAssetSelect(asset)}
                        className="text-white/70 hover:text-white"
                      >
                        <Eye size={14} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:text-white"
                      >
                        <Edit size={14} />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white/70 hover:text-white"
                          >
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="glass-puck border-white/20">
                          <DropdownMenuItem>
                            <Wrench size={14} className="mr-2" />
                            Schedule Maintenance
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText size={14} className="mr-2" />
                            View Reports
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User size={14} className="mr-2" />
                            Assign Technician
                          </DropdownMenuItem>
                          <Separator />
                          <DropdownMenuItem className="text-red-400">
                            <Trash2 size={14} className="mr-2" />
                            Delete Asset
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
          <div className="text-white/60 sf-footnote">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, filteredAssets.length)} of{' '}
            {filteredAssets.length} assets
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="glass-pill border-white/20"
            >
              Previous
            </Button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, Math.ceil(filteredAssets.length / pagination.limit)) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    size="sm"
                    variant={pagination.page === page ? "default" : "outline"}
                    onClick={() => setPagination(prev => ({ ...prev, page }))}
                    className={`w-8 h-8 p-0 ${
                      pagination.page === page 
                        ? 'bg-teal-400 text-white' 
                        : 'glass-pill border-white/20'
                    }`}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPagination(prev => ({ 
                ...prev, 
                page: Math.min(Math.ceil(filteredAssets.length / prev.limit), prev.page + 1) 
              }))}
              disabled={pagination.page >= Math.ceil(filteredAssets.length / pagination.limit)}
              className="glass-pill border-white/20"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Create Asset Dialog */}
      <CreateAssetDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
        onAssetCreated={(asset) => {
          setAssets(prev => [asset, ...prev]);
          setShowCreateDialog(false);
        }}
      />
    </div>
  );
}

function AssetSummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  trend 
}: { 
  title: string; 
  value: string; 
  icon: any; 
  color: string; 
  trend: string; 
}) {
  const colorClasses = {
    teal: 'from-teal-400 to-cyan-400 elix-glow',
    green: 'from-green-400 to-emerald-400 status-success',
    red: 'from-red-400 to-red-500 status-destructive',
    blue: 'from-blue-400 to-cyan-400 status-primary'
  };

  return (
    <div className="glass-puck p-6 interactive-element hover:elix-glow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon size={24} className="text-white" />
        </div>
        
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full ${
          trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingUp size={12} className="rotate-180" />}
          <span className="sf-caption-2 font-medium">{trend}</span>
        </div>
      </div>
      
      <h3 className="sf-callout text-white/70 mb-2">{title}</h3>
      <span className="sf-title-1 text-white font-bold">{value}</span>
    </div>
  );
}

function CreateAssetDialog({ 
  open, 
  onOpenChange, 
  onAssetCreated 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onAssetCreated: (asset: EnterpriseAsset) => void; 
}) {
  const [formData, setFormData] = useState({
    name: '',
    assetNumber: '',
    category: '',
    type: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    location: '',
    criticality: 'medium',
    purchasePrice: '',
    purchaseDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new asset
    const newAsset: Partial<EnterpriseAsset> = {
      name: formData.name,
      assetNumber: formData.assetNumber,
      category: formData.category,
      type: formData.type,
      criticality: formData.criticality as any,
      status: 'operational',
      specifications: {
        manufacturer: formData.manufacturer,
        model: formData.model,
        serialNumber: formData.serialNumber
      },
      financials: {
        purchasePrice: parseFloat(formData.purchasePrice) || 0,
        currentValue: parseFloat(formData.purchasePrice) || 0,
        depreciationRate: 10,
        monthlyOperatingCost: 0
      },
      location: {
        id: 'loc-1',
        name: formData.location,
        address: '',
        coordinates: { lat: 0, lng: 0 }
      }
    };

    try {
      const result = await enterpriseAssetService.createEnterpriseAsset(newAsset);
      if (result.asset) {
        onAssetCreated(result.asset);
      }
    } catch (error) {
      console.error('Error creating asset:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-puck border-white/20 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sf-title-2 text-white">Create New Asset</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="glass-pill bg-white/5 border-white/10">
              <TabsTrigger value="basic">Basic Information</TabsTrigger>
              <TabsTrigger value="technical">Technical Details</TabsTrigger>
              <TabsTrigger value="financial">Financial Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Asset Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                    required
                  />
                </div>
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Asset Number</label>
                  <Input
                    value={formData.assetNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, assetNumber: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                    required
                  />
                </div>
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Category</label>
                  <Select value={formData.category} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }>
                    <SelectTrigger className="glass-pill border-white/20 bg-white/5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="glass-puck border-white/20">
                      <SelectItem value="Heavy Machinery">Heavy Machinery</SelectItem>
                      <SelectItem value="HVAC Systems">HVAC Systems</SelectItem>
                      <SelectItem value="Power Generation">Power Generation</SelectItem>
                      <SelectItem value="Fleet Vehicles">Fleet Vehicles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Type</label>
                  <Input
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                    required
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="technical" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Manufacturer</label>
                  <Input
                    value={formData.manufacturer}
                    onChange={(e) => setFormData(prev => ({ ...prev, manufacturer: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                  />
                </div>
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Model</label>
                  <Input
                    value={formData.model}
                    onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                  />
                </div>
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Serial Number</label>
                  <Input
                    value={formData.serialNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                  />
                </div>
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Criticality</label>
                  <Select value={formData.criticality} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, criticality: value }))
                  }>
                    <SelectTrigger className="glass-pill border-white/20 bg-white/5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-puck border-white/20">
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Purchase Price</label>
                  <Input
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchasePrice: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                  />
                </div>
                <div>
                  <label className="sf-footnote text-white/70 mb-2 block">Purchase Date</label>
                  <Input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                  />
                </div>
                <div className="col-span-2">
                  <label className="sf-footnote text-white/70 mb-2 block">Location</label>
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="glass-pill border-white/20 bg-white/5"
                    required
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-white/10">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="glass-pill border-white/20"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="glass-pill bg-gradient-to-r from-teal-400/20 to-cyan-400/20 border-teal-400/30"
            >
              Create Asset
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Mock data generator
function generateMockAssets(): EnterpriseAsset[] {
  const categories = ['Heavy Machinery', 'HVAC Systems', 'Power Generation', 'Fleet Vehicles'];
  const locations = [
    { id: 'dubai', name: 'Dubai Industrial Zone', address: 'Dubai, UAE', coordinates: { lat: 25.1972, lng: 55.2744 } },
    { id: 'abu-dhabi', name: 'Abu Dhabi Complex', address: 'Abu Dhabi, UAE', coordinates: { lat: 24.4539, lng: 54.3773 } },
    { id: 'riyadh', name: 'Riyadh Operations', address: 'Riyadh, Saudi Arabia', coordinates: { lat: 24.7136, lng: 46.6753 } },
    { id: 'doha', name: 'Doha Facility', address: 'Doha, Qatar', coordinates: { lat: 25.2854, lng: 51.5310 } }
  ];
  const statuses: AssetStatus[] = ['operational', 'warning', 'critical', 'maintenance', 'offline'];
  const criticalities = ['low', 'medium', 'high', 'critical'];

  return Array.from({ length: 50 }, (_, i) => {
    const category = categories[i % categories.length];
    const location = locations[i % locations.length];
    const status = statuses[i % statuses.length];
    const criticality = criticalities[i % criticalities.length];

    return {
      id: `asset-${i + 1}`,
      assetNumber: `${category.substring(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
      name: `${category} Asset ${i + 1}`,
      description: `Enterprise ${category} for operations`,
      parentAssetId: undefined,
      childAssetIds: [],
      assetPath: `Fleet/${category}`,
      level: 1,
      category,
      type: category,
      subtype: undefined,
      criticality: criticality as any,
      status,
      locationId: location.id,
      location,
      assignedTo: undefined,
      department: 'Operations',
      costCenter: 'OPS-001',
      specifications: {
        manufacturer: 'Enterprise Manufacturer',
        model: `Model ${i + 1}`,
        serialNumber: `SN-${Date.now()}-${i}`,
        year: 2020 + (i % 4)
      },
      financials: {
        purchasePrice: 100000 + (i * 5000),
        currentValue: 80000 + (i * 4000),
        depreciationRate: 10,
        monthlyOperatingCost: 2000 + (i * 100)
      },
      sensorData: {
        temperature: 25 + (Math.random() * 20),
        efficiency: 80 + (Math.random() * 20),
        lastReading: new Date().toISOString()
      },
      operationalStatus: {
        isOnline: status !== 'offline',
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        uptime: 85 + (Math.random() * 15),
        utilization: 70 + (Math.random() * 25),
        efficiency: 80 + (Math.random() * 20)
      },
      maintenanceInfo: {
        lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
        nextMaintenance: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        mtbf: 720 + (Math.random() * 480),
        mttr: 4 + (Math.random() * 8)
      },
      compliance: {
        certifications: [],
        inspectionSchedule: [],
        regulatoryStatus: 'compliant'
      },
      documentation: {
        manuals: [],
        warranties: [],
        drawings: [],
        photos: []
      },
      createdBy: 'system',
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedBy: 'system',
      updatedAt: new Date().toISOString(),
      version: 1
    };
  });
}