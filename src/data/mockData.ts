import {
  FarmerProfile,
  Product,
  MarketPrice,
  WeatherData,
  BulkRequirement,
  Quote,
  Order,
  AuditLog,
  ImpactMetrics,
  User,
  BusinessProfile,
  LogisticsPartner
} from '../types';

export const INITIAL_FARMERS: FarmerProfile[] = [
  {
    id: 'farmer-1',
    name: 'Ramesh Patel',
    email: 'ramesh.farmer@farmdirect.in',
    phone: '+91 98451 23049',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    verified: true,
    farmName: 'Green Valley Agro Farms',
    farmSizeAcres: 12.5,
    farmingType: 'Organic',
    cropsGrown: ['Tomatoes', 'Bell Peppers', 'Carrots', 'Spinach'],
    experienceYears: 18,
    rating: 4.9,
    totalOrdersFulfilled: 342,
    story: '3rd generation farmer in Kolar district practicing zero-budget natural farming and drip irrigation to preserve groundwater while growing pesticide-free vegetables.',
    badges: ['ZBNF Certified', 'Fresh Harvest', 'Top Rated 2025', 'Water Wise'],
    paymentDetails: {
      upiId: 'rameshfarm@okhdfcbank',
      accountNumber: 'XXXXXX4819',
      ifsc: 'HDFC0001234'
    },
    address: {
      street: 'Survey No. 42, Rayasandra Road',
      villageOrCity: 'Kolar',
      district: 'Kolar',
      state: 'Karnataka',
      pinCode: '563101',
      lat: 13.1367,
      lng: 78.1346
    },
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'farmer-2',
    name: 'Sunita Jadhav',
    email: 'sunita.jadhav@farmdirect.in',
    phone: '+91 94220 88312',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    verified: true,
    farmName: 'Sahyadri Bio Orchards',
    farmSizeAcres: 24,
    farmingType: 'Natural',
    cropsGrown: ['Nashik Red Onions', 'Table Grapes', 'Pomegranates'],
    experienceYears: 14,
    rating: 4.85,
    totalOrdersFulfilled: 489,
    story: 'Pioneering women-led organic cooperative in Dindori, Nashik. We specialize in export-grade red onions with 45-day storage life and naturally sweetened Thompson seedless grapes.',
    badges: ['Women Agri Leader', 'Export Grade', 'Pesticide Free'],
    paymentDetails: {
      upiId: 'sunitajadhav@sbi',
      accountNumber: 'XXXXXX9021',
      ifsc: 'SBIN0005678'
    },
    address: {
      street: 'Vani Road, Dindori',
      villageOrCity: 'Dindori',
      district: 'Nashik',
      state: 'Maharashtra',
      pinCode: '422202',
      lat: 20.2015,
      lng: 73.8372
    },
    createdAt: '2024-02-10T10:30:00Z'
  },
  {
    id: 'farmer-3',
    name: 'Venkatesh Rao',
    email: 'venkatesh.rao@farmdirect.in',
    phone: '+91 99890 34112',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    verified: true,
    farmName: 'Krishna Delta Spice Estate',
    farmSizeAcres: 16,
    farmingType: 'Organic',
    cropsGrown: ['Guntur Sannam Chillies', 'Salem Turmeric', 'Black Pepper'],
    experienceYears: 22,
    rating: 4.92,
    totalOrdersFulfilled: 215,
    story: 'Cultivating the famous pungent GI-tagged Guntur Red Chillies and high-curcumin Salem turmeric along the fertile Krishna river basin without synthetic fertilizers.',
    badges: ['GI Tagged Origin', 'Certified Organic', 'Direct Exporter'],
    paymentDetails: {
      upiId: 'venkateshspice@icici',
      accountNumber: 'XXXXXX3341',
      ifsc: 'ICIC0002233'
    },
    address: {
      street: 'Tenali Highway',
      villageOrCity: 'Tenali',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      pinCode: '522201',
      lat: 16.2437,
      lng: 80.6400
    },
    createdAt: '2024-03-01T12:00:00Z'
  },
  {
    id: 'farmer-4',
    name: 'Lakshmi Devi',
    email: 'lakshmi.devi@farmdirect.in',
    phone: '+91 97401 55219',
    role: 'farmer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    verified: true,
    farmName: 'Kaveri River Organic Haven',
    farmSizeAcres: 8.5,
    farmingType: 'Organic',
    cropsGrown: ['Robusta Bananas', 'Papayas', 'Country Tomatoes', 'Curry Leaves'],
    experienceYears: 12,
    rating: 4.95,
    totalOrdersFulfilled: 610,
    story: 'Growing chemical-free tree-ripened bananas and indigenous country tomatoes using Jeevamrutha microbial culture. Direct daily dispatch to Bengaluru and Mysuru.',
    badges: ['Tree Ripened', '100% Zero Chemical', 'Daily Harvest'],
    paymentDetails: {
      upiId: 'kaverihaven@ybl',
      accountNumber: 'XXXXXX7842',
      ifsc: 'KKBK0004567'
    },
    address: {
      street: 'Srirangapatna Road',
      villageOrCity: 'Pandavapura',
      district: 'Mandya',
      state: 'Karnataka',
      pinCode: '571434',
      lat: 12.4988,
      lng: 76.6698
    },
    createdAt: '2024-03-15T09:15:00Z'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmName: 'Green Valley Agro Farms',
    farmerRating: 4.9,
    farmerLocation: {
      village: 'Rayasandra',
      district: 'Kolar',
      state: 'Karnataka',
      lat: 13.1367,
      lng: 78.1346
    },
    name: 'Vine-Ripened Hybrid Tomatoes (Red & Firm)',
    category: 'Vegetables',
    variety: 'Shivam Hybrid Grade A',
    description: 'Freshly harvested firm red tomatoes grown with drip irrigation and organic mulch. High pulp density, juicy, ideal for salads and rich curries. Harvested within 24 hours.',
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&auto=format&fit=crop&q=80'
    ],
    pricePerKg: 28, // Farmer receives
    marketReferencePrice: 32, // Mandi rate
    traditionalRetailPrice: 48, // Traditional store
    availableQuantityKg: 850,
    minOrderQuantityKg: 2,
    maxOrderQuantityKg: 200,
    qualityGrade: 'A Grade (Premium)',
    isOrganic: true,
    farmingMethod: 'Natural',
    harvestDate: 'Today morning (06:00 AM)',
    freshnessGuaranteeHours: 48,
    shelfLifeDays: 8,
    deliveryAvailable: true,
    maxDeliveryRadiusKm: 85,
    unit: 'kg',
    status: 'active'
  },
  {
    id: 'prod-2',
    farmerId: 'farmer-2',
    farmerName: 'Sunita Jadhav',
    farmName: 'Sahyadri Bio Orchards',
    farmerRating: 4.85,
    farmerLocation: {
      village: 'Dindori',
      district: 'Nashik',
      state: 'Maharashtra',
      lat: 20.2015,
      lng: 73.8372
    },
    name: 'Nashik Sun-Cured Medium Red Onions',
    category: 'Vegetables',
    variety: 'Nashik Fursungi Red',
    description: 'Crisp, pungent, sun-cured Nashik red onions with thin paper skin and solid inner layers. Specially graded for restaurants and home cooks. Natural 45-day storage life.',
    images: [
      'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'
    ],
    pricePerKg: 32,
    marketReferencePrice: 35,
    traditionalRetailPrice: 52,
    availableQuantityKg: 2400,
    minOrderQuantityKg: 5,
    maxOrderQuantityKg: 1000,
    qualityGrade: 'A Grade (Export)',
    isOrganic: false,
    farmingMethod: 'Drip-Irrigated',
    harvestDate: 'Sun-cured 3 days ago',
    freshnessGuaranteeHours: 720,
    shelfLifeDays: 45,
    deliveryAvailable: true,
    maxDeliveryRadiusKm: 250,
    unit: 'kg',
    status: 'active'
  },
  {
    id: 'prod-3',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel',
    farmName: 'Green Valley Agro Farms',
    farmerRating: 4.9,
    farmerLocation: {
      village: 'Rayasandra',
      district: 'Kolar',
      state: 'Karnataka',
      lat: 13.1367,
      lng: 78.1346
    },
    name: 'Crunchy Green Bell Peppers (Capsicum)',
    category: 'Vegetables',
    variety: 'Indra Polyhouse F1',
    description: 'Thick-walled, crunchy green bell peppers grown in climate-controlled shade nets. Pesticide-free, high vitamin C, perfect for stir fries, continental cooking, and stuffing.',
    images: [
      'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=600&auto=format&fit=crop&q=80'
    ],
    pricePerKg: 42,
    marketReferencePrice: 48,
    traditionalRetailPrice: 75,
    availableQuantityKg: 420,
    minOrderQuantityKg: 1,
    maxOrderQuantityKg: 100,
    qualityGrade: 'A Grade (Export)',
    isOrganic: true,
    farmingMethod: 'Certified Organic',
    harvestDate: 'Yesterday evening',
    freshnessGuaranteeHours: 72,
    shelfLifeDays: 10,
    deliveryAvailable: true,
    maxDeliveryRadiusKm: 85,
    unit: 'kg',
    status: 'active'
  },
  {
    id: 'prod-4',
    farmerId: 'farmer-4',
    farmerName: 'Lakshmi Devi',
    farmName: 'Kaveri River Organic Haven',
    farmerRating: 4.95,
    farmerLocation: {
      village: 'Pandavapura',
      district: 'Mandya',
      state: 'Karnataka',
      lat: 12.4988,
      lng: 76.6698
    },
    name: 'Naturally Ripened Robusta Bananas (Carbide-Free)',
    category: 'Fruits',
    variety: 'Kaveri Basin Robusta',
    description: '100% naturally chamber ripened with zero calcium carbide chemicals. Sweet, rich in potassium, gentle on digestion. Graded uniform bunches from river delta groves.',
    images: [
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=600&auto=format&fit=crop&q=80'
    ],
    pricePerKg: 34,
    marketReferencePrice: 38,
    traditionalRetailPrice: 58,
    availableQuantityKg: 650,
    minOrderQuantityKg: 2,
    maxOrderQuantityKg: 150,
    qualityGrade: 'Organic Certified',
    isOrganic: true,
    farmingMethod: 'Natural',
    harvestDate: 'Harvested 36 hrs ago',
    freshnessGuaranteeHours: 96,
    shelfLifeDays: 6,
    deliveryAvailable: true,
    maxDeliveryRadiusKm: 120,
    unit: 'kg',
    status: 'active'
  },
  {
    id: 'prod-5',
    farmerId: 'farmer-3',
    farmerName: 'Venkatesh Rao',
    farmName: 'Krishna Delta Spice Estate',
    farmerRating: 4.92,
    farmerLocation: {
      village: 'Tenali',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      lat: 16.2437,
      lng: 80.6400
    },
    name: 'Sun-Dried GI Guntur Sannam Red Chillies',
    category: 'Spices & Herbs',
    variety: 'Guntur S334 Deep Red',
    description: 'World-renowned fiery GI-tagged Guntur dry red chillies with intact stalks. High capsaicin content and natural red pigment. Cleaned and sun-cured on hygienic tarpaulins.',
    images: [
      'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80'
    ],
    pricePerKg: 185,
    marketReferencePrice: 205,
    traditionalRetailPrice: 290,
    availableQuantityKg: 1200,
    minOrderQuantityKg: 1,
    maxOrderQuantityKg: 500,
    qualityGrade: 'A Grade (Export)',
    isOrganic: true,
    farmingMethod: 'Certified Organic',
    harvestDate: 'Fresh harvest cured last week',
    freshnessGuaranteeHours: 2000,
    shelfLifeDays: 180,
    deliveryAvailable: true,
    maxDeliveryRadiusKm: 500,
    unit: 'kg',
    status: 'active'
  },
  {
    id: 'prod-6',
    farmerId: 'farmer-4',
    farmerName: 'Lakshmi Devi',
    farmName: 'Kaveri River Organic Haven',
    farmerRating: 4.95,
    farmerLocation: {
      village: 'Pandavapura',
      district: 'Mandya',
      state: 'Karnataka',
      lat: 12.4988,
      lng: 76.6698
    },
    name: 'Desi Country Tomatoes (Nati Tomato)',
    category: 'Vegetables',
    variety: 'Indigenous Mandya Nati',
    description: 'Tangy, juicy heirloom country tomatoes known for authentic sambar and rasam flavor. Thinner skin, bursting with natural aroma and higher lycopene than commercial hybrids.',
    images: [
      'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=600&auto=format&fit=crop&q=80'
    ],
    pricePerKg: 35,
    marketReferencePrice: 40,
    traditionalRetailPrice: 62,
    availableQuantityKg: 380,
    minOrderQuantityKg: 1,
    maxOrderQuantityKg: 80,
    qualityGrade: 'Organic Certified',
    isOrganic: true,
    farmingMethod: 'Natural',
    harvestDate: 'Today morning (05:30 AM)',
    freshnessGuaranteeHours: 48,
    shelfLifeDays: 6,
    deliveryAvailable: true,
    maxDeliveryRadiusKm: 120,
    unit: 'kg',
    status: 'active'
  }
];

