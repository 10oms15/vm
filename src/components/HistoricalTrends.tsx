import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { TrendingUp, Clock, Calendar, Sparkles, Droplets, Sun, Activity, Download, Info } from 'lucide-react';

interface HourlyDataPoint {
  time: string;
  hour: number;
  zone1Moisture: number; // %
  zone2Tension: number; // kPa
  temperature: number; // °C
  irrigationEvent?: string; // e.g. "รดน้ำ 8 นาที"
  irrigationVolumeL?: number;
}

interface HistoricalTrendsProps {
  currentMoisture: number;
  currentTension: number;
}

export const HistoricalTrends: React.FC<HistoricalTrendsProps> = ({
  currentMoisture,
  currentTension
}) => {
  const [metricView, setMetricView] = useState<'all' | 'zone1' | 'zone2' | 'temp'>('all');

  // Generate 24-hour realistic agronomic trend data
  const historicalData = useMemo<HourlyDataPoint[]>(() => {
    const data: HourlyDataPoint[] = [];
    const now = new Date();
    const currentHour = now.getHours();

    for (let i = 23; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600 * 1000);
      const hour = d.getHours();
      const timeStr = `${hour < 10 ? '0' : ''}${hour}:00`;

      // Diurnal curve simulation based on solar & irrigation cycle
      let moisture = 62;
      let tension = 32;
      let temp = 27;
      let event: string | undefined = undefined;
      let volume: number | undefined = undefined;

      if (hour >= 0 && hour < 6) {
        // Night time: cool, minimal evaporation
        temp = 25.5 + Math.sin(hour) * 0.8;
        moisture = 64.5 - hour * 0.2;
        tension = 28 + hour * 0.5;
      } else if (hour === 6 || hour === 7) {
        // Morning irrigation event at 07:00
        temp = 28.0;
        moisture = 74.0;
        tension = 18.0; // tension drops when wet
        if (hour === 7) {
          event = '💧 รอบเช้า (8 นาที)';
          volume = 115;
        }
      } else if (hour >= 8 && hour < 12) {
        // Morning sun climbs, moisture starts lowering
        temp = 29.5 + (hour - 8) * 1.2;
        moisture = 72 - (hour - 7) * 2.2;
        tension = 20 + (hour - 7) * 3.5;
      } else if (hour >= 12 && hour < 16) {
        // Peak solar radiation & evaporation (12:00 - 15:00)
        temp = 33.5 + Math.sin(hour - 12) * 1.2;
        moisture = 55 - (hour - 12) * 2.0;
        tension = 42 + (hour - 12) * 2.5; // plant tension rises
      } else if (hour === 16 || hour === 17) {
        // Afternoon Cycle & Soak irrigation at 16:30
        temp = 31.0;
        moisture = 68.0;
        tension = 22.0;
        if (hour === 16) {
          event = '💧 รอบเย็น (8 นาที)';
          volume = 115;
        }
      } else {
        // Evening / Sunset: calm, stable
        temp = 29.0 - (hour - 18) * 0.6;
        moisture = 66 - (hour - 18) * 0.4;
        tension = 25 + (hour - 18) * 1.0;
      }

      // Anchor the latest hour to real-time props
      if (i === 0) {
        moisture = currentMoisture;
        tension = currentTension;
      }

      data.push({
        time: timeStr,
        hour,
        zone1Moisture: Number(moisture.toFixed(1)),
        zone2Tension: Number(tension.toFixed(1)),
        temperature: Number(temp.toFixed(1)),
        irrigationEvent: event,
        irrigationVolumeL: volume
      });
    }

    return data;
  }, [currentMoisture, currentTension]);

  // Export CSV helper
  const handleExportCsv = () => {
    const headers = ['Time', 'Zone1_Moisture_Pct', 'Zone2_Tension_kPa', 'Temperature_C', 'Irrigation_Event'];
    const rows = historicalData.map(d => [
      d.time,
      d.zone1Moisture,
      d.zone2Tension,
      d.temperature,
      d.irrigationEvent || '-'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `smart_farm_24h_trends_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="liquid-glass-card p-6 sm:p-8 space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-emerald-950/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-semibold mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>แนวโน้มย้อนหลัง 24 ชั่วโมง (Historical Trends)</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
            พฤติกรรมความชื้น & แรงดึงน้ำในดินตลอด 24 ชม.
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-2xl font-normal">
            กราฟวิเคราะห์ Recharts ความสัมพันธ์ระหว่างความชื้นสัมพัทธ์ (Zone 1) กับแรงดึงดิน (Zone 2) เพื่อค้นหาแบบแผนการคายระเหยและตรวจรอบการรดน้ำ
          </p>
        </div>

        {/* View Switchers & Export */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-xl border border-neutral-200/80">
            <button
              onClick={() => setMetricView('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                metricView === 'all'
                  ? 'bg-white text-emerald-900 font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ภาพรวมทั้งหมด
            </button>
            <button
              onClick={() => setMetricView('zone1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                metricView === 'zone1'
                  ? 'bg-emerald-600 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              โซน 1 (ความชื้น %)
            </button>
            <button
              onClick={() => setMetricView('zone2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                metricView === 'zone2'
                  ? 'bg-teal-700 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              โซน 2 (Tension kPa)
            </button>
            <button
              onClick={() => setMetricView('temp')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                metricView === 'temp'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              อุณหภูมิ (°C)
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            title="ดาวน์โหลดข้อมูล 24 ชม. เป็นไฟล์ CSV"
            className="p-2 sm:px-3 sm:py-1.5 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-xl text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Recharts Area Container */}
      <div className="w-full h-80 sm:h-96 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={historicalData}
            margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Gradient for Zone 1 Moisture */}
              <linearGradient id="moistureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>

              {/* Gradient for Zone 2 Tension */}
              <linearGradient id="tensionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>

              {/* Gradient for Temperature */}
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#d97706" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(16, 185, 129, 0.12)" />

            <XAxis
              dataKey="time"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />

            {/* Left Y Axis: Percentage / kPa */}
            <YAxis
              yAxisId="left"
              domain={[0, 100]}
              stroke="#059669"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit="%"
            />

            {/* Right Y Axis: Tension / Temp */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 80]}
              stroke="#0d9488"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              unit=" kPa"
            />

            {/* Target Ideal Moisture Reference Line (41 - 50%) */}
            <ReferenceLine
              y={50}
              yAxisId="left"
              stroke="#10b981"
              strokeDasharray="4 4"
              label={{ value: 'เป้าหมายดินเหนียว (50%)', fill: '#059669', fontSize: 10, position: 'insideTopLeft' }}
            />

            {/* Tension Stress Threshold (40 kPa) */}
            <ReferenceLine
              y={40}
              yAxisId="right"
              stroke="#f59e0b"
              strokeDasharray="4 4"
              label={{ value: 'เกณฑ์เริ่มขาดน้ำ (40 kPa)', fill: '#d97706', fontSize: 10, position: 'insideTopRight' }}
            />

            {/* Custom Tooltip */}
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dataPoint = payload[0].payload as HourlyDataPoint;
                  return (
                    <div className="bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-emerald-100/90 text-xs space-y-2 min-w-[200px]">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-1.5 font-bold text-neutral-900">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>เวลา {label} น.</span>
                        </span>
                        {dataPoint.irrigationEvent && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
                            {dataPoint.irrigationEvent}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 font-mono text-[11px]">
                        <div className="flex justify-between items-center text-emerald-800">
                          <span className="font-sans flex items-center gap-1 text-neutral-600">
                            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block"></span>
                            ความชื้นโซน 1:
                          </span>
                          <span className="font-bold">{dataPoint.zone1Moisture}%</span>
                        </div>

                        <div className="flex justify-between items-center text-teal-800">
                          <span className="font-sans flex items-center gap-1 text-neutral-600">
                            <span className="w-2 h-2 rounded-full bg-teal-600 inline-block"></span>
                            แรงดึงดินโซน 2:
                          </span>
                          <span className="font-bold">{dataPoint.zone2Tension} kPa</span>
                        </div>

                        <div className="flex justify-between items-center text-amber-800">
                          <span className="font-sans flex items-center gap-1 text-neutral-600">
                            <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                            อุณหภูมิอากาศ:
                          </span>
                          <span className="font-bold">{dataPoint.temperature}°C</span>
                        </div>
                      </div>

                      {dataPoint.irrigationVolumeL && (
                        <div className="pt-1.5 border-t border-neutral-100 text-[10px] text-neutral-500 flex justify-between">
                          <span>ปริมาณน้ำจ่าย:</span>
                          <span className="font-bold text-emerald-700">{dataPoint.irrigationVolumeL} ลิตร</span>
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingTop: '0px' }}
            />

            {/* Zone 1 Area */}
            {(metricView === 'all' || metricView === 'zone1') && (
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="zone1Moisture"
                name="โซน 1: ความชื้นดิน (%)"
                stroke="#059669"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#moistureGradient)"
                activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {/* Zone 2 Area */}
            {(metricView === 'all' || metricView === 'zone2') && (
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="zone2Tension"
                name="โซน 2: แรงดึงดิน (kPa)"
                stroke="#0d9488"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tensionGradient)"
                activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 2 }}
              />
            )}

            {/* Temperature Line */}
            {(metricView === 'all' || metricView === 'temp') && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="temperature"
                name="อุณหภูมิ (°C)"
                stroke="#d97706"
                strokeWidth={1.8}
                dot={false}
                strokeDasharray={metricView === 'all' ? "3 3" : undefined}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 3 Pattern Insights Cards (Helping Users Spot Patterns) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-emerald-950/10">
        
        <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sun className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="font-bold text-xs text-neutral-900">
              1. พีคการคายน้ำช่วงแดดจัด (12:00 - 15:00)
            </h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            อุณหภูมิพุ่งแตะ 34.5°C ส่งผลให้ความชื้นในดินลดลงเร็วที่สุดถึง <strong>~2.0% ต่อชั่วโมง</strong> และแรงดึงดินแตะเกณฑ์เครียด 45 kPa เป็นจุดที่ควรเตรียมรดน้ำรอบบ่าย
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4 text-emerald-600" />
            </div>
            <h4 className="font-bold text-xs text-neutral-900">
              2. ประสิทธิภาพรอบการรดน้ำ (Irrigation Impact)
            </h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            การรดน้ำ 2 รอบ (07:00 และ 16:30) ครั้งละ 8 นาที ช่วยฟื้นฟูความชื้นขึ้นมาที่ <strong>68 - 74%</strong> ได้ทันเวลาโดยไม่ปล่อยให้พืชเหี่ยวถาวร
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 border border-neutral-200/80 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4 text-teal-600" />
            </div>
            <h4 className="font-bold text-xs text-neutral-900">
              3. คุณสมบัติการอุ้มน้ำของดินเหนียว (Clay Retention)
            </h4>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            ช่วงกลางคืน (00:00 - 06:00) ความชื้นลดลงเพียง 0.2% ต่อชม. แสดงว่า <strong>ดินเหนียวอุ้มน้ำได้ดีเยี่ยม</strong> เมื่อไม่มีแสงแดด จึงไม่จำเป็นต้องรดน้ำช่วงกลางคืน
          </p>
        </div>

      </div>

    </div>
  );
};
