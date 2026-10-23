# Smart Farm AgroFlow Hub - Developer & API Integration Guide 🌾

คู่มือสำหรับเพื่อนร่วมทีมและนักพัฒนา (IoT Developers & Hardware Engineers) ในการนำโปรเจกต์นี้ไปพัฒนาต่อ และเชื่อมต่อเซ็นเซอร์จริงผ่าน REST API

---

## 1. วิธีรันโปรเจกต์ (Quickstart)

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. รันในโหมด Development (Full-Stack Express + Vite)
npm run dev

# 3. หรือ Build และรันในโหมด Production
npm run build
npm start
```
เซิร์ฟเวอร์จะเปิดทำงานที่ `http://localhost:3000` โดยมีทั้ง:
- **Frontend SPA (React + Tailwind CSS v4 + Framer Motion)**
- **Backend API (Express REST Endpoints)** พร้อมรับข้อมูลจากบอร์ดไมโครคอนโทรลเลอร์

---

## 2. โครงสร้างโปรเจกต์ (Project Architecture)

```text
├── server.ts                   # Express Backend Entry Point & REST API Endpoints
├── src/
│   ├── types/
│   │   └── iot.ts              # TypeScript Data Contracts สำหรับ Sensors & Actuators
│   ├── services/
│   │   └── apiService.ts       # Client API Service สำหรับยิง Request ไปยังเซิร์ฟเวอร์
│   ├── data/
│   │   └── agronomyData.ts     # ฐานข้อมูลพืช 16 ชนิด, ค่า Kc, สภาพอากาศ EP ลาดกระบัง, และผลแล็บดิน
│   ├── components/
│   │   ├── HeaderNav.tsx           # แถบเมนูด้านบน (3-zone top bar contract)
│   │   ├── LiquidWaterControl.tsx  # แดชบอร์ดและสวิตช์ปั๊มน้ำ 3D Liquid Glass
│   │   ├── LiveSensorCards.tsx     # การ์ดแสดงผลเซ็นเซอร์ Real-time และกราฟ
│   │   ├── AgronomyCalculator.tsx  # เครื่องคำนวณความต้องการน้ำตามหลัก FAO-56
│   │   ├── SoilAndCropsKnowledge.tsx# ข้อมูลดินเหนียว และตารางพืช 16 ชนิด
│   │   ├── DataPipelineGuide.tsx   # คู่มือการแปลงข้อมูลดิบ (Calibration Sandbox)
│   │   └── DeveloperApiPortal.tsx  # หน้าระบบเชื่อมต่อ API & โค้ดตัวอย่างในตัวเว็บ
│   ├── App.tsx                 # Main React Application & State Synchronizer
│   └── index.css               # สไตล์ Liquid Glass และ Fluid Animations
```

---

## 3. สรุป REST API Endpoints

### 3.1 ส่งข้อมูลเซ็นเซอร์ (POST `/api/sensors/telemetry`)
ฮาร์ดแวร์ (ESP32, Raspberry Pi, LoRa Gateway หรือ Node-RED) สามารถส่งข้อมูล JSON เข้ามาได้:

#### แบบที่ 1: ส่งค่าที่แปลงแล้ว (Physical Units)
```bash
curl -X POST http://localhost:3000/api/sensors/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "ESP32-STATION-01",
    "zone1MoisturePercent": 65.5,
    "zone2TensionKpa": 38.0,
    "tankLevelPercent": 85.0,
    "temperatureC": 32.4,
    "humidityPercent": 60,
    "flowRateLpm": 14.2
  }'
```

#### แบบที่ 2: ส่งค่าดิบทางไฟฟ้า (Raw Data)
ระบบมีฟังก์ชัน Auto-calibration บนเซิร์ฟเวอร์ ช่วยแปลงค่าให้อัตโนมัติ:
```bash
curl -X POST http://localhost:3000/api/sensors/telemetry \
  -H "Content-Type: application/json" \
  -d '{
    "zone1RawAdc": 1850,
    "zone2RawOhms": 3200,
    "tankDistanceCm": 30
  }'
```

### 3.2 ดึงข้อมูลเซ็นเซอร์ล่าสุด (GET `/api/sensors/latest`)
```bash
curl -X GET http://localhost:3000/api/sensors/latest
```
Response:
```json
{
  "success": true,
  "sensors": {
    "zone1MoisturePercent": 65.5,
    "zone2TensionKpa": 38.0,
    "tankLevelPercent": 85.0,
    "temperatureC": 32.4
  },
  "actuators": {
    "pumpOn": false,
    "zone1On": false,
    "zone2On": false
  }
}
```

### 3.3 สั่งงานปั๊มน้ำ (POST `/api/control/pump`)
```bash
curl -X POST http://localhost:3000/api/control/pump \
  -H "Content-Type: application/json" \
  -d '{"state": true}'
```

### 3.4 สั่งเปิด/ปิดวาล์วโซน 1 และ 2 (POST `/api/control/zones`)
```bash
curl -X POST http://localhost:3000/api/control/zones \
  -H "Content-Type: application/json" \
  -d '{"zone1": true, "zone2": false}'
```

---

## 4. วิธีเพิ่มเซ็นเซอร์ตัวใหม่ (How to Add New Sensors)

หากเพื่อนต้องการเพิ่มเซ็นเซอร์ใหม่ เช่น **EC/NPK, pH ดิน หรือ อุณหภูมิดิน (Soil Temp)**:

1. **เพิ่ม Type ใน `src/types/iot.ts`**:
   ```typescript
   export interface SensorTelemetryPayload {
     // ... ค่าเดิม ...
     soilEcUsm?: number;       // ค่า EC ดิน (µS/cm)
     soilPh?: number;          // ค่ากรดด่าง pH
     soilTemperatureC?: number;// อุณหภูมิดิน °C
   }
   ```

2. **เพิ่มตัวแปรใน `server.ts`**:
   - เพิ่มค่าเริ่มต้นใน `sensorState`
   - เพิ่มตรรกะใน `app.post('/api/sensors/telemetry')`

3. **แสดงผลบนหน้าจอ**:
   - นำค่าจาก `sensorState` ไปแสดงบนการ์ดใน `src/components/LiveSensorCards.tsx`

---

## 5. ตัวอย่างโค้ด ESP32 (Arduino C++)

```cpp
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASS";
const char* serverUrl = "http://YOUR_SERVER_IP:3000/api/sensors/telemetry";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi Connected!");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    int rawAdc = analogRead(34); // เซ็นเซอร์ความชื้น Capacitive

    StaticJsonDocument<256> doc;
    doc["deviceId"] = "ESP32_NODE_01";
    doc["zone1RawAdc"] = rawAdc;
    doc["temperatureC"] = 32.5;

    String payload;
    serializeJson(doc, payload);

    int httpCode = http.POST(payload);
    Serial.printf("Response: %d\n", httpCode);
    http.end();
  }
  delay(5000); // ส่งทุก 5 วินาที
}
```