export const INITIAL_MARKET_PRICES: MarketPrice[] = [
  {
    id: 'mkt-1',
    cropName: 'Tomato (Hybrid)',
    variety: 'Hybrid Grade A',
    mandiName: 'Kolar APMC Mandi',
    district: 'Kolar',
    state: 'Karnataka',
    minPrice: 24,
    maxPrice: 36,
    modalPrice: 30,
    traditionalRetailEstimate: 48,
    farmDirectAverage: 28,
    unit: '₹/kg',
    priceTrend: 'increasing',
    changePercentage: 12.5,
    lastUpdated: 'Today at 08:30 AM (AGMARKNET verified)',
    history7Days: [
      { date: 'Mon', modalPrice: 24, farmDirectPrice: 22 },
      { date: 'Tue', modalPrice: 25, farmDirectPrice: 23 },
      { date: 'Wed', modalPrice: 27, farmDirectPrice: 25 },
      { date: 'Thu', modalPrice: 28, farmDirectPrice: 26 },
      { date: 'Fri', modalPrice: 29, farmDirectPrice: 27 },
      { date: 'Sat', modalPrice: 30, farmDirectPrice: 28 },
      { date: 'Sun', modalPrice: 31, farmDirectPrice: 28 }
    ]
  },
  {
    id: 'mkt-2',
    cropName: 'Onion (Red)',
    variety: 'Nashik Red Medium',
    mandiName: 'Lasalgaon APMC Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    minPrice: 28,
    maxPrice: 38,
    modalPrice: 34,
    traditionalRetailEstimate: 54,
    farmDirectAverage: 32,
    unit: '₹/kg',
    priceTrend: 'stable',
    changePercentage: 1.2,
    lastUpdated: 'Today at 09:15 AM (AGMARKNET verified)',
    history7Days: [
      { date: 'Mon', modalPrice: 33, farmDirectPrice: 31 },
      { date: 'Tue', modalPrice: 34, farmDirectPrice: 32 },
      { date: 'Wed', modalPrice: 33, farmDirectPrice: 32 },
      { date: 'Thu', modalPrice: 34, farmDirectPrice: 32 },
      { date: 'Fri', modalPrice: 34, farmDirectPrice: 32 },
      { date: 'Sat', modalPrice: 35, farmDirectPrice: 33 },
      { date: 'Sun', modalPrice: 34, farmDirectPrice: 32 }
    ]
  },
  {
    id: 'mkt-3',
    cropName: 'Potato (Jyoti)',
    variety: 'Pukhraj / Jyoti',
    mandiName: 'Azadpur Mandi',
    district: 'New Delhi',
    state: 'Delhi',
    minPrice: 18,
    maxPrice: 25,
    modalPrice: 22,
    traditionalRetailEstimate: 36,
    farmDirectAverage: 20,
    unit: '₹/kg',
    priceTrend: 'decreasing',
    changePercentage: -4.8,
    lastUpdated: 'Today at 07:45 AM (AGMARKNET verified)',
    history7Days: [
      { date: 'Mon', modalPrice: 24, farmDirectPrice: 22 },
      { date: 'Tue', modalPrice: 23, farmDirectPrice: 21 },
      { date: 'Wed', modalPrice: 23, farmDirectPrice: 21 },
      { date: 'Thu', modalPrice: 22, farmDirectPrice: 20 },
      { date: 'Fri', modalPrice: 22, farmDirectPrice: 20 },
      { date: 'Sat', modalPrice: 21, farmDirectPrice: 19 },
      { date: 'Sun', modalPrice: 22, farmDirectPrice: 20 }
    ]
  },
  {
    id: 'mkt-4',
    cropName: 'Guntur Dry Red Chillies',
    variety: 'S334 Stemless',
    mandiName: 'Guntur APMC Yard',
    district: 'Guntur',
    state: 'Andhra Pradesh',
    minPrice: 180,
    maxPrice: 230,
    modalPrice: 210,
    traditionalRetailEstimate: 295,
    farmDirectAverage: 185,
    unit: '₹/kg',
    priceTrend: 'increasing',
    changePercentage: 8.2,
    lastUpdated: 'Today at 10:00 AM (AGMARKNET verified)',
    history7Days: [
      { date: 'Mon', modalPrice: 195, farmDirectPrice: 175 },
      { date: 'Tue', modalPrice: 198, farmDirectPrice: 178 },
      { date: 'Wed', modalPrice: 202, farmDirectPrice: 180 },
      { date: 'Thu', modalPrice: 205, farmDirectPrice: 182 },
      { date: 'Fri', modalPrice: 208, farmDirectPrice: 185 },
      { date: 'Sat', modalPrice: 210, farmDirectPrice: 185 },
      { date: 'Sun', modalPrice: 210, farmDirectPrice: 185 }
    ]
  }
];

