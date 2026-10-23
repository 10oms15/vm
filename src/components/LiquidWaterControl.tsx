import React, { useState } from 'react';
import { Power, Droplets, Clock, AlertTriangle, ShieldCheck, Gauge, Waves, Flower2, TreePine, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiquidWaterControlProps {
  isPumpOn: boolean;
  isZone1On: boolean;
  isZone2On: boolean;
  isAutoMode: boolean;
  flowRateLpm: number;
  totalVolumePumpedL: number;
  tankLevelPercent: number;
  zone1Moisture: number;
  zone2Tension: number;
  onTogglePump: () => void;
  onToggleZone1: () => void;
  onToggleZone2: () => void;
  onToggleAutoMode: () => void;
  onSetTimerMinutes: (mins: number) => void;
  activeTimerRemainingSec: number | null;
}

export const LiquidWaterControl: React.FC<LiquidWaterControlProps> = ({
  isPumpOn,
  isZone1On,
  isZone2On,
  isAutoMode,
  flowRateLpm,
  totalVolumePumpedL,
  tankLevelPercent,
  zone1Moisture,
  zone2Tension,
  onTogglePump,
  onToggleZone1,
  onToggleZone2,
  onToggleAutoMode,
  onSetTimerMinutes,
  activeTimerRemainingSec
}) => {
  const [selectedQuickTimer, setSelectedQuickTimer] = useState<number | null>(null);

  // Status helper in everyday plain Thai
  const getOverallStatusMessage = () => {
    if (tankLevelPercent <= 15) {
      return {
        text: 'เตือน: น้ำในถังพักเหลือน้อยเกินไป (<15%) ระบบล็อคเพื่อป้องกันปั๊มไหม้',
        tone: 'danger'
      };
    }
    if (isPumpOn) {
      if (isZone1On && isZone2On) {
        return {
          text: 'กำลังจ่ายน้ำพร้อมกันทั้ง 2 โซน: แปลงกระถาง และแปลงไม้ยืนต้น',
          tone: 'active'
        };
      }
      if (isZone1On) {
        return {
          text: 'กำลังรดน้ำแปลงที่ 1 (ไม้กระถาง/ผัก) อัตราการไหลปกติ',
          tone: 'active'
        };
      }
      if (isZone2On) {
        return {
          text: 'กำลังรดน้ำแปลงที่ 2 (ไม้ผล/ไม้ยืนต้น) น้ำซึมสู่ระบบรากลึก',
          tone: 'active'
        };
      }
      return {
        text: 'ปั๊มน้ำหลักเปิดพร้อมทำงานแล้ว โปรดเลือกเปิดวาล์วแปลงที่ 1 หรือ แปลงที่ 2 ในขั้นตอนที่ 2',
        tone: 'warning'
      };
    }
    return {
      text: 'ระบบรดน้ำอยู่ในสถานะเตรียมพร้อม (สแตนด์บาย) ปั๊มและวาล์วปิดสนิท ไม่มีการใช้น้ำ',
      tone: 'normal'
    };
  };

  const status = getOverallStatusMessage();

  const handleTimerClick = (mins: number) => {
    if (selectedQuickTimer === mins && activeTimerRemainingSec !== null) {
      // cancel
      setSelectedQuickTimer(null);
      onSetTimerMinutes(0);
    } else {
      setSelectedQuickTimer(mins);
      onSetTimerMinutes(mins);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Easy Plain Thai Explanation */}
      <div className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
        status.tone === 'active'
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950'
          : status.tone === 'warning'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-950'
          : status.tone === 'danger'
          ? 'bg-rose-500/10 border-rose-500/30 text-rose-950'
          : 'bg-white/60 border-neutral-200/80 text-neutral-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            status.tone === 'active' ? 'bg-emerald-600 text-white animate-pulse' :
            status.tone === 'warning' ? 'bg-amber-500 text-white' :
            status.tone === 'danger' ? 'bg-rose-500 text-white' :
            'bg-neutral-200 text-neutral-700'
          }`}>
            {status.tone === 'active' ? <Droplets className="w-5 h-5" /> :
             status.tone === 'danger' ? <AlertTriangle className="w-5 h-5" /> :
             <ShieldCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              สถานะการทำงานปัจจุบัน (Current Status)
            </div>
            <div className="text-sm font-medium mt-0.5">{status.text}</div>
          </div>
        </div>

        {/* Auto Mode Switch */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/50 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs text-neutral-600 flex items-center gap-1 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            ระบบอัตโนมัติ (Auto-Pilot):
          </span>
          <button
            onClick={onToggleAutoMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-hidden ${
              isAutoMode ? 'bg-emerald-600' : 'bg-neutral-300'
            }`}
            title="เปิด/ปิด การรดน้ำอัตโนมัติเมื่อดินแห้งถึงเกณฑ์"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAutoMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Liquid Glass Control Panel */}
      <div className="liquid-glass-card p-6 sm:p-8 space-y-8 relative overflow-hidden">
        
        {/* Subtle decorative water gradient backdrop glow */}
        <div className={`absolute -right-20 -top-20 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${
          isPumpOn ? 'bg-emerald-400/25 opacity-100' : 'bg-teal-200/10 opacity-40'
        }`} />

        {/* STEP 1: Master Pump Button (Big, Prominent, tactile Liquid Glass) */}
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 pb-8 border-b border-emerald-950/10">
          
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-emerald-800 text-xs font-semibold">
              <span>ขั้นตอนที่ 1</span>
              <span>·</span>
              <span>เปิดปั๊มน้ำหลัก (Main Water Pump)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
              สวิตช์ควบคุมปั๊มน้ำกลาง
            </h2>
            <p className="text-sm text-neutral-600 max-w-xl">
              กดปุ่มด้านขวาเพื่อเริ่มเดินเครื่องปั๊มน้ำจากถังพัก 5,000 ลิตร ระบบความปลอดภัยจะตรวจสอบการไหลผ่าน Flow Meter ก่อนส่งน้ำเข้าแปลง
            </p>

            {/* Live Flow Meter Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-white/70 px-3 py-1.5 rounded-lg border border-white/80 shadow-2xs">
                <Gauge className="w-4 h-4 text-emerald-600" />
                <span>อัตราการไหล (Flow Meter):</span>
                <span className="font-mono font-bold text-emerald-700 text-sm tabular-nums">
                  {flowRateLpm.toFixed(1)} L/min
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-neutral-700 bg-white/70 px-3 py-1.5 rounded-lg border border-white/80 shadow-2xs">
                <Waves className="w-4 h-4 text-teal-600" />
                <span>ปริมาณน้ำจ่ายวันนี้:</span>
                <span className="font-mono font-bold text-teal-700 text-sm tabular-nums">
                  {totalVolumePumpedL.toFixed(0)} ลิตร
                </span>
              </div>
            </div>
          </div>

          {/* Liquid Glass Hero Button */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <button
              onClick={onTogglePump}
              aria-label={isPumpOn ? "ปิดปั๊มน้ำหลัก" : "เปิดปั๊มน้ำหลัก"}
              className={`w-48 sm:w-56 h-20 sm:h-24 rounded-2xl flex items-center justify-center gap-3.5 font-bold text-lg sm:text-xl transition-all cursor-pointer select-none ${
                isPumpOn
                  ? 'liquid-btn-active liquid-btn-power ring-4 ring-emerald-400/30'
                  : 'liquid-btn-standby text-neutral-800 hover:text-emerald-900'
              }`}
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-all ${
                isPumpOn ? 'bg-white/20 text-white shadow-inner' : 'bg-neutral-100 text-neutral-500'
              }`}>
                <Power className={`w-6 h-6 sm:w-7 sm:h-7 ${isPumpOn ? 'stroke-[2.5] text-white animate-pulse' : 'stroke-2'}`} />
              </div>
              <div className="text-left">
                <div className="text-[11px] uppercase tracking-wider font-semibold opacity-80">
                  {isPumpOn ? 'ระบบกำลังทำงาน' : 'สถานะหยุดเดินเครื่อง'}
                </div>
                <div className="leading-tight">
                  {isPumpOn ? 'ปิดปั๊มน้ำ (STOP)' : 'เปิดปั๊มน้ำ (START)'}
                </div>
              </div>
            </button>

            {/* Quick countdown indicator if timer set */}
            {activeTimerRemainingSec !== null && isPumpOn && (
              <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300 font-medium">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>จะปิดอัตโนมัติใน:</span>
                <span className="font-mono font-bold">{formatTimer(activeTimerRemainingSec)}</span>
              </div>
            )}
          </div>

        </div>

        {/* STEP 2: 2-Zone Solenoid Valves (Step-by-step unlock) */}
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-300/60 text-teal-900 text-xs font-semibold mb-1">
                <span>ขั้นตอนที่ 2</span>
                <span>·</span>
                <span>เลือกแปลงที่ต้องการรดน้ำ (2 โซนอิสระ)</span>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">
                โซนจ่ายน้ำ (Zone Valves)
              </h3>
            </div>

            {/* Quick Timer Presets */}
            <div className="flex items-center gap-1.5 self-start sm:self-auto">
              <span className="text-xs text-neutral-500 hidden sm:inline mr-1">ตั้งเวลาตัดน้ำ:</span>
              {[5, 10, 15, 20].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleTimerClick(mins)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    selectedQuickTimer === mins && activeTimerRemainingSec !== null
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'bg-white/80 border border-neutral-200 text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {mins} นาที
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Pipeline Diagram (Visualizing Water Flow from Pump to Zones) */}
          <div className="p-3 bg-neutral-900/5 rounded-2xl border border-neutral-900/5">
            <svg viewBox="0 0 600 70" className="w-full h-14 sm:h-16 text-emerald-600">
              {/* Pipe from Pump to splitter */}
              <line
                x1="40"
                y1="35"
                x2="300"
                y2="35"
                stroke={isPumpOn ? "#059669" : "#cbd5e1"}
                strokeWidth="5"
                strokeLinecap="round"
                className={isPumpOn ? "water-pipe-flow" : ""}
              />
              {/* Pipe split to Zone 1 (upper) */}
              <path
                d="M 300 35 L 340 18 L 560 18"
                fill="none"
                stroke={isPumpOn && isZone1On ? "#059669" : "#cbd5e1"}
                strokeWidth="4"
                strokeLinecap="round"
                className={isPumpOn && isZone1On ? "water-pipe-flow" : ""}
              />
              {/* Pipe split to Zone 2 (lower) */}
              <path
                d="M 300 35 L 340 52 L 560 52"
                fill="none"
                stroke={isPumpOn && isZone2On ? "#059669" : "#cbd5e1"}
                strokeWidth="4"
                strokeLinecap="round"
                className={isPumpOn && isZone2On ? "water-pipe-flow" : ""}
              />

              {/* Pump Node */}
              <circle cx="40" cy="35" r="14" fill={isPumpOn ? "#059669" : "#94a3b8"} />
              <text x="40" y="39" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">PUMP</text>

              {/* Splitter Node */}
              <circle cx="300" cy="35" r="7" fill={isPumpOn ? "#10b981" : "#cbd5e1"} />

              {/* Zone 1 Outlet */}
              <circle cx="560" cy="18" r="10" fill={isPumpOn && isZone1On ? "#059669" : "#94a3b8"} />
              <text x="560" y="21" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Z1</text>

              {/* Zone 2 Outlet */}
              <circle cx="560" cy="52" r="10" fill={isPumpOn && isZone2On ? "#059669" : "#94a3b8"} />
              <text x="560" y="55" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">Z2</text>
            </svg>
          </div>

          {/* The 2 Zone Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
            
            {/* Zone 1 Card */}
            <div className={`p-5 rounded-2xl border transition-all relative ${
              isZone1On && isPumpOn
                ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/80 border-emerald-300 shadow-md'
                : 'bg-white/70 border-neutral-200/90'
            }`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Flower2 className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base">โซน 1: สวนไม้กระถาง & ผัก</h4>
                    <p className="text-xs text-neutral-500">เซ็นเซอร์ Capacitive (DFRobot) · ราก 10-30 ซม.</p>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isZone1On && isPumpOn
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                }`}>
                  {isZone1On && isPumpOn ? 'กำลังจ่ายน้ำ' : 'วาล์วปิด'}
                </span>
              </div>

              {/* Moisture status helper */}
              <div className="mb-5 p-3 rounded-xl bg-white/60 border border-white/80 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-600">ความชื้นดินปัจจุบัน:</span>
                  <span className="font-mono font-bold text-emerald-800 text-sm">{zone1Moisture}%</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(zone1Moisture, 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-neutral-500 flex justify-between pt-0.5">
                  <span>เป้าหมายดินเหนียว: 41 - 50%</span>
                  <span className="text-emerald-700 font-medium">
                    {zone1Moisture < 41 ? '⚠️ ดินเริ่มแห้ง' : zone1Moisture > 55 ? '💧 ชื้นเพียงพอ' : '✅ เหมาะสม'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onToggleZone1}
                disabled={!isPumpOn}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  !isPumpOn
                    ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed opacity-70'
                    : isZone1On
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    : 'bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-300 shadow-2xs'
                }`}
              >
                {!isPumpOn ? (
                  <span>กรุณาเปิดปั๊มน้ำก่อน</span>
                ) : isZone1On ? (
                  <>
                    <Droplets className="w-4 h-4 text-white animate-bounce" />
                    <span>กำลังรดน้ำ (แตะเพื่อปิดวาล์ว)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>เริ่มรดน้ำโซน 1 (เปิดวาล์ว)</span>
                  </>
                )}
              </button>
            </div>

            {/* Zone 2 Card */}
            <div className={`p-5 rounded-2xl border transition-all relative ${
              isZone2On && isPumpOn
                ? 'bg-gradient-to-br from-emerald-50/90 to-teal-50/80 border-emerald-300 shadow-md'
                : 'bg-white/70 border-neutral-200/90'
            }`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <TreePine className="w-5 h-5 text-teal-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-neutral-900 text-base">โซน 2: ไม้ผล & ไม้ยืนต้น</h4>
                    <p className="text-xs text-neutral-500">เซ็นเซอร์ Watermark 200SS · รากลึก 1-3 เมตร</p>
                  </div>
                </div>

                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isZone2On && isPumpOn
                    ? 'bg-teal-100 text-teal-800 border-teal-300'
                    : 'bg-neutral-100 text-neutral-600 border-neutral-200'
                }`}>
                  {isZone2On && isPumpOn ? 'กำลังจ่ายน้ำ' : 'วาล์วปิด'}
                </span>
              </div>

              {/* Soil Tension status helper */}
              <div className="mb-5 p-3 rounded-xl bg-white/60 border border-white/80 space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-600">แรงดึงน้ำในดิน (Tension):</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{zone2Tension} kPa</span>
                </div>
                <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      zone2Tension > 40 ? 'bg-amber-500' : 'bg-teal-500'
                    }`}
                    style={{ width: `${Math.min((zone2Tension / 80) * 100, 100)}%` }}
                  />
                </div>
                <div className="text-[11px] text-neutral-500 flex justify-between pt-0.5">
                  <span>เกณฑ์ปกติ: 15 - 35 kPa</span>
                  <span className={zone2Tension > 40 ? 'text-amber-700 font-semibold' : 'text-teal-700 font-medium'}>
                    {zone2Tension > 40 ? '⚠️ พืชเริ่มเครียด ควรให้น้ำ' : '✅ ชุ่มชื้นดี'}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onToggleZone2}
                disabled={!isPumpOn}
                className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  !isPumpOn
                    ? 'bg-neutral-100 text-neutral-400 border border-neutral-200 cursor-not-allowed opacity-70'
                    : isZone2On
                    ? 'bg-teal-700 hover:bg-teal-800 text-white shadow-md'
                    : 'bg-white hover:bg-teal-50 text-teal-950 border border-teal-300 shadow-2xs'
                }`}
              >
                {!isPumpOn ? (
                  <span>กรุณาเปิดปั๊มน้ำก่อน</span>
                ) : isZone2On ? (
                  <>
                    <Droplets className="w-4 h-4 text-white animate-bounce" />
                    <span>กำลังรดน้ำ (แตะเพื่อปิดวาล์ว)</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-teal-700" />
                    <span>เริ่มรดน้ำโซน 2 (เปิดวาล์ว)</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
