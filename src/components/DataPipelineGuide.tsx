import React, { useState } from 'react';
import { Cpu, ArrowRight, CheckCircle2, HelpCircle, Terminal, RefreshCw, Sliders, Zap } from 'lucide-react';
import { SENSORS_SPECS, DATA_PIPELINE_STAGES } from '../data/agronomyData';

export const DataPipelineGuide: React.FC = () => {
  // Interactive Raw Data Converter Sandbox
  const [testRawAdc, setTestRawAdc] = useState<number>(1850); // ADC (0-4095) for capacitive
  const [testResistanceOhms, setTestResistanceOhms] = useState<number>(3200); // Ohms for Watermark
  const [testUltrasonicDistCm, setTestUltrasonicDistCm] = useState<number>(30); // cm from tank top

  // 1. Capacitive Sensor: Two-point calibration
  // Assume Dry Air ADC = 3200, Pure Water ADC = 1300
  const airAdc = 3200;
  const waterAdc = 1300;
  const convertedRelativeMoisture = Math.max(
    0,
    Math.min(100, Math.round(((airAdc - testRawAdc) / (airAdc - waterAdc)) * 100))
  );

  // 2. Watermark 200SS: Ohms -> Soil Tension (kPa)
  // Calibration formula: approx kPa = 7.407 * (R / 1000) - 3.7 (normalized at 25°C)
  const convertedTensionKpa = Math.max(
    0,
    Math.round(7.407 * (testResistanceOhms / 1000) - 3.7)
  );

  // 3. Ultrasonic: Distance to Water Volume in 5,000L tank
  // Assume tank height = 200 cm, bottom area = 2.5 m² (25,000 cm²)
  const tankTotalHeightCm = 200;
  const waterHeightCm = Math.max(0, tankTotalHeightCm - testUltrasonicDistCm);
  const convertedTankPercent = Math.min(100, Math.round((waterHeightCm / tankTotalHeightCm) * 100));
  const convertedTankLiters = Math.round((convertedTankPercent / 100) * 5000);

  return (
    <div className="space-y-10">
      
      {/* SECTION 1: Direct Answer to User's Core Question */}
      <div className="liquid-glass-card p-6 sm:p-8 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>บทวิเคราะห์สถาปัตยกรรมข้อมูล (Data Engineering & UI Strategy)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
          วิธีจัดการข้อมูลดิบและออกแบบหน้าเว็บให้สวยงาม ไม่เกะกะ
        </h2>
        <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
          จากข้อมูลที่ท่านให้มา (ตารางเซ็นเซอร์ 6 ตัว, ผลตรวจดินเหนียว, ค่าระเหย EP ลาดกระบัง, และค่า Kc พืช 16 ชนิด) หากนำตัวเลขทั้งหมดมาแสดงพร้อมกันในหน้าจอเดียว จะทำให้ผู้ใช้ที่ไม่เคยเรียนการเกษตรเกิดความสับสนและใช้งานยาก <strong>ระบบจึงแบ่งกระบวนการเป็น 3 ลำดับขั้น (Multi-Layer Architecture)</strong>:
        </p>

        {/* 3 Design Principles for Zero Clutter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-white/70 border border-neutral-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h4 className="font-bold text-sm text-neutral-900">ซ่อนสมการไว้เบื้องหลัง (Backend Engine)</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              สูตรคำนวณอย่าง FAO-56 Penman-Monteith, Two-point calibration, และ Water Deficit ถูกประมวลผลอัตโนมัติ ผู้ใช้งานทั่วไปไม่ต้องกรอกสูตรเอง
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-neutral-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h4 className="font-bold text-sm text-neutral-900">แสดงผลแบบเข้าใจทันที (Farmer First UI)</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              แปลงตัวเลขฟิสิกส์ให้เป็นรหัสสีและประโยคภาษาไทยที่ชัดเจน เช่น "ดินชุ่มชื้นดี (เขียว)", "พืชเริ่มเครียดขาดน้ำ (เหลือง)", "น้ำในถังพอ (ฟ้า)" พร้อมปุ่มกดรดน้ำ Liquid Glass ขนาดใหญ่
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-neutral-200/80 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h4 className="font-bold text-sm text-neutral-900">แยกแท็บเชิงลึกสำหรับทีมงาน (Data Deep-Dive)</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              ผู้บริหารและทีม IoT ที่ต้องการดูโปรโตคอล (LoRaWAN, Modbus RTU, Pulse frequency) หรือตรวจเช็คค่า Kc สามารถคลิกเข้ามาดูในแท็บนี้ได้โดยไม่รบกวนหน้าควบคุมหลัก
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 2: 5-Stage Data Pipeline Architecture */}
      <div className="liquid-glass-card p-6 sm:p-8 space-y-6">
        <h3 className="font-bold text-xl text-neutral-900 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-600" />
          <span>กระบวนการแปลงข้อมูลจากเซ็นเซอร์สู่งานจริง (Data Pipeline Stages)</span>
        </h3>

        <div className="space-y-3">
          {DATA_PIPELINE_STAGES.map((stage, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white/60 border border-neutral-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-sm text-emerald-950 block">{stage.stage}</span>
                <p className="text-xs text-neutral-600 max-w-2xl">{stage.description}</p>
              </div>
              <div className="bg-emerald-50 text-emerald-900 p-2.5 rounded-lg border border-emerald-200/80 text-xs shrink-0 max-w-xs">
                <strong className="block text-[11px] uppercase tracking-wider text-emerald-800">สิ่งที่ระบบทำ:</strong>
                <span>{stage.actionNeeded}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: Interactive IoT Sensor Calibration Sandbox */}
      <div className="liquid-glass-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-1">
              <Sliders className="w-3.5 h-3.5" />
              <span>ห้องทดลองปรับเทียบเซ็นเซอร์จำลอง (Calibration Sandbox)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
              ทดสอบการแปลงค่าดิบ (Raw Data) เป็นค่าแสดงผลจริง
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Test 1: Capacitive ADC -> % */}
          <div className="p-5 bg-white/70 rounded-2xl border border-neutral-200 space-y-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                1. เซ็นเซอร์ Capacitive (DFRobot)
              </span>
              <h4 className="font-bold text-sm text-neutral-900">สัญญาณอนาล็อก Voltage (ADC)</h4>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">ค่า Raw ADC อ่านได้:</span>
                <span className="font-mono font-bold text-emerald-700">{testRawAdc}</span>
              </div>
              <input
                type="range"
                min="1300"
                max="3200"
                step="20"
                value={testRawAdc}
                onChange={(e) => setTestRawAdc(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>1300 (จุ่มน้ำอิ่มตัว)</span>
                <span>3200 (แห้งสนิท)</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <span className="text-[11px] text-emerald-800 block">แปลงเป็นค่าความชื้นสัมพัทธ์:</span>
              <span className="font-mono font-extrabold text-2xl text-emerald-950">{convertedRelativeMoisture}%</span>
            </div>
          </div>

          {/* Test 2: Watermark Resistance -> kPa */}
          <div className="p-5 bg-white/70 rounded-2xl border border-neutral-200 space-y-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                2. เซ็นเซอร์ Watermark 200SS
              </span>
              <h4 className="font-bold text-sm text-neutral-900">ความต้านทานไฟฟ้า (Ohms)</h4>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">ค่าความต้านทาน:</span>
                <span className="font-mono font-bold text-teal-700">{testResistanceOhms} Ω</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={testResistanceOhms}
                onChange={(e) => setTestResistanceOhms(Number(e.target.value))}
                className="w-full accent-teal-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>500 Ω (ชุ่มฉ่ำ)</span>
                <span>10,000 Ω (แห้งจัด)</span>
              </div>
            </div>

            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-center">
              <span className="text-[11px] text-teal-800 block">แปลงเป็นแรงดึงน้ำในดิน (Tension):</span>
              <span className="font-mono font-extrabold text-2xl text-teal-950">{convertedTensionKpa} kPa</span>
            </div>
          </div>

          {/* Test 3: Ultrasonic -> Tank Liters */}
          <div className="p-5 bg-white/70 rounded-2xl border border-neutral-200 space-y-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
                3. เซ็นเซอร์ Ultrasonic ถังน้ำ
              </span>
              <h4 className="font-bold text-sm text-neutral-900">ระยะห่างผิวน้ำ (Distance cm)</h4>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-600">ระยะห่างจากปากถัง:</span>
                <span className="font-mono font-bold text-sky-700">{testUltrasonicDistCm} cm</span>
              </div>
              <input
                type="range"
                min="10"
                max="190"
                step="5"
                value={testUltrasonicDistCm}
                onChange={(e) => setTestUltrasonicDistCm(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>10 cm (น้ำเต็มถัง)</span>
                <span>190 cm (น้ำก้นถัง)</span>
              </div>
            </div>

            <div className="p-3 bg-sky-50 rounded-xl border border-sky-200 text-center">
              <span className="text-[11px] text-sky-800 block">คำนวณปริมาตรน้ำคงเหลือ:</span>
              <span className="font-mono font-extrabold text-2xl text-sky-950">{convertedTankPercent}% ({convertedTankLiters.toLocaleString()} L)</span>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 4: Comprehensive IoT Hardware Specifications Table (Matching Screenshot 3) */}
      <div className="liquid-glass-card p-6 sm:p-8 space-y-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>ตารางสเปกฮาร์ดแวร์เซ็นเซอร์ที่ทีม IoT ประสานงาน</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
            ระบบเซ็นเซอร์ทั้ง 6 จุดและการนำไปใช้ใน Workflow
          </h3>
        </div>

        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                <th className="py-3 px-4">ตำแหน่ง / อุปกรณ์</th>
                <th className="py-3 px-3">การสื่อสาร</th>
                <th className="py-3 px-3">ค่าที่ส่งออก (Raw Data)</th>
                <th className="py-3 px-3">หน่วยประมวลผล (Unit)</th>
                <th className="py-3 px-4">การนำไปใช้ใน Workflow (Application)</th>
                <th className="py-3 px-3 text-center">สถานะ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200/70 bg-white/60">
              {SENSORS_SPECS.map((spec) => (
                <tr key={spec.id} className="hover:bg-neutral-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-neutral-900">{spec.model}</div>
                    <div className="text-[11px] text-neutral-500">{spec.location}</div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-neutral-200/80 font-mono text-neutral-800 text-[11px]">
                      {spec.communication}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-neutral-700 font-mono text-[11px]">{spec.rawData}</td>
                  <td className="py-3.5 px-3 font-semibold text-emerald-800 font-mono text-[11px]">{spec.unit}</td>
                  <td className="py-3.5 px-4 text-neutral-600 leading-relaxed text-xs">{spec.workflow}</td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      พร้อมใช้งาน
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