export const INITIAL_WEATHER: WeatherData = {
  city: 'Kolar / Bengaluru Rural',
  state: 'Karnataka',
  temperatureC: 27,
  condition: 'Partly Cloudy with Evening Showers',
  icon: 'cloud-rain',
  humidityPercent: 74,
  rainProbabilityPercent: 65,
  windSpeedKmh: 14,
  advisory: 'Moderate rainfall expected tomorrow afternoon (15-25mm). Consider harvesting ripe tomatoes and capsicums today before downpours cause field moisture damage.',
  forecast5Days: [
    { day: 'Today', temp: 28, rainProb: 20, condition: 'Partly Sunny' },
    { day: 'Tomorrow', temp: 25, rainProb: 65, condition: 'Scattered Showers' },
    { day: 'Wednesday', temp: 26, rainProb: 40, condition: 'Cloudy with Light Rain' },
    { day: 'Thursday', temp: 29, rainProb: 15, condition: 'Clear Sky' },
    { day: 'Friday', temp: 30, rainProb: 10, condition: 'Sunny' }
  ]
};

export const INITIAL_DEMO_USERS: Record<string, User | FarmerProfile | BusinessProfile | LogisticsPartner> = {
  farmer: INITIAL_FARMERS[0],
  consumer: {
    id: 'user-consumer-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '+91 98860 41235',
    role: 'consumer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    address: {
      street: 'Flat 402, Green Glen Layout, Bellandur',
      villageOrCity: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pinCode: '560103',
      lat: 12.9260,
      lng: 77.6762
    },
    createdAt: '2024-04-01T10:00:00Z'
  },
  business: {
    id: 'user-business-1',
    name: 'Chef Vikram Roy',
    email: 'procurement@royalspicebistro.com',
    phone: '+91 99002 88471',
    role: 'business',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&auto=format&fit=crop&q=80',
    verified: true,
    companyName: 'Royal Spice Bistro & Caterers',
    businessType: 'Restaurant',
    gstNumber: '29ABCDE1234F1Z5',
    monthlyProcurementVolumeKg: 2800,
    address: {
      street: '100ft Road, Indiranagar',
      villageOrCity: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pinCode: '560038',
      lat: 12.9719,
      lng: 77.6412
    },
    createdAt: '2024-03-20T11:00:00Z'
  } as BusinessProfile,
  logistics: {
    id: 'user-logistics-1',
    name: 'Suresh Kumar',
    email: 'suresh.delivery@ecotrans.in',
    phone: '+91 97312 90041',
    role: 'logistics',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    verified: true,
    vehicleType: 'Electric Van',
    vehicleNumber: 'KA-04-EV-8842',
    capacityKg: 850,
    activeDeliveriesCount: 1,
    rating: 4.88,
    totalTripsCompleted: 142,
    address: {
      street: 'Ring Road Logistics Hub',
      villageOrCity: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pinCode: '560068',
      lat: 12.9121,
      lng: 77.6321
    },
    createdAt: '2024-02-18T14:20:00Z'
  } as LogisticsPartner,
  admin: {
    id: 'user-admin-1',
    name: 'FarmDirect Ops Directorate',
    email: 'director@farmdirect.gov.in',
    phone: '+91 80 2345 6789',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    verified: true,
    address: {
      street: 'National Agtech Complex, MG Road',
      villageOrCity: 'Bengaluru',
      district: 'Bengaluru Urban',
      state: 'Karnataka',
      pinCode: '560001',
      lat: 12.9716,
      lng: 77.5946
    },
    createdAt: '2023-12-01T00:00:00Z'
  }
};

export const INITIAL_BULK_REQUIREMENTS: BulkRequirement[] = [
  {
    id: 'req-1',
    businessId: 'user-business-1',
    businessName: 'Royal Spice Bistro & Caterers',
    productName: 'Fresh Hybrid Tomatoes',
    category: 'Vegetables',
    quantityRequiredKg: 350,
    targetPricePerKg: 30,
    deliveryDate: 'Tomorrow by 09:00 AM',
    deliveryCity: 'Indiranagar, Bengaluru',
    qualityPreference: 'Grade A firm, medium size, high pulp for sauce & gravies',
    status: 'QUOTES_RECEIVED',
    quotesCount: 2,
    createdAt: '2025-05-10T08:00:00Z'
  },
  {
    id: 'req-2',
    businessId: 'user-business-1',
    businessName: 'Royal Spice Bistro & Caterers',
    productName: 'Nashik Red Onions (Medium)',
    category: 'Vegetables',
    quantityRequiredKg: 500,
    targetPricePerKg: 32,
    deliveryDate: 'In 3 Days',
    deliveryCity: 'Indiranagar, Bengaluru',
    qualityPreference: 'Sun-cured, dry skin, no sprouting',
    status: 'OPEN',
    quotesCount: 1,
    createdAt: '2025-05-10T11:30:00Z'
  }
];

export const INITIAL_QUOTES: Quote[] = [
  {
    id: 'quote-1',
    requirementId: 'req-1',
    farmerId: 'farmer-1',
    farmerName: 'Ramesh Patel (Green Valley Agro)',
    farmerRating: 4.9,
    quantityOfferedKg: 350,
    offeredPricePerKg: 28,
    deliveryDateEstimate: 'Tomorrow at 07:30 AM (Farm fresh harvest)',
    farmerNotes: 'Can fulfill all 350kg directly from morning harvest. Packed in hygienic food-grade crates.',
    status: 'PENDING',
    createdAt: '2025-05-10T09:15:00Z'
  },
  {
    id: 'quote-2',
    requirementId: 'req-1',
    farmerId: 'farmer-4',
    farmerName: 'Lakshmi Devi (Kaveri Haven)',
    farmerRating: 4.95,
    quantityOfferedKg: 200,
    offeredPricePerKg: 29,
    deliveryDateEstimate: 'Tomorrow by 08:30 AM',
    farmerNotes: '200kg premium organic country tomatoes available immediately.',
    status: 'PENDING',
    createdAt: '2025-05-10T10:00:00Z'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-FD-8921',
    buyerId: 'user-consumer-1',
    buyerName: 'Ananya Sharma',
    buyerPhone: '+91 98860 41235',
    buyerRole: 'consumer',
    shippingAddress: {
      addressLine: 'Flat 402, Green Glen Layout, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560103',
      lat: 12.9260,
      lng: 77.6762
    },
    items: [
      {
        productId: 'prod-1',
        productName: 'Vine-Ripened Hybrid Tomatoes',
        farmerId: 'farmer-1',
        farmerName: 'Ramesh Patel',
        quantityKg: 6,
        unitPrice: 28,
        farmerTotal: 168,
        platformFee: 5,
        logisticsFee: 24,
        subtotal: 197
      },
      {
        productId: 'prod-3',
        productName: 'Crunchy Green Bell Peppers',
        farmerId: 'farmer-1',
        farmerName: 'Ramesh Patel',
        quantityKg: 2,
        unitPrice: 42,
        farmerTotal: 84,
        platformFee: 3,
        logisticsFee: 8,
        subtotal: 95
      }
    ],
    productAmount: 252,
    logisticsFee: 32,
    platformFee: 8,
    totalPaid: 292,
    farmerEarnings: 252,
    status: 'IN_TRANSIT',
    paymentId: 'pay_rzp_test_89412',
    paymentStatus: 'SUCCESS',
    paymentMethod: 'UPI',
    logisticsPartnerId: 'user-logistics-1',
    logisticsPartnerName: 'Suresh Kumar (Electric Van KA-04-EV-8842)',
    estimatedDeliveryTime: 'Today at 02:45 PM',
    createdAt: '2025-05-10T07:15:00Z',
    deliveryProofOtp: '4829',
    driverLocation: { lat: 12.9512, lng: 77.6980 }
  },
  {
    id: 'ORD-FD-7740',
    buyerId: 'user-business-1',
    buyerName: 'Chef Vikram Roy (Royal Spice Bistro)',
    buyerPhone: '+91 99002 88471',
    buyerRole: 'business',
    shippingAddress: {
      addressLine: '100ft Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pinCode: '560038',
      lat: 12.9719,
      lng: 77.6412
    },
    items: [
      {
        productId: 'prod-2',
        productName: 'Nashik Sun-Cured Medium Red Onions',
        farmerId: 'farmer-2',
        farmerName: 'Sunita Jadhav',
        quantityKg: 100,
        unitPrice: 32,
        farmerTotal: 3200,
        platformFee: 96,
        logisticsFee: 350,
        subtotal: 3646
      }
    ],
    productAmount: 3200,
    logisticsFee: 350,
    platformFee: 96,
    totalPaid: 3646,
    farmerEarnings: 3200,
    status: 'DELIVERED',
    paymentId: 'pay_rzp_test_77401',
    paymentStatus: 'SUCCESS',
    paymentMethod: 'CARDS',
    logisticsPartnerId: 'user-logistics-1',
    logisticsPartnerName: 'Suresh Kumar',
    estimatedDeliveryTime: 'Yesterday, 11:30 AM',
    deliveredAt: 'Yesterday, 11:15 AM',
    createdAt: '2025-05-09T09:00:00Z',
    review: {
      rating: 5,
      comment: 'Exceptional onion quality. Solid bulbs, perfectly dried. Our gravies have incredible depth of flavor. Saved ₹1,800 compared to Russell Market middlemen.',
      createdAt: '2025-05-09T14:30:00Z'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    actorName: 'FarmDirect Ops Directorate',
    actorRole: 'admin',
    action: 'FARMER_VERIFIED',
    target: 'Ramesh Patel (Green Valley Agro Farms)',
    timestamp: '2025-05-08T10:14:22Z',
    metadata: { district: 'Kolar', surveyNo: '42', verificationMethod: 'Geo-survey + Soil Test' }
  },
  {
    id: 'log-2',
    actorName: 'Ramesh Patel',
    actorRole: 'farmer',
    action: 'INVENTORY_LISTED',
    target: 'Vine-Ripened Hybrid Tomatoes (850 kg @ ₹28/kg)',
    timestamp: '2025-05-10T06:05:00Z',
    metadata: { harvestDate: '2025-05-10', priceReference: 'Kolar APMC: ₹30/kg' }
  },
  {
    id: 'log-3',
    actorName: 'Suresh Kumar',
    actorRole: 'logistics',
    action: 'ORDER_PICKED_UP',
    target: 'Order ORD-FD-8921',
    timestamp: '2025-05-10T12:30:00Z',
    metadata: { partner: 'KA-04-EV-8842', pickupFarm: 'Green Valley Agro Farms' }
  }
];

export const INITIAL_IMPACT_METRICS: ImpactMetrics = {
  totalProduceDeliveredKg: 48520,
  totalFarmerEarnings: 1582400,
  traditionalEarningsEstimate: 949440,
  additionalFarmerIncome: 632960, // +66.6% more in farmer pockets!
  totalConsumerSavings: 428600, // Buyers paid ~23% less than retail
  intermediariesBypassed: 4, // Local trader, commission agent, APMC wholesaler, retail middleman
  averageFoodMilesKm: 42.8 // Direct farm to city delivery
};
