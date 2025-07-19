import { projectId, publicAnonKey } from '../utils/supabase/info';

interface DemoAsset {
  id: string;
  name: string;
  type: string;
  category: string;
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  location: {
    site: string;
    coordinates: { lat: number; lng: number };
    building?: string;
    floor?: string;
  };
  model: string;
  supplier: string;
  purchaseDate: string;
  serialNumber: string;
  value: number;
  lastMaintenance?: string;
  nextMaintenance?: string;
  efficiency?: number;
  temperature?: number;
  pressure?: number;
  vibration?: number;
  powerConsumption?: number;
  operatingHours?: number;
  criticality: 'low' | 'medium' | 'high' | 'critical';
}

interface DemoAlert {
  id: string;
  assetId: string;
  assetName: string;
  riskPercentage: number;
  timeframe: string;
  recommendation: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'addressed' | 'resolved';
  predictedFailureDate?: string;
  potentialCostImpact?: number;
  confidenceLevel: number;
  aiInsight: string;
}

interface DemoWorkOrder {
  id: string;
  assetId: string;
  assetName: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assignedTo?: string;
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  estimatedCost: number;
  actualCost?: number;
  estimatedHours: number;
  actualHours?: number;
}

class DemoDataService {
  private baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-7a1baec9`;

  private generateDemoAssets(): DemoAsset[] {
    const sites = [
      { name: 'Dubai Industrial Zone', coordinates: { lat: 25.1972, lng: 55.2744 } },
      { name: 'Abu Dhabi Complex', coordinates: { lat: 24.4539, lng: 54.3773 } },
      { name: 'Riyadh Operations Center', coordinates: { lat: 24.7136, lng: 46.6753 } },
      { name: 'Doha Facility', coordinates: { lat: 25.2854, lng: 51.5310 } },
      { name: 'Kuwait Industrial Park', coordinates: { lat: 29.3759, lng: 47.9774 } },
      { name: 'Jeddah Port Complex', coordinates: { lat: 21.4858, lng: 39.1925 } }
    ];

    const assetTypes = [
      {
        type: 'Heavy Machinery',
        models: ['CAT 320GC', 'Komatsu PC200-8', 'Volvo EC140E', 'Hitachi ZX160LC'],
        suppliers: ['Caterpillar Inc.', 'Komatsu Ltd.', 'Volvo CE', 'Hitachi Construction'],
        baseValue: 250000
      },
      {
        type: 'HVAC Systems',
        models: ['Carrier AquaEdge 19DV', 'Trane CenTraVac', 'York YLAA', 'Daikin Applied'],
        suppliers: ['Carrier Corporation', 'Trane Technologies', 'Johnson Controls', 'Daikin Applied'],
        baseValue: 150000
      },
      {
        type: 'Generators',
        models: ['Caterpillar C18', 'Cummins QSK19', 'Perkins 4006', 'MTU 12V2000'],
        suppliers: ['Caterpillar Power', 'Cummins Inc.', 'Perkins Engines', 'MTU Solutions'],
        baseValue: 180000
      },
      {
        type: 'Compressors',
        models: ['Atlas Copco GA37', 'Ingersoll Rand R-Series', 'Kaeser ASD', 'Gardner Denver'],
        suppliers: ['Atlas Copco', 'Ingersoll Rand', 'Kaeser Kompressoren', 'Gardner Denver'],
        baseValue: 75000
      },
      {
        type: 'Pumping Systems',
        models: ['Grundfos CR', 'KSB Multitec', 'Sulzer APT', 'Flowserve ANSI'],
        suppliers: ['Grundfos', 'KSB Group', 'Sulzer Ltd.', 'Flowserve Corporation'],
        baseValue: 45000
      }
    ];

    const assets: DemoAsset[] = [];
    let assetCounter = 1;

    assetTypes.forEach(assetType => {
      for (let i = 0; i < 8; i++) {
        const site = sites[Math.floor(Math.random() * sites.length)];
        const model = assetType.models[Math.floor(Math.random() * assetType.models.length)];
        const supplier = assetType.suppliers[Math.floor(Math.random() * assetType.suppliers.length)];
        
        // Generate realistic status distribution
        let status: 'healthy' | 'warning' | 'critical' | 'offline';
        const statusRandom = Math.random();
        if (statusRandom < 0.7) status = 'healthy';
        else if (statusRandom < 0.9) status = 'warning';
        else if (statusRandom < 0.98) status = 'critical';
        else status = 'offline';

        // Generate realistic operational data
        const efficiency = status === 'healthy' ? 85 + Math.random() * 10 :
                          status === 'warning' ? 70 + Math.random() * 15 :
                          status === 'critical' ? 40 + Math.random() * 30 : 0;

        const asset: DemoAsset = {
          id: `${assetType.type.replace(/\s+/g, '').toUpperCase()}-${String(assetCounter).padStart(3, '0')}`,
          name: `${model} Unit ${assetCounter}`,
          type: assetType.type,
          category: assetType.type,
          status,
          location: {
            site: site.name,
            coordinates: {
              lat: site.coordinates.lat + (Math.random() - 0.5) * 0.01,
              lng: site.coordinates.lng + (Math.random() - 0.5) * 0.01
            },
            building: `Building ${Math.ceil(Math.random() * 5)}`,
            floor: `Floor ${Math.ceil(Math.random() * 3)}`
          },
          model,
          supplier,
          purchaseDate: new Date(2020 + Math.random() * 4, Math.random() * 12, Math.random() * 28).toISOString().split('T')[0],
          serialNumber: `${supplier.substring(0, 3).toUpperCase()}-${assetType.type.substring(0, 2).toUpperCase()}-${assetCounter.toString().padStart(4, '0')}`,
          value: assetType.baseValue + (Math.random() - 0.5) * assetType.baseValue * 0.3,
          lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          nextMaintenance: new Date(Date.now() + Math.random() * 120 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          efficiency: Math.round(efficiency),
          temperature: 20 + Math.random() * 60,
          pressure: 1 + Math.random() * 10,
          vibration: Math.random() * 5,
          powerConsumption: 10 + Math.random() * 100,
          operatingHours: Math.round(1000 + Math.random() * 8000),
          criticality: status === 'critical' ? 'critical' : 
                      status === 'warning' ? 'high' :
                      Math.random() > 0.5 ? 'medium' : 'low'
        };

        assets.push(asset);
        assetCounter++;
      }
    });

    return assets;
  }

  private generateDemoAlerts(assets: DemoAsset[]): DemoAlert[] {
    const alertTemplates = [
      {
        type: 'Temperature Anomaly',
        description: 'Elevated operating temperature detected',
        recommendation: 'Inspect cooling system and replace filters',
        severity: 'medium',
        aiInsight: 'AI detected 15% increase in temperature over normal operating range. Pattern suggests cooling system degradation.'
      },
      {
        type: 'Vibration Pattern',
        description: 'Unusual vibration signatures detected',
        recommendation: 'Schedule bearing inspection and alignment check',
        severity: 'high',
        aiInsight: 'Machine learning algorithms identified bearing wear patterns consistent with imminent failure.'
      },
      {
        type: 'Efficiency Decline',
        description: 'Performance efficiency below optimal thresholds',
        recommendation: 'Perform comprehensive maintenance and calibration',
        severity: 'medium',
        aiInsight: 'Predictive models indicate 23% efficiency loss due to component wear and calibration drift.'
      },
      {
        type: 'Power Anomaly',
        description: 'Abnormal power consumption patterns',
        recommendation: 'Electrical system inspection required',
        severity: 'high',
        aiInsight: 'Neural networks detected power signature anomalies indicating potential electrical component failure.'
      },
      {
        type: 'Predictive Failure',
        description: 'Critical component failure predicted',
        recommendation: 'Immediate shutdown and component replacement',
        severity: 'critical',
        aiInsight: 'Advanced AI models predict 91% probability of critical failure within 72 hours based on sensor fusion analysis.'
      }
    ];

    const alerts: DemoAlert[] = [];
    let alertCounter = 1;

    // Generate alerts for assets with warning or critical status
    assets.forEach(asset => {
      if (asset.status === 'warning' || asset.status === 'critical') {
        const template = alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
        const riskPercentage = asset.status === 'critical' ? 80 + Math.random() * 15 : 60 + Math.random() * 25;
        
        const alert: DemoAlert = {
          id: `PA-${String(alertCounter).padStart(4, '0')}`,
          assetId: asset.id,
          assetName: asset.name,
          riskPercentage: Math.round(riskPercentage),
          timeframe: asset.status === 'critical' ? 
            `${Math.ceil(Math.random() * 7)} days` : 
            `${Math.ceil(Math.random() * 30)} days`,
          recommendation: template.recommendation,
          category: asset.category,
          priority: asset.status === 'critical' ? 'critical' : 
                   riskPercentage > 75 ? 'high' : 'medium',
          status: 'active',
          predictedFailureDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          potentialCostImpact: Math.round((asset.value * 0.1) + (Math.random() * asset.value * 0.2)),
          confidenceLevel: Math.round(75 + Math.random() * 20),
          aiInsight: template.aiInsight
        };

        alerts.push(alert);
        alertCounter++;
      }
    });

    // Add some additional random alerts for healthy assets (early warning)
    const healthyAssets = assets.filter(a => a.status === 'healthy');
    for (let i = 0; i < Math.min(5, healthyAssets.length); i++) {
      const asset = healthyAssets[Math.floor(Math.random() * healthyAssets.length)];
      const template = alertTemplates[Math.floor(Math.random() * 3)]; // Lower severity templates
      
      const alert: DemoAlert = {
        id: `PA-${String(alertCounter).padStart(4, '0')}`,
        assetId: asset.id,
        assetName: asset.name,
        riskPercentage: Math.round(30 + Math.random() * 30),
        timeframe: `${Math.ceil(30 + Math.random() * 60)} days`,
        recommendation: template.recommendation,
        category: asset.category,
        priority: 'low',
        status: 'active',
        predictedFailureDate: new Date(Date.now() + (60 + Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        potentialCostImpact: Math.round(asset.value * 0.05 + Math.random() * asset.value * 0.1),
        confidenceLevel: Math.round(60 + Math.random() * 15),
        aiInsight: template.aiInsight
      };

      alerts.push(alert);
      alertCounter++;
    }

    return alerts;
  }

  private generateDemoWorkOrders(assets: DemoAsset[], alerts: DemoAlert[]): DemoWorkOrder[] {
    const workOrders: DemoWorkOrder[] = [];
    let workOrderCounter = 1;

    const technicians = [
      'Ahmed Al-Mansouri', 'Sarah Johnson', 'Mohammed Hassan', 'Lisa Chen',
      'Omar Al-Rashid', 'Jennifer Martinez', 'Khalid Al-Zahra', 'Maria Rodriguez'
    ];

    // Generate work orders for critical alerts
    alerts.filter(alert => alert.priority === 'critical').forEach(alert => {
      const asset = assets.find(a => a.id === alert.assetId);
      if (!asset) return;

      const workOrder: DemoWorkOrder = {
        id: `WO-${String(workOrderCounter).padStart(5, '0')}`,
        assetId: alert.assetId,
        assetName: alert.assetName,
        title: `Critical Maintenance - ${alert.assetName}`,
        description: `${alert.recommendation}. Predicted failure risk: ${alert.riskPercentage}%`,
        priority: 'critical',
        status: Math.random() > 0.5 ? 'in_progress' : 'pending',
        assignedTo: technicians[Math.floor(Math.random() * technicians.length)],
        createdDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedCost: Math.round(5000 + Math.random() * 15000),
        estimatedHours: Math.round(8 + Math.random() * 24)
      };

      if (workOrder.status === 'completed') {
        workOrder.completedDate = new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        workOrder.actualCost = Math.round(workOrder.estimatedCost * (0.8 + Math.random() * 0.4));
        workOrder.actualHours = Math.round(workOrder.estimatedHours * (0.9 + Math.random() * 0.3));
      }

      workOrders.push(workOrder);
      workOrderCounter++;
    });

    // Generate routine maintenance work orders
    const routineAssets = assets.filter(a => a.status === 'healthy' || a.status === 'warning').slice(0, 10);
    routineAssets.forEach(asset => {
      const workOrder: DemoWorkOrder = {
        id: `WO-${String(workOrderCounter).padStart(5, '0')}`,
        assetId: asset.id,
        assetName: asset.name,
        title: `Scheduled Maintenance - ${asset.name}`,
        description: 'Routine preventive maintenance including inspection, lubrication, and filter replacement',
        priority: 'medium',
        status: ['completed', 'in_progress', 'pending'][Math.floor(Math.random() * 3)] as any,
        assignedTo: technicians[Math.floor(Math.random() * technicians.length)],
        createdDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        dueDate: new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimatedCost: Math.round(1000 + Math.random() * 5000),
        estimatedHours: Math.round(2 + Math.random() * 8)
      };

      if (workOrder.status === 'completed') {
        workOrder.completedDate = new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        workOrder.actualCost = Math.round(workOrder.estimatedCost * (0.8 + Math.random() * 0.4));
        workOrder.actualHours = Math.round(workOrder.estimatedHours * (0.9 + Math.random() * 0.3));
      }

      workOrders.push(workOrder);
      workOrderCounter++;
    });

    return workOrders;
  }

  async initializeEnhancedDemoData(): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('Generating enhanced demo data...');
      
      const assets = this.generateDemoAssets();
      const alerts = this.generateDemoAlerts(assets);
      const workOrders = this.generateDemoWorkOrders(assets, alerts);

      console.log(`Generated ${assets.length} assets, ${alerts.length} alerts, ${workOrders.length} work orders`);

      // Send to server
      const response = await fetch(`${this.baseUrl}/init-enhanced-demo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({
          assets,
          alerts,
          workOrders
        })
      });

      const result = await response.json();

      if (!response.ok) {
        return { success: false, error: result.error || 'Failed to initialize demo data' };
      }

      return { success: true };
    } catch (error) {
      console.error('Demo data initialization error:', error);
      return { success: false, error: `Failed to initialize demo data: ${error.message}` };
    }
  }

  async getPerformanceMetrics(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/demo/performance-metrics`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch performance metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
      throw error;
    }
  }

  async getRealtimeUpdates(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/demo/realtime-updates`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch realtime updates');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching realtime updates:', error);
      throw error;
    }
  }
}

export const demoDataService = new DemoDataService();