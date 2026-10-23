import React from 'react';
import { Thermometer, Sun, Wind, Droplet, Sprout, Trees, Cylinder } from 'lucide-react';
import { WEATHER_EP_MONTHS } from '../data/agronomyData';

interface LiveSensorCardsProps {
  zone1Moisture: number;
  zone2Tension: number;
  tankLevelPercent: number;
  temperatureC: number;
  humidityPercent: number;
  moistureHistory: number[];
}

export const LiveSensorCards: React.FC<LiveSensorCardsProps> = ({
  zone1Moisture,
  zone2Tension,
  tankLevelPercent,
  temperatureC,
  humidityPercent,
  moistureHistory
}) => {
  // Current month (October) ETo data
  const octWeather = WEATHER_EP_MONTHS.find(m => m.monthNum === 10) || WEATHER_EP_MONTHS[9];
  const tankCapacityLiters = 5000;
  const currentTankLiters = Math.round((tankLevelPercent / 100) * tankCapacityLiters);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      
      {/* CARD 1: Weather Station & ETo */}
      <div className="liquid-glass-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              สภาพอากาศสถานีลาดกระบัง
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4 text-amber-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-mono tabular-nums">
              {temperatureC.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-neutral-500">°C</span>
            <span className="text-sm font-mono text-neutral-600 ml-2">
              RH {humidityPercent}%
            </span>
          </div>

          <p className="text-xs text-neutral-600">
            สถานี SenseCAP 5700-B
          </p>
        </div>

        {/* Calculated ETo display */}
        <div className="mt-4 pt-3 border-t border-neutral-900/5 space-y-1.5 text-xs">
          <div className="flex justify-between items-center text-neutral-600">
            <span>ถาดระเหย (EP ต.ค.):</span>
            <span className="font-mono font-semibold text-neutral-900">{octWeather.ep} มม./วัน</span>
          </div>
          <div className="flex justify-between items-center text-neutral-600">
            <span>สัมประสิทธิ์ (Kp):</span>
            <span className="font-mono font-semibold text-neutral-900">{octWeather.kp}</span>
          </div>
          <div className="flex justify-between items-center bg-amber-50/80 p-2 rounded-lg border border-amber-200/60 font-medium text-amber-950">
            <span>ค่าระเหยอ้างอิง (ETo):</span>
            <span className="font-mono font-bold text-amber-800 text-sm">{octWeather.eto} มม./วัน</span>
          </div>
        </div>
      </div>

      {/* CARD 2: Zone 1 Moisture (Capacitive DFRobot) */}
      <div className="liquid-glass-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              โซน 1 · ไม้กระถาง & ผัก
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Sprout className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-mono tabular-nums">
              {zone1Moisture}
            </span>
            <span className="text-xl font-medium text-neutral-500">%</span>
          </div>

          <p className="text-xs text-neutral-600">
            Capacitive Soil Sensor (LoRaWAN)
          </p>
        </div>

        {/* Moisture mini bar & status */}
        <div className="mt-4 pt-3 border-t border-neutral-900/5 space-y-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>ระดับความชื้นสัมพัทธ์</span>
              <span className="font-medium text-emerald-800">เป้าหมาย 41-50%</span>
            </div>
            <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  zone1Moisture < 41 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(zone1Moisture, 100)}%` }}
              />
            </div>
          </div>

          {/* Simple Sparkline */}
          <div className="h-6 flex items-end gap-1 px-1">
            {moistureHistory.map((val, idx) => {
              const heightPct = Math.max(20, Math.min(100, ((val - 35) / 45) * 100));
              return (
                <div
                  key={idx}
                  className="flex-1 bg-emerald-400/40 rounded-t-xs hover:bg-emerald-500 transition-colors"
                  style={{ height: `${heightPct}%` }}
                  title={`${val}%`}
                />
              );
            })}
          </div>

          <div className="text-[11px] font-medium text-emerald-800 bg-emerald-50 p-1.5 rounded-lg border border-emerald-200/60 text-center">
            {zone1Moisture >= 41 && zone1Moisture <= 65
              ? '✅ ดินชุ่มชื้นเหมาะสม ไม่ต้องรดน้ำ'
              : zone1Moisture < 41
              ? '⚠️ ดินเริ่มแห้ง แนะนำเปิดรดน้ำ'
              : '💧 ดินมีความชื้นสะสมสูง'}
          </div>
        </div>
      </div>

      {/* CARD 3: Zone 2 Soil Tension (Watermark 200SS) */}
      <div className="liquid-glass-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              โซน 2 · ไม้ผล & ไม้ยืนต้น
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Trees className="w-4 h-4 text-teal-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-mono tabular-nums">
              {zone2Tension}
            </span>
            <span className="text-lg font-medium text-neutral-500">kPa</span>
          </div>

          <p className="text-xs text-neutral-600">
            Watermark 200SS (แรงดึงน้ำในดิน)
          </p>
        </div>

        {/* Tension explanation */}
        <div className="mt-4 pt-3 border-t border-neutral-900/5 space-y-2 text-xs">
          <div className="flex justify-between items-center text-neutral-600">
            <span>ระดับความตึงเครียดราก:</span>
            <span className="font-mono font-semibold text-neutral-900">
              {zone2Tension > 50 ? 'แห้งมาก' : zone2Tension > 35 ? 'เริ่มขาดน้ำ' : 'สบายดี'}
            </span>
          </div>

          <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                zone2Tension > 40 ? 'bg-amber-500' : 'bg-teal-500'
              }`}
              style={{ width: `${Math.min((zone2Tension / 80) * 100, 100)}%` }}
            />
          </div>

          <div className="text-[11px] text-neutral-500 flex justify-between">
            <span>0-10: ดินแฉะ</span>
            <span>10-30: เหมาะสม</span>
            <span>&gt;40: ควรรด</span>
          </div>

          <div className={`text-[11px] font-medium p-1.5 rounded-lg border text-center ${
            zone2Tension > 40
              ? 'bg-amber-50 text-amber-900 border-amber-200'
              : 'bg-teal-50 text-teal-900 border-teal-200'
          }`}>
            {zone2Tension > 40 ? '⚠️ พืชเริ่มเครียด ควรเปิดน้ำ' : '✅ ระบบรากดูดซับน้ำปกติ'}
          </div>
        </div>
      </div>

      {/* CARD 4: Water Tank Reserve (Ultrasonic Sensor) */}
      <div className="liquid-glass-card p-5 sm:p-6 flex flex-col justify-between relative overflow-hidden group">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              ถังสำรองน้ำต้นทุน
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <Cylinder className="w-4 h-4 text-sky-600" />
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 font-mono tabular-nums">
              {tankLevelPercent}
            </span>
            <span className="text-xl font-medium text-neutral-500">%</span>
            <span className="text-xs text-neutral-600 font-mono ml-2">
              ({currentTankLiters.toLocaleString()} L)
            </span>
          </div>

          <p className="text-xs text-neutral-600">
            เซ็นเซอร์วัดระยะ Ultrasonic (Laser)
          </p>
        </div>

        {/* Liquid Water Tank visualizer */}
        <div className="mt-4 pt-3 border-t border-neutral-900/5 space-y-2">
          <div className="relative h-12 w-full bg-sky-100/60 rounded-xl overflow-hidden border border-sky-200/80">
            <div
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-sky-500 to-cyan-400 transition-all duration-700"
              style={{ height: `${tankLevelPercent}%` }}
            >
              <div className="w-full h-2 bg-white/30 backdrop-blur-xs opacity-75" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-sky-950/80 drop-shadow-xs font-mono">
                {currentTankLiters.toLocaleString()} / {tankCapacityLiters.toLocaleString()} ลิตร
              </span>
            </div>
          </div>

          <div className="text-[11px] font-medium text-sky-900 bg-sky-50 p-1.5 rounded-lg border border-sky-200/60 text-center">
            {tankLevelPercent > 40
              ? '💧 ปริมาณน้ำเพียงพอต่อการรดน้ำทั้งวัน'
              : tankLevelPercent > 15
              ? '⚠️ น้ำเริ่มปานกลาง เฝ้าระวัง'
              : '🚨 น้ำเหลือน้อยมาก ระบบตัดการทำงาน'}
          </div>
        </div>
      </div>

    </div>
  );
};
