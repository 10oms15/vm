import React, { useState, useEffect, useRef } from 'react';
import { HeaderNav } from './components/HeaderNav';
import { LiquidWaterControl } from './components/LiquidWaterControl';
import { LiveSensorCards } from './components/LiveSensorCards';
import { AgronomyCalculator } from './components/AgronomyCalculator';
import { SoilAndCropsKnowledge } from './components/SoilAndCropsKnowledge';
import { DataPipelineGuide } from './components/DataPipelineGuide';
import { DeveloperApiPortal } from './components/DeveloperApiPortal';
import { HistoricalTrends } from './components/HistoricalTrends';
import { fetchLatestSensors, setPumpState, setZoneValves, setAutoModeState } from './services/apiService';
import { Droplet, Leaf, Sprout, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'control' | 'calculator' | 'knowledge' | 'pipeline' | 'api'>('control');
  
  // Hardware States
  const [isPumpOn, setIsPumpOn] = useState<boolean>(false);
  const [isZone1On, setIsZone1On] = useState<boolean>(false);
  const [isZone2On, setIsZone2On] = useState<boolean>(false);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);

  // Sensor Real-time Simulation States
  const [zone1Moisture, setZone1Moisture] = useState<number>(65); // %
  const [zone2Tension, setZone2Tension] = useState<number>(42); // kPa (needs water)
  const [tankLevelPercent, setTankLevelPercent] = useState<number>(85); // %
  const [temperatureC, setTemperatureC] = useState<number>(32.4);
  const [humidityPercent, setHumidityPercent] = useState<number>(60);
  const [totalVolumePumpedL, setTotalVolumePumpedL] = useState<number>(340);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  
  // Timer State
  const [activeTimerRemainingSec, setActiveTimerRemainingSec] = useState<number | null>(null);

  // Moisture history for sparkline
  const [moistureHistory, setMoistureHistory] = useState<number[]>([58, 60, 62, 61, 63, 64, 65]);
  const [lastUpdated, setLastUpdated] = useState<string>('กำลังเชื่อมต่อ...');

  // Toast feedback message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Flow rate calculation based on active valves
  const flowRateLpm = !isPumpOn
    ? 0
    : (isZone1On && isZone2On)
    ? 24.5
    : isZone1On
    ? 14.2
    : isZone2On
    ? 11.8
    : 0.8; // Small recirculation leak/standby if pump on without valves

  // Real-time loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setLastUpdated(
        now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );

      // Decrement Timer if active
      if (activeTimerRemainingSec !== null) {
        if (activeTimerRemainingSec <= 1) {
          // Timer finished
          setActiveTimerRemainingSec(null);
          setIsPumpOn(false);
          setIsZone1On(false);
          setIsZone2On(false);
          showToast('⏰ ตัวตั้งเวลารดน้ำครบกำหนด: ปิดปั๊มน้ำหลักและวาล์วทุกโซนเรียบร้อยแล้ว');
        } else {
          setActiveTimerRemainingSec(prev => (prev !== null ? prev - 1 : null));
        }
      }

      // Physics Simulation
      if (isSimulating) {
        // If pump and valves are active, simulate moisture absorption and tank depletion
        if (isPumpOn && (isZone1On || isZone2On)) {
          // Deplete tank very slowly
          setTankLevelPercent(prev => Math.max(5, Number((prev - 0.05).toFixed(2))));
          setTotalVolumePumpedL(prev => prev + 0.5);

          if (isZone1On) {
            setZone1Moisture(prev => {
              const next = Math.min(92, Number((prev + 0.3).toFixed(1)));
              return next;
            });
          }

          if (isZone2On) {
            // Lower tension means more moist
            setZone2Tension(prev => {
              const next = Math.max(12, Number((prev - 0.4).toFixed(1)));
              return next;
            });
          }
        } else {
          // Slow natural evaporation during sunny day
          setZone1Moisture(prev => Math.max(30, Number((prev - 0.02).toFixed(1))));
          setZone2Tension(prev => Math.min(85, Number((prev + 0.03).toFixed(1))));
        }

        // Slight micro-jitter in temperature and humidity for organic feel
        setTemperatureC(prev => Number((32.0 + Math.sin(now.getTime() / 15000) * 0.8).toFixed(1)));
        setHumidityPercent(prev => Math.round(60 + Math.cos(now.getTime() / 18000) * 3));
      }

      // Auto-Mode Controller Trigger Logic
      if (isAutoMode && !isPumpOn) {
        if (zone1Moisture < 41 || zone2Tension > 45) {
          setIsPumpOn(true);
          if (zone1Moisture < 41) setIsZone1On(true);
          if (zone2Tension > 45) setIsZone2On(true);
          setActiveTimerRemainingSec(8 * 60); // 8 minutes cycle soak
          showToast('🤖 ระบบอัตโนมัติทำงาน: ตรวจพบดินแห้งเกินเกณฑ์ สั่งเปิดปั๊มน้ำ 8 นาที');
        }
      }

    }, 1000);

    return () => clearInterval(interval);
  }, [isSimulating, isPumpOn, isZone1On, isZone2On, activeTimerRemainingSec, isAutoMode, zone1Moisture, zone2Tension]);

  // Update sparkline history every 6 seconds
  useEffect(() => {
    const historyInterval = setInterval(() => {
      setMoistureHistory(prev => {
        const next = [...prev.slice(1), Math.round(zone1Moisture)];
        return next;
      });
    }, 6000);
    return () => clearInterval(historyInterval);
  }, [zone1Moisture]);

  // Fetch latest telemetry from Express backend API
  const handleFetchLiveBackendSensors = async () => {
    const data = await fetchLatestSensors();
    if (data && data.sensors) {
      if (typeof data.sensors.zone1MoisturePercent === 'number') {
        setZone1Moisture(data.sensors.zone1MoisturePercent);
      }
      if (typeof data.sensors.zone2TensionKpa === 'number') {
        setZone2Tension(data.sensors.zone2TensionKpa);
      }
      if (typeof data.sensors.tankLevelPercent === 'number') {
        setTankLevelPercent(data.sensors.tankLevelPercent);
      }
      if (typeof data.sensors.temperatureC === 'number') {
        setTemperatureC(data.sensors.temperatureC);
      }
      if (typeof data.sensors.humidityPercent === 'number') {
        setHumidityPercent(data.sensors.humidityPercent);
      }
      if (typeof data.sensors.totalVolumePumpedL === 'number') {
        setTotalVolumePumpedL(data.sensors.totalVolumePumpedL);
      }
    }
  };

  // Check backend API periodically when not exclusively in client simulation
  useEffect(() => {
    handleFetchLiveBackendSensors();
    const apiInterval = setInterval(() => {
      handleFetchLiveBackendSensors();
    }, 5000);
    return () => clearInterval(apiInterval);
  }, []);

  // Handlers
  const handleTogglePump = async () => {
    if (tankLevelPercent <= 15 && !isPumpOn) {
      showToast('⚠️ ไม่สามารถเปิดปั๊มได้: ระดับน้ำในถังต่ำกว่า 15% กรุณาเติมน้ำ');
      return;
    }

    const nextState = !isPumpOn;
    setIsPumpOn(nextState);
    if (!nextState) {
      setIsZone1On(false);
      setIsZone2On(false);
      setActiveTimerRemainingSec(null);
      showToast('🛑 ปิดปั๊มน้ำหลักและวาล์วทุกโซนเรียบร้อยแล้ว');
    } else {
      showToast('💧 เปิดปั๊มน้ำหลักแล้ว! โปรดเลือกวาล์วแปลงที่ 1 หรือ 2');
    }
    // Sync with backend API
    await setPumpState(nextState);
  };

  const handleToggleZone1 = async () => {
    if (!isPumpOn) {
      showToast('⚠️ กรุณากดเปิดปั๊มน้ำหลักก่อนเปิดวาล์ว');
      return;
    }
    const next = !isZone1On;
    setIsZone1On(next);
    showToast(next ? '🌱 เปิดวาล์วรดน้ำโซน 1 (ไม้กระถาง/ผัก)' : 'วาล์วโซน 1 ปิดแล้ว');
    await setZoneValves(next, undefined);
  };

  const handleToggleZone2 = async () => {
    if (!isPumpOn) {
      showToast('⚠️ กรุณากดเปิดปั๊มน้ำหลักก่อนเปิดวาล์ว');
      return;
    }
    const next = !isZone2On;
    setIsZone2On(next);
    showToast(next ? '🌳 เปิดวาล์วรดน้ำโซน 2 (ไม้ผล/ไม้ยืนต้น)' : 'วาล์วโซน 2 ปิดแล้ว');
    await setZoneValves(undefined, next);
  };

  const handleToggleAutoMode = async () => {
    const next = !isAutoMode;
    setIsAutoMode(next);
    showToast(next ? '✨ เปิดระบบรดน้ำอัตโนมัติ (Auto-Pilot) ตามเกณฑ์ดินเหนียว' : 'เปลี่ยนเป็นโหมดควบคุมด้วยตนเอง (Manual)');
    await setAutoModeState(next);
  };

  const handleSetTimerMinutes = (mins: number) => {
    if (mins <= 0) {
      setActiveTimerRemainingSec(null);
      showToast('ยกเลิกการตั้งเวลาตัดน้ำ');
      return;
    }
    if (!isPumpOn) {
      setIsPumpOn(true);
      setIsZone1On(true);
      setPumpState(true);
      setZoneValves(true, undefined);
    }
    setActiveTimerRemainingSec(mins * 60);
    showToast(`⏱️ ตั้งเวลารดน้ำ ${mins} นาที ระบบจะตัดน้ำอัตโนมัติ`);
  };

  const handleApplyDurationToPump = (durationMins: number) => {
    setActiveTab('control');
    setIsPumpOn(true);
    setIsZone1On(true);
    setPumpState(true);
    setZoneValves(true, undefined);
    setActiveTimerRemainingSec(durationMins * 60);
    showToast(`🌾 นำค่าเวลาคำนวณ ${durationMins} นาที มาตั้งเวลารดน้ำเรียบร้อยแล้ว`);
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-neutral-900 selection:bg-emerald-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-md bg-neutral-900/90 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-2xl shadow-xl backdrop-blur-md border border-white/20 transition-all flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <HeaderNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        lastUpdated={lastUpdated}
        isPumpRunning={isPumpOn}
      />

      {/* Hero Accent Bar with Organic Ambient Backdrop */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-900/10 via-transparent to-transparent py-6 sm:py-8 border-b border-emerald-950/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>แปลงทดสอบการเกษตรแม่นยำ · สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 tracking-tight mt-1">
                ระบบควบคุมอัจฉริยะ & รดน้ำอัตโนมัติ 2 โซน
              </h1>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-normal">
                ออกแบบสไตล์ Liquid Glass สำหรับเกษตรกรรุ่นใหม่และผู้ดูแลแปลง ใช้งานง่าย ปลอดภัยต่อดินเหนียวอุ้มน้ำสูง
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white shadow-2xs self-start md:self-auto">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <Sprout className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="text-xs">
                <div className="text-neutral-500 font-medium">สภาพแปลงภาพรวม:</div>
                <div className="font-bold text-neutral-900">
                  {zone1Moisture >= 41 && zone2Tension <= 40 ? 'ดินชุ่มชื้นปกติ รากดูดซึมดี' : 'ต้องการน้ำในโซน 2'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Viewports */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        
        {/* VIEW 1: Control & Live Dashboard */}
        {activeTab === 'control' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Live Sensor Cards */}
            <LiveSensorCards
              zone1Moisture={Math.round(zone1Moisture)}
              zone2Tension={Math.round(zone2Tension)}
              tankLevelPercent={Math.round(tankLevelPercent)}
              temperatureC={temperatureC}
              humidityPercent={humidityPercent}
              moistureHistory={moistureHistory}
            />

            {/* Interactive Liquid Water Control */}
            <LiquidWaterControl
              isPumpOn={isPumpOn}
              isZone1On={isZone1On}
              isZone2On={isZone2On}
              isAutoMode={isAutoMode}
              flowRateLpm={flowRateLpm}
              totalVolumePumpedL={totalVolumePumpedL}
              tankLevelPercent={tankLevelPercent}
              zone1Moisture={Math.round(zone1Moisture)}
              zone2Tension={Math.round(zone2Tension)}
              onTogglePump={handleTogglePump}
              onToggleZone1={handleToggleZone1}
              onToggleZone2={handleToggleZone2}
              onToggleAutoMode={handleToggleAutoMode}
              onSetTimerMinutes={handleSetTimerMinutes}
              activeTimerRemainingSec={activeTimerRemainingSec}
            />

            {/* Historical Trends (24h Soil Moisture & Tension Recharts) */}
            <HistoricalTrends
              currentMoisture={Math.round(zone1Moisture)}
              currentTension={Math.round(zone2Tension)}
            />
          </div>
        )}

        {/* VIEW 2: Agronomy Calculator (Kc & FAO-56) */}
        {activeTab === 'calculator' && (
          <div className="animate-in fade-in duration-300">
            <AgronomyCalculator onApplyDurationToPump={handleApplyDurationToPump} />
          </div>
        )}

        {/* VIEW 3: Soil & Crops Knowledge */}
        {activeTab === 'knowledge' && (
          <div className="animate-in fade-in duration-300">
            <SoilAndCropsKnowledge />
          </div>
        )}

        {/* VIEW 4: IoT Data Pipeline Architecture */}
        {activeTab === 'pipeline' && (
          <div className="animate-in fade-in duration-300">
            <DataPipelineGuide />
          </div>
        )}

        {/* VIEW 5: Developer API Portal for Hardware & Teammates */}
        {activeTab === 'api' && (
          <div className="animate-in fade-in duration-300">
            <DeveloperApiPortal
              onRefreshData={handleFetchLiveBackendSensors}
              showToast={showToast}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-emerald-900/10 bg-white/60 backdrop-blur-md py-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-neutral-800">Smart Farm AgroFlow Hub</span>
            <span>·</span>
            <span>ระบบรดน้ำอัตโนมัติ & วิเคราะห์ดินเหนียว 2 โซน</span>
          </div>
          <div>
            <span>ข้อมูลสอดคล้องกับพืช 16 ชนิด · สถานีตรวจวัดลาดกระบัง (Kp 0.75)</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
