import { projectId, publicAnonKey } from '../utils/supabase/info'

export interface Asset {
  id: string
  name: string
  type: string
  category: string
  status: 'healthy' | 'warning' | 'critical'
  location: {
    site: string
    coordinates: { lat: number; lng: number }
  }
  model?: string
  supplier?: string
  purchaseDate?: string
  serialNumber?: string
}

export interface PredictiveAlert {
  id: string
  assetId: string
  assetName: string
  riskPercentage: number
  timeframe: string
  recommendation: string
  category: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'active' | 'addressed'
}

export interface WorkOrder {
  id: string
  assetId: string
  type: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: string
  technician?: string
  created_at: string
  alertId?: string
}

export interface KPIData {
  fleetReadiness: number
  criticalAlerts: number
  fieldTeamUptime: number
  budgetStatus: number
}

class DataService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-7a1baec9`

  private async getAuthHeaders(accessToken?: string) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      headers['Authorization'] = `Bearer ${publicAnonKey}`
    }

    return headers
  }

  async initializeSampleData(): Promise<{ error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/init-sample-data`, {
        method: 'POST',
        headers: await this.getAuthHeaders()
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to initialize sample data' }
      }

      return {}
    } catch (error) {
      console.error('Sample data initialization error:', error)
      return { error: `Network error initializing data: ${error.message}` }
    }
  }

  async getAssets(accessToken: string): Promise<{ assets?: Asset[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/assets`, {
        headers: await this.getAuthHeaders(accessToken)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to fetch assets' }
      }

      return { assets: data.assets }
    } catch (error) {
      console.error('Assets fetch error:', error)
      return { error: `Network error fetching assets: ${error.message}` }
    }
  }

  async getAsset(assetId: string, accessToken: string): Promise<{ asset?: Asset; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/assets/${assetId}`, {
        headers: await this.getAuthHeaders(accessToken)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to fetch asset' }
      }

      return { asset: data.asset }
    } catch (error) {
      console.error('Asset fetch error:', error)
      return { error: `Network error fetching asset: ${error.message}` }
    }
  }

  async createAsset(assetData: Partial<Asset>, accessToken: string): Promise<{ asset?: Asset; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/assets`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify(assetData)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to create asset' }
      }

      return { asset: data.asset }
    } catch (error) {
      console.error('Asset creation error:', error)
      return { error: `Network error creating asset: ${error.message}` }
    }
  }

  async getPredictiveAlerts(accessToken?: string): Promise<{ alerts?: PredictiveAlert[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/alerts`, {
        headers: await this.getAuthHeaders(accessToken)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to fetch alerts' }
      }

      return { alerts: data.alerts }
    } catch (error) {
      console.error('Alerts fetch error:', error)
      return { error: `Network error fetching alerts: ${error.message}` }
    }
  }

  async createWorkOrder(workOrderData: Partial<WorkOrder>, accessToken: string): Promise<{ workOrder?: WorkOrder; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders`, {
        method: 'POST',
        headers: await this.getAuthHeaders(accessToken),
        body: JSON.stringify(workOrderData)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to create work order' }
      }

      return { workOrder: data.workOrder }
    } catch (error) {
      console.error('Work order creation error:', error)
      return { error: `Network error creating work order: ${error.message}` }
    }
  }

  async getWorkOrdersForAsset(assetId: string, accessToken: string): Promise<{ workOrders?: WorkOrder[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/work-orders/asset/${assetId}`, {
        headers: await this.getAuthHeaders(accessToken)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to fetch work orders' }
      }

      return { workOrders: data.workOrders }
    } catch (error) {
      console.error('Work orders fetch error:', error)
      return { error: `Network error fetching work orders: ${error.message}` }
    }
  }

  async getPerformanceOverview(accessToken?: string): Promise<{ kpis?: KPIData; totals?: any; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/performance/overview`, {
        headers: await this.getAuthHeaders(accessToken)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to fetch performance data' }
      }

      return { kpis: data.kpis, totals: data.totals }
    } catch (error) {
      console.error('Performance overview error:', error)
      return { error: `Network error fetching performance data: ${error.message}` }
    }
  }

  async getCategoryPerformance(accessToken: string): Promise<{ categoryPerformance?: any[]; error?: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/performance/categories`, {
        headers: await this.getAuthHeaders(accessToken)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to fetch category performance' }
      }

      return { categoryPerformance: data.categoryPerformance }
    } catch (error) {
      console.error('Category performance error:', error)
      return { error: `Network error fetching category performance: ${error.message}` }
    }
  }
}

export const dataService = new DataService()