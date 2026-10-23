import React, { useState } from 'react';
import { Calculator, Sprout, Calendar, Ruler, AlertCircle, Droplets, CheckCircle, ArrowRight } from 'lucide-react';
import { CROPS_DATA, WEATHER_EP_MONTHS, KP_LAT_KRABANG } from '../data/agronomyData';

interface AgronomyCalculatorProps {
  onApplyDurationToPump: (durationMins: number) => void;
}

export const AgronomyCalculator: React.FC<AgronomyCalculatorProps> = ({
  onApplyDurationToPump
}) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('lantana'); // ผกากรอง default
  const [selectedGrowthStage, setSelectedGrowthStage] = useState<'ini' | 'mid' | 'end'>('mid');
  const [selectedMonthNum, setSelectedMonthNum] = useState<number>(10); // ต.ค. (Current Month)
  const [plotAreaSqm, setPlotAreaSqm] = useState<number>(50); // ตร.ม.
  const [irrigationFlowRateLpm, setIrrigationFlowRateLpm] = useState<number>(12); // ลิตร/นาที

  const selectedCrop = CROPS_DATA.find(c => c.id === selectedCropId) || CROPS_DATA[0];
  const selectedMonth = WEATHER_EP_MONTHS.find(m => m.monthNum === selectedMonthNum) || WEATHER_EP_MONTHS[9];

  // Kc factor based on stage
  const currentKc = selectedGrowthStage === 'ini' 
    ? selectedCrop.kcIni 
    : selectedGrowthStage === 'mid' 
    ? selectedCrop.kcMid 
    : selectedCrop.kcEnd;

  // ETo = EP * Kp
  const currentEto = selectedMonth.eto;

  // ETc = ETo * Kc (mm/day)
  const currentEtc = Number((currentEto * currentKc).toFixed(2));

  // Daily Water requirement for the plot:
  // 1 mm depth on 1 sq.m = 1 Liter
  // Water Volume (Liters) = ETc (mm) * Area (sqm)
  // Considering 85% application efficiency for drip/sprinkler
  const applicationEfficiency = 0.85;
  const grossWaterLiters = Number(((currentEtc * plotAreaSqm) / applicationEfficiency).toFixed(1));

  // Time required (Minutes) = Gross Water (Liters) / Flow Rate (L/min)
  const requiredRuntimeMins = Math.max(1, Math.round(grossWaterLiters / irrigationFlowRateLpm));

  // Clay soil infiltration safety check:
  // Clay infiltration is ~5.45 to 6.66 mm/hr (~0.09 - 0.11 mm/min)
  // If application rate exceeds infiltration, recommend "Cycle & Soak"
  const needsCycleSoak = requiredRuntimeMins > 10;
  const cycleCount = needsCycleSoak ? Math.ceil(requiredRuntimeMins / 8) : 1;
  const minsPerCycle = Math.round(requiredRuntimeMins / cycleCount);

  return (
    <div className="space-y-8">
      
      {/* Title & Introduction */}
      <div className="liquid-glass-card p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <Calculator className="w-3.5 h-3.5" />
          <span>เครื่องคำนวณความต้องการน้ำของพืช (FAO-56 Crop Water Calculator)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          คำนวณการให้น้ำแม่นยำตามค่า Kc และสภาพอากาศจริง
        </h2>
        <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
          นำค่าสัมประสิทธิ์พืช (Crop Coefficient - Kc) ทั้ง 16 ชนิดจากแปลงทดสอบ ร่วมกับค่าถาดระเหย (EP) ลาดกระบัง มาคำนวณหาความต้องการน้ำจริง (ETc) และแปลงเป็นระยะเวลาเปิดปั๊มน้ำที่ปลอดภัยต่อดินเหนียว
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
        
        {/* LEFT COLUMN: Input Parameters */}
        <div className="lg:col-span-7 liquid-glass-card p-6 sm:p-7 space-y-6">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-600" />
            <span>เลือกพืชและพารามิเตอร์แปลง</span>
          </h3>

          {/* 1. Crop Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              1. เลือกชนิดพืช (16 ชนิดในแปลง):
            </label>
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              className="w-full bg-white/90 border border-neutral-300 rounded-xl px-4 py-2.5 text-sm font-medium text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <optgroup label="สวนไม้กระถาง">
                {CROPS_DATA.filter(c => c.category === 'สวนไม้กระถาง').map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} ({crop.scientificName})
                  </option>
                ))}
              </optgroup>
              <optgroup label="พืชไร่ / พืชคลุมดิน">
                {CROPS_DATA.filter(c => c.category === 'พืชไร่/พืชคลุมดิน').map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} ({crop.scientificName})
                  </option>
                ))}
              </optgroup>
              <optgroup label="แปลงไม้ยืนต้น">
                {CROPS_DATA.filter(c => c.category === 'แปลงไม้ยืนต้น').map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} ({crop.scientificName})
                  </option>
                ))}
              </optgroup>
              <optgroup label="แปลงพืชไร่">
                {CROPS_DATA.filter(c => c.category === 'แปลงพืชไร่').map(crop => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name} ({crop.scientificName})
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="text-xs text-neutral-500 italic">
              {selectedCrop.description} · ความลึกราก {selectedCrop.rootDepthMin}-{selectedCrop.rootDepthMax} ซม.
            </p>
          </div>

          {/* 2. Growth Stage */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              2. ระยะการเจริญเติบโตของพืช (Growth Stage):
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedGrowthStage('ini')}
                className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                  selectedGrowthStage === 'ini'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white/80 text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="font-bold">ระยะต้นกล้า (Ini)</div>
                <div className="text-[11px] opacity-90">Kc = {selectedCrop.kcIni}</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedGrowthStage('mid')}
                className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                  selectedGrowthStage === 'mid'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white/80 text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="font-bold">เติบโตเต็มที่ (Mid)</div>
                <div className="text-[11px] opacity-90">Kc = {selectedCrop.kcMid}</div>
              </button>
              <button
                type="button"
                onClick={() => setSelectedGrowthStage('end')}
                className={`py-2 px-3 text-xs rounded-xl font-medium border text-center transition-all ${
                  selectedGrowthStage === 'end'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white/80 text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="font-bold">สุกแก่/พักต้น (End)</div>
                <div className="text-[11px] opacity-90">Kc = {selectedCrop.kcEnd}</div>
              </button>
            </div>
          </div>

          {/* 3. Month & EP Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              3. เดือนที่ทำการเพาะปลูก (ดึงค่า EP ลาดกระบัง):
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {WEATHER_EP_MONTHS.map((m) => (
                <button
                  key={m.monthNum}
                  type="button"
                  onClick={() => setSelectedMonthNum(m.monthNum)}
                  className={`py-1.5 px-2 text-xs rounded-lg font-medium border text-center transition-all ${
                    selectedMonthNum === m.monthNum
                      ? 'bg-teal-700 text-white border-teal-700 shadow-xs'
                      : 'bg-white/80 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <div className="font-semibold">{m.shortMonth}</div>
                  <div className="text-[10px] opacity-80">{m.ep} mm</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Area & Flow Rate Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-200">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-700">ขนาดพื้นที่แปลง:</span>
                <span className="font-mono font-bold text-emerald-800">{plotAreaSqm} ตร.ม.</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={plotAreaSqm}
                onChange={(e) => setPlotAreaSqm(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-500">ปรับขนาดแปลง 10 - 200 ตร.ม.</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-neutral-700">อัตราการจ่ายน้ำของหัวจ่าย:</span>
                <span className="font-mono font-bold text-teal-800">{irrigationFlowRateLpm} L/min</span>
              </div>
              <input
                type="range"
                min="4"
                max="30"
                step="1"
                value={irrigationFlowRateLpm}
                onChange={(e) => setIrrigationFlowRateLpm(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <span className="text-[10px] text-neutral-500">สอดคล้องกับ Flow meter YF-S201</span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: Calculated Results & Actionable Recommendation */}
        <div className="lg:col-span-5 liquid-glass-card p-6 sm:p-7 space-y-6">
          <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-emerald-600" />
            <span>ผลการวิเคราะห์ & แผนการรดน้ำ</span>
          </h3>

          {/* Formula Breakdown Cards */}
          <div className="space-y-3">
            
            <div className="p-3.5 bg-white/70 rounded-xl border border-neutral-200/80 flex items-center justify-between text-sm">
              <div>
                <span className="text-neutral-600 block text-xs">1. ค่าระเหยอ้างอิง (ETo = EP × Kp)</span>
                <span className="font-bold text-neutral-900">{selectedMonth.ep} × {KP_LAT_KRABANG} =</span>
              </div>
              <span className="font-mono font-extrabold text-base text-neutral-900">{currentEto} มม./วัน</span>
            </div>

            <div className="p-3.5 bg-white/70 rounded-xl border border-neutral-200/80 flex items-center justify-between text-sm">
              <div>
                <span className="text-neutral-600 block text-xs">2. สัมประสิทธิ์พืช (Kc {selectedCrop.name})</span>
                <span className="font-bold text-neutral-900">ระยะ {selectedGrowthStage === 'ini' ? 'ต้นกล้า' : selectedGrowthStage === 'mid' ? 'เติบโตเต็มที่' : 'พักต้น'}</span>
              </div>
              <span className="font-mono font-extrabold text-base text-emerald-700">{currentKc}</span>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 flex items-center justify-between">
              <div>
                <span className="text-emerald-800 font-semibold block text-xs">3. ความต้องการน้ำสุทธิ (ETc = ETo × Kc)</span>
                <span className="text-xs text-emerald-700">ปริมาณน้ำที่พืชคายระเหยต่อวัน</span>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-2xl text-emerald-950">{currentEtc}</span>
                <span className="text-xs text-emerald-800 ml-1">มม./วัน</span>
              </div>
            </div>

          </div>

          {/* Total Liters & Recommended Runtime */}
          <div className="p-5 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl text-white space-y-3 shadow-md">
            <div className="text-xs text-emerald-100 uppercase font-semibold tracking-wider">
              ปริมาณน้ำที่ต้องจ่ายลงแปลง {plotAreaSqm} ตร.ม.
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black font-mono tracking-tight">{grossWaterLiters}</span>
              <span className="text-lg font-medium opacity-90">ลิตร/วัน</span>
            </div>
            
            <div className="pt-2 border-t border-white/20 flex justify-between items-center text-sm">
              <span className="opacity-90">ระยะเวลาเปิดปั๊มทั้งหมด:</span>
              <span className="font-bold font-mono text-lg bg-white/20 px-3 py-0.5 rounded-lg">
                ~ {requiredRuntimeMins} นาที
              </span>
            </div>
          </div>

          {/* Clay Soil Warning & Cycle Soak */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>คำแนะนำสำคัญสำหรับดินเหนียว (Infiltration 5.4 - 6.6 mm/hr):</span>
            </div>
            {needsCycleSoak ? (
              <p className="leading-relaxed">
                เนื่องจากดินเหนียวซึมน้ำช้ามาก <strong className="underline">ห้ามรดต่อเนื่องรวดเดียว {requiredRuntimeMins} นาที</strong> เพราะน้ำจะขังผิวดิน ให้ใช้เทคนิค <strong>Cycle & Soak (รดแล้วแช่)</strong>:
                <br />
                👉 แนะนำรดรอบละ <strong>{minsPerCycle} นาที</strong> (ทำ {cycleCount} รอบ เว้นช่วง 15 นาที)
              </p>
            ) : (
              <p className="leading-relaxed">
                ระยะเวลารดน้ำ {requiredRuntimeMins} นาที สามารถรดได้ในรอบเดียว ดินเหนียวจะสามารถดูดซับน้ำได้ทันโดยไม่เกิดน้ำท่วมขัง
              </p>
            )}
          </div>

          {/* Quick Apply Button */}
          <button
            onClick={() => onApplyDurationToPump(needsCycleSoak ? minsPerCycle : requiredRuntimeMins)}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-emerald-700 hover:bg-emerald-800 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>ส่งค่าเวลารดน้ำ {needsCycleSoak ? minsPerCycle : requiredRuntimeMins} นาที ไปยังตัวตั้งเวลาปั๊ม</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
