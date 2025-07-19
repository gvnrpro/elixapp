import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: '*',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.use('*', logger(console.log))

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Helper function to verify user authorization
async function verifyAuth(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No access token provided', user: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return { error: 'Invalid or expired token', user: null };
  }
  
  return { user, error: null };
}

// Authentication Routes
app.post('/make-server-7a1baec9/auth/signup', async (c) => {
  try {
    const { email, password, name, role } = await c.req.json()
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: role || 'site_manager' },
      // Automatically confirm the user's email since an email server hasn't been configured
      email_confirm: true
    })
    
    if (error) {
      console.log('Signup error:', error)
      return c.json({ error: `Signup failed: ${error.message}` }, 400)
    }
    
    // Store user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email,
      name,
      role: role || 'site_manager',
      created_at: new Date().toISOString()
    })
    
    return c.json({ user: data.user, message: 'User created successfully' })
    
  } catch (error) {
    console.log('Signup error:', error)
    return c.json({ error: `Server error during signup: ${error.message}` }, 500)
  }
})

app.get('/make-server-7a1baec9/auth/profile', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const profile = await kv.get(`user:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }
    
    return c.json({ profile })
    
  } catch (error) {
    console.log('Profile fetch error:', error)
    return c.json({ error: `Error fetching profile: ${error.message}` }, 500)
  }
})

// Asset Management Routes
app.get('/make-server-7a1baec9/assets', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const assets = await kv.getByPrefix('asset:')
    return c.json({ assets })
    
  } catch (error) {
    console.log('Assets fetch error:', error)
    return c.json({ error: `Error fetching assets: ${error.message}` }, 500)
  }
})

app.get('/make-server-7a1baec9/assets/:id', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const assetId = c.req.param('id')
    const asset = await kv.get(`asset:${assetId}`)
    
    if (!asset) {
      return c.json({ error: 'Asset not found' }, 404)
    }
    
    return c.json({ asset })
    
  } catch (error) {
    console.log('Asset fetch error:', error)
    return c.json({ error: `Error fetching asset: ${error.message}` }, 500)
  }
})

app.post('/make-server-7a1baec9/assets', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const assetData = await c.req.json()
    const assetId = `${assetData.type.toLowerCase()}-${Date.now()}`
    
    const asset = {
      id: assetId,
      ...assetData,
      created_by: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    await kv.set(`asset:${assetId}`, asset)
    
    return c.json({ asset, message: 'Asset created successfully' })
    
  } catch (error) {
    console.log('Asset creation error:', error)
    return c.json({ error: `Error creating asset: ${error.message}` }, 500)
  }
})

// Predictive Analytics Routes
app.get('/make-server-7a1baec9/alerts', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const alerts = await kv.getByPrefix('alert:')
    
    // Sort by priority and risk percentage
    const sortedAlerts = alerts.sort((a, b) => {
      const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 }
      const aPriority = priorityOrder[a.priority] || 0
      const bPriority = priorityOrder[b.priority] || 0
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }
      
      return b.riskPercentage - a.riskPercentage
    })
    
    return c.json({ alerts: sortedAlerts })
    
  } catch (error) {
    console.log('Alerts fetch error:', error)
    return c.json({ error: `Error fetching alerts: ${error.message}` }, 500)
  }
})

app.post('/make-server-7a1baec9/alerts', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const alertData = await c.req.json()
    const alertId = `PA-${Date.now()}`
    
    const alert = {
      id: alertId,
      ...alertData,
      created_by: user.id,
      created_at: new Date().toISOString(),
      status: 'active'
    }
    
    await kv.set(`alert:${alertId}`, alert)
    
    return c.json({ alert, message: 'Alert created successfully' })
    
  } catch (error) {
    console.log('Alert creation error:', error)
    return c.json({ error: `Error creating alert: ${error.message}` }, 500)
  }
})

// Work Order Management Routes
app.post('/make-server-7a1baec9/work-orders', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const workOrderData = await c.req.json()
    const workOrderId = `WO-${Date.now()}`
    
    const workOrder = {
      id: workOrderId,
      ...workOrderData,
      created_by: user.id,
      created_at: new Date().toISOString(),
      status: workOrderData.status || 'pending'
    }
    
    await kv.set(`work_order:${workOrderId}`, workOrder)
    
    // If this work order is for an alert, mark the alert as addressed
    if (workOrderData.alertId) {
      const alert = await kv.get(`alert:${workOrderData.alertId}`)
      if (alert) {
        alert.status = 'addressed'
        alert.work_order_id = workOrderId
        alert.updated_at = new Date().toISOString()
        await kv.set(`alert:${workOrderData.alertId}`, alert)
      }
    }
    
    return c.json({ workOrder, message: 'Work order created successfully' })
    
  } catch (error) {
    console.log('Work order creation error:', error)
    return c.json({ error: `Error creating work order: ${error.message}` }, 500)
  }
})

app.get('/make-server-7a1baec9/work-orders/asset/:assetId', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const assetId = c.req.param('assetId')
    const allWorkOrders = await kv.getByPrefix('work_order:')
    
    const assetWorkOrders = allWorkOrders
      .filter(wo => wo.assetId === assetId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    return c.json({ workOrders: assetWorkOrders })
    
  } catch (error) {
    console.log('Work orders fetch error:', error)
    return c.json({ error: `Error fetching work orders: ${error.message}` }, 500)
  }
})

// Performance Data Routes
app.get('/make-server-7a1baec9/performance/overview', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    // Calculate KPIs from stored data
    const assets = await kv.getByPrefix('asset:')
    const alerts = await kv.getByPrefix('alert:')
    const workOrders = await kv.getByPrefix('work_order:')
    
    const totalAssets = assets.length
    const operationalAssets = assets.filter(asset => asset.status === 'healthy' || asset.status === 'warning').length
    const criticalAlerts = alerts.filter(alert => alert.priority === 'critical' && alert.status === 'active').length
    
    const fleetReadiness = totalAssets > 0 ? Math.round((operationalAssets / totalAssets) * 100) : 0
    
    // Mock field team uptime (in real implementation, this would come from IoT devices)
    const fieldTeamUptime = 98
    
    // Calculate budget status from work orders
    const monthlyBudget = 50000 // Mock budget
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyWorkOrders = workOrders.filter(wo => {
      const woDate = new Date(wo.created_at)
      return woDate.getMonth() === currentMonth && woDate.getFullYear() === currentYear
    })
    
    const budgetUsed = monthlyWorkOrders.reduce((sum, wo) => sum + (wo.cost || 0), 0)
    const budgetStatus = Math.round((budgetUsed / monthlyBudget) * 100)
    
    return c.json({
      kpis: {
        fleetReadiness,
        criticalAlerts: criticalAlerts,
        fieldTeamUptime,
        budgetStatus
      },
      totals: {
        totalAssets,
        operationalAssets,
        totalAlerts: alerts.length,
        totalWorkOrders: workOrders.length
      }
    })
    
  } catch (error) {
    console.log('Performance overview error:', error)
    return c.json({ error: `Error fetching performance data: ${error.message}` }, 500)
  }
})

// Asset performance by category
app.get('/make-server-7a1baec9/performance/categories', async (c) => {
  try {
    const { user, error } = await verifyAuth(c.req)
    if (error) {
      return c.json({ error }, 401)
    }
    
    const assets = await kv.getByPrefix('asset:')
    
    // Group assets by category and calculate uptime
    const categoryStats = {}
    
    assets.forEach(asset => {
      const category = asset.category || asset.type || 'Unknown'
      
      if (!categoryStats[category]) {
        categoryStats[category] = {
          category,
          total: 0,
          operational: 0,
          uptime: 0
        }
      }
      
      categoryStats[category].total++
      
      if (asset.status === 'healthy' || asset.status === 'warning') {
        categoryStats[category].operational++
      }
    })
    
    // Calculate uptime percentages
    Object.values(categoryStats).forEach(stat => {
      stat.uptime = stat.total > 0 ? Math.round((stat.operational / stat.total) * 100) : 0
    })
    
    return c.json({ categoryPerformance: Object.values(categoryStats) })
    
  } catch (error) {
    console.log('Category performance error:', error)
    return c.json({ error: `Error fetching category performance: ${error.message}` }, 500)
  }
})

// Initialize enhanced demo data
app.post('/make-server-7a1baec9/init-enhanced-demo', async (c) => {
  try {
    // First, create the demo user if it doesn't exist
    try {
      const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail('demo@elix.com')
      
      if (getUserError || !existingUser.user) {
        console.log('Creating demo user...')
        const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
          email: 'demo@elix.com',
          password: 'demo123',
          user_metadata: { 
            name: 'Operations Director',
            role: 'operations_director' 
          },
          email_confirm: true
        })
        
        if (createError) {
          console.log('Demo user creation error:', createError)
        } else {
          console.log('Demo user created successfully')
          
          // Store demo user profile in KV store
          await kv.set(`user:${newUser.user.id}`, {
            id: newUser.user.id,
            email: 'demo@elix.com',
            name: 'Operations Director',
            role: 'operations_director',
            created_at: new Date().toISOString()
          })
        }
      } else {
        console.log('Demo user already exists')
      }
    } catch (userError) {
      console.log('Error handling demo user:', userError)
    }
    
    const { assets, alerts, workOrders } = await c.req.json()
    
    // Clear existing demo data
    const existingAssets = await kv.getByPrefix('asset:')
    const existingAlerts = await kv.getByPrefix('alert:')
    const existingWorkOrders = await kv.getByPrefix('work_order:')
    
    // Store enhanced demo data
    console.log(`Storing ${assets.length} assets...`)
    for (const asset of assets) {
      await kv.set(`asset:${asset.id}`, asset)
    }
    
    console.log(`Storing ${alerts.length} alerts...`)
    for (const alert of alerts) {
      await kv.set(`alert:${alert.id}`, alert)
    }
    
    console.log(`Storing ${workOrders.length} work orders...`)
    for (const workOrder of workOrders) {
      await kv.set(`work_order:${workOrder.id}`, workOrder)
    }
    
    return c.json({ 
      message: 'Enhanced demo data initialized successfully',
      stats: {
        assets: assets.length,
        alerts: alerts.length,
        workOrders: workOrders.length
      }
    })
    
  } catch (error) {
    console.log('Enhanced demo data initialization error:', error)
    return c.json({ error: `Error initializing enhanced demo data: ${error.message}` }, 500)
  }
})

// Legacy sample data initialization (kept for backward compatibility)
app.post('/make-server-7a1baec9/init-sample-data', async (c) => {
  try {
    // Simple sample data for quick testing
    const sampleAssets = [
      {
        id: 'HM-001',
        name: 'Excavator CAT 320',
        type: 'Heavy Machinery',
        category: 'Heavy Machinery',
        status: 'healthy',
        location: { site: 'Dubai Industrial Zone', coordinates: { lat: 25.1972, lng: 55.2744 } },
        model: 'CAT 320GC',
        supplier: 'Caterpillar Inc.',
        purchaseDate: '2022-03-15',
        serialNumber: 'CAT320-2024-001',
        efficiency: 89,
        criticality: 'medium'
      },
      {
        id: 'HM-002',
        name: 'Crane Liebherr LTM',
        type: 'Heavy Machinery',
        category: 'Heavy Machinery',
        status: 'warning',
        location: { site: 'Abu Dhabi Complex', coordinates: { lat: 24.4539, lng: 54.3773 } },
        model: 'LTM 1070-4.2',
        supplier: 'Liebherr Group',
        purchaseDate: '2021-08-20',
        serialNumber: 'LIE-2024-002',
        efficiency: 74,
        criticality: 'high'
      },
      {
        id: 'HVAC-001',
        name: 'Chiller Unit 1',
        type: 'HVAC',
        category: 'HVAC Systems',
        status: 'critical',
        location: { site: 'Riyadh Operations', coordinates: { lat: 24.7136, lng: 46.6753 } },
        model: 'Carrier AquaEdge 19DV',
        supplier: 'Carrier Corporation',
        purchaseDate: '2023-01-10',
        serialNumber: 'CAR-HVAC-003',
        efficiency: 45,
        criticality: 'critical'
      }
    ]
    
    const sampleAlerts = [
      {
        id: 'PA-001',
        assetId: 'HM-002',
        assetName: 'Crane Liebherr LTM',
        riskPercentage: 85,
        timeframe: '7 days',
        recommendation: 'Schedule hydraulic system inspection',
        category: 'Heavy Machinery',
        priority: 'high',
        status: 'active',
        aiInsight: 'Machine learning detected irregular hydraulic pressure patterns indicating potential pump failure.'
      },
      {
        id: 'PA-002',
        assetId: 'HVAC-001',
        assetName: 'Chiller Unit 1',
        riskPercentage: 91,
        timeframe: '3 days',
        recommendation: 'Immediate maintenance required',
        category: 'HVAC',
        priority: 'critical',
        status: 'active',
        aiInsight: 'AI models predict critical compressor failure within 72 hours based on vibration and temperature analysis.'
      }
    ]
    
    // Store sample data
    for (const asset of sampleAssets) {
      await kv.set(`asset:${asset.id}`, asset)
    }
    
    for (const alert of sampleAlerts) {
      await kv.set(`alert:${alert.id}`, alert)
    }
    
    return c.json({ message: 'Basic sample data initialized successfully' })
    
  } catch (error) {
    console.log('Sample data initialization error:', error)
    return c.json({ error: `Error initializing sample data: ${error.message}` }, 500)
  }
})

// Demo-specific endpoints
app.get('/make-server-7a1baec9/demo/performance-metrics', async (c) => {
  try {
    const assets = await kv.getByPrefix('asset:')
    const alerts = await kv.getByPrefix('alert:')
    const workOrders = await kv.getByPrefix('work_order:')
    
    // Calculate enhanced KPIs for demo
    const totalAssets = assets.length
    const operationalAssets = assets.filter(asset => asset.status === 'healthy' || asset.status === 'warning').length
    const criticalAlerts = alerts.filter(alert => alert.priority === 'critical' && alert.status === 'active').length
    const totalAssetValue = assets.reduce((sum, asset) => sum + (asset.value || 0), 0)
    
    // Calculate fleet readiness
    const fleetReadiness = totalAssets > 0 ? Math.round((operationalAssets / totalAssets) * 100) : 0
    
    // Calculate efficiency metrics
    const avgEfficiency = assets.length > 0 ? 
      Math.round(assets.reduce((sum, asset) => sum + (asset.efficiency || 0), 0) / assets.length) : 0
    
    // Calculate cost savings from predictive maintenance
    const potentialCostSavings = alerts.reduce((sum, alert) => sum + (alert.potentialCostImpact || 0), 0)
    
    // Calculate work order metrics
    const completedWorkOrders = workOrders.filter(wo => wo.status === 'completed').length
    const avgCompletionTime = workOrders
      .filter(wo => wo.status === 'completed' && wo.completedDate && wo.createdDate)
      .reduce((sum, wo) => {
        const completion = new Date(wo.completedDate).getTime()
        const creation = new Date(wo.createdDate).getTime()
        return sum + (completion - creation) / (1000 * 60 * 60 * 24) // days
      }, 0)
    
    const avgResponseTime = avgCompletionTime > 0 ? Math.round(avgCompletionTime / completedWorkOrders) : 0
    
    // Uptime calculation based on asset status
    const uptimeByCategory = {}
    assets.forEach(asset => {
      const category = asset.category || 'Unknown'
      if (!uptimeByCategory[category]) {
        uptimeByCategory[category] = { total: 0, operational: 0 }
      }
      uptimeByCategory[category].total++
      if (asset.status === 'healthy' || asset.status === 'warning') {
        uptimeByCategory[category].operational++
      }
    })
    
    Object.keys(uptimeByCategory).forEach(category => {
      const data = uptimeByCategory[category]
      uptimeByCategory[category].uptime = Math.round((data.operational / data.total) * 100)
    })
    
    return c.json({
      kpis: {
        fleetReadiness,
        criticalAlerts: criticalAlerts,
        avgEfficiency,
        avgResponseTime,
        totalAssetValue: Math.round(totalAssetValue),
        potentialSavings: Math.round(potentialCostSavings),
        completionRate: completedWorkOrders
      },
      totals: {
        totalAssets,
        operationalAssets,
        totalAlerts: alerts.length,
        totalWorkOrders: workOrders.length,
        activeAlerts: alerts.filter(a => a.status === 'active').length
      },
      categoryPerformance: Object.keys(uptimeByCategory).map(category => ({
        category,
        ...uptimeByCategory[category]
      })),
      trends: {
        alertTrends: generateAlertTrends(alerts),
        performanceTrends: generatePerformanceTrends(assets),
        costTrends: generateCostTrends(workOrders)
      }
    })
    
  } catch (error) {
    console.log('Performance metrics error:', error)
    return c.json({ error: `Error fetching performance metrics: ${error.message}` }, 500)
  }
})

app.get('/make-server-7a1baec9/demo/realtime-updates', async (c) => {
  try {
    const assets = await kv.getByPrefix('asset:')
    const alerts = await kv.getByPrefix('alert:')
    
    // Simulate real-time data updates
    const realtimeUpdates = []
    
    // Simulate sensor readings
    assets.slice(0, 5).forEach(asset => {
      if (asset.status !== 'offline') {
        realtimeUpdates.push({
          type: 'sensor_reading',
          assetId: asset.id,
          assetName: asset.name,
          timestamp: new Date().toISOString(),
          data: {
            temperature: Math.round((asset.temperature || 25) + (Math.random() - 0.5) * 5),
            pressure: Math.round((asset.pressure || 5) + (Math.random() - 0.5) * 2),
            vibration: Math.round((asset.vibration || 2) + (Math.random() - 0.5) * 1),
            efficiency: Math.max(0, Math.min(100, Math.round((asset.efficiency || 85) + (Math.random() - 0.5) * 10)))
          }
        })
      }
    })
    
    // Simulate alert status changes
    if (Math.random() > 0.7) {
      const activeAlerts = alerts.filter(a => a.status === 'active')
      if (activeAlerts.length > 0) {
        const alert = activeAlerts[Math.floor(Math.random() * activeAlerts.length)]
        realtimeUpdates.push({
          type: 'alert_update',
          alertId: alert.id,
          assetName: alert.assetName,
          timestamp: new Date().toISOString(),
          change: Math.random() > 0.5 ? 'risk_increased' : 'risk_decreased',
          newRiskPercentage: Math.max(0, Math.min(100, alert.riskPercentage + (Math.random() - 0.5) * 10))
        })
      }
    }
    
    // Simulate new predictive insights
    if (Math.random() > 0.8) {
      const randomAsset = assets[Math.floor(Math.random() * assets.length)]
      realtimeUpdates.push({
        type: 'ai_insight',
        assetId: randomAsset.id,
        assetName: randomAsset.name,
        timestamp: new Date().toISOString(),
        insight: 'AI detected subtle pattern changes in operational data suggesting optimal maintenance window in 14-21 days.',
        confidence: Math.round(75 + Math.random() * 20)
      })
    }
    
    return c.json({
      updates: realtimeUpdates,
      timestamp: new Date().toISOString(),
      systemStatus: 'optimal',
      dataFreshness: 'real-time'
    })
    
  } catch (error) {
    console.log('Realtime updates error:', error)
    return c.json({ error: `Error fetching realtime updates: ${error.message}` }, 500)
  }
})

// Helper functions for demo metrics
function generateAlertTrends(alerts) {
  const days = 30
  const trends = []
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const critical = Math.floor(Math.random() * 3) + (i < 7 ? 2 : 0)
    const high = Math.floor(Math.random() * 5) + 2
    const medium = Math.floor(Math.random() * 8) + 3
    
    trends.push({
      date: date.toISOString().split('T')[0],
      critical,
      high,
      medium,
      total: critical + high + medium
    })
  }
  return trends
}

function generatePerformanceTrends(assets) {
  const days = 30
  const trends = []
  for (let i = days; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
    const baseEfficiency = 85
    const efficiency = Math.max(70, Math.min(95, baseEfficiency + (Math.random() - 0.5) * 10))
    
    trends.push({
      date: date.toISOString().split('T')[0],
      avgEfficiency: Math.round(efficiency),
      uptime: Math.round(95 + (Math.random() - 0.5) * 8),
      utilization: Math.round(78 + (Math.random() - 0.5) * 15)
    })
  }
  return trends
}

function generateCostTrends(workOrders) {
  const months = 12
  const trends = []
  for (let i = months; i >= 0; i--) {
    const date = new Date(Date.now() - i * 30 * 24 * 60 * 60 * 1000)
    const preventive = Math.round(15000 + Math.random() * 10000)
    const corrective = Math.round(25000 + Math.random() * 15000)
    const emergency = Math.round(5000 + Math.random() * 8000)
    
    trends.push({
      month: date.toISOString().slice(0, 7),
      preventive,
      corrective,
      emergency,
      total: preventive + corrective + emergency,
      savings: Math.round(preventive * 0.7) // Estimated savings from predictive maintenance
    })
  }
  return trends
}

// Create demo user endpoint
app.post('/make-server-7a1baec9/create-demo-user', async (c) => {
  try {
    // Check if demo user already exists
    const { data: existingUser, error: getUserError } = await supabase.auth.admin.getUserByEmail('demo@elix.com')
    
    if (existingUser.user) {
      return c.json({ message: 'Demo user already exists', user: existingUser.user })
    }
    
    // Create demo user
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'demo@elix.com',
      password: 'demo123',
      user_metadata: { 
        name: 'Operations Director',
        role: 'operations_director' 
      },
      email_confirm: true
    })
    
    if (error) {
      console.log('Demo user creation error:', error)
      return c.json({ error: `Failed to create demo user: ${error.message}` }, 400)
    }
    
    // Store demo user profile in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: 'demo@elix.com',
      name: 'Operations Director',
      role: 'operations_director',
      created_at: new Date().toISOString()
    })
    
    return c.json({ message: 'Demo user created successfully', user: data.user })
    
  } catch (error) {
    console.log('Demo user creation error:', error)
    return c.json({ error: `Error creating demo user: ${error.message}` }, 500)
  }
})

// Health check
app.get('/make-server-7a1baec9/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

serve(app.fetch)