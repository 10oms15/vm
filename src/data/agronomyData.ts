/**
 * Smart Farm Agronomy Data & Reference Models
 * Extracted accurately from field lab data and IoT sensor specifications.
 */

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  category: 'สวนไม้กระถาง' | 'แปลงไม้ยืนต้น' | 'พืชไร่/พืชคลุมดิน' | 'แปลงพืชไร่';
  kcIni: number;
  kcMid: number;
  kcEnd: number;
  rootDepthMin: number;
  rootDepthMax: number;
  recommendedZone: 'zone1' | 'zone2';
  description: string;
}

export interface WeatherMonthData {
  month: string;
  shortMonth: string;
  monthNum: number;
  ep: number; // Evaporation Pan mm/day
  kp: number; // Pan coefficient = 0.75 @Lat Krabang
  eto: number; // Reference Evapotranspiration mm/day = ep * kp
}

export interface SoilPlotData {
  plotId: string;
  plotName: string;
  soilType: string;
  infiltrationRate: number; // mm/hr
  labMoistureAvg: number; // % by weight
  targetMoistureMin: number;
  targetMoistureMax: number;
  targetTensionKpaMin: number;
  targetTensionKpaMax: number;
  warningNote: string;
}

export interface SensorSpec {
  id: string;
  type: string;
  communication: string;
  model: string;
  location: string;
  rawData: string;
  unit: string;
  workflow: string;
  formulaNote: string;
  typicalRange: string;
  status: 'online' | 'standby' | 'alert';
}

