import {
  Product,
  Order,
  FarmerProfile,
  MarketPrice,
  WeatherData,
  BulkRequirement,
  Quote,
  AuditLog,
  ImpactMetrics,
  OrderStatus
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_FARMERS,
  INITIAL_MARKET_PRICES,
  INITIAL_WEATHER,
  INITIAL_BULK_REQUIREMENTS,
  INITIAL_QUOTES,
  INITIAL_ORDERS,
  INITIAL_AUDIT_LOGS,
  INITIAL_IMPACT_METRICS
} from '../data/mockData';

async function fetchJSON<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.error || `Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[FarmDirect API fallback] ${url}:`, err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  async getProducts(params?: Record<string, string>): Promise<Product[]> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJSON<Product[]>(`/api/products${qs}`, undefined, INITIAL_PRODUCTS);
  },

  async getProductById(id: string): Promise<Product | null> {
    return fetchJSON<Product | null>(`/api/products/${id}`, undefined, INITIAL_PRODUCTS.find(p => p.id === id) || null);
  },

  async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
    return fetchJSON<Product>('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    return fetchJSON<Product>(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return fetchJSON<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE'
    });
  },

  async getFarmers(): Promise<FarmerProfile[]> {
    return fetchJSON<FarmerProfile[]>('/api/farmers', undefined, INITIAL_FARMERS);
  },

  async getFarmerById(id: string): Promise<FarmerProfile | null> {
    return fetchJSON<FarmerProfile | null>(`/api/farmers/${id}`, undefined, INITIAL_FARMERS.find(f => f.id === id) || null);
  },

  async verifyFarmer(id: string, verified: boolean): Promise<FarmerProfile> {
    return fetchJSON<FarmerProfile>(`/api/farmers/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified })
    });
  },

  async getOrders(params?: Record<string, string>): Promise<Order[]> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return fetchJSON<Order[]>(`/api/orders${qs}`, undefined, INITIAL_ORDERS);
  },

  async getOrderById(id: string): Promise<Order | null> {
    return fetchJSON<Order | null>(`/api/orders/${id}`, undefined, INITIAL_ORDERS.find(o => o.id === id) || null);
  },

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    return fetchJSON<Order>('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
  },

  async updateOrderStatus(id: string, status: OrderStatus, actorName?: string): Promise<Order> {
    return fetchJSON<Order>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, actorName })
    });
  },

  async createPayment(amount: number, receipt?: string) {
    return fetchJSON<{ id: string; amount: number; currency: string; keyId: string; isTestMode: boolean }>('/api/payments/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, receipt })
    });
  },

  async verifyPayment(verificationData: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; orderId?: string }) {
    return fetchJSON<{ success: boolean; paymentId?: string }>('/api/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verificationData)
    });
  },

  async getMarketPrices(): Promise<MarketPrice[]> {
    return fetchJSON<MarketPrice[]>('/api/market-prices', undefined, INITIAL_MARKET_PRICES);
  },

  async getWeather(city?: string): Promise<WeatherData> {
    const qs = city ? `?city=${encodeURIComponent(city)}` : '';
    return fetchJSON<WeatherData>(`/api/weather${qs}`, undefined, INITIAL_WEATHER);
  },

  async getBulkRequirements(): Promise<BulkRequirement[]> {
    return fetchJSON<BulkRequirement[]>('/api/bulk-requirements', undefined, INITIAL_BULK_REQUIREMENTS);
  },

  async createBulkRequirement(data: Omit<BulkRequirement, 'id' | 'quotesCount' | 'createdAt'>): Promise<BulkRequirement> {
    return fetchJSON<BulkRequirement>('/api/bulk-requirements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getQuotes(requirementId?: string): Promise<Quote[]> {
    const qs = requirementId ? `?requirementId=${requirementId}` : '';
    return fetchJSON<Quote[]>(`/api/quotes${qs}`, undefined, INITIAL_QUOTES);
  },

  async createQuote(data: Omit<Quote, 'id' | 'status' | 'createdAt'>): Promise<Quote> {
    return fetchJSON<Quote>('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async acceptQuote(quoteId: string): Promise<{ success: boolean; order?: Order; quote?: Quote }> {
    return fetchJSON<{ success: boolean; order?: Order; quote?: Quote }>(`/api/quotes/${quoteId}/accept`, {
      method: 'POST'
    });
  },

  async getAIInsights() {
    return fetchJSON<any[]>('/api/ai/insights', undefined, [
      {
        cropName: 'Tomato (Hybrid)',
        currentPrice: 30,
        predictedTrend: 'increasing',
        confidenceScore: 0.88,
        expectedChangePercent: 12.5,
        recommendation: 'Consider scheduling tomato delivery within the next 2–4 days before anticipated rain disruptions.',
        rationale: 'Upcoming rainfall in Kolar and Chintamani belt will temporarily slow APMC arrivals by ~18%, driving prices up.',
        historicalBasis: '7-day AGMARKNET weighted moving average'
      }
    ]);
  },

  async getAIForecast() {
    return fetchJSON<any[]>('/api/ai/forecast', undefined, [
      {
        cropCategory: 'Vegetables',
        cropName: 'Hybrid Tomatoes & Capsicum',
        forecastPercent: 24,
        keyDrivers: ['Weekend catering surge', 'Hospitality weddings', 'Rain advisory tightening supply'],
        targetBuyerSegment: 'Restaurants, Cafes & Urban Consumers',
        actionItem: 'Increase available farm harvest listing and accept bulk B2B procurement quotes.'
      }
    ]);
  },

  async getAIMatch(requirementId: string) {
    return fetchJSON<any>('/api/ai/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirementId })
    });
  },

  async askAIChat(query: string, role: string): Promise<{ answer: string; source: string; suggestions?: string[] }> {
    return fetchJSON<{ answer: string; source: string; suggestions?: string[] }>('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, role })
    }, {
      answer: "Welcome to FarmDirect! Mandi prices for tomatoes are currently trading at ₹30/kg (+12.5%) and onions at ₹22/kg. You can list crops directly, check the 5-day weather forecast, or fulfill open restaurant procurement orders.",
      source: "FarmDirect Agro Intelligence Engine (Local Grounding)",
      suggestions: ["What should I sell today?", "How are tomato prices trending?", "What weather is expected?"]
    });
  },

  async getAdminAnalytics() {
    return fetchJSON<any>('/api/admin/analytics', undefined, {
      totalGmv: 428000,
      platformFees: 12840,
      farmerEarnings: 395000,
      totalOrders: 142,
      activeListings: 6,
      registeredFarmers: 4,
      pendingVerifications: 0
    });
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    return fetchJSON<AuditLog[]>('/api/admin/audit-logs', undefined, INITIAL_AUDIT_LOGS);
  },

  async getImpact(): Promise<ImpactMetrics> {
    return fetchJSON<ImpactMetrics>('/api/impact', undefined, INITIAL_IMPACT_METRICS);
  }
};
