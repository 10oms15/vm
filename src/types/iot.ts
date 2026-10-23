/**
 * Smart Farm IoT & Sensor API Types
 * Provides standardized data contracts for hardware gateways, ESP32, and cloud APIs.
 */

export interface SensorTelemetryPayload {
  deviceId?: string;
  timestamp?: string; // ISO string or epoch ms
  
  // Zone 1: Capacitive Soil Moisture
  zone1MoisturePercent?: number; // 0 - 100%
  zone1RawAdc?: number; // Raw ADC 0 - 4095

  // Zone 2: Watermark 200SS Soil Tension
  zone2TensionKpa?: number; // 0 - 100 kPa
  zone2RawOhms?: number; // Resistance in Ohms

  // Water Tank
  tankLevelPercent?: number; // 0 - 100%
  tankDistanceCm?: number; // Distance from ultrasonic sensor (cm)
  tankVolumeLiters?: number; // 0 - 5000 L

  // Weather Station SenseCAP 5700-B
  temperatureC?: number; // Celsius
  humidityPercent?: number; // % RH
  solarRadiationWm2?: number; // W/m²
  windSpeedMs?: number; // m/s
  rainfallMm?: number; // mm
  barometricPressureHpa?: number; // hPa

  // Flow Meter YF-S201
  flowRateLpm?: number; // Liters per minute
  flowPulseFreqHz?: number; // Pulse frequency in Hz
  totalVolumePumpedL?: number; // Liters total accumulated
}

export interface ActuatorControlState {
  pumpOn: boolean;
  zone1On: boolean;
  zone2On: boolean;
  autoMode: boolean;
  timerRemainingSec: number | null;
  lastCommandTimestamp: string;
  commandSource: 'web' | 'hardware' | 'auto-pilot';
}

export interface SystemStatusResponse {
  success: boolean;
  version: string;
  timestamp: string;
  sensors: SensorTelemetryPayload;
  actuators: ActuatorControlState;
  agronomyAlerts: string[];
}
