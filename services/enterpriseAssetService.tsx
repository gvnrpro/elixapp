import { projectId, publicAnonKey } from '../utils/supabase/info';
import { 
  EnterpriseAsset, 
  MaintenancePlan, 
  EnhancedWorkOrder, 
  EnhancedPredictiveAlert,
  AssetPerformanceMetrics,
  AssetHierarchy,
  MaintenanceSchedule,
  EnterpriseKPIs,
  AssetStatus,
  WorkOrderStatus,
  MaintenanceType
} from '../types/assetTypes';

class EnterpriseAssetService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-7a1baec9`;

  private async getAuthHeaders(accessToken?: string): Promise<Record<string, string>> {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken || publicAnonKey}`
    };
  }

  // Asset Management
  async getAssetHierarchy(rootAssetId?: string, accessToken?: string): Promise<{ hierarchy?: AssetHierarchy; error?: string }> {
    try {
      const url = rootAssetId 
        ? `${this.baseUrl}/assets/hierarchy/${rootAssetId}`
        : `${this.baseUrl}/assets/hierarchy`;
        
      const response = await fetch(url, {
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch asset hierarchy' };
      }

      return { hierarchy: data.hierarchy };
    } catch (error) {
      console.error('Asset hierarchy fetch error:', error);
      return { error: `Network error fetching asset hierarchy: ${error.message}` };
    }
  }

  async getEnterpriseAssets(filters?: {
    status?: AssetStatus[];
    category?: string[];
    location?: string[];
    criticality?: string[];
    search?: string;
    page?: number;
    limit?: number;
  }, accessToken?: string): Promise<{ assets?: EnterpriseAsset[]; total?: number; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(','));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/enterprise/assets?${queryParams}`, {
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch enterprise assets' };
      }

      return { assets: data.assets, total: data.total };
    } catch (error) {
      console.error('Enterprise assets fetch error:', error);
      return { error: `Network error fetching enterprise assets: ${error.message}` };
    }
  }

  async createEnterpriseAsset(assetData: Partial<EnterpriseAsset>, accessToken?: string): Promise<{ asset?: EnterpriseAsset; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enterprise/assets`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify(assetData)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to create asset' };
      }

      return { asset: data.asset };
    } catch (error) {
      console.error('Asset creation error:', error);
      return { error: `Network error creating asset: ${error.message}` };
    }
  }

  async updateAsset(assetId: string, updates: Partial<EnterpriseAsset>, accessToken?: string): Promise<{ asset?: EnterpriseAsset; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enterprise/assets/${assetId}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify(updates)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to update asset' };
      }

      return { asset: data.asset };
    } catch (error) {
      console.error('Asset update error:', error);
      return { error: `Network error updating asset: ${error.message}` };
    }
  }

  async deleteAsset(assetId: string, accessToken?: string): Promise<{ success?: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enterprise/assets/${assetId}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to delete asset' };
      }

      return { success: true };
    } catch (error) {
      console.error('Asset deletion error:', error);
      return { error: `Network error deleting asset: ${error.message}` };
    }
  }

  // Maintenance Management
  async getMaintenancePlans(assetId?: string, accessToken?: string): Promise<{ plans?: MaintenancePlan[]; error?: string }> {
    try {
      const url = assetId 
        ? `${this.baseUrl}/maintenance/plans?assetId=${assetId}`
        : `${this.baseUrl}/maintenance/plans`;

      const response = await fetch(url, {
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch maintenance plans' };
      }

      return { plans: data.plans };
    } catch (error) {
      console.error('Maintenance plans fetch error:', error);
      return { error: `Network error fetching maintenance plans: ${error.message}` };
    }
  }

  async createMaintenancePlan(planData: Partial<MaintenancePlan>, accessToken?: string): Promise<{ plan?: MaintenancePlan; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/maintenance/plans`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify(planData)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to create maintenance plan' };
      }

      return { plan: data.plan };
    } catch (error) {
      console.error('Maintenance plan creation error:', error);
      return { error: `Network error creating maintenance plan: ${error.message}` };
    }
  }

  async getMaintenanceSchedule(
    startDate: string, 
    endDate: string, 
    accessToken?: string
  ): Promise<{ schedule?: MaintenanceSchedule[]; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/maintenance/schedule?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: await this.getAuthHeaders(accessToken)
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch maintenance schedule' };
      }

      return { schedule: data.schedule };
    } catch (error) {
      console.error('Maintenance schedule fetch error:', error);
      return { error: `Network error fetching maintenance schedule: ${error.message}` };
    }
  }

  // Enhanced Work Order Management
  async getEnhancedWorkOrders(filters?: {
    assetId?: string;
    status?: WorkOrderStatus[];
    priority?: string[];
    assignedTo?: string;
    dateRange?: { start: string; end: string };
    type?: MaintenanceType[];
    page?: number;
    limit?: number;
  }, accessToken?: string): Promise<{ workOrders?: EnhancedWorkOrder[]; total?: number; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(','));
            } else if (typeof value === 'object' && key === 'dateRange') {
              queryParams.append('startDate', value.start);
              queryParams.append('endDate', value.end);
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/work-orders/enhanced?${queryParams}`, {
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch enhanced work orders' };
      }

      return { workOrders: data.workOrders, total: data.total };
    } catch (error) {
      console.error('Enhanced work orders fetch error:', error);
      return { error: `Network error fetching enhanced work orders: ${error.message}` };
    }
  }

  async createEnhancedWorkOrder(workOrderData: Partial<EnhancedWorkOrder>, accessToken?: string): Promise<{ workOrder?: EnhancedWorkOrder; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders/enhanced`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify(workOrderData)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to create enhanced work order' };
      }

      return { workOrder: data.workOrder };
    } catch (error) {
      console.error('Enhanced work order creation error:', error);
      return { error: `Network error creating enhanced work order: ${error.message}` };
    }
  }

  async updateWorkOrderStatus(
    workOrderId: string, 
    status: WorkOrderStatus, 
    notes?: string, 
    accessToken?: string
  ): Promise<{ workOrder?: EnhancedWorkOrder; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders/enhanced/${workOrderId}/status`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify({ status, notes })
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to update work order status' };
      }

      return { workOrder: data.workOrder };
    } catch (error) {
      console.error('Work order status update error:', error);
      return { error: `Network error updating work order status: ${error.message}` };
    }
  }

  // Enhanced Predictive Analytics
  async getEnhancedPredictiveAlerts(filters?: {
    assetId?: string;
    severity?: string[];
    status?: string[];
    category?: string[];
    dateRange?: { start: string; end: string };
  }, accessToken?: string): Promise<{ alerts?: EnhancedPredictiveAlert[]; error?: string }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(','));
            } else if (typeof value === 'object' && key === 'dateRange') {
              queryParams.append('startDate', value.start);
              queryParams.append('endDate', value.end);
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/predictive/alerts/enhanced?${queryParams}`, {
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch enhanced predictive alerts' };
      }

      return { alerts: data.alerts };
    } catch (error) {
      console.error('Enhanced predictive alerts fetch error:', error);
      return { error: `Network error fetching enhanced predictive alerts: ${error.message}` };
    }
  }

  async acknowledgeAlert(alertId: string, userId: string, notes?: string, accessToken?: string): Promise<{ success?: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/predictive/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify({ userId, notes })
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to acknowledge alert' };
      }

      return { success: true };
    } catch (error) {
      console.error('Alert acknowledgment error:', error);
      return { error: `Network error acknowledging alert: ${error.message}` };
    }
  }

  // Performance Analytics
  async getAssetPerformanceMetrics(
    assetId: string, 
    dateRange: { start: string; end: string },
    accessToken?: string
  ): Promise<{ metrics?: AssetPerformanceMetrics[]; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/analytics/performance/${assetId}?startDate=${dateRange.start}&endDate=${dateRange.end}`,
        {
          headers: await this.getAuthHeaders(accessToken)
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch asset performance metrics' };
      }

      return { metrics: data.metrics };
    } catch (error) {
      console.error('Asset performance metrics fetch error:', error);
      return { error: `Network error fetching asset performance metrics: ${error.message}` };
    }
  }

  async getEnterpriseKPIs(accessToken?: string): Promise<{ kpis?: EnterpriseKPIs; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/enterprise-kpis`, {
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch enterprise KPIs' };
      }

      return { kpis: data.kpis };
    } catch (error) {
      console.error('Enterprise KPIs fetch error:', error);
      return { error: `Network error fetching enterprise KPIs: ${error.message}` };
    }
  }

  async getFleetPerformanceTrends(
    dateRange: { start: string; end: string },
    accessToken?: string
  ): Promise<{ trends?: any[]; error?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/analytics/fleet-trends?startDate=${dateRange.start}&endDate=${dateRange.end}`,
        {
          headers: await this.getAuthHeaders(accessToken)
        }
      );

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch fleet performance trends' };
      }

      return { trends: data.trends };
    } catch (error) {
      console.error('Fleet performance trends fetch error:', error);
      return { error: `Network error fetching fleet performance trends: ${error.message}` };
    }
  }

  // Reporting & Analytics
  async generateAssetReport(
    reportType: 'utilization' | 'maintenance' | 'financial' | 'compliance',
    filters: Record<string, any>,
    accessToken?: string
  ): Promise<{ report?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/reports/assets/${reportType}`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify(filters)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to generate asset report' };
      }

      return { report: data.report };
    } catch (error) {
      console.error('Asset report generation error:', error);
      return { error: `Network error generating asset report: ${error.message}` };
    }
  }

  async exportData(
    dataType: 'assets' | 'work_orders' | 'alerts' | 'performance',
    format: 'csv' | 'excel' | 'pdf',
    filters?: Record<string, any>,
    accessToken?: string
  ): Promise<{ downloadUrl?: string; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/export/${dataType}`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify({ format, filters })
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to export data' };
      }

      return { downloadUrl: data.downloadUrl };
    } catch (error) {
      console.error('Data export error:', error);
      return { error: `Network error exporting data: ${error.message}` };
    }
  }

  // Real-time Asset Monitoring
  async getAssetRealTimeData(assetId: string, accessToken?: string): Promise<{ data?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/realtime/assets/${assetId}`, {
        headers: await this.getAuthHeaders(accessToken)
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to fetch real-time asset data' };
      }

      return { data: data.realtimeData };
    } catch (error) {
      console.error('Real-time asset data fetch error:', error);
      return { error: `Network error fetching real-time asset data: ${error.message}` };
    }
  }

  // Asset Lifecycle Management
  async updateAssetLifecycleStage(
    assetId: string, 
    stage: string, 
    notes?: string, 
    accessToken?: string
  ): Promise<{ success?: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enterprise/assets/${assetId}/lifecycle`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify({ stage, notes })
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to update asset lifecycle stage' };
      }

      return { success: true };
    } catch (error) {
      console.error('Asset lifecycle update error:', error);
      return { error: `Network error updating asset lifecycle: ${error.message}` };
    }
  }

  async scheduleAssetRetirement(
    assetId: string, 
    retirementDate: string, 
    disposalMethod: string, 
    accessToken?: string
  ): Promise<{ success?: boolean; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/enterprise/assets/${assetId}/retirement`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify({ retirementDate, disposalMethod })
      });

      const data = await response.json();
      if (!response.ok) {
        return { error: data.error || 'Failed to schedule asset retirement' };
      }

      return { success: true };
    } catch (error) {
      console.error('Asset retirement scheduling error:', error);
      return { error: `Network error scheduling asset retirement: ${error.message}` };
    }
  }
}

export const enterpriseAssetService = new EnterpriseAssetService();