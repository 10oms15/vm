import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-Memory IoT & Sensor State (Initialized with realistic baseline from lab sheet)
let sensorState = {
  deviceId: 'LAT-KRABANG-GATEWAY-01',
  timestamp: new Date().toISOString(),
  zone1MoisturePercent: 65.0,
  zone1RawAdc: 1850,
  zone2TensionKpa: 42.0,
  zone2RawOhms: 3200,
  tankLevelPercent: 85.0,
  tankDistanceCm: 30,
  tankVolumeLiters: 4250,
  temperatureC: 32.4,
  humidityPercent: 60,
  solarRadiationWm2: 680,
  windSpeedMs: 2.1,
  rainfallMm: 0.0,
  barometricPressureHpa: 1012,
  flowRateLpm: 0.0,
  flowPulseFreqHz: 0,
  totalVolumePumpedL: 340.0
};

let actuatorState = {
  pumpOn: false,
  zone1On: false,
  zone2On: false,
  autoMode: false,
  timerRemainingSec: null as number | null,
  lastCommandTimestamp: new Date().toISOString(),
  commandSource: 'web' as 'web' | 'hardware' | 'auto-pilot'
};

// ================= API ROUTES FOR HARDWARE & DEVELOPERS ================= //

// 1. System Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Smart Farm AgroFlow Hub API',
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

// 2. GET Latest Sensor Telemetry
app.get('/api/sensors/latest', (req, res) => {
  res.json({
    success: true,
    sensors: sensorState,
    actuators: actuatorState,
    timestamp: new Date().toISOString()
  });
});

// 3. POST Sensor Telemetry (Hardware Ingestion Endpoint for ESP32, LoRaWAN, Webhook)
app.post('/api/sensors/telemetry', (req, res) => {
  const body = req.body || {};

  // Support Raw Conversion if raw values provided
  let calculatedMoisture = body.zone1MoisturePercent;
  if (calculatedMoisture === undefined && body.zone1RawAdc !== undefined) {
    // Air ADC 3200, Water ADC 1300
    const air = 3200;
    const water = 1300;
    calculatedMoisture = Math.max(0, Math.min(100, Math.round(((air - body.zone1RawAdc) / (air - water)) * 100)));
  }

  let calculatedTension = body.zone2TensionKpa;
  if (calculatedTension === undefined && body.zone2RawOhms !== undefined) {
    calculatedTension = Math.max(0, Math.round(7.407 * (body.zone2RawOhms / 1000) - 3.7));
  }

  let calculatedTankLevel = body.tankLevelPercent;
  let calculatedLiters = body.tankVolumeLiters;
  if (calculatedTankLevel === undefined && body.tankDistanceCm !== undefined) {
    const totalHeight = 200;
    const waterHeight = Math.max(0, totalHeight - body.tankDistanceCm);
    calculatedTankLevel = Math.min(100, Math.round((waterHeight / totalHeight) * 100));
    calculatedLiters = Math.round((calculatedTankLevel / 100) * 5000);
  }

  // Update in-memory state
  sensorState = {
    ...sensorState,
    ...body,
    zone1MoisturePercent: calculatedMoisture !== undefined ? Number(calculatedMoisture) : sensorState.zone1MoisturePercent,
    zone2TensionKpa: calculatedTension !== undefined ? Number(calculatedTension) : sensorState.zone2TensionKpa,
    tankLevelPercent: calculatedTankLevel !== undefined ? Number(calculatedTankLevel) : sensorState.tankLevelPercent,
    tankVolumeLiters: calculatedLiters !== undefined ? Number(calculatedLiters) : sensorState.tankVolumeLiters,
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    message: 'Sensor telemetry recorded successfully',
    updatedSensors: sensorState
  });
});

// 4. GET Actuator Control Status
app.get('/api/control/status', (req, res) => {
  res.json({
    success: true,
    actuators: actuatorState
  });
});

// 5. POST Pump Switch
app.post('/api/control/pump', (req, res) => {
  const { state, source = 'web' } = req.body;
  if (typeof state !== 'boolean') {
    return res.status(400).json({ success: false, error: 'state boolean required (true/false)' });
  }

  actuatorState.pumpOn = state;
  actuatorState.lastCommandTimestamp = new Date().toISOString();
  actuatorState.commandSource = source;

  if (!state) {
    // If pump turns off, shut down zone valves too
    actuatorState.zone1On = false;
    actuatorState.zone2On = false;
    actuatorState.timerRemainingSec = null;
    sensorState.flowRateLpm = 0.0;
  } else {
    sensorState.flowRateLpm = 0.8;
  }

  res.json({
    success: true,
    message: state ? 'Pump started' : 'Pump stopped',
    actuators: actuatorState
  });
});

// 6. POST Zones Solenoid Valves
app.post('/api/control/zones', (req, res) => {
  const { zone1, zone2, source = 'web' } = req.body;

  if (!actuatorState.pumpOn && (zone1 || zone2)) {
    return res.status(400).json({
      success: false,
      error: 'Cannot open zone valves while master pump is OFF. Start pump first.'
    });
  }

  if (typeof zone1 === 'boolean') actuatorState.zone1On = zone1;
  if (typeof zone2 === 'boolean') actuatorState.zone2On = zone2;

  actuatorState.lastCommandTimestamp = new Date().toISOString();
  actuatorState.commandSource = source;

  // Calculate flow rate
  if (actuatorState.pumpOn) {
    if (actuatorState.zone1On && actuatorState.zone2On) sensorState.flowRateLpm = 24.5;
    else if (actuatorState.zone1On) sensorState.flowRateLpm = 14.2;
    else if (actuatorState.zone2On) sensorState.flowRateLpm = 11.8;
    else sensorState.flowRateLpm = 0.8;
  }

  res.json({
    success: true,
    message: 'Zone valves updated',
    actuators: actuatorState
  });
});

// 7. POST Auto-mode Switch
app.post('/api/control/automode', (req, res) => {
  const { autoMode } = req.body;
  actuatorState.autoMode = Boolean(autoMode);
  res.json({
    success: true,
    autoMode: actuatorState.autoMode
  });
});

// ================= VITE DEV MIDDLEWARE / STATIC FILES ================= //

async function startServer() {
  if (!isProduction) {
    // In dev: mount Vite dev server as middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production: serve dist folder
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Smart Farm Server] Listening on port ${PORT} (http://0.0.0.0:${PORT})`);
  });
}

startServer();
