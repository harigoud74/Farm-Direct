import {
  User,
  FarmerProfile,
  BusinessProfile,
  LogisticsPartner,
  Product,
  Order,
  BulkRequirement,
  Quote,
  MarketPrice,
  WeatherData,
  AuditLog,
  ImpactMetrics,
  OrderStatus
} from '../src/types';
import {
  INITIAL_DEMO_USERS,
  INITIAL_FARMERS,
  INITIAL_PRODUCTS,
  INITIAL_MARKET_PRICES,
  INITIAL_WEATHER,
  INITIAL_BULK_REQUIREMENTS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_IMPACT_METRICS
} from '../src/data/mockData';

class FarmDirectDatabase {
  private users: Map<string, User | FarmerProfile | BusinessProfile | LogisticsPartner> = new Map();
  private products: Map<string, Product> = new Map();
  private orders: Map<string, Order> = new Map();
  private bulkRequirements: Map<string, BulkRequirement> = new Map();
  private quotes: Map<string, Quote> = new Map();
  private marketPrices: Map<string, MarketPrice> = new Map();
  private weather: WeatherData = INITIAL_WEATHER;
  private auditLogs: AuditLog[] = [];

  constructor() {
    this.seed();
  }

  private seed() {
    // Seed Users
    Object.values(INITIAL_DEMO_USERS).forEach(user => {
      this.users.set(user.id, user);
    });
    INITIAL_FARMERS.forEach(farmer => {
      this.users.set(farmer.id, farmer);
    });

    // Seed Products
    INITIAL_PRODUCTS.forEach(p => {
      this.products.set(p.id, { ...p });
    });

    // Seed Market Prices
    INITIAL_MARKET_PRICES.forEach(m => {
      this.marketPrices.set(m.id, { ...m });
    });

    // Seed Bulk Requirements & Quotes
    INITIAL_BULK_REQUIREMENTS.forEach(r => {
      this.bulkRequirements.set(r.id, { ...r });
    });
    INITIAL_QUOTES.forEach(q => {
      this.quotes.set(q.id, { ...q });
    });

    // Seed Orders
    INITIAL_ORDERS.forEach(o => {
      this.orders.set(o.id, { ...o });
    });

    // Seed Audit Logs
    this.auditLogs = [...INITIAL_AUDIT_LOGS];
  }

