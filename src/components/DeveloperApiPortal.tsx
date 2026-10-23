import React, { useState } from 'react';
import { Terminal, Code2, Copy, Check, Send, Globe, Server, Cpu, ExternalLink, Sparkles } from 'lucide-react';
import { pushSensorTelemetry, getApiBaseUrl, setCustomApiBaseUrl } from '../services/apiService';

interface DeveloperApiPortalProps {
  onRefreshData: () => void;
  showToast: (msg: string) => void;
}

export const DeveloperApiPortal: React.FC<DeveloperApiPortalProps> = ({
  onRefreshData,
  showToast
}) => {
  const [activeCodeTab, setActiveCodeTab] = useState<'curl' | 'esp32' | 'python' | 'json'>('curl');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Custom API configuration
  const [customUrl, setCustomUrl] = useState<string>(getApiBaseUrl());
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);

  // Test payload values
  const [testMoisture, setTestMoisture] = useState<number>(72);
  const [testTension, setTestTension] = useState<number>(28);
  const [testTankLevel, setTestTankLevel] = useState<number>(90);
  const [testTemp, setTestTemp] = useState<number>(33.1);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast('คัดลอกโค้ดลงคลิปบอร์ดแล้ว!');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSaveApiUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiBaseUrl(customUrl);
    showToast(customUrl ? `บันทึก Base URL: ${customUrl}` : 'ใช้ Default Same-Origin Express API');
  };

  const handleSendTestPayload = async () => {
    setIsSendingTest(true);
    const success = await pushSensorTelemetry({
      deviceId: 'TEST-DEV-CLIENT-01',
      zone1MoisturePercent: testMoisture,
      zone2TensionKpa: testTension,
      tankLevelPercent: testTankLevel,
      temperatureC: testTemp,
      humidityPercent: 58,
      timestamp: new Date().toISOString()
    });

    setIsSendingTest(false);
    if (success) {
      showToast('✅ ส่งข้อมูลผ่าน POST /api/sensors/telemetry สำเร็จ! แดชบอร์ดอัปเดตแล้ว');
      onRefreshData();
    } else {
      showToast('❌ ไม่สามารถส่งข้อมูลได้ โปรดตรวจสอบว่าเซิร์ฟเวอร์รันอยู่');
    }
  };

  const currentHost = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';

  // Code snippets for friends
  const curlCode = `# 1. ส่งข้อมูลความชื้นและสภาพอากาศจากเซ็นเซอร์ (POST Telemetry)
curl -X POST ${currentHost}/api/sensors/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{
    "deviceId": "ESP32-PLOT-01",
    "zone1MoisturePercent": 68.5,
    "zone2TensionKpa": 35.0,
    "tankLevelPercent": 88,
    "temperatureC": 31.8,
    "humidityPercent": 62
  }'

# 2. หรือส่งค่าดิบ Raw ADC (ระบบจะแปลงสูตร Calibration ให้อัตโนมัติ)
curl -X POST ${currentHost}/api/sensors/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{
    "zone1RawAdc": 1750,
    "zone2RawOhms": 2800,
    "tankDistanceCm": 25
  }'

# 3. สั่งเปิด/ปิดปั๊มน้ำผ่าน API (Actuator Control)
curl -X POST ${currentHost}/api/control/pump \\
  -H "Content-Type: application/json" \\
  -d '{"state": true}'`;

  const esp32Code = `// ตัวอย่างโค้ด Arduino / ESP32 ส่งข้อมูลเซ็นเซอร์เข้า Smart Farm API
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "${currentHost}/api/sensors/telemetry";

const int SOIL_ADC_PIN = 34; // DFRobot Capacitive Sensor

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi Connected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    int rawAdc = analogRead(SOIL_ADC_PIN);
    
    // สร้าง JSON Payload
    StaticJsonDocument<256> doc;
    doc["deviceId"] = "ESP32_ZONE_1";
    doc["zone1RawAdc"] = rawAdc; // ส่งค่าดิบให้ Server แปลงให้
    doc["temperatureC"] = 32.5;

    String jsonString;
    serializeJson(doc, jsonString);

    int httpCode = http.POST(jsonString);
    Serial.printf("POST Response Code: %d\\n", httpCode);
    http.end();
  }
  delay(10000); // ส่งทุก 10 วินาที
}`;

  const pythonCode = `# ตัวอย่าง Python สำหรับ Raspberry Pi หรือคอมพิวเตอร์ที่ต่อ RS-485 Modbus
import requests
import time

API_URL = "${currentHost}/api/sensors/telemetry"

def send_sensor_data():
    payload = {
        "deviceId": "RPI-MODBUS-GW",
        "zone1MoisturePercent": 64.2,
        "zone2TensionKpa": 38.0,
        "tankLevelPercent": 85.0,
        "temperatureC": 32.1,
        "flowRateLpm": 14.5
    }
    try:
        response = requests.post(API_URL, json=payload, timeout=5)
        print("Status:", response.status_code, response.json())
    except Exception as e:
        print("Error sending telemetry:", e)

if __name__ == "__main__":
    while True:
        send_sensor_data()
        time.sleep(10)`;

  const jsonSchemaCode = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "SensorTelemetryPayload",
  "type": "object",
  "properties": {
    "deviceId": { "type": "string", "example": "NODE-01" },
    "zone1MoisturePercent": { "type": "number", "minimum": 0, "maximum": 100 },
    "zone1RawAdc": { "type": "integer", "description": "Raw ADC 0-4095" },
    "zone2TensionKpa": { "type": "number", "description": "Soil Tension kPa" },
    "zone2RawOhms": { "type": "number", "description": "Watermark resistance" },
    "tankLevelPercent": { "type": "number", "minimum": 0, "maximum": 100 },
    "temperatureC": { "type": "number", "example": 32.4 },
    "humidityPercent": { "type": "number", "example": 60 }
  }
}`;

  return (
    <div className="space-y-8">
      
      {/* Title & Introduction */}
      <div className="liquid-glass-card p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Code2 className="w-3.5 h-3.5" />
          <span>ระบบเชื่อมต่อ API ฮาร์ดแวร์จริง (IoT Developer & Team Integration)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          พร้อมให้เพื่อนร่วมทีมนำไปพัฒนาต่อ & เพิ่ม API เซ็นเซอร์ได้ทันที
        </h2>
        <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
          ระบบมี <strong>Express REST API แบบ Full-Stack</strong> ในตัว พร้อมให้เชื่อมต่อกับไมโครคอนโทรลเลอร์จริง (ESP32, Arduino, NodeMCU), LoRaWAN Gateway, Modbus RS-485, หรือเซิร์ฟเวอร์ภายนอก สามารถส่งข้อมูลเข้ามาอัปเดตหน้าเว็บได้แบบเรียลไทม์
        </p>
      </div>

      {/* SECTION 1: Test Push Sandbox (Send Real HTTP Request to Backend) */}
      <div className="liquid-glass-card p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Send className="w-5 h-5 text-emerald-600" />
              <span>ทดสอบส่งข้อมูลผ่าน API จริง (Live API Test Push)</span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              กดปุ่มด้านล่างเพื่อส่งข้อมูล JSON เข้า <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-800">POST /api/sensors/telemetry</code> บนเซิร์ฟเวอร์จริง
            </p>
          </div>

          <button
            onClick={handleSendTestPayload}
            disabled={isSendingTest}
            className="py-2.5 px-5 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0 self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-emerald-200" />
            <span>{isSendingTest ? 'กำลังส่งข้อมูล...' : 'ยิงข้อมูลจำลองเข้า API (Send POST)'}</span>
          </button>
        </div>

        {/* Sliders for Test Payload */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-white/70 border border-neutral-200">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">ความชื้นโซน 1:</span>
              <span className="font-mono font-bold text-emerald-800">{testMoisture}%</span>
            </div>
            <input
              type="range"
              min="20"
              max="95"
              value={testMoisture}
              onChange={(e) => setTestMoisture(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">แรงดึงดินโซน 2:</span>
              <span className="font-mono font-bold text-teal-800">{testTension} kPa</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={testTension}
              onChange={(e) => setTestTension(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">ระดับน้ำในถัง:</span>
              <span className="font-mono font-bold text-sky-800">{testTankLevel}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              value={testTankLevel}
              onChange={(e) => setTestTankLevel(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-neutral-600">อุณหภูมิอากาศ:</span>
              <span className="font-mono font-bold text-amber-800">{testTemp}°C</span>
            </div>
            <input
              type="range"
              min="20"
              max="42"
              step="0.5"
              value={testTemp}
              onChange={(e) => setTestTemp(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Config Custom API Base URL Form */}
        <form onSubmit={handleSaveApiUrl} className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1">
            <label className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider block mb-1">
              ปรับเปลี่ยน Base URL ปลายทาง (หากเพื่อนต้องการชี้ไปเซิร์ฟเวอร์หรือ Gateway อื่น):
            </label>
            <input
              type="text"
              placeholder={`ค่าปัจจุบัน: ${currentHost} (เว้นว่างไว้เพื่อใช้ Same-Origin Server)`}
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="py-2 px-4 rounded-xl font-semibold text-xs bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-300 shadow-2xs self-end"
          >
            บันทึก URL
          </button>
        </form>
      </div>

      {/* SECTION 2: Ready-to-use Code Snippets for Teammates */}
      <div className="liquid-glass-card p-6 sm:p-7 space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-3">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-600" />
              <span>โค้ดตัวอย่างพร้อมคัดลอกไปใช้ในฮาร์ดแวร์ (Ready-to-Flash Code)</span>
            </h3>
            <p className="text-xs text-neutral-500">เลือกภาษาที่เพื่อนใช้งานเพื่อดูตัวอย่างการเรียก API</p>
          </div>

          {/* Code Tabs */}
          <div className="flex items-center gap-1.5 bg-neutral-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveCodeTab('curl')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCodeTab === 'curl' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'
              }`}
            >
              cURL / HTTP
            </button>
            <button
              onClick={() => setActiveCodeTab('esp32')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCodeTab === 'esp32' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'
              }`}
            >
              ESP32 (Arduino C++)
            </button>
            <button
              onClick={() => setActiveCodeTab('python')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCodeTab === 'python' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'
              }`}
            >
              Python / RPi
            </button>
            <button
              onClick={() => setActiveCodeTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCodeTab === 'json' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'
              }`}
            >
              JSON Schema
            </button>
          </div>
        </div>

        {/* Code Viewer Container */}
        <div className="relative rounded-2xl bg-neutral-950 text-neutral-100 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-neutral-800">
          <div className="flex justify-between items-center pb-3 mb-3 border-b border-neutral-800 text-neutral-400 text-[11px]">
            <span>
              {activeCodeTab === 'curl' ? 'Terminal Command (cURL)' :
               activeCodeTab === 'esp32' ? 'sketch.ino (Arduino IDE for ESP32)' :
               activeCodeTab === 'python' ? 'telemetry_sender.py' : 'payload_schema.json'}
            </span>
            <button
              onClick={() => {
                const text = activeCodeTab === 'curl' ? curlCode :
                             activeCodeTab === 'esp32' ? esp32Code :
                             activeCodeTab === 'python' ? pythonCode : jsonSchemaCode;
                handleCopy(text, activeCodeTab);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer text-xs"
            >
              {copiedKey === activeCodeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอกโค้ด</span>
                </>
              )}
            </button>
          </div>

          <pre className="leading-relaxed whitespace-pre font-mono text-emerald-400 selection:bg-emerald-900">
            {activeCodeTab === 'curl' && curlCode}
            {activeCodeTab === 'esp32' && esp32Code}
            {activeCodeTab === 'python' && pythonCode}
            {activeCodeTab === 'json' && jsonSchemaCode}
          </pre>
        </div>

      </div>

      {/* SECTION 3: Summary of API Endpoints for Teammates */}
      <div className="liquid-glass-card p-6 sm:p-7 space-y-4">
        <h3 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
          <Server className="w-5 h-5 text-emerald-600" />
          <span>ตารางสรุป REST API ทั้งหมดในโปรเจกต์</span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                <th className="py-2.5 px-3">Method</th>
                <th className="py-2.5 px-3">Endpoint Path</th>
                <th className="py-2.5 px-4">หน้าที่และการใช้งาน</th>
                <th className="py-2.5 px-3">ตัวอย่างข้อมูล Body</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/70 bg-white/60 font-mono text-[11px]">
              <tr>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">POST</span></td>
                <td className="py-2.5 px-3 text-neutral-900 font-bold">/api/sensors/telemetry</td>
                <td className="py-2.5 px-4 font-sans text-neutral-700">ส่งค่าเซ็นเซอร์ (ความชื้น, แรงดึงดิน, ถังน้ำ, อุณหภูมิ, Flow)</td>
                <td className="py-2.5 px-3 text-neutral-500">{`{ zone1MoisturePercent: 65, ... }`}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">GET</span></td>
                <td className="py-2.5 px-3 text-neutral-900 font-bold">/api/sensors/latest</td>
                <td className="py-2.5 px-4 font-sans text-neutral-700">ดึงค่าสถานะเซ็นเซอร์ล่าสุดทั้งหมด</td>
                <td className="py-2.5 px-3 text-neutral-500">None</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">POST</span></td>
                <td className="py-2.5 px-3 text-neutral-900 font-bold">/api/control/pump</td>
                <td className="py-2.5 px-4 font-sans text-neutral-700">สั่งเปิด/ปิดปั๊มน้ำหลัก</td>
                <td className="py-2.5 px-3 text-neutral-500">{`{ state: true }`}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">POST</span></td>
                <td className="py-2.5 px-3 text-neutral-900 font-bold">/api/control/zones</td>
                <td className="py-2.5 px-4 font-sans text-neutral-700">สั่งเปิด/ปิดวาล์วโซน 1 และ 2</td>
                <td className="py-2.5 px-3 text-neutral-500">{`{ zone1: true, zone2: false }`}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">GET</span></td>
                <td className="py-2.5 px-3 text-neutral-900 font-bold">/api/health</td>
                <td className="py-2.5 px-4 font-sans text-neutral-700">เช็คสถานะการทำงานของเซิร์ฟเวอร์ (Uptime)</td>
                <td className="py-2.5 px-3 text-neutral-500">None</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
