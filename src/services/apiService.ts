import { SensorTelemetryPayload, ActuatorControlState } from '../types/iot';

/**
 * Smart Farm API Client Service
 * Connects frontend UI to Express backend API or custom IoT Gateways.
 */

// Default to same-origin relative URL, or allows user to specify custom gateway URL
let customApiBaseUrl: string = '';

export const setCustomApiBaseUrl = (url: string) => {
  customApiBaseUrl = url.trim().replace(/\/+$/, '');
};

export const getApiBaseUrl = (): string => {
  return customApiBaseUrl || '';
};

// 1. Fetch Latest Telemetry from Backend
export async function fetchLatestSensors(): Promise<{
  sensors: SensorTelemetryPayload;
  actuators: ActuatorControlState;
} | null> {
  try {
    const url = `${getApiBaseUrl()}/api/sensors/latest`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return {
      sensors: data.sensors,
      actuators: data.actuators
    };
  } catch (err) {
    console.warn('[API Service] Failed to fetch latest sensors:', err);
    return null;
  }
}

// 2. Post Telemetry Data (Used by test button or custom hardware client)
export async function pushSensorTelemetry(
  payload: SensorTelemetryPayload
): Promise<boolean> {
  try {
    const url = `${getApiBaseUrl()}/api/sensors/telemetry`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error('[API Service] Failed to push telemetry:', err);
    return false;
  }
}

// 3. Post Pump Control
export async function setPumpState(state: boolean): Promise<boolean> {
  try {
    const url = `${getApiBaseUrl()}/api/control/pump`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ state, source: 'web' })
    });
    return res.ok;
  } catch (err) {
    console.error('[API Service] Failed to set pump state:', err);
    return false;
  }
}

// 4. Post Zones Control
export async function setZoneValves(zone1?: boolean, zone2?: boolean): Promise<boolean> {
  try {
    const url = `${getApiBaseUrl()}/api/control/zones`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ zone1, zone2, source: 'web' })
    });
    return res.ok;
  } catch (err) {
    console.error('[API Service] Failed to set zone valves:', err);
    return false;
  }
}

// 5. Post Auto-Mode
export async function setAutoModeState(autoMode: boolean): Promise<boolean> {
  try {
    const url = `${getApiBaseUrl()}/api/control/automode`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ autoMode })
    });
    return res.ok;
  } catch (err) {
    console.error('[API Service] Failed to set auto-mode:', err);
    return false;
  }
}
