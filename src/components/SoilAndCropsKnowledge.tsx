import React, { useState } from 'react';
import { Layers, Search, AlertCircle, Droplets, BookOpen, ChevronRight, Check } from 'lucide-react';
import { CROPS_DATA, SOIL_PLOTS_DATA, CropInfo } from '../data/agronomyData';

export const SoilAndCropsKnowledge: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCropDetail, setSelectedCropDetail] = useState<CropInfo>(CROPS_DATA[0]);

  const filteredCrops = CROPS_DATA.filter(crop => {
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      
      {/* SECTION 1: Soil Analysis & Lab Results (From Screenshot 4) */}
      <div className="space-y-4">
        <div className="liquid-glass-card p-6 sm:p-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <Layers className="w-3.5 h-3.5" />
            <span>ผลตรวจวิเคราะห์ดินในแปลงจริง (Soil Infiltration & Lab Moisture Results)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900">
            ลักษณะดินเหนียวในแปลงและข้อควรปฏิบัติ
          </h2>
          <p className="text-sm text-neutral-600 max-w-3xl leading-relaxed">
            ผลตรวจจากกระป๋องตัวอย่างแล็บชี้ชัดว่า ดินในฟาร์มเป็น <strong>ดินเหนียว (Clay Soil)</strong> ที่มีสมรรถนะการอุ้มน้ำสูงมาก (41% - 50%) แต่อัตราการซึมน้ำช้ามาก (5.45 - 6.66 มม./ชม.) จึงต้องบริหารจัดการระบบน้ำอย่างระมัดระวัง
          </p>
        </div>

        {/* 3 Plots Summary Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SOIL_PLOTS_DATA.map((plot) => (
            <div key={plot.plotId} className="liquid-glass-card p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base text-neutral-900">{plot.plotName}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                    {plot.soilType}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-2">
                  <div className="flex justify-between py-1.5 border-b border-neutral-200/80">
                    <span className="text-neutral-500">อัตราการซึมน้ำ (Infiltration):</span>
                    <span className="font-mono font-bold text-red-600 text-sm">{plot.infiltrationRate.toFixed(2)} มม./ชม.</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200/80">
                    <span className="text-neutral-500">ความชื้นเฉลี่ยจากแล็บ:</span>
                    <span className="font-mono font-bold text-neutral-800 text-sm">{plot.labMoistureAvg.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-neutral-200/80">
                    <span className="text-neutral-500">ช่วงความชื้นเป้าหมาย:</span>
                    <span className="font-mono font-bold text-emerald-700 text-sm">{plot.targetMoistureMin} - {plot.targetMoistureMax}%</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-neutral-500">แรงดึงน้ำเป้าหมาย:</span>
                    <span className="font-mono font-bold text-teal-700 text-sm">{plot.targetTensionKpaMin} - {plot.targetTensionKpaMax} kPa</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200/80 text-xs text-amber-900">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>คำเตือนประจำแปลง:</span>
                </div>
                <p className="leading-relaxed">{plot.warningNote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actionable Advice Box for Beginners */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span>หลักการเข้าใจง่ายสำหรับผู้ดูแลแปลง (Non-Technical Guide)</span>
          </div>
          <h4 className="text-lg font-bold">ทำไมดินเหนียวถึงห้ามรดน้ำนานๆ?</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-emerald-50 leading-relaxed pt-1">
            <div className="bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
              <strong className="text-white block mb-1">1. ดินอนุภาคเล็ก เม็ดชิดกันแน่น</strong>
              เหมือนแป้งเปียก ช่องว่างให้อากาศและน้ำแทรกมีน้อย น้ำจึงซึมลงดินได้ช้ามาก เพียงชั่วโมงละ 5-6 มิลลิเมตรเท่านั้น
            </div>
            <div className="bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
              <strong className="text-white block mb-1">2. ถ้ารดน้ำแรงและนานเกินไป</strong>
              น้ำจะขังเป็นแอ่งบนผิวดิน อากาศในดินจะถูกไล่ออกหมด รากพืชจะขาดออกซิเจนและเกิดโรครากเน่าโคนเน่าทันที
            </div>
            <div className="bg-white/10 p-3.5 rounded-xl backdrop-blur-xs">
              <strong className="text-white block mb-1">3. เคล็ดลับ "รดแล้วแช่ (Cycle & Soak)"</strong>
              รดน้ำทีละ 8-10 นาที แล้วหยุดพัก 15-20 นาที เพื่อให้เวลาน้ำค่อยๆ ซึมลงไปหารากลึก แล้วจึงรดซ้ำหากจำเป็น
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: 16 Crops Reference Table & Detail Inspector (From Screenshot 1) */}
      <div className="space-y-4 pt-4">
        <div className="liquid-glass-card p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold mb-1">
                <span>ฐานข้อมูลสัมประสิทธิ์พืช (Crop Coefficients - Kc)</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-neutral-900">
                รายชื่อพืชทั้ง 16 ชนิดในแปลงทดสอบ
              </h3>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาชื่อพืช, ชื่อวิทยาศาสตร์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/90 border border-neutral-300 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap gap-2 pt-1 border-b border-neutral-200 pb-3">
            {[
              { id: 'all', label: 'พืชทั้งหมด (16 ชนิด)' },
              { id: 'สวนไม้กระถาง', label: 'สวนไม้กระถาง (4 ชนิด)' },
              { id: 'แปลงไม้ยืนต้น', label: 'แปลงไม้ยืนต้น & ไม้ผล (9 ชนิด)' },
              { id: 'พืชไร่/พืชคลุมดิน', label: 'พืชไร่ / คลุมดิน (2 ชนิด)' },
              { id: 'แปลงพืชไร่', label: 'แปลงพืชไร่ / ข้าว กข43' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-700 text-white font-semibold shadow-xs'
                    : 'bg-white/80 text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Interactive Table with Row Highlighting */}
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100/80 text-neutral-700 font-bold border-b border-neutral-200">
                  <th className="py-3 px-4">ชื่อพืช</th>
                  <th className="py-3 px-3">หมวดหมู่</th>
                  <th className="py-3 px-3 text-center">Kc (Ini)</th>
                  <th className="py-3 px-3 text-center">Kc (Mid)</th>
                  <th className="py-3 px-3 text-center">Kc (End)</th>
                  <th className="py-3 px-3 text-center">ความลึกราก (ซม.)</th>
                  <th className="py-3 px-3">โซนแนะนำ</th>
                  <th className="py-3 px-3 text-right">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/70 bg-white/60">
                {filteredCrops.map((crop) => (
                  <tr
                    key={crop.id}
                    onClick={() => setSelectedCropDetail(crop)}
                    className={`hover:bg-emerald-50/60 transition-colors cursor-pointer ${
                      selectedCropDetail.id === crop.id ? 'bg-emerald-100/50 font-medium' : ''
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-bold text-neutral-900">{crop.name}</div>
                      <div className="text-[11px] text-neutral-500 italic">{crop.scientificName}</div>
                    </td>
                    <td className="py-3 px-3 text-neutral-600">{crop.category}</td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">{crop.kcIni}</td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-700">{crop.kcMid}</td>
                    <td className="py-3 px-3 text-center font-mono text-neutral-600">{crop.kcEnd}</td>
                    <td className="py-3 px-3 text-center font-mono text-neutral-700">
                      {crop.rootDepthMin} - {crop.rootDepthMax}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        crop.recommendedZone === 'zone1'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {crop.recommendedZone === 'zone1' ? 'โซน 1 (กระถาง/ผัก)' : 'โซน 2 (ไม้ยืนต้น)'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <ChevronRight className="w-4 h-4 text-neutral-400 inline" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Crop Detail Spotlight Card */}
          {selectedCropDetail && (
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">
                  ข้อมูลเฉพาะ: {selectedCropDetail.name} ({selectedCropDetail.scientificName})
                </div>
                <p className="text-xs text-neutral-700 mt-1 max-w-xl">
                  {selectedCropDetail.description}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 text-xs">
                <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs text-center">
                  <span className="text-neutral-500 block text-[10px]">ความลึกราก</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedCropDetail.rootDepthMin}-{selectedCropDetail.rootDepthMax} ซม.</span>
                </div>
                <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-2xs text-center">
                  <span className="text-neutral-500 block text-[10px]">Kc สูงสุด (Mid)</span>
                  <span className="font-mono font-bold text-emerald-800">{selectedCropDetail.kcMid}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
