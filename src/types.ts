export type UserRole = 'farmer' | 'consumer' | 'business' | 'logistics' | 'admin';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  verified?: boolean;
  address: {
    street: string;
    villageOrCity: string;
    district: string;
    state: string;
    pinCode: string;
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export interface FarmerProfile extends User {
  role: 'farmer';
  farmName: string;
  farmSizeAcres: number;
  farmingType: 'Organic' | 'Natural' | 'Hydroponic' | 'Conventional';
  cropsGrown: string[];
  experienceYears: number;
  rating: number;
  totalOrdersFulfilled: number;
  story: string;
  badges: string[];
  paymentDetails: {
    upiId: string;
    accountNumber: string;
    ifsc: string;
  };
}

export interface BusinessProfile extends User {
  role: 'business';
  companyName: string;
  businessType: 'Restaurant' | 'Hotel' | 'Catering' | 'Supermarket' | 'Wholesaler';
  gstNumber?: string;
  monthlyProcurementVolumeKg: number;
}

export interface LogisticsPartner extends User {
  role: 'logistics';
  vehicleType: 'Electric Van' | 'Refrigerated Mini Truck' | 'Cargo Auto' | 'Motorcycle with Insulated Box';
  vehicleNumber: string;
  capacityKg: number;
  activeDeliveriesCount: number;
  rating: number;
  totalTripsCompleted: number;
}

export type ProduceCategory = 'Vegetables' | 'Fruits' | 'Grains & Pulses' | 'Spices & Herbs' | 'Dairy & Honey';

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmerRating: number;
  farmerLocation: {
    village: string;
    district: string;
    state: string;
    lat: number;
    lng: number;
  };
  name: string;
  category: ProduceCategory;
  variety: string;
  description: string;
  images: string[];
  pricePerKg: number; // Farmer's price
  marketReferencePrice: number; // Current Mandi benchmark
  traditionalRetailPrice: number; // Estimated retail store price
  availableQuantityKg: number;
  minOrderQuantityKg: number;
  maxOrderQuantityKg: number;
  qualityGrade: 'A Grade (Export)' | 'A Grade (Premium)' | 'B Grade' | 'Organic Certified';
  isOrganic: boolean;
  farmingMethod: 'Natural' | 'Certified Organic' | 'Drip-Irrigated' | 'Hydroponic' | 'Conventional';
  harvestDate: string;
  freshnessGuaranteeHours: number;
  shelfLifeDays: number;
  deliveryAvailable: boolean;
  maxDeliveryRadiusKm: number;
  unit: string;
  status: 'active' | 'out_of_stock' | 'unlisted';
}

export interface PriceBreakdown {
  farmerPrice: number;
  traditionalRetailPrice: number;
  platformFee: number; // 3%
  logisticsFee: number; // ₹3-5 per kg depending on distance
  totalConsumerPrice: number;
  farmerBonus: number; // How much more the farmer gets vs middlemen
  buyerSavings: number; // How much buyer saves vs retail
  savingsPercentage: number;
  farmerBonusPercentage: number;
}

export interface CartItem {
  product: Product;
  quantityKg: number;
  priceBreakdown: PriceBreakdown;
}

export type OrderStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'PAID'
  | 'PREPARING'
  | 'READY_FOR_PICKUP'
  | 'PICKED_UP'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItem {
  productId: string;
  productName: string;
  farmerId: string;
  farmerName: string;
  quantityKg: number;
  unitPrice: number;
  farmerTotal: number;
  platformFee: number;
  logisticsFee: number;
  subtotal: number;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerRole: 'consumer' | 'business';
  shippingAddress: {
    addressLine: string;
    city: string;
    state: string;
    pinCode: string;
    lat: number;
    lng: number;
  };
  items: OrderItem[];
  productAmount: number;
  logisticsFee: number;
  platformFee: number;
  totalPaid: number;
  farmerEarnings: number;
  status: OrderStatus;
  paymentId?: string;
  paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
  paymentMethod?: 'UPI' | 'RAZORPAY_TEST' | 'NETBANKING' | 'CARDS';
  logisticsPartnerId?: string;
  logisticsPartnerName?: string;
  estimatedDeliveryTime: string;
  deliveredAt?: string;
  createdAt: string;
  deliveryProofOtp?: string;
  driverLocation?: { lat: number; lng: number };
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
}

export interface BulkRequirement {
  id: string;
  businessId: string;
  businessName: string;
  productName: string;
  category: ProduceCategory;
  quantityRequiredKg: number;
  targetPricePerKg: number;
  deliveryDate: string;
  deliveryCity: string;
  qualityPreference: string;
  status: 'OPEN' | 'QUOTES_RECEIVED' | 'FULFILLED' | 'CLOSED';
  quotesCount: number;
  createdAt: string;
}

export interface Quote {
  id: string;
  requirementId: string;
  farmerId: string;
  farmerName: string;
  farmerRating: number;
  quantityOfferedKg: number;
  offeredPricePerKg: number;
  deliveryDateEstimate: string;
  farmerNotes: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export interface MarketPrice {
  id: string;
  cropName: string;
  variety: string;
  mandiName: string;
  district: string;
  state: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number; // Benchmark standard
  traditionalRetailEstimate: number;
  farmDirectAverage: number;
  unit: string;
  priceTrend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  lastUpdated: string;
  history7Days: { date: string; modalPrice: number; farmDirectPrice: number }[];
}

export interface WeatherData {
  city: string;
  state: string;
  temperatureC: number;
  condition: string;
  icon: string;
  humidityPercent: number;
  rainProbabilityPercent: number;
  windSpeedKmh: number;
  advisory: string;
  forecast5Days: {
    day: string;
    temp: number;
    rainProb: number;
    condition: string;
  }[];
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: string;
  action: string;
  target: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export interface ImpactMetrics {
  totalProduceDeliveredKg: number;
  totalFarmerEarnings: number;
  traditionalEarningsEstimate: number;
  additionalFarmerIncome: number;
  totalConsumerSavings: number;
  intermediariesBypassed: number;
  averageFoodMilesKm: number;
}