  // --- Audit Logs ---
  addAuditLog(actorName: string, actorRole: string, action: string, target: string, metadata: Record<string, any> = {}) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      actorName,
      actorRole,
      action,
      target,
      timestamp: new Date().toISOString(),
      metadata
    };
    this.auditLogs.unshift(log);
    if (this.auditLogs.length > 200) {
      this.auditLogs.pop();
    }
    return log;
  }

  getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  // --- Users ---
  getUserById(id: string) {
    return this.users.get(id);
  }

  getUserByEmail(email: string) {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  getAllFarmers(): FarmerProfile[] {
    const farmers: FarmerProfile[] = [];
    for (const u of this.users.values()) {
      if (u.role === 'farmer') {
        farmers.push(u as FarmerProfile);
      }
    }
    return farmers;
  }

  createUser(userData: Partial<User> & { role: string; name: string; email: string }): User {
    const id = `user-${Date.now()}`;
    const newUser: User = {
      id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '+91 98000 00000',
      role: userData.role as any,
      verified: userData.role !== 'farmer', // farmers start unverified or pending
      address: userData.address || {
        street: 'Main Street',
        villageOrCity: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        pinCode: '560001',
        lat: 12.9716,
        lng: 77.5946
      },
      createdAt: new Date().toISOString()
    };
    this.users.set(id, newUser);
    this.addAuditLog(newUser.name, newUser.role, 'USER_REGISTERED', newUser.id);
    return newUser;
  }

  verifyFarmer(farmerId: string, verified: boolean): FarmerProfile | null {
    const farmer = this.users.get(farmerId) as FarmerProfile;
    if (!farmer || farmer.role !== 'farmer') return null;
    farmer.verified = verified;
    this.addAuditLog('Admin', 'admin', verified ? 'FARMER_VERIFIED' : 'FARMER_SUSPENDED', farmer.name);
    return farmer;
  }

  // --- Products ---
  getProducts(filters?: {
    category?: string;
    farmerId?: string;
    search?: string;
    maxPrice?: number;
    organicOnly?: boolean;
    maxDistanceKm?: number;
  }): Product[] {
    let result = Array.from(this.products.values()).filter(p => p.status !== 'unlisted');

    if (filters?.category && filters.category !== 'All' && filters.category !== 'All Categories') {
      result = result.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters?.farmerId) {
      result = result.filter(p => p.farmerId === filters.farmerId);
    }

    if (filters?.organicOnly) {
      result = result.filter(p => p.isOrganic);
    }

    if (filters?.maxPrice) {
      result = result.filter(p => p.pricePerKg <= filters.maxPrice!);
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.variety.toLowerCase().includes(q) ||
        p.farmerName.toLowerCase().includes(q) ||
        p.farmerLocation.district.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    return result;
  }

  getProductById(id: string): Product | null {
    return this.products.get(id) || null;
  }

  createProduct(productData: Omit<Product, 'id'>): Product {
    const id = `prod-${Date.now()}`;
    const product: Product = {
      ...productData,
      id
    };
    this.products.set(id, product);
    this.addAuditLog(product.farmerName, 'farmer', 'PRODUCT_CREATED', `${product.name} (${product.availableQuantityKg} kg)`);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  deleteProduct(id: string): boolean {
    return this.products.delete(id);
  }

  // --- Orders & Stock Reservation ---
  getOrders(filters?: { buyerId?: string; farmerId?: string; status?: string }): Order[] {
    let list = Array.from(this.orders.values());
    if (filters?.buyerId) {
      list = list.filter(o => o.buyerId === filters.buyerId);
    }
    if (filters?.farmerId) {
      list = list.filter(o => o.items.some(item => item.farmerId === filters.farmerId));
    }
    if (filters?.status) {
      list = list.filter(o => o.status === filters.status);
    }
    // Most recent first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getOrderById(id: string): Order | null {
    return this.orders.get(id) || null;
  }

  createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): { success: boolean; order?: Order; error?: string } {
    // 1. Atomic Stock Verification & Deduction
    for (const item of orderData.items) {
      const product = this.products.get(item.productId);
      if (!product) {
        return { success: false, error: `Product "${item.productName}" not found.` };
      }
      if (product.availableQuantityKg < item.quantityKg) {
        return {
          success: false,
          error: `Insufficient inventory for "${product.name}". Available: ${product.availableQuantityKg} kg, Requested: ${item.quantityKg} kg.`
        };
      }
    }

    // Deduct stock safely
    for (const item of orderData.items) {
      const product = this.products.get(item.productId)!;
      product.availableQuantityKg -= item.quantityKg;
      if (product.availableQuantityKg <= 0) {
        product.status = 'out_of_stock';
      }
      this.products.set(product.id, product);
    }

    const id = `ORD-FD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      createdAt: new Date().toISOString()
    };

    this.orders.set(id, newOrder);
    this.addAuditLog(
      newOrder.buyerName,
      newOrder.buyerRole,
      'ORDER_PLACED',
      `${newOrder.id} - ₹${newOrder.totalPaid}`,
      { itemsCount: newOrder.items.length }
    );

    return { success: true, order: newOrder };
  }

  updateOrderStatus(orderId: string, status: OrderStatus, actorName: string = 'System'): Order | null {
    const order = this.orders.get(orderId);
    if (!order) return null;

    // Handle cancellation: return stock to inventory
    if (status === 'CANCELLED' && order.status !== 'CANCELLED') {
      for (const item of order.items) {
        const prod = this.products.get(item.productId);
        if (prod) {
          prod.availableQuantityKg += item.quantityKg;
          if (prod.status === 'out_of_stock') {
            prod.status = 'active';
          }
          this.products.set(prod.id, prod);
        }
      }
    }

    order.status = status;
    if (status === 'DELIVERED') {
      order.deliveredAt = new Date().toISOString();
    }

    this.orders.set(orderId, order);
    this.addAuditLog(actorName, 'user', 'ORDER_STATUS_CHANGED', `${orderId} -> ${status}`);
    return order;
  }

  // --- Bulk Requirements & B2B Quotes ---
  getBulkRequirements(): BulkRequirement[] {
    return Array.from(this.bulkRequirements.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  createBulkRequirement(req: Omit<BulkRequirement, 'id' | 'quotesCount' | 'createdAt'>): BulkRequirement {
    const id = `req-${Date.now()}`;
    const newReq: BulkRequirement = {
      ...req,
      id,
      quotesCount: 0,
      createdAt: new Date().toISOString()
    };
    this.bulkRequirements.set(id, newReq);
    this.addAuditLog(newReq.businessName, 'business', 'BULK_REQUIREMENT_POSTED', `${newReq.productName} (${newReq.quantityRequiredKg} kg)`);
    return newReq;
  }

  getQuotes(requirementId?: string): Quote[] {
    let list = Array.from(this.quotes.values());
    if (requirementId) {
      list = list.filter(q => q.requirementId === requirementId);
    }
    return list;
  }

  createQuote(quoteData: Omit<Quote, 'id' | 'status' | 'createdAt'>): Quote {
    const id = `quote-${Date.now()}`;
    const newQuote: Quote = {
      ...quoteData,
      id,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    this.quotes.set(id, newQuote);

    const req = this.bulkRequirements.get(newQuote.requirementId);
    if (req) {
      req.quotesCount += 1;
      req.status = 'QUOTES_RECEIVED';
      this.bulkRequirements.set(req.id, req);
    }

    this.addAuditLog(newQuote.farmerName, 'farmer', 'QUOTE_SUBMITTED', `Req ${newQuote.requirementId} - ${newQuote.quantityOfferedKg}kg @ ₹${newQuote.offeredPricePerKg}/kg`);
    return newQuote;
  }

  acceptQuote(quoteId: string): { success: boolean; order?: Order; quote?: Quote } {
    const quote = this.quotes.get(quoteId);
    if (!quote) return { success: false };

    quote.status = 'ACCEPTED';
    this.quotes.set(quoteId, quote);

    const req = this.bulkRequirements.get(quote.requirementId);
    if (req) {
      req.status = 'FULFILLED';
      this.bulkRequirements.set(req.id, req);
    }

    // Automatically generate a B2B confirmed order
    const totalProduce = quote.quantityOfferedKg * quote.offeredPricePerKg;
    const logistics = Math.round(quote.quantityOfferedKg * 3.5);
    const platform = Math.round(totalProduce * 0.03);

    const orderRes = this.createOrder({
      buyerId: req ? req.businessId : 'user-business-1',
      buyerName: req ? req.businessName : 'Business Buyer',
      buyerPhone: '+91 99002 88471',
      buyerRole: 'business',
      shippingAddress: {
        addressLine: req?.deliveryCity || 'Commercial Hub, Bengaluru',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560001',
        lat: 12.9716,
        lng: 77.5946
      },
      items: [
        {
          productId: `bulk-${quote.id}`,
          productName: req ? req.productName : 'Bulk Farm Produce',
          farmerId: quote.farmerId,
          farmerName: quote.farmerName,
          quantityKg: quote.quantityOfferedKg,
          unitPrice: quote.offeredPricePerKg,
          farmerTotal: totalProduce,
          platformFee: platform,
          logisticsFee: logistics,
          subtotal: totalProduce + platform + logistics
        }
      ],
      productAmount: totalProduce,
      logisticsFee: logistics,
      platformFee: platform,
      totalPaid: totalProduce + platform + logistics,
      farmerEarnings: totalProduce,
      status: 'ACCEPTED',
      paymentStatus: 'SUCCESS',
      paymentMethod: 'NETBANKING',
      estimatedDeliveryTime: quote.deliveryDateEstimate
    });

    return { success: true, order: orderRes.order, quote };
  }

  // --- Market Prices & Weather ---
  getMarketPrices(): MarketPrice[] {
    return Array.from(this.marketPrices.values());
  }

  getWeather(): WeatherData {
    return this.weather;
  }

  // --- Impact Calculations ---
  getImpactMetrics(): ImpactMetrics {
    const orders = Array.from(this.orders.values());
    let totalProduceKg = INITIAL_IMPACT_METRICS.totalProduceDeliveredKg;
    let totalFarmerEarnings = INITIAL_IMPACT_METRICS.totalFarmerEarnings;
    let totalConsumerSavings = INITIAL_IMPACT_METRICS.totalConsumerSavings;

    for (const order of orders) {
      if (order.status !== 'CANCELLED') {
        const orderKg = order.items.reduce((sum, item) => sum + item.quantityKg, 0);
        totalProduceKg += orderKg;
        totalFarmerEarnings += order.farmerEarnings;
        // Middleman markup estimate vs retail
        totalConsumerSavings += Math.round(order.productAmount * 0.28);
      }
    }

    const traditionalEarningsEstimate = Math.round(totalFarmerEarnings * 0.60);
    const additionalFarmerIncome = totalFarmerEarnings - traditionalEarningsEstimate;

    return {
      totalProduceDeliveredKg: totalProduceKg,
      totalFarmerEarnings,
      traditionalEarningsEstimate,
      additionalFarmerIncome,
      totalConsumerSavings,
      intermediariesBypassed: 4,
      averageFoodMilesKm: 38.4
    };
  }
}

export const db = new FarmDirectDatabase();