// 1. All 16 Crops from field measurement sheet
export const CROPS_DATA: CropInfo[] = [
  // สวนไม้กระถาง
  {
    id: 'lantana',
    name: 'ผกากรอง',
    scientificName: 'Lantana camara',
    category: 'สวนไม้กระถาง',
    kcIni: 0.8,
    kcMid: 0.85,
    kcEnd: 0.85,
    rootDepthMin: 10,
    rootDepthMax: 30,
    recommendedZone: 'zone1',
    description: 'ไม้ประดับดอกหลากสี ทนแดดจัด ต้องการน้ำปานกลาง รากตื้น'
  },
  {
    id: 'ixora',
    name: 'เข็ม',
    scientificName: 'Ixora chinensis',
    category: 'สวนไม้กระถาง',
    kcIni: 1.1,
    kcMid: 1.15,
    kcEnd: 1.15,
    rootDepthMin: 30,
    rootDepthMax: 60,
    recommendedZone: 'zone1',
    description: 'ไม้พุ่มดอกช่อ นิยมปลูกริมรั้ว ทนทาน รากลึกระดับกลาง'
  },
  {
    id: 'cape-jasmine',
    name: 'พุดซ้อน',
    scientificName: 'Gardenia jasminoides',
    category: 'สวนไม้กระถาง',
    kcIni: 1.1,
    kcMid: 1.15,
    kcEnd: 1.15,
    rootDepthMin: 10,
    rootDepthMax: 20,
    recommendedZone: 'zone1',
    description: 'ไม้ดอกสีขาวกลิ่นหอม รากตื้น ดินต้องชุ่มชื้นสม่ำเสมอ'
  },
  {
    id: 'forget-me-not',
    name: 'Forget me not (แวววิเชียร)',
    scientificName: 'Angelonia goyazensis',
    category: 'สวนไม้กระถาง',
    kcIni: 0.7,
    kcMid: 1.0,
    kcEnd: 0.95,
    rootDepthMin: 10,
    rootDepthMax: 20,
    recommendedZone: 'zone1',
    description: 'ไม้ดอกกระถางล้มลุก รากตื้น ไวต่อการขาดน้ำในเวลากลางวัน'
  },

  // พืชไร่ / คลุมดิน
  {
    id: 'sunflower',
    name: 'ทานตะวัน',
    scientificName: 'Helianthus annuus',
    category: 'พืชไร่/พืชคลุมดิน',
    kcIni: 0.35,
    kcMid: 1.15,
    kcEnd: 0.35,
    rootDepthMin: 80,
    rootDepthMax: 150,
    recommendedZone: 'zone2',
    description: 'พืชล้มลุกช่วงต้นกินน้ำน้อย ช่วงออกดอกต้องการน้ำสูง รากหยั่งลึก'
  },
  {
    id: 'sunn-hemp',
    name: 'ปอเทือง',
    scientificName: 'Crotalaria juncea',
    category: 'พืชไร่/พืชคลุมดิน',
    kcIni: 0.4,
    kcMid: 1.15,
    kcEnd: 0.53,
    rootDepthMin: 50,
    rootDepthMax: 100,
    recommendedZone: 'zone2',
    description: 'พืชตระกูลถั่วบำรุงดิน ตรึงไนโตรเจน ทนแล้งได้ดี'
  },

  // แปลงไม้ยืนต้น
  {
    id: 'rain-tree',
    name: 'จามจุรี (ก้ามปู)',
    scientificName: 'Samanea saman',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.5,
    kcMid: 1.1,
    kcEnd: 0.65,
    rootDepthMin: 100,
    rootDepthMax: 300,
    recommendedZone: 'zone2',
    description: 'ไม้ยืนต้นขนาดใหญ่ เรือนยอดกว้าง รากลึกมาก ดูดซับน้ำลึกได้เอง'
  },
  {
    id: 'silver-buttonwood',
    name: 'กระดุมใบเงิน',
    scientificName: 'Conocarpus erectus sericeus',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.65,
    kcMid: 0.7,
    kcEnd: 0.7,
    rootDepthMin: 50,
    rootDepthMax: 100,
    recommendedZone: 'zone2',
    description: 'ไม้พุ่มขนาดกลาง ใบสีเขียวอมเงิน ทนแล้งและทนไอเค็มได้ดี'
  },
  {
    id: 'neem',
    name: 'สะเดา',
    scientificName: 'Azadirachta indica',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.65,
    kcMid: 0.7,
    kcEnd: 0.7,
    rootDepthMin: 200,
    rootDepthMax: 300,
    recommendedZone: 'zone2',
    description: 'ไม้ยืนต้นสมุนไพร ระบบรากลึก ทนแล้งสูงมาก'
  },
  {
    id: 'jacaranda',
    name: 'ศรีตรัง',
    scientificName: 'Jacaranda mimosifolia',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.6,
    kcMid: 0.95,
    kcEnd: 0.75,
    rootDepthMin: 100,
    rootDepthMax: 150,
    recommendedZone: 'zone2',
    description: 'ไม้ยืนต้นดอกม่วงสวยงาม รากลึกปานกลาง'
  },
  {
    id: 'pink-trumpet',
    name: 'ชมพูพันธุ์ทิพย์',
    scientificName: 'Tabebuia rosea',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.4,
    kcMid: 1.1,
    kcEnd: 0.45,
    rootDepthMin: 120,
    rootDepthMax: 150,
    recommendedZone: 'zone2',
    description: 'ไม้ยืนต้นผลัดใบช่วงออกดอก ระบบรากลึกปานกลาง'
  },
  {
    id: 'cork-tree',
    name: 'ดอกปีบ (กาสะลอง)',
    scientificName: 'Millingtonia hortensis',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.6,
    kcMid: 0.95,
    kcEnd: 0.75,
    rootDepthMin: 200,
    rootDepthMax: 300,
    recommendedZone: 'zone2',
    description: 'ไม้ยืนต้นทรงสูง ดอกหอม รากลึกมาก ทนสภาพดินแห้งได้ดี'
  },
  {
    id: 'silver-trumpet',
    name: 'เหลืองปรีดียาธร',
    scientificName: 'Tabebuia aurea',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.4,
    kcMid: 1.1,
    kcEnd: 0.45,
    rootDepthMin: 120,
    rootDepthMax: 150,
    recommendedZone: 'zone2',
    description: 'ไม้ยืนต้นผลัดใบ ออกดอกสีเหลืองอร่าม รากระดับกลาง'
  },
  {
    id: 'blackboard-tree',
    name: 'ตีนเป็ด (พญาสัตบรรณ)',
    scientificName: 'Alstonia scholaris',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.65,
    kcMid: 0.7,
    kcEnd: 0.7,
    rootDepthMin: 200,
    rootDepthMax: 200,
    recommendedZone: 'zone2',
    description: 'ไม้ยืนต้นโตเร็ว กิ่งแผ่เป็นชั้น รากหยั่งลึก'
  },
  {
    id: 'guava',
    name: 'ฝรั่ง',
    scientificName: 'Psidium guajava',
    category: 'แปลงไม้ยืนต้น',
    kcIni: 0.65,
    kcMid: 0.6,
    kcEnd: 0.65,
    rootDepthMin: 100,
    rootDepthMax: 150,
    recommendedZone: 'zone2',
    description: 'ไม้ผลยอดนิยม ต้องการน้ำสม่ำเสมอเพื่อความหวานกรอบของผลผลิต'
  },

  // พืชไร่
  {
    id: 'rice-rd43',
    name: 'ข้าว กข43',
    scientificName: 'Oryza sativa (RD43)',
    category: 'แปลงพืชไร่',
    kcIni: 1.05,
    kcMid: 1.2,
    kcEnd: 0.75,
    rootDepthMin: 30,
    rootDepthMax: 40,
    recommendedZone: 'zone1',
    description: 'ข้าวพันธุ์ค่าน้ำตาลต่ำ ต้องการน้ำสม่ำเสมอในระยะแตกกอและออกรวง'
  }
];

// 2. Weather & Pan Evaporation @ Lat Krabang (Kp = 0.75)
export const KP_LAT_KRABANG = 0.75;

export const WEATHER_EP_MONTHS: WeatherMonthData[] = [
  { month: 'มกราคม', shortMonth: 'ม.ค.', monthNum: 1, ep: 3.82, kp: KP_LAT_KRABANG, eto: Number((3.82 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'กุมภาพันธ์', shortMonth: 'ก.พ.', monthNum: 2, ep: 4.93, kp: KP_LAT_KRABANG, eto: Number((4.93 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'มีนาคม', shortMonth: 'มี.ค.', monthNum: 3, ep: 5.26, kp: KP_LAT_KRABANG, eto: Number((5.26 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'เมษายน', shortMonth: 'เม.ย.', monthNum: 4, ep: 4.74, kp: KP_LAT_KRABANG, eto: Number((4.74 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'พฤษภาคม', shortMonth: 'พ.ค.', monthNum: 5, ep: 4.45, kp: KP_LAT_KRABANG, eto: Number((4.45 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'มิถุนายน', shortMonth: 'มิ.ย.', monthNum: 6, ep: 4.27, kp: KP_LAT_KRABANG, eto: Number((4.27 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'กรกฎาคม', shortMonth: 'ก.ค.', monthNum: 7, ep: 3.24, kp: KP_LAT_KRABANG, eto: Number((3.24 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'สิงหาคม', shortMonth: 'ส.ค.', monthNum: 8, ep: 3.65, kp: KP_LAT_KRABANG, eto: Number((3.65 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'กันยายน', shortMonth: 'ก.ย.', monthNum: 9, ep: 3.37, kp: KP_LAT_KRABANG, eto: Number((3.37 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'ตุลาคม', shortMonth: 'ต.ค.', monthNum: 10, ep: 3.37, kp: KP_LAT_KRABANG, eto: Number((3.37 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'พฤศจิกายน', shortMonth: 'พ.ย.', monthNum: 11, ep: 3.80, kp: KP_LAT_KRABANG, eto: Number((3.80 * KP_LAT_KRABANG).toFixed(2)) },
  { month: 'ธันวาคม', shortMonth: 'ธ.ค.', monthNum: 12, ep: 3.76, kp: KP_LAT_KRABANG, eto: Number((3.76 * KP_LAT_KRABANG).toFixed(2)) },
];

// 3. Soil in Plots Lab Analysis
export const SOIL_PLOTS_DATA: SoilPlotData[] = [
  {
    plotId: 'plot1',
    plotName: 'แปลงที่ 1 (ไม้กระถาง/ผัก)',
    soilType: 'ดินเหนียว (Clay Soil)',
    infiltrationRate: 5.4524,
    labMoistureAvg: 41.56,
    targetMoistureMin: 41,
    targetMoistureMax: 50,
    targetTensionKpaMin: 15,
    targetTensionKpaMax: 35,
    warningNote: 'อุ้มน้ำสูงมาก ซึมน้ำช้า (5.45 มม./ชม.) ห้ามรดน้ำรวดเดียวเกิน 15 นาที เพราะจะเกิดน้ำท่วมขังผิวดิน'
  },
  {
    plotId: 'plot2',
    plotName: 'แปลงที่ 2 (ไม้ผล/ไม้ยืนต้น)',
    soilType: 'ดินเหนียว (Clay Soil)',
    infiltrationRate: 6.0304,
    labMoistureAvg: 45.96,
    targetMoistureMin: 41,
    targetMoistureMax: 50,
    targetTensionKpaMin: 20,
    targetTensionKpaMax: 45,
    warningNote: 'ดินเหนียวแน่น ระบายน้ำช้า ควรใช้ระบบน้ำหยดเพื่อให้น้ำซึมลงช้าๆ ถึงความลึกราก 1-2 เมตร'
  },
  {
    plotId: 'plot34',
    plotName: 'แปลงที่ 3 & 4 (พืชไร่/สำรอง)',
    soilType: 'ดินเหนียว (Clay Soil)',
    infiltrationRate: 6.6648,
    labMoistureAvg: 50.80,
    targetMoistureMin: 41,
    targetMoistureMax: 52,
    targetTensionKpaMin: 15,
    targetTensionKpaMax: 40,
    warningNote: 'ความชื้นสะสมสูงกว่า 50% ตรวจเช็คก่อนให้น้ำ หากความชื้นยังสูงให้งดรดน้ำเพื่อป้องกันรากเน่า'
  }
];

// 4. Sensors Architecture & Specs
export const SENSORS_SPECS: SensorSpec[] = [
  {
    id: 's1',
    type: 'Soil Sensor Node',
    communication: 'LoRaWAN',
    model: 'Capacitive (DFRobot)',
    location: 'พื้นที่ 1 (แปลงผัก/กระถาง)',
    rawData: 'สัญญาณอนาล็อก (Voltage / ADC 0-4095)',
    unit: '% (Relative Moisture)',
    workflow: 'ใช้ดูแนวโน้มความชื้นเบื้องต้น ต้องทำ Calibration ก่อน ไม่เหมาะกับการคำนวณปริมาตรน้ำตรงๆ',
    formulaNote: 'Relative% = ((ADC_Air - ADC_Read) / (ADC_Air - ADC_Water)) * 100',
    typicalRange: '40% - 75%',
    status: 'online'
  },
  {
    id: 's2',
    type: 'Soil Sensor Node',
    communication: 'WiFi (ESP32)',
    model: 'Watermark 200SS',
    location: 'พื้นที่ 2 (ไม้ผล/ไม้ยืนต้น)',
    rawData: 'ความต้านทานไฟฟ้า (Ohms)',
    unit: 'kPa หรือ cb (Soil Tension)',
    workflow: 'ใช้วัดแรงดึงน้ำในดิน เพื่อเป็นจุดทริกเกอร์ (Threshold) สั่งเปิดปั๊มเมื่อพืชเริ่มเครียดขาดน้ำ',
    formulaNote: 'kPa = 7.407 * (R / (1 - 0.018 * (T - 24))) - 3.7',
    typicalRange: '10 - 80 kPa (ค่าต่ำ = ชื้นมาก, ค่าสูง = ดินแห้ง)',
    status: 'online'
  },
  {
    id: 's3',
    type: 'Soil Sensor Node',
    communication: 'Zigbee',
    model: 'RS-485 Modbus (Seeed S-Soil MT-02)',
    location: 'พื้นที่ 3',
    rawData: 'ข้อมูลดิจิทัล (Modbus RTU Register)',
    unit: '% VWC, °C, µS/cm',
    workflow: 'ใช้ค่า %VWC (ความชื้นเชิงปริมาตร) คำนวณหา Soil Water Deficit ว่าต้องเติมน้ำกี่มิลลิเมตรให้เต็ม Field Capacity (FC)',
    formulaNote: 'Water Needed (mm) = (FieldCapacity% - VWC%) * RootDepth(cm) / 10',
    typicalRange: '20% - 55% VWC',
    status: 'online'
  },
  {
    id: 's4',
    type: 'Soil Sensor Node',
    communication: 'LoRa P2P',
    model: 'Tensiometer',
    location: 'พื้นที่ 4',
    rawData: 'แรงดันสุญญากาศ (กลศาสตร์/Analog)',
    unit: 'kPa, cb หรือ Bar',
    workflow: 'ใช้อ่านความเครียดของพืชโดยตรง เพื่อความแม่นยำสูงในการกำหนดจังหวะให้น้ำ',
    formulaNote: 'Direct soil suction measurement in root zone',
    typicalRange: '0 - 100 cb',
    status: 'online'
  },
  {
    id: 's5',
    type: 'Weather Station',
    communication: 'WiFi',
    model: 'SenseCAP 5700-B (คำนวณ ETc)',
    location: 'พื้นที่ 5 (สถานีอากาศกลางฟาร์ม)',
    rawData: 'ข้อมูลดิจิทัล (แพ็กเกจสภาพอากาศ)',
    unit: '°C, %RH, m/s, mm, W/m², hPa',
    workflow: 'ใช้คำนวณการคายระเหยอ้างอิง (ETo), ความต้องการน้ำ (ETc) และฝนใช้การ (Effective Rainfall)',
    formulaNote: 'FAO-56 Penman-Monteith Equation or EP * Kp',
    typicalRange: 'ETo 2.0 - 5.5 mm/day',
    status: 'online'
  },
  {
    id: 's6',
    type: 'Crop Station / ปั๊มหลัก',
    communication: 'WiFi',
    model: 'Flow meter (YF-S201) + เซ็นเซอร์วัดระยะน้ำ (Ultrasonic)',
    location: 'ปั๊มหลัก & ถังพักน้ำ 5,000 ลิตร',
    rawData: 'สัญญาณพัลส์ (Pulse Frequency) + ระยะทาง (Distance cm)',
    unit: 'L/min (อัตราการไหล), L (ปริมาตรสะสม), cm/m',
    workflow: 'คำนวณระยะเวลาเปิดปั๊ม (Runtime) ยืนยันน้ำไหลจริง และคำนวณปริมาตรน้ำต้นทุนในถังก่อนสั่งปั๊ม',
    formulaNote: 'Flow L/min = Pulse/7.5; Tank Vol = BaseArea * (MaxHeight - SensorDistance)',
    typicalRange: '0 - 30 L/min, 0 - 5000 Liters',
    status: 'online'
  }
];

// 5. Data Pipeline Transformation Guide (User Question Answer)
export const DATA_PIPELINE_STAGES = [
  {
    stage: '1. Raw Sensor Ingestion (รับค่าดิบจากฮาร์ดแวร์)',
    description: 'รับสัญญาณ Analog Voltage, Resistance (Ohms), Modbus RTU bytes, Ultrasonic distance, Pulse counts ผ่าน LoRaWAN/WiFi/Zigbee',
    actionNeeded: 'แปลงสัญญาณทางไฟฟ้าให้อยู่ในหน่วยมาตรวิทยามาตรฐาน พร้อมตรวจจับ Packet Loss และค่า Spike หลุดสเกล'
  },
  {
    stage: '2. Unit Conversion & Sensor Calibration (การปรับเทียบและแปลงหน่วย)',
    description: 'แปลง Voltage เป็น % ความชื้นสัมพัทธ์, Ohms เป็น Tension (kPa), Distance เป็นความจุถัง (Liters), Pulses เป็นอัตราการไหล (L/min)',
    actionNeeded: 'ต้องทำ Calibration Curve ในแล็ป เช่น เซ็นเซอร์ดินเหนียวแต่ละชนิดตอบสนองต่อเกลือแร่และอุณหภูมิไม่เท่ากัน'
  },
  {
    stage: '3. Agronomy Engine Calculation (การคำนวณทางเกษตรศาสตร์)',
    description: 'นำข้อมูลสภาพอากาศ (EP x Kp = ETo) มารวมกับพืชที่ปลูก (ETo x Kc = ETc) และสมรรถนะดินเหนียว (5.45 mm/hr)',
    actionNeeded: 'คำนวณว่าแปลงต้องการน้ำกี่มิลลิเมตร หรือกี่ลิตรต่อวัน และคำนวณเวลาการเปิดปั๊ม (Watering Duration) ที่สอดคล้องกับอัตราการซึม'
  },
  {
    stage: '4. Decision & Safety Interlock (การตัดสินใจและระบบความปลอดภัย)',
    description: 'ตรวจสอบเงื่อนไข 3 ด้านก่อนเปิดปั๊ม: 1) น้ำในถังพอไหม (>15%) 2) ดินแห้งถึงเกณฑ์ทริกเกอร์หรือไม่ 3) ฝนตกหรือไม่',
    actionNeeded: 'สั่งเปิดปั๊มหลัก -> เช็ค Flow meter วิ่งหรือไม่ (ป้องกันปั๊มไหม้ Dry-run) -> เปิดวาล์วโซน 1 หรือ 2'
  },
  {
    stage: '5. UI Presentation for Everyone (การแสดงผลที่เข้าใจง่าย ไม่เกะกะ)',
    description: 'ซ่อนสูตรซับซ้อนไว้เบื้องหลัง แสดงผลลัพธ์เป็นข้อความภาษาง่ายๆ พร้อมไฟสถานะเขียว/เหลือง/แดง และปุ่มกด Liquid Glass ที่ชัดเจน',
    actionNeeded: 'แบ่งเลเยอร์: ผู้ใช้งานทั่วไปกดเปิด-ปิดดูแค่เปอร์เซ็นต์สีเขียว ส่วนทีมงานกดดูตัวเลขเชิงลึกและสเปกเซ็นเซอร์ได้ในแท็บ Data'
  }
];
