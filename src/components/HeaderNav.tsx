import React from 'react';
import { Droplet, Activity, Sprout, Database, Cpu, Play, Pause } from 'lucide-react';

interface HeaderNavProps {
  activeTab: 'control' | 'calculator' | 'knowledge' | 'pipeline' | 'api';
  onSelectTab: (tab: 'control' | 'calculator' | 'knowledge' | 'pipeline' | 'api') => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  lastUpdated: string;
  isPumpRunning: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  onSelectTab,
  isSimulating,
  onToggleSimulation,
  lastUpdated,
  isPumpRunning
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-emerald-900/10 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Wordmark Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-emerald-950/20 rounded-[10px] flex items-center justify-center backdrop-blur-xs">
              <Droplet className="w-5 h-5 text-white fill-white/80" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-emerald-950">AgroFlow</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">Smart Farm</span>
            </div>
            <p className="text-[11px] text-emerald-800/70 hidden sm:block">ระบบควบคุมรดน้ำอัจฉริยะ & วิเคราะห์ดินเหนียว</p>
          </div>
        </div>

        {/* Zone 2: Navigation Tabs (Single line, cleanly styled) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-emerald-950/5 rounded-full border border-emerald-950/5">
          <button
            onClick={() => onSelectTab('control')}
            className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'control'
                ? 'bg-white text-emerald-900 shadow-sm font-semibold'
                : 'text-emerald-800/80 hover:text-emerald-950 hover:bg-white/40'
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>ควบคุมน้ำ & แดชบอร์ด</span>
          </button>

          <button
            onClick={() => onSelectTab('calculator')}
            className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'calculator'
                ? 'bg-white text-emerald-900 shadow-sm font-semibold'
                : 'text-emerald-800/80 hover:text-emerald-950 hover:bg-white/40'
            }`}
          >
            <Sprout className="w-4 h-4 text-emerald-600" />
            <span>คำนวณค่า Kc พืช</span>
          </button>

          <button
            onClick={() => onSelectTab('knowledge')}
            className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'knowledge'
                ? 'bg-white text-emerald-900 shadow-sm font-semibold'
                : 'text-emerald-800/80 hover:text-emerald-950 hover:bg-white/40'
            }`}
          >
            <Database className="w-4 h-4 text-emerald-600" />
            <span>ข้อมูลดิน & พืช 16 ชนิด</span>
          </button>

          <button
            onClick={() => onSelectTab('pipeline')}
            className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'pipeline'
                ? 'bg-white text-emerald-900 shadow-sm font-semibold'
                : 'text-emerald-800/80 hover:text-emerald-950 hover:bg-white/40'
            }`}
          >
            <Cpu className="w-4 h-4 text-emerald-600" />
            <span>คู่มือ IoT</span>
          </button>

          <button
            onClick={() => onSelectTab('api')}
            className={`px-4 py-2 rounded-full text-xs lg:text-sm font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
              activeTab === 'api'
                ? 'bg-white text-emerald-900 shadow-sm font-semibold'
                : 'text-emerald-800/80 hover:text-emerald-950 hover:bg-white/40'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>API เชื่อมต่อเซ็นเซอร์</span>
          </button>
        </nav>

        {/* Zone 3: Live Simulator & Clock Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleSimulation}
            title={isSimulating ? "หยุดการจำลองข้อมูลเซ็นเซอร์" : "เริ่มจำลองข้อมูลเซ็นเซอร์อัตโนมัติ"}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 transition-all whitespace-nowrap ${
              isSimulating
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs'
                : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span className="hidden sm:inline">จำลองเซ็นเซอร์ Real-time:</span>
                <span className="font-semibold text-emerald-700">เปิดอยู่</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-neutral-500" />
                <span className="hidden sm:inline">โหมดจำลอง:</span>
                <span>หยุดพัก</span>
              </>
            )}
          </button>

          <div className="hidden lg:flex flex-col items-end text-right pl-2 border-l border-emerald-900/10">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPumpRunning ? 'bg-emerald-500 animate-pulse' : 'bg-emerald-400'}`}></span>
              <span className="text-xs font-medium text-emerald-950">
                {isPumpRunning ? 'ปั๊มกำลังทำงาน' : 'ระบบพร้อมทำงาน'}
              </span>
            </div>
            <span className="text-[10px] text-neutral-500 font-mono tabular-nums">
              อัปเดต {lastUpdated}
            </span>
          </div>
        </div>

      </div>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 gap-2 border-t border-emerald-900/5 bg-emerald-50/50 scrollbar-none">
        <button
          onClick={() => onSelectTab('control')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'control' ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900 border border-emerald-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>ควบคุมน้ำ</span>
        </button>
        <button
          onClick={() => onSelectTab('calculator')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'calculator' ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900 border border-emerald-200'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>คำนวณ Kc</span>
        </button>
        <button
          onClick={() => onSelectTab('knowledge')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'knowledge' ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900 border border-emerald-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>ดิน & พืช 16 ชนิด</span>
        </button>
        <button
          onClick={() => onSelectTab('pipeline')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'pipeline' ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900 border border-emerald-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>คู่มือ IoT</span>
        </button>
        <button
          onClick={() => onSelectTab('api')}
          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
            activeTab === 'api' ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-900 border border-emerald-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>API ฮาร์ดแวร์</span>
        </button>
      </div>
    </header>
  );
};
