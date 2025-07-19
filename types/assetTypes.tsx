// Enhanced Enterprise Asset Management Type Definitions

export type AssetStatus = 'operational' | 'warning' | 'critical' | 'maintenance' | 'offline' | 'retired';
export type AssetCriticality = 'critical' | 'high' | 'medium' | 'low';
export type MaintenanceType = 'preventive' | 'predictive' | 'corrective' | 'emergency' | 'inspection';
export type WorkOrderStatus = 'draft' | 'pending' | 'approved' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
export type WorkOrderPriority = 'emergency' | 'urgent' | 'high' | 'medium' | 'low';

export interface Location {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  site?: string;
  building?: string;
  floor?: string;
  room?: string;
}

export interface AssetFinancials {
  purchasePrice: number;
  currentValue: number;
  depreciationRate: number;
  monthlyOperatingCost: number;
  insuranceValue?: number;
  warrantyEnd?: string;
  leaseEnd?: string;
}

export interface AssetSpecifications {
  manufacturer: string;
  model: string;
  serialNumber: string;
  year?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'mm' | 'cm' | 'm' | 'in' | 'ft';
  };
  capacity?: {
    value: number;
    unit: string;
  };
  powerRequirements?: {
    voltage: number;
    amperage: number;
    frequency: number;
  };
}

export interface AssetCompliance {
  certifications: Certification[];
  inspectionSchedule: InspectionSchedule[];
  regulatoryStatus: 'compliant' | 'non_compliant' | 'pending' | 'expired';
  nextInspectionDate?: string;
  complianceNotes?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending_renewal';
  documentUrl?: string;
}

export interface InspectionSchedule {
  id: string;
  type: string;
  frequency: number; // days
  lastInspection?: string;
  nextInspection: string;
  inspector?: string;
  mandatory: boolean;
}

export interface AssetSensorData {
  temperature?: number;
  pressure?: number;
  vibration?: number;
  humidity?: number;
  powerConsumption?: number;
  operatingHours?: number;
  cycleCount?: number;
  efficiency?: number;
  lastReading?: string;
}

export interface EnterpriseAsset {
  id: string;
  assetNumber: string; // Unique asset identifier
  name: string;
  description?: string;
  
  // Hierarchy
  parentAssetId?: string;
  childAssetIds: string[];
  assetPath: string; // e.g., "Fleet/Vehicle/Engine"
  level: number; // Hierarchy depth
  
  // Classification
  category: string;
  type: string;
  subtype?: string;
  criticality: AssetCriticality;
  status: AssetStatus;
  
  // Location & Assignment
  locationId: string;
  location: Location;
  assignedTo?: string; // User ID
  department?: string;
  costCenter?: string;
  
  // Specifications & Technical Details
  specifications: AssetSpecifications;
  
  // Financial Information
  financials: AssetFinancials;
  
  // Operational Data
  sensorData?: AssetSensorData;
  operationalStatus: {
    isOnline: boolean;
    lastActivity?: string;
    uptime: number; // percentage
    utilization: number; // percentage
    efficiency: number; // percentage
  };
  
  // Maintenance Information
  maintenanceInfo: {
    lastMaintenance?: string;
    nextMaintenance?: string;
    maintenancePlanId?: string;
    mtbf?: number; // Mean Time Between Failures (hours)
    mttr?: number; // Mean Time To Repair (hours)
  };
  
  // Compliance & Regulatory
  compliance: AssetCompliance;
  
  // Documentation
  documentation: {
    manuals: Document[];
    warranties: Document[];
    drawings: Document[];
    photos: Document[];
  };
  
  // Audit Trail
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  version: number;
  
  // Custom Fields for Industry-Specific Data
  customFields?: Record<string, any>;
}

export interface Document {
  id: string;
  name: string;
  type: 'manual' | 'warranty' | 'drawing' | 'photo' | 'certificate' | 'report';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  version?: string;
  tags?: string[];
}

export interface MaintenancePlan {
  id: string;
  assetId: string;
  name: string;
  description?: string;
  type: MaintenanceType;
  
  // Scheduling
  frequency: {
    value: number;
    unit: 'days' | 'weeks' | 'months' | 'hours' | 'cycles';
  };
  
  // Tasks
  tasks: MaintenanceTask[];
  
  // Resources
  estimatedDuration: number; // minutes
  requiredSkills: string[];
  requiredParts: RequiredPart[];
  
  // Status
  isActive: boolean;
  priority: WorkOrderPriority;
  nextDueDate: string;
  
  // Analytics
  averageCost: number;
  averageDuration: number;
  successRate: number; // percentage
  
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTask {
  id: string;
  sequence: number;
  name: string;
  description: string;
  estimatedDuration: number; // minutes
  requiredSkills: string[];
  safetyRequirements?: string[];
  instructions: string[];
  checkpoints: TaskCheckpoint[];
}

export interface TaskCheckpoint {
  id: string;
  name: string;
  type: 'visual' | 'measurement' | 'test' | 'replacement' | 'adjustment';
  required: boolean;
  acceptableMeasurement?: {
    min: number;
    max: number;
    unit: string;
  };
}

export interface RequiredPart {
  id: string;
  partNumber: string;
  name: string;
  quantity: number;
  estimatedCost: number;
  stockLevel?: number;
  supplier?: string;
  leadTime?: number; // days
}

export interface EnhancedWorkOrder {
  id: string;
  workOrderNumber: string;
  
  // Asset Information
  assetId: string;
  assetName: string;
  locationId: string;
  
  // Work Order Details
  title: string;
  description: string;
  type: MaintenanceType;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  
  // Planning
  maintenancePlanId?: string;
  alertId?: string; // If generated from predictive alert
  
  // Scheduling
  requestedDate: string;
  scheduledStartDate?: string;
  scheduledEndDate?: string;
  estimatedDuration: number; // minutes
  
  // Execution
  actualStartDate?: string;
  actualEndDate?: string;
  actualDuration?: number; // minutes
  
  // Assignment
  assignedTo?: string;
  assignedTeam?: string[];
  requiredSkills: string[];
  
  // Resources
  estimatedCost: number;
  actualCost?: number;
  requiredParts: RequiredPart[];
  usedParts?: UsedPart[];
  
  // Completion
  tasks: WorkOrderTask[];
  workPerformed?: string;
  findingsAndRecommendations?: string;
  followUpRequired?: boolean;
  followUpWorkOrderId?: string;
  
  // Quality & Safety
  safetyIncidents?: SafetyIncident[];
  qualityChecks?: QualityCheck[];
  customerSatisfaction?: number; // 1-5 rating
  
  // Approval Workflow
  approvalRequired: boolean;
  approvals: WorkOrderApproval[];
  
  // Attachments
  attachments: Document[];
  
  // Audit Trail
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  
  // Analytics
  efficiency?: number; // actual vs estimated time
  firstTimeFixed?: boolean;
  
  // Custom Fields
  customFields?: Record<string, any>;
}

export interface WorkOrderTask {
  id: string;
  maintenanceTaskId?: string;
  sequence: number;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo?: string;
  estimatedDuration: number;
  actualDuration?: number;
  startTime?: string;
  endTime?: string;
  notes?: string;
  checkpoints: TaskCheckpointResult[];
}

export interface TaskCheckpointResult {
  checkpointId: string;
  name: string;
  status: 'pass' | 'fail' | 'na';
  measurement?: {
    value: number;
    unit: string;
  };
  notes?: string;
  photosUrls?: string[];
}

export interface UsedPart {
  partId: string;
  partNumber: string;
  name: string;
  quantityUsed: number;
  actualCost: number;
  batchNumber?: string;
  supplierLotNumber?: string;
}

export interface SafetyIncident {
  id: string;
  type: 'near_miss' | 'minor_injury' | 'major_injury' | 'equipment_damage';
  description: string;
  reportedBy: string;
  reportedAt: string;
  actionsTaken: string[];
  preventiveMeasures: string[];
}

export interface QualityCheck {
  id: string;
  checkType: string;
  status: 'pass' | 'fail' | 'conditional';
  performedBy: string;
  performedAt: string;
  notes?: string;
  correctiveActions?: string[];
}

export interface WorkOrderApproval {
  id: string;
  approverRole: string;
  approverUserId: string;
  approverName: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  comments?: string;
  level: number; // Approval hierarchy level
}

export interface EnhancedPredictiveAlert {
  id: string;
  
  // Asset Information
  assetId: string;
  assetName: string;
  assetLocation: string;
  
  // Alert Details
  title: string;
  description: string;
  category: string;
  alertType: 'performance' | 'condition' | 'failure_prediction' | 'anomaly';
  
  // Risk Assessment
  riskScore: number; // 0-100
  probability: number; // 0-100
  impact: 'low' | 'medium' | 'high' | 'critical';
  severity: 'informational' | 'warning' | 'critical' | 'emergency';
  
  // Prediction Details
  predictedFailureDate?: string;
  confidenceLevel: number; // 0-100
  timeToAction: number; // hours
  
  // AI/ML Information
  modelUsed: string;
  modelVersion: string;
  dataSourcesUsed: string[];
  triggeredBy: {
    sensors: string[];
    thresholds: Record<string, number>;
    patterns: string[];
  };
  
  // Business Impact
  estimatedDowntime?: number; // hours
  estimatedCostImpact: number;
  affectedOperations: string[];
  cascadingEffects?: string[];
  
  // Recommendations
  recommendations: AlertRecommendation[];
  suggestedActions: SuggestedAction[];
  
  // Status & Workflow
  status: 'active' | 'acknowledged' | 'in_progress' | 'resolved' | 'false_positive';
  priority: 'low' | 'medium' | 'high' | 'critical';
  
  // Assignment
  assignedTo?: string;
  assignedTeam?: string;
  escalationLevel: number;
  
  // Resolution
  workOrderId?: string;
  resolvedAt?: string;
  resolution?: string;
  actualOutcome?: string;
  preventionEffectiveness?: number; // 1-5 rating
  
  // Historical Context
  similarAlertsCount: number;
  lastSimilarAlert?: string;
  trendingDirection: 'improving' | 'stable' | 'degrading';
  
  // Audit Trail
  createdAt: string;
  updatedAt: string;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  
  // Integration
  externalSystemRefs?: Record<string, string>;
  notificationsSent: NotificationLog[];
}

export interface AlertRecommendation {
  id: string;
  type: 'immediate' | 'short_term' | 'long_term';
  action: string;
  reasoning: string;
  estimatedCost?: number;
  estimatedTimeframe?: string;
  priority: number;
  requiredSkills?: string[];
  requiredParts?: string[];
}

export interface SuggestedAction {
  id: string;
  action: string;
  urgency: 'immediate' | 'within_24h' | 'within_week' | 'planned';
  estimatedEffort: number; // hours
  skillsRequired: string[];
  toolsRequired: string[];
  safetyConsiderations?: string[];
}

export interface NotificationLog {
  id: string;
  channel: 'email' | 'sms' | 'push' | 'slack' | 'teams';
  recipient: string;
  sentAt: string;
  status: 'sent' | 'delivered' | 'failed';
  content?: string;
}

export interface AssetPerformanceMetrics {
  assetId: string;
  date: string;
  
  // Operational Metrics
  uptime: number; // percentage
  availability: number; // percentage
  utilization: number; // percentage
  efficiency: number; // percentage
  throughput?: number;
  qualityRate?: number; // percentage
  
  // Maintenance Metrics
  mtbf: number; // hours
  mttr: number; // hours
  maintenanceCost: number;
  plannedMaintenanceRatio: number; // percentage
  
  // Financial Metrics
  operatingCost: number;
  revenueGenerated?: number;
  costPerHour: number;
  roi?: number; // percentage
  
  // Energy & Environmental
  energyConsumption?: number; // kWh
  carbonFootprint?: number; // kg CO2
  waterUsage?: number; // liters
  wasteGenerated?: number; // kg
  
  // Quality & Safety
  incidentCount: number;
  nearMissCount: number;
  complianceScore: number; // percentage
  
  // Predictive Indicators
  healthScore: number; // 0-100
  riskScore: number; // 0-100
  remainingUsefulLife?: number; // days
}

export interface AssetHierarchy {
  id: string;
  name: string;
  level: number;
  children: AssetHierarchy[];
  assetCount: number;
  totalValue: number;
  averageHealth: number;
  criticalAlertsCount: number;
}

export interface MaintenanceSchedule {
  date: string;
  workOrders: {
    id: string;
    assetName: string;
    type: MaintenanceType;
    priority: WorkOrderPriority;
    estimatedDuration: number;
    assignedTo?: string;
    status: WorkOrderStatus;
  }[];
  totalWorkOrders: number;
  totalEstimatedHours: number;
  resourceUtilization: number; // percentage
  conflictsCount: number;
}

// Enterprise KPI Definitions
export interface EnterpriseKPIs {
  // Fleet Performance
  fleetAvailability: number; // percentage
  fleetUtilization: number; // percentage
  overallEquipmentEffectiveness: number; // percentage
  
  // Maintenance Performance
  plannedMaintenancePercentage: number;
  maintenanceBacklog: number; // hours
  emergencyWorkPercentage: number;
  maintenanceCostPerRevenue: number; // percentage
  
  // Financial Performance
  totalAssetValue: number;
  depreciationRate: number;
  maintenanceCostTrend: number; // percentage change
  costAvoidance: number; // from predictive maintenance
  
  // Quality & Compliance
  complianceScore: number; // percentage
  safetyIncidentRate: number; // incidents per 1000 hours
  environmentalComplianceScore: number; // percentage
  
  // Predictive Analytics
  predictiveMaintenanceAccuracy: number; // percentage
  falsePositiveRate: number; // percentage
  costSavingsFromPredictive: number;
  earlyDetectionRate: number; // percentage
  
  // Operational Excellence
  firstTimeFixRate: number; // percentage
  wrenchTime: number; // percentage
  technicianProductivity: number; // hours per day
  assetReliability: number; // percentage
}