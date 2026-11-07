/**
 * TARIFA OFICIAL 2027 - BASE DE DATOS COMPLETA DE PRODUCTOS
 * Tarificador Comercial Pro 2027
 */

const CHANNELS = [
  { id: 't3', label: 'Tramo 3 (Frame - Máximo)', default: true },
  { id: 't2', label: 'Tramo 2', default: false },
  { id: 't1', label: 'Tramo 1', default: false },
  { id: 't4', label: 'Tramo 4', default: false },
  { id: 'diurno', label: 'HORECA Diurno', default: false },
  { id: 'nocturno', label: 'HORECA Nocturno', default: false },
  { id: 'at', label: 'Tarifa AT (Alimentación Tradicional)', default: false },
  { id: 'zero', label: 'Descuento 0% (Tarifa Base)', default: false }
];

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: '✨' },
  { id: 'vidrio_vr', label: 'Vidrio VR', icon: '🍾' },
  { id: 'latas', label: 'Latas', icon: '🥫' },
  { id: 'pet', label: 'PET', icon: '🧴' },
  { id: 'aguas', label: 'Aguas', icon: '💧' },
  { id: 'mixers_energy', label: 'Energéticas / Mixers', icon: '⚡' }
];

const PRODUCTS_DB = [
  // ==========================================
  // A) VIDRIO RETORNABLE (VR) - HOSTELERÍA
  // ==========================================
  {
    id: 'vr-cc-regular-237',
    code: 'VR01',
    name: 'Coca-Cola Regular VR 23,7 cl',
    brand: 'Coca-Cola',
    format: 'VR 23,7 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 27.36,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 23.7,
    discounts: {
      t3: 32.50, // Caja: 18.47 €, Ud: 0.770 €
      t2: 29.50,
      t1: 28.50,
      t4: 33.50,
      diurno: 29.50,
      nocturno: 29.50,
      at: 32.50,
      zero: 0.0
    },
    highlightSalesPitch: 'VR 23,7 cl (+18,5% vs 200 ml competidor, casi 1L más por caja)'
  },
  {
    id: 'vr-cc-zero-237',
    code: 'VR02',
    name: 'Coca-Cola Zero VR 23,7 cl',
    brand: 'Coca-Cola',
    format: 'VR 23,7 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 27.36,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 23.7,
    discounts: {
      t3: 32.50,
      t2: 29.50,
      t1: 28.50,
      t4: 33.50,
      diurno: 29.50,
      nocturno: 29.50,
      at: 32.50,
      zero: 0.0
    },
    highlightSalesPitch: 'VR 23,7 cl (+18,5% vs 200 ml competidor)'
  },
  {
    id: 'vr-cc-light-zz-237',
    code: 'VR03',
    name: 'Coca-Cola Light / Zero Zero VR 23,7 cl',
    brand: 'Coca-Cola',
    format: 'VR 23,7 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 27.36,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 23.7,
    discounts: {
      t3: 32.50, // Caja: 18.47 €
      t2: 29.50,
      t1: 28.50,
      t4: 33.50,
      diurno: 29.50,
      nocturno: 29.50,
      at: 32.50,
      zero: 0.0
    },
    highlightSalesPitch: 'VR 23,7 cl (+18,5% vs 200 ml competidor)'
  },
  {
    id: 'vr-fanta-naranja-237',
    code: 'VR04',
    name: 'Fanta Naranja VR 23,7 cl',
    brand: 'Fanta',
    format: 'VR 23,7 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 27.36,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 23.7,
    discounts: {
      t3: 46.50, // Caja: 14.64 €, Ud: 0.610 €
      t2: 43.50,
      t1: 42.50,
      t4: 47.50,
      diurno: 43.50,
      nocturno: 43.50,
      at: 46.50,
      zero: 0.0
    },
    highlightSalesPitch: 'Precio imbatible 14,64 € en Tramo 3 con 23,7 cl'
  },
  {
    id: 'vr-fanta-limon-frambuesa-237',
    code: 'VR05',
    name: 'Fanta Limón / Frambuesa VR 23,7 cl',
    brand: 'Fanta',
    format: 'VR 23,7 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 27.36,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 23.7,
    discounts: {
      t3: 46.50, // Caja: 14.64 €, Ud: 0.610 €
      t2: 43.50,
      t1: 42.50,
      t4: 47.50,
      diurno: 43.50,
      nocturno: 43.50,
      at: 46.50,
      zero: 0.0
    },
    highlightSalesPitch: 'Precio imbatible 14,64 € en Tramo 3 con 23,7 cl'
  },
  {
    id: 'vr-sprite-20',
    code: 'VR06',
    name: 'Sprite VR 20 cl',
    brand: 'Sprite',
    format: 'VR 20 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 26.88,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 20.0,
    discounts: {
      t3: 46.50, // Caja: 14.38 €, Ud: 0.599 €
      t2: 43.50,
      t1: 42.50,
      t4: 47.50,
      diurno: 43.50,
      nocturno: 43.50,
      at: 46.50,
      zero: 0.0
    },
    highlightSalesPitch: 'Excelente rotación y margen en hostelería'
  },
  {
    id: 'vr-nordic-tonica-blue-20',
    code: 'VR07',
    name: 'Nordic Mist Tónica / Blue VR 20 cl',
    brand: 'Nordic Mist',
    format: 'VR 20 cl',
    category: 'vidrio_vr',
    subCategory: 'Mixers',
    unitsPerBox: 24,
    tarifaBase: 33.12,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 20.0,
    discounts: {
      t3: 46.50, // Caja: 17.72 €, Ud: 0.738 €
      t2: 43.50,
      t1: 42.50,
      t4: 47.50,
      diurno: 43.50,
      nocturno: 43.50,
      at: 46.50,
      zero: 0.0
    },
    highlightSalesPitch: 'Tónica estándar líder de combinados'
  },
  {
    id: 'vr-royal-bliss-variedades-20',
    code: 'VR08',
    name: 'Royal Bliss (Signature / Zero / Berry / Naranja) VR 20 cl',
    brand: 'Royal Bliss',
    format: 'VR 20 cl',
    category: 'vidrio_vr',
    subCategory: 'Mixers',
    unitsPerBox: 24,
    tarifaBase: 34.32,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 20.0,
    discounts: {
      t3: 40.00, // Caja: 20.59 €, Ud: 0.858 €
      t2: 37.00,
      t1: 36.00,
      t4: 41.00,
      diurno: 37.00,
      nocturno: 37.00,
      at: 40.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Línea Premium para coctelería y tardeo/noche'
  },
  {
    id: 'vr-royal-bliss-lemon-mixer-20',
    code: 'VR09',
    name: 'Royal Bliss Lemon Mixer VR 20 cl',
    brand: 'Royal Bliss',
    format: 'VR 20 cl',
    category: 'vidrio_vr',
    subCategory: 'Mixers',
    unitsPerBox: 24,
    tarifaBase: 32.16,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 20.0,
    discounts: {
      t3: 40.00, // Caja: 19.30 €, Ud: 0.804 €
      t2: 37.00,
      t1: 36.00,
      t4: 41.00,
      diurno: 37.00,
      nocturno: 37.00,
      at: 40.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Mixer cítrico versátil de alta rentabilidad'
  },
  {
    id: 'vr-aquarius-limon-30',
    code: 'VR10',
    name: 'Aquarius Limón VR 30 cl',
    brand: 'Aquarius',
    format: 'VR 30 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 37.44,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 30.0,
    discounts: {
      t3: 48.00, // Caja: 19.47 €, Ud: 0.811 €
      t2: 44.00,
      t1: 43.00,
      t4: 49.00,
      diurno: 44.00,
      nocturno: 44.00,
      at: 48.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Gran formato 30 cl (+50% volumen vs 200 ml, Caja 19,47 €)'
  },
  {
    id: 'vr-aquarius-naranja-melocoton-30',
    code: 'VR11',
    name: 'Aquarius Naranja / Melocotón Rojo VR 30 cl',
    brand: 'Aquarius',
    format: 'VR 30 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 37.44,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 30.0,
    discounts: {
      t3: 48.00, // Caja: 19.47 €, Ud: 0.811 €
      t2: 44.00,
      t1: 43.00,
      t4: 49.00,
      diurno: 44.00,
      nocturno: 44.00,
      at: 48.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Gran formato 30 cl isotónico líder en hostelería'
  },
  {
    id: 'vr-fuze-tea-30',
    code: 'VR12',
    name: 'Fuze Tea (Limón / S/A / Mango-Piña / Maracuyá) VR 30 cl',
    brand: 'Fuze Tea',
    format: 'VR 30 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 34.08,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 30.0,
    discounts: {
      t3: 48.00, // Caja: 17.72 €, Ud: 0.738 €
      t2: 44.00,
      t1: 43.00,
      t4: 49.00,
      diurno: 44.00,
      nocturno: 44.00,
      at: 48.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Formato 30 cl té helado de alta demanda'
  },
  {
    id: 'vr-coca-cola-35',
    code: 'VR13',
    name: 'Coca-Cola (Regular / Zero / Light / Zero Zero) VR 35 cl',
    brand: 'Coca-Cola',
    format: 'VR 35 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 31.68,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 35.0,
    discounts: {
      t3: 37.50, // Caja: 19.80 €, Ud: 0.825 €
      t2: 34.50,
      t1: 33.50,
      t4: 38.50,
      diurno: 34.50,
      nocturno: 34.50,
      at: 37.50,
      zero: 0.0
    },
    highlightSalesPitch: 'Maxi formato 35 cl para terrazas y comidas'
  },
  {
    id: 'vr-fanta-sprite-35',
    code: 'VR14',
    name: 'Fanta (Naranja / Limón) y Sprite VR 35 cl',
    brand: 'Fanta / Sprite',
    format: 'VR 35 cl',
    category: 'vidrio_vr',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 31.68,
    pvCaja: 0.024,
    iva: 21,
    volumeCl: 35.0,
    discounts: {
      t3: 46.50, // Caja: 16.95 €, Ud: 0.706 €
      t2: 43.50,
      t1: 42.50,
      t4: 47.50,
      diurno: 43.50,
      nocturno: 43.50,
      at: 46.50,
      zero: 0.0
    },
    highlightSalesPitch: 'Maxi formato 35 cl sabor frutal y refrescante'
  },
  {
    id: 'vr-aquabona-singular-365',
    code: 'VR15',
    name: 'Aquabona Singular VR 36,5 cl (20 uds)',
    brand: 'Aquabona',
    format: 'VR 36,5 cl',
    category: 'vidrio_vr',
    subCategory: 'Aguas',
    unitsPerBox: 20,
    tarifaBase: 26.20,
    pvCaja: 0.020,
    iva: 10,
    volumeCl: 36.5,
    discounts: {
      t3: 40.00,
      t2: 38.00,
      t1: 37.00,
      t4: 41.00,
      diurno: 38.00,
      nocturno: 38.00,
      at: 40.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Vidrio diseño exclusivo mesa elegante (IVA 10%)'
  },
  {
    id: 'vr-aquabona-50',
    code: 'VR16',
    name: 'Aquabona VR 50 cl (20 uds)',
    brand: 'Aquabona',
    format: 'VR 50 cl',
    category: 'vidrio_vr',
    subCategory: 'Aguas',
    unitsPerBox: 20,
    tarifaBase: 22.20,
    pvCaja: 0.020,
    iva: 10,
    volumeCl: 50.0,
    discounts: {
      t3: 40.00,
      t2: 38.00,
      t1: 37.00,
      t4: 41.00,
      diurno: 38.00,
      nocturno: 38.00,
      at: 40.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Agua mineral natural retornable para mantel'
  },
  {
    id: 'vr-aquabona-1l',
    code: 'VR17',
    name: 'Aquabona VR 1 L (12 uds)',
    brand: 'Aquabona',
    format: 'VR 1 L',
    category: 'vidrio_vr',
    subCategory: 'Aguas',
    unitsPerBox: 12,
    tarifaBase: 21.12,
    pvCaja: 0.012,
    iva: 10,
    volumeCl: 100.0,
    discounts: {
      t3: 40.00,
      t2: 38.00,
      t1: 37.00,
      t4: 41.00,
      diurno: 38.00,
      nocturno: 38.00,
      at: 40.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Formato familiar 1L vidrio retornable mesa'
  },

  // ==========================================
  // B) LATAS Y PET (TARIFA 2027)
  // ==========================================
  // 1. LATA 25 cl. TONICA NORDIC
  {
    id: 'lata-nordic-25',
    num: 1,
    code: 'L01',
    name: 'Tónica Nordic Mist Lata 25 cl',
    brand: 'Nordic Mist',
    format: 'LATA 25 cl.',
    category: 'latas',
    subCategory: 'Mixers',
    unitsPerBox: 24,
    tarifaBase: 36.24,
    pvCaja: 0.048,
    iva: 21,
    volumeCl: 25.0,
    discounts: {
      t3: 70.00,
      t2: 67.00,
      t1: 65.00,
      t4: 71.00,
      diurno: 67.00,
      nocturno: 67.00,
      at: 70.00, // 10.87 € caja, 0.453 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Neto Ud 0,453 € - Gran margen de copa'
  },
  // 2. LATA 25 cl. TONICA ROYAL BLISS
  {
    id: 'lata-royal-bliss-25',
    num: 2,
    code: 'L02',
    name: 'Tónica Royal Bliss Lata 25 cl',
    brand: 'Royal Bliss',
    format: 'LATA 25 cl.',
    category: 'latas',
    subCategory: 'Mixers',
    unitsPerBox: 12,
    tarifaBase: 16.80,
    pvCaja: 0.012,
    iva: 21,
    volumeCl: 25.0,
    discounts: {
      t3: 54.00,
      t2: 51.00,
      t1: 49.00,
      t4: 55.00,
      diurno: 51.00,
      nocturno: 51.00,
      at: 54.00, // 7.73 € caja, 0.644 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Mixer premium en formato individual C/12'
  },
  // 3. LATA 25 cl. BURN
  {
    id: 'lata-burn-25',
    num: 3,
    code: 'L03',
    name: 'Burn Lata 25 cl',
    brand: 'Burn',
    format: 'LATA 25 cl.',
    category: 'latas',
    subCategory: 'Energéticas',
    unitsPerBox: 24,
    tarifaBase: 61.68,
    pvCaja: 0.072,
    iva: 21,
    volumeCl: 25.0,
    discounts: {
      t3: 73.13,
      t2: 70.00,
      t1: 68.00,
      t4: 74.00,
      diurno: 70.00,
      nocturno: 70.00,
      at: 73.13, // 16.57 € caja, 0.691 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Energética líder con 73,13% descuento'
  },
  // 4. LATA 25 cl. MONSTER
  {
    id: 'lata-monster-25',
    num: 4,
    code: 'L04',
    name: 'Monster Lata 25 cl',
    brand: 'Monster',
    format: 'LATA 25 cl.',
    category: 'latas',
    subCategory: 'Energéticas',
    unitsPerBox: 24,
    tarifaBase: 46.56,
    pvCaja: 0.048,
    iva: 21,
    volumeCl: 25.0,
    discounts: {
      t3: 52.84,
      t2: 50.00,
      t1: 48.00,
      t4: 54.00,
      diurno: 50.00,
      nocturno: 50.00,
      at: 52.84, // 21.96 € caja, 0.915 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Monster compacto 25 cl alta demanda noche y tarde'
  },
  // 5. LATA 25 cl. APPLETISER
  {
    id: 'lata-appletiser-25',
    num: 5,
    code: 'L05',
    name: 'Appletiser Lata 25 cl',
    brand: 'Appletiser',
    format: 'LATA 25 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 12,
    tarifaBase: 16.68,
    pvCaja: 0.012,
    iva: 21,
    volumeCl: 25.0,
    discounts: {
      t3: 55.20,
      t2: 52.00,
      t1: 50.00,
      t4: 56.00,
      diurno: 52.00,
      nocturno: 52.00,
      at: 55.20, // 7.47 € caja, 0.623 € ud
      zero: 0.0
    },
    highlightSalesPitch: '100% zumo de manzana con burbuja fina C/12'
  },
  // 6. LATA 25 cl. ABSOLUT SPRITE
  {
    id: 'lata-absolut-sprite-25',
    num: 6,
    code: 'L06',
    name: 'Absolut Sprite Lata 25 cl',
    brand: 'Absolut',
    format: 'LATA 25 cl.',
    category: 'latas',
    subCategory: 'Alcohol Ready-to-Drink',
    unitsPerBox: 12,
    tarifaBase: 36.60,
    pvCaja: 0.012,
    iva: 21,
    volumeCl: 25.0,
    discounts: {
      t3: 57.05,
      t2: 54.00,
      t1: 52.00,
      t4: 58.00,
      diurno: 54.00,
      nocturno: 54.00,
      at: 57.05, // 15.72 € caja, 1.310 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Combinado premium RTD listo para servir'
  },
  // 7. LATA 25 cl. BACARDI COLA
  {
    id: 'lata-bacardi-cola-25',
    num: 7,
    code: 'L07',
    name: 'Bacardi Cola Lata 25 cl',
    brand: 'Bacardi',
    format: 'LATA 25 cl.',
    category: 'latas',
    subCategory: 'Alcohol Ready-to-Drink',
    unitsPerBox: 12,
    tarifaBase: 36.60,
    pvCaja: 0.012,
    iva: 21,
    volumeCl: 25.0,
    discounts: {
      t3: 57.05,
      t2: 54.00,
      t1: 52.00,
      t4: 58.00,
      diurno: 54.00,
      nocturno: 54.00,
      at: 57.05, // 15.72 € caja, 1.310 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Cuba libre oficial listo para consumir'
  },
  // 8. LATA 33 cl. COCA-COLA
  {
    id: 'lata-cc-33',
    num: 8,
    code: 'L08',
    name: 'Coca-Cola Lata 33 cl (Sabor Original / Zero)',
    brand: 'Coca-Cola',
    format: 'LATA 33 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 42.00,
    pvCaja: 0.072,
    iva: 21,
    volumeCl: 33.0,
    discounts: {
      t3: 59.10, // Tramo 2/3 Horeca: 59.10% -> 17.18 €
      t2: 59.10,
      t1: 56.50,
      t4: 60.50,
      diurno: 59.10,
      nocturno: 59.10,
      at: 66.55, // 14.05 € caja, 0.585 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'El formato lata más vendido de España'
  },
  // 9. LATA 33 cl. FANTA
  {
    id: 'lata-fanta-33',
    num: 9,
    code: 'L09',
    name: 'Fanta Naranja / Limón Lata 33 cl',
    brand: 'Fanta',
    format: 'LATA 33 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 41.04,
    pvCaja: 0.072,
    iva: 21,
    volumeCl: 33.0,
    discounts: {
      t3: 70.90,
      t2: 67.50,
      t1: 65.50,
      t4: 71.90,
      diurno: 67.50,
      nocturno: 67.50,
      at: 70.90, // 11.94 € caja, 0.498 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Gran margen: neto unidad menos de 0,50 €'
  },
  // 10. LATA 33 cl. SPRITE
  {
    id: 'lata-sprite-33',
    num: 10,
    code: 'L10',
    name: 'Sprite Lata 33 cl',
    brand: 'Sprite',
    format: 'LATA 33 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 41.04,
    pvCaja: 0.072,
    iva: 21,
    volumeCl: 33.0,
    discounts: {
      t3: 70.90,
      t2: 67.50,
      t1: 65.50,
      t4: 71.90,
      diurno: 67.50,
      nocturno: 67.50,
      at: 70.90, // 11.94 € caja, 0.498 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Refrescante lima-limón a 11,94 € caja en AT'
  },
  // 11. LATA 33 cl. AQUARIUS
  {
    id: 'lata-aquarius-33',
    num: 11,
    code: 'L11',
    name: 'Aquarius Limón / Naranja Lata 33 cl',
    brand: 'Aquarius',
    format: 'LATA 33 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 44.88,
    pvCaja: 0.072,
    iva: 21,
    volumeCl: 33.0,
    discounts: {
      t3: 63.00,
      t2: 60.00,
      t1: 58.00,
      t4: 64.00,
      diurno: 60.00,
      nocturno: 60.00,
      at: 63.00, // 16.61 € caja, 0.692 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Isotónico por excelencia para hostelería y llevar'
  },
  // 12. LATA 33 cl. FUZE TEA
  {
    id: 'lata-fuze-tea-33',
    num: 12,
    code: 'L12',
    name: 'Fuze Tea Limón / Mango Lata 33 cl',
    brand: 'Fuze Tea',
    format: 'LATA 33 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 40.80,
    pvCaja: 0.072,
    iva: 21,
    volumeCl: 33.0,
    discounts: {
      t3: 73.19,
      t2: 70.00,
      t1: 68.00,
      t4: 74.00,
      diurno: 70.00,
      nocturno: 70.00,
      at: 73.19, // 10.94 € caja, 0.456 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Té helado premium a solo 0,456 € la unidad'
  },
  // 13. LATA 33 cl. JACK&COKE
  {
    id: 'lata-jack-coke-33',
    num: 13,
    code: 'L13',
    name: "Jack Daniel's & Coca-Cola Lata 33 cl",
    brand: 'Jack & Coke',
    format: 'LATA 33 cl.',
    category: 'latas',
    subCategory: 'Alcohol Ready-to-Drink',
    unitsPerBox: 12,
    tarifaBase: 46.56,
    pvCaja: 0.036,
    iva: 21,
    volumeCl: 33.0,
    discounts: {
      t3: 62.50,
      t2: 59.50,
      t1: 58.00,
      t4: 63.50,
      diurno: 59.50,
      nocturno: 59.50,
      at: 62.50, // 17.46 € caja, 1.455 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Alianza legendaria en formato de 33 cl'
  },
  // 14. LATA 50 cl. BURN
  {
    id: 'lata-burn-50',
    num: 14,
    code: 'L14',
    name: 'Burn Lata 50 cl',
    brand: 'Burn',
    format: 'LATA 50 cl.',
    category: 'latas',
    subCategory: 'Energéticas',
    unitsPerBox: 12,
    tarifaBase: 38.28,
    pvCaja: 0.036,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 80.65,
      t2: 77.50,
      t1: 75.50,
      t4: 81.50,
      diurno: 77.50,
      nocturno: 77.50,
      at: 80.65, // 7.41 € caja, 0.617 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Descuento récord 80,65% - 7,41 € por caja de 12'
  },
  // 15. LATA 50 cl. MONSTER
  {
    id: 'lata-monster-50',
    num: 15,
    code: 'L15',
    name: 'Monster Energy Variedades Lata 50 cl',
    brand: 'Monster',
    format: 'LATA 50 cl.',
    category: 'latas',
    subCategory: 'Energéticas',
    unitsPerBox: 24,
    tarifaBase: 59.04,
    pvCaja: 0.072,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 58.40,
      t2: 55.00,
      t1: 53.00,
      t4: 59.50,
      diurno: 55.00,
      nocturno: 55.00,
      at: 58.40, // 24.56 € caja, 1.023 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'La marca nº1 de energéticas en medio litro'
  },
  // 16. LATA 50 cl. BANG
  {
    id: 'lata-bang-50',
    num: 16,
    code: 'L16',
    name: 'Bang Energy Lata 50 cl',
    brand: 'Bang',
    format: 'LATA 50 cl.',
    category: 'latas',
    subCategory: 'Energéticas',
    unitsPerBox: 12,
    tarifaBase: 14.64,
    pvCaja: 0.036,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 57.38,
      t2: 54.00,
      t1: 52.00,
      t4: 58.50,
      diurno: 54.00,
      nocturno: 54.00,
      at: 57.38, // 6.24 € caja, 0.520 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Bebida energética fitness y zero azúcar'
  },
  // 17. LATA 50 cl. COCA-COLA
  {
    id: 'lata-cc-50',
    num: 17,
    code: 'L17',
    name: 'Coca-Cola Lata 50 cl',
    brand: 'Coca-Cola',
    format: 'LATA 50 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 12,
    tarifaBase: 22.08,
    pvCaja: 0.036,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 50.80,
      t2: 48.00,
      t1: 46.00,
      t4: 52.00,
      diurno: 48.00,
      nocturno: 48.00,
      at: 50.80, // 10.86 € caja, 0.905 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Medio litro para consumo take away y kioscos'
  },
  // 18. LATA 50 cl. FANTA
  {
    id: 'lata-fanta-50',
    num: 18,
    code: 'L18',
    name: 'Fanta Naranja Lata 50 cl',
    brand: 'Fanta',
    format: 'LATA 50 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 12,
    tarifaBase: 18.48,
    pvCaja: 0.036,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 41.50,
      t2: 39.00,
      t1: 37.00,
      t4: 42.50,
      diurno: 39.00,
      nocturno: 39.00,
      at: 41.50, // 10.81 € caja, 0.901 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Maxi lata 50 cl sabor intenso'
  },
  // 19. LATA 50 cl. SPRITE
  {
    id: 'lata-sprite-50',
    num: 19,
    code: 'L19',
    name: 'Sprite Lata 50 cl',
    brand: 'Sprite',
    format: 'LATA 50 cl.',
    category: 'latas',
    subCategory: 'Refrescos',
    unitsPerBox: 12,
    tarifaBase: 18.48,
    pvCaja: 0.036,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 42.31,
      t2: 39.50,
      t1: 38.00,
      t4: 43.50,
      diurno: 39.50,
      nocturno: 39.50,
      at: 42.31, // 10.66 € caja, 0.888 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Formato 50 cl refrescante de alta rotación'
  },
  // 20. LATA 55,8 cl. MONSTER
  {
    id: 'lata-monster-558',
    num: 20,
    code: 'L20',
    name: 'Monster Mega Can 55,8 cl',
    brand: 'Monster',
    format: 'LATA 55,8 cl.',
    category: 'latas',
    subCategory: 'Energéticas',
    unitsPerBox: 12,
    tarifaBase: 31.80,
    pvCaja: 0.048,
    iva: 21,
    volumeCl: 55.8,
    discounts: {
      t3: 58.90,
      t2: 56.00,
      t1: 54.00,
      t4: 60.0,
      diurno: 56.00,
      nocturno: 56.00,
      at: 58.90, // 13.07 € caja, 1.089 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Mega lata con cierre con tapa resellable'
  },

  // ------------------------------------------
  // PET 50 cl.
  // ------------------------------------------
  // 21. PET 50 cl. COCA-COLA
  {
    id: 'pet-cc-50',
    num: 21,
    code: 'P01',
    name: 'Coca-Cola PET 50 cl',
    brand: 'Coca-Cola',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 49.20,
    pvCaja: 0.192,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 55.78,
      t2: 52.50,
      t1: 50.50,
      t4: 57.00,
      diurno: 52.50,
      nocturno: 52.50,
      at: 55.78, // 21.76 € caja, 0.907 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Botella individual perfecta para llevar e impulso'
  },
  // 22. PET 50 cl. FANTA
  {
    id: 'pet-fanta-50',
    num: 22,
    code: 'P02',
    name: 'Fanta Naranja / Limón PET 50 cl',
    brand: 'Fanta',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 49.20,
    pvCaja: 0.192,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 57.08,
      t2: 54.00,
      t1: 52.00,
      t4: 58.50,
      diurno: 54.00,
      nocturno: 54.00,
      at: 57.08, // 21.12 € caja, 0.880 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Botella de medio litro con tapón adherido'
  },
  // 23. PET 50 cl. SPRITE
  {
    id: 'pet-sprite-50',
    num: 23,
    code: 'P03',
    name: 'Sprite PET 50 cl',
    brand: 'Sprite',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 49.20,
    pvCaja: 0.192,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 57.08,
      t2: 54.00,
      t1: 52.00,
      t4: 58.50,
      diurno: 54.00,
      nocturno: 54.00,
      at: 57.08, // 21.12 € caja, 0.880 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Formato PET 50 cl muy pedido en comida rápida y delivery'
  },
  // 24. PET 50 cl. AQUARIUS
  {
    id: 'pet-aquarius-50',
    num: 24,
    code: 'P04',
    name: 'Aquarius Limón / Naranja PET 50 cl',
    brand: 'Aquarius',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 56.40,
    pvCaja: 0.216,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 60.54,
      t2: 57.50,
      t1: 55.50,
      t4: 61.50,
      diurno: 57.50,
      nocturno: 57.50,
      at: 60.54, // 22.26 € caja, 0.927 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Líder absoluto de hidratación en formato viaje'
  },
  // 25. PET 50 cl. FUZE TEA
  {
    id: 'pet-fuze-tea-50',
    num: 25,
    code: 'P05',
    name: 'Fuze Tea Limón / Mango PET 50 cl',
    brand: 'Fuze Tea',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 56.40,
    pvCaja: 0.216,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 62.44,
      t2: 59.00,
      t1: 57.00,
      t4: 63.50,
      diurno: 59.00,
      nocturno: 59.00,
      at: 62.44, // 21.18 € caja, 0.883 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Té con extracto natural en botella ergonómica'
  },
  // 26. PET 50 cl. POWERADE
  {
    id: 'pet-powerade-50',
    num: 26,
    code: 'P06',
    name: 'Powerade Ice Storm PET 50 cl',
    brand: 'Powerade',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Energéticas',
    unitsPerBox: 12,
    tarifaBase: 35.28,
    pvCaja: 0.108,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 72.30,
      t2: 69.00,
      t1: 67.00,
      t4: 73.50,
      diurno: 69.00,
      nocturno: 69.00,
      at: 72.30, // 9.77 € caja, 0.814 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Bebida deportiva con tapón deportivo C/12'
  },
  // 27. PET 50 cl. LIMCA
  {
    id: 'pet-limca-50',
    num: 27,
    code: 'P07',
    name: 'Limca Limón PET 50 cl',
    brand: 'Limca',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 24,
    tarifaBase: 34.80,
    pvCaja: 0.192,
    iva: 21,
    volumeCl: 50.0,
    discounts: {
      t3: 67.25,
      t2: 64.00,
      t1: 62.00,
      t4: 68.50,
      diurno: 64.00,
      nocturno: 64.00,
      at: 67.25, // 11.40 € caja, 0.475 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Sabor lima-limón picante y fresco a 0,475 €'
  },
  // 28. PET 575 ml. BODYARMOR
  {
    id: 'pet-bodyarmor-575',
    num: 28,
    code: 'P08',
    name: 'Bodyarmor SuperDrink PET 575 ml',
    brand: 'Bodyarmor',
    format: 'PET 575 ml.',
    category: 'pet',
    subCategory: 'Energéticas',
    unitsPerBox: 12,
    tarifaBase: 42.72,
    pvCaja: 0.156,
    iva: 21,
    volumeCl: 57.5,
    discounts: {
      t3: 60.87,
      t2: 58.00,
      t1: 56.00,
      t4: 62.00,
      diurno: 58.00,
      nocturno: 58.00,
      at: 60.87, // 16.72 € caja, 1.393 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Bebida premium con agua de coco y electrolitos'
  },

  // ------------------------------------------
  // PET 1 L
  // ------------------------------------------
  // 29. PET 1 L COCA-COLA
  {
    id: 'pet-cc-1l',
    num: 29,
    code: 'P09',
    name: 'Coca-Cola PET 1 L',
    brand: 'Coca-Cola',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 12,
    tarifaBase: 30.72,
    pvCaja: 0.156,
    iva: 21,
    volumeCl: 100.0,
    discounts: {
      t3: 55.52,
      t2: 52.50,
      t1: 50.50,
      t4: 56.50,
      diurno: 52.50,
      nocturno: 52.50,
      at: 55.52, // 13.66 € caja, 1.139 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Formato ideal para menú del día y comidas para 2'
  },
  // 30. PET 1 L FANTA
  {
    id: 'pet-fanta-1l',
    num: 30,
    code: 'P10',
    name: 'Fanta Naranja PET 1 L',
    brand: 'Fanta',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 12,
    tarifaBase: 30.72,
    pvCaja: 0.156,
    iva: 21,
    volumeCl: 100.0,
    discounts: {
      t3: 56.35,
      t2: 53.00,
      t1: 51.00,
      t4: 57.50,
      diurno: 53.00,
      nocturno: 53.00,
      at: 56.35, // 13.41 € caja, 1.117 € ud
      zero: 0.0
    },
    highlightSalesPitch: '1 Litro de naranja para servicio de mesas'
  },
  // 31. PET 1 L AQUARIUS
  {
    id: 'pet-aquarius-1l',
    num: 31,
    code: 'P11',
    name: 'Aquarius Limón PET 1 L',
    brand: 'Aquarius',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 12,
    tarifaBase: 44.88,
    pvCaja: 0.168,
    iva: 21,
    volumeCl: 100.0,
    discounts: {
      t3: 63.05,
      t2: 60.00,
      t1: 58.00,
      t4: 64.00,
      diurno: 60.00,
      nocturno: 60.00,
      at: 63.05, // 16.58 € caja, 1.382 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Isotónico 1 Litro para grupos y deportistas'
  },
  // 32. PET 1 L TONICA NORDIC
  {
    id: 'pet-nordic-1l',
    num: 32,
    code: 'P12',
    name: 'Tónica Nordic Mist PET 1 L',
    brand: 'Nordic Mist',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Mixers',
    unitsPerBox: 12,
    tarifaBase: 37.80,
    pvCaja: 0.156,
    iva: 21,
    volumeCl: 100.0,
    discounts: {
      t3: 70.82,
      t2: 67.50,
      t1: 65.50,
      t4: 71.80,
      diurno: 67.50,
      nocturno: 67.50,
      at: 70.82, // 11.03 € caja, 0.919 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Litro de tónica para barras de alta rotación'
  },
  // 33. PET 1 L GASEOSA LIMCA
  {
    id: 'pet-gaseosa-limca-1l',
    num: 33,
    code: 'P13',
    name: 'Gaseosa Limca PET 1 L',
    brand: 'Limca',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Mixers',
    unitsPerBox: 12,
    tarifaBase: 28.20,
    pvCaja: 0.156,
    iva: 21,
    volumeCl: 100.0,
    discounts: {
      t3: 67.10,
      t2: 64.00,
      t1: 62.00,
      t4: 68.00,
      diurno: 64.00,
      nocturno: 64.00,
      at: 67.10, // 9.28 € caja, 0.773 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Gaseosa tradicional para tinto de verano y mesa'
  },
  // 34. PET 1 L MINUTE MAID LIMONADA
  {
    id: 'pet-minute-maid-limonada-1l',
    num: 34,
    code: 'P14',
    name: 'Minute Maid Limonada PET 1 L',
    brand: 'Minute Maid',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 26.28,
    pvCaja: 0.126,
    iva: 21,
    volumeCl: 100.0,
    discounts: {
      t3: 68.90,
      t2: 65.50,
      t1: 63.50,
      t4: 70.00,
      diurno: 65.50,
      nocturno: 65.50,
      at: 68.90, // 8.17 € caja, 1.362 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Limonada refrescante natural en caja reducida C/6'
  },
  // 35. PET 1 L POWERADE
  {
    id: 'pet-powerade-1l',
    num: 35,
    code: 'P15',
    name: 'Powerade Ice Storm PET 1 L',
    brand: 'Powerade',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Energéticas',
    unitsPerBox: 12,
    tarifaBase: 59.16,
    pvCaja: 0.168,
    iva: 21,
    volumeCl: 100.0,
    discounts: {
      t3: 69.00,
      t2: 66.00,
      t1: 64.00,
      t4: 70.00,
      diurno: 66.00,
      nocturno: 66.00,
      at: 69.00, // 18.34 € caja, 1.528 € ud
      zero: 0.0
    },
    highlightSalesPitch: '1 Litro isotónico para clubes deportivos y gimnasios'
  },

  // ------------------------------------------
  // PET 1,25 L - 1,5 L - 2 L
  // ------------------------------------------
  // 36. PET 1,25 L COCA-COLA
  {
    id: 'pet-cc-125l',
    num: 36,
    code: 'P16',
    name: 'Coca-Cola PET 1,25 L',
    brand: 'Coca-Cola',
    format: 'PET 1,25 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 21.96,
    pvCaja: 0.090,
    iva: 21,
    volumeCl: 125.0,
    discounts: {
      t3: 69.00,
      t2: 66.00,
      t1: 64.00,
      t4: 70.00,
      diurno: 66.00,
      nocturno: 66.00,
      at: 69.00, // 6.81 € caja, 1.135 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Tamaño idóneo para raciones y menús familiares C/6'
  },
  // 37. PET 1,25 L FANTA
  {
    id: 'pet-fanta-125l',
    num: 37,
    code: 'P17',
    name: 'Fanta Naranja PET 1,25 L',
    brand: 'Fanta',
    format: 'PET 1,25 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 20.82,
    pvCaja: 0.090,
    iva: 21,
    volumeCl: 125.0,
    discounts: {
      t3: 68.51,
      t2: 65.50,
      t1: 63.50,
      t4: 69.50,
      diurno: 65.50,
      nocturno: 65.50,
      at: 68.51, // 6.56 € caja, 1.093 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Fanta familiar compacta fácil de almacenar'
  },
  // 38. PET 1,5 L AQUARIUS
  {
    id: 'pet-aquarius-15l',
    num: 38,
    code: 'P18',
    name: 'Aquarius Limón PET 1,5 L',
    brand: 'Aquarius',
    format: 'PET 1,5 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 24.96,
    pvCaja: 0.096,
    iva: 21,
    volumeCl: 150.0,
    discounts: {
      t3: 65.65,
      t2: 62.50,
      t1: 60.50,
      t4: 66.50,
      diurno: 62.50,
      nocturno: 62.50,
      at: 65.65, // 8.57 € caja, 1.429 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Isotónico 1,5 L caja de 6 para grupos grandes'
  },
  // 39. PET 1,5 L FUZE TEA
  {
    id: 'pet-fuze-tea-15l',
    num: 39,
    code: 'P19',
    name: 'Fuze Tea Limón PET 1,5 L',
    brand: 'Fuze Tea',
    format: 'PET 1,5 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 23.16,
    pvCaja: 0.096,
    iva: 21,
    volumeCl: 150.0,
    discounts: {
      t3: 72.90,
      t2: 69.50,
      t1: 67.50,
      t4: 74.00,
      diurno: 69.50,
      nocturno: 69.50,
      at: 72.90, // 6.28 € caja, 1.046 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Super descuento 72,90% - Unidad a 1,046 €'
  },
  // 40. PET 2 L COCA-COLA
  {
    id: 'pet-cc-2l',
    num: 40,
    code: 'P20',
    name: 'Coca-Cola PET 2 L',
    brand: 'Coca-Cola',
    format: 'PET 2 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 31.68,
    pvCaja: 0.108,
    iva: 21,
    volumeCl: 200.0,
    discounts: {
      t3: 73.55,
      t2: 70.00,
      t1: 68.00,
      t4: 74.50,
      diurno: 70.00,
      nocturno: 70.00,
      at: 73.55, // 8.38 € caja, 1.397 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Formato ahorro 2L caja de 6 con 73,55% dcto'
  },
  // 41. PET 2 L FANTA
  {
    id: 'pet-fanta-2l',
    num: 41,
    code: 'P21',
    name: 'Fanta Naranja PET 2 L',
    brand: 'Fanta',
    format: 'PET 2 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 29.46,
    pvCaja: 0.108,
    iva: 21,
    volumeCl: 200.0,
    discounts: {
      t3: 74.12,
      t2: 71.00,
      t1: 69.00,
      t4: 75.00,
      diurno: 71.00,
      nocturno: 71.00,
      at: 74.12, // 7.62 € caja, 1.271 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Fanta 2 Litros a solo 7,62 € por caja de 6'
  },
  // 42. PET 2 L SPRITE
  {
    id: 'pet-sprite-2l',
    num: 42,
    code: 'P22',
    name: 'Sprite PET 2 L',
    brand: 'Sprite',
    format: 'PET 2 L',
    category: 'pet',
    subCategory: 'Refrescos',
    unitsPerBox: 6,
    tarifaBase: 29.46,
    pvCaja: 0.108,
    iva: 21,
    volumeCl: 200.0,
    discounts: {
      t3: 74.12,
      t2: 71.00,
      t1: 69.00,
      t4: 75.00,
      diurno: 71.00,
      nocturno: 71.00,
      at: 74.12, // 7.62 € caja, 1.271 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Sprite 2 Litros a solo 7,62 € por caja de 6'
  },

  // ==========================================
  // C) AGUAS EN PET (IVA 10%)
  // ==========================================
  // 43. PET 35 cl. AQUABONA
  {
    id: 'pet-aquabona-35',
    num: 43,
    code: 'A01',
    name: 'Aquabona PET 35 cl',
    brand: 'Aquabona',
    format: 'PET 35 cl.',
    category: 'pet',
    subCategory: 'Aguas',
    unitsPerBox: 24,
    tarifaBase: 19.44,
    pvCaja: 0.144,
    iva: 10,
    volumeCl: 35.0,
    discounts: {
      t3: 68.20,
      t2: 65.00,
      t1: 63.00,
      t4: 69.00,
      diurno: 65.00,
      nocturno: 65.00,
      at: 68.20, // 6.18 € caja, 0.258 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Formato bolsillo agua mineral - Ud a 0,258 € (IVA 10%)'
  },
  // 44. PET 50 cl. AQUABONA
  {
    id: 'pet-aquabona-50',
    num: 44,
    code: 'A02',
    name: 'Aquabona PET 50 cl',
    brand: 'Aquabona',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Aguas',
    unitsPerBox: 24,
    tarifaBase: 22.56,
    pvCaja: 0.144,
    iva: 10,
    volumeCl: 50.0,
    discounts: {
      t3: 69.00, // 6.99 € caja, 0.291 € ud
      t2: 66.00,
      t1: 64.00,
      t4: 70.00,
      diurno: 66.00,
      nocturno: 66.00,
      at: 69.00,
      zero: 0.0
    },
    highlightSalesPitch: 'Superventas Hostelería: 6,99 € caja (0,291 €/ud)'
  },
  // 45. PET 50 cl. AQUABONA CON GAS
  {
    id: 'pet-aquabona-gas-50',
    num: 45,
    code: 'A03',
    name: 'Aquabona Con Gas PET 50 cl',
    brand: 'Aquabona',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Aguas',
    unitsPerBox: 12,
    tarifaBase: 15.84,
    pvCaja: 0.084,
    iva: 10,
    volumeCl: 50.0,
    discounts: {
      t3: 65.44,
      t2: 62.50,
      t1: 60.50,
      t4: 66.50,
      diurno: 62.50,
      nocturno: 62.50,
      at: 65.44, // 5.47 € caja, 0.456 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Agua con gas en formato práctico individual C/12'
  },
  // 46. PET 50 cl. VILAS DEL TURBON
  {
    id: 'pet-vilas-turbon-50',
    num: 46,
    code: 'A04',
    name: 'Vilas del Turbón PET 50 cl',
    brand: 'Vilas del Turbón',
    format: 'PET 50 cl.',
    category: 'pet',
    subCategory: 'Aguas',
    unitsPerBox: 24,
    tarifaBase: 18.24,
    pvCaja: 0.144,
    iva: 10,
    volumeCl: 50.0,
    discounts: {
      t3: 43.75,
      t2: 40.50,
      t1: 39.00,
      t4: 45.00,
      diurno: 40.50,
      nocturno: 40.50,
      at: 43.75, // 10.26 € caja, 0.428 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Agua de manantial pirenaico de mineralización muy débil'
  },
  // 47. PET 1 L VILAS DEL TURBON
  {
    id: 'pet-vilas-turbon-1l',
    num: 47,
    code: 'A05',
    name: 'Vilas del Turbón PET 1 L',
    brand: 'Vilas del Turbón',
    format: 'PET 1 L',
    category: 'pet',
    subCategory: 'Aguas',
    unitsPerBox: 6,
    tarifaBase: 6.36,
    pvCaja: 0.060,
    iva: 10,
    volumeCl: 100.0,
    discounts: {
      t3: 40.10,
      t2: 37.00,
      t1: 35.00,
      t4: 41.50,
      diurno: 37.00,
      nocturno: 37.00,
      at: 40.10, // 3.81 € caja, 0.635 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Agua gourmet 1 Litro caja de 6 a 3,81 €'
  },
  // 48. PET 1,5 L AQUABONA
  {
    id: 'pet-aquabona-15l',
    num: 48,
    code: 'A06',
    name: 'Aquabona PET 1,5 L',
    brand: 'Aquabona',
    format: 'PET 1,5 L',
    category: 'pet',
    subCategory: 'Aguas',
    unitsPerBox: 6,
    tarifaBase: 10.14,
    pvCaja: 0.066,
    iva: 10,
    volumeCl: 150.0,
    discounts: {
      t3: 74.05,
      t2: 71.00,
      t1: 69.00,
      t4: 75.00,
      diurno: 71.00,
      nocturno: 71.00,
      at: 74.05, // 2.63 € caja, 0.439 € ud
      zero: 0.0
    },
    highlightSalesPitch: 'Gran formato 1,5L a solo 2,63 € caja de 6 (0,439 €/ud)'
  }
];

// Helper calculations
const PriceEngine = {
  // Calculates net box without PV
  getNetoCajaSinPV(tarifaBase, discountPercent) {
    const d = parseFloat(discountPercent) || 0;
    return (parseFloat(tarifaBase) || 0) * (1 - d / 100);
  },

  // Calculates net unit without PV
  getNetoUnidadSinPV(netoCajaSinPV, unitsPerBox) {
    const u = parseInt(unitsPerBox, 10) || 1;
    return (parseFloat(netoCajaSinPV) || 0) / u;
  },

  // Calculates net box with PV
  getNetoCajaConPV(netoCajaSinPV, pvCaja) {
    return (parseFloat(netoCajaSinPV) || 0) + (parseFloat(pvCaja) || 0);
  },

  // Calculates net unit with PV
  getNetoUnidadConPV(netoCajaConPV, unitsPerBox) {
    const u = parseInt(unitsPerBox, 10) || 1;
    return (parseFloat(netoCajaConPV) || 0) / u;
  },

  // Calculates price with IVA
  getPriceWithIVA(price, ivaRate) {
    const r = parseFloat(ivaRate) || 0;
    return (parseFloat(price) || 0) * (1 + r / 100);
  },

  // Bidirectional reverse: From target box price (sin PV) to discount percent
  getDiscountFromTargetBox(tarifaBase, targetBoxPrice) {
    const tb = parseFloat(tarifaBase) || 0;
    const tp = parseFloat(targetBoxPrice) || 0;
    if (tb <= 0) return 0;
    return ((1 - (tp / tb)) * 100);
  },

  // Bidirectional reverse: From target unit price (sin PV) to discount percent
  getDiscountFromTargetUnit(tarifaBase, targetUnitPrice, unitsPerBox) {
    const tb = parseFloat(tarifaBase) || 0;
    const u = parseInt(unitsPerBox, 10) || 1;
    const tu = parseFloat(targetUnitPrice) || 0;
    const targetBoxPrice = tu * u;
    return this.getDiscountFromTargetBox(tb, targetBoxPrice);
  },

  // Full calculation bundle for a product with a given discount
  calculateProduct(product, discountPercent, options = {}) {
    const { includePV = false, includeIVA = false } = options;
    const tarifaBase = parseFloat(product.tarifaBase) || 0;
    const units = parseInt(product.unitsPerBox, 10) || 1;
    const pvCaja = parseFloat(product.pvCaja) || 0;
    const ivaRate = parseFloat(product.iva) || 21;
    const discount = parseFloat(discountPercent) || 0;

    const netoCajaSinPV = this.getNetoCajaSinPV(tarifaBase, discount);
    const netoUdSinPV = this.getNetoUnidadSinPV(netoCajaSinPV, units);
    const netoCajaConPV = this.getNetoCajaConPV(netoCajaSinPV, pvCaja);
    const netoUdConPV = this.getNetoUnidadConPV(netoCajaConPV, units);

    // Chosen display box and unit
    const chosenCajaSinIVA = includePV ? netoCajaConPV : netoCajaSinPV;
    const chosenUdSinIVA = includePV ? netoUdConPV : netoUdSinPV;

    const finalCaja = includeIVA ? this.getPriceWithIVA(chosenCajaSinIVA, ivaRate) : chosenCajaSinIVA;
    const finalUd = includeIVA ? this.getPriceWithIVA(chosenUdSinIVA, ivaRate) : chosenUdSinIVA;

    return {
      tarifaBase,
      discount,
      units,
      pvCaja,
      ivaRate,
      netoCajaSinPV,
      netoUdSinPV,
      netoCajaConPV,
      netoUdConPV,
      finalCaja,
      finalUd,
      includePV,
      includeIVA
    };
  },

  // Format currency
  formatCurrency(value, decimals = 2) {
    const n = parseFloat(value) || 0;
    return n.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + ' €';
  },

  // Format unit price (often 3 decimals for precision)
  formatUnitCurrency(value) {
    const n = parseFloat(value) || 0;
    return n.toLocaleString('es-ES', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 3
    }) + ' €';
  },

  // Format percentage
  formatPercent(value, decimals = 2) {
    const n = parseFloat(value) || 0;
    return n.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }) + '%';
  }
};
