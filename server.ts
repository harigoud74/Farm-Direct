import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db';
import { paymentService } from './server/paymentService';
import { weatherService } from './server/weatherService';
import { aiService } from './server/aiService';

const PORT = 3000;

async function startServer() {
  const app = express();

  // Basic middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // --- HEALTH CHECK ---
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'FarmDirect',
      timestamp: new Date().toISOString(),
      integrations: {
        payment: { provider: 'Razorpay', mode: 'TEST' },
        weather: { provider: process.env.OPENWEATHER_API_KEY ? 'OpenWeather (Live)' : 'Agro-Meteorological Simulation (Test/Mock)' },
        marketPrices: { provider: 'AGMARKNET Mandi Data Engine', status: 'Active' },
        ai: { provider: process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' ? 'Gemini Flash (Live Multi-Model Resilient)' : 'FarmDirect Agricultural Intelligence Engine (Test/Mock)' }
      }
    });
  });

  // --- AUTH ENDPOINTS ---
  app.post('/api/auth/register', (req: Request, res: Response) => {
    try {
      const { name, email, phone, role, address } = req.body;
      if (!name || !email || !role) {
        return res.status(400).json({ error: 'Name, email, and role are required' });
      }
      const existing = db.getUserByEmail(email);
      if (existing) {
        return res.json({ user: existing, isExisting: true });
      }
      const user = db.createUser({ name, email, phone, role, address });
      res.status(201).json({ user, isExisting: false });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email } = req.body;
    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'User not found. Try demo login or register.' });
    }
    res.json({ user });
  });

  // --- PRODUCTS ENDPOINTS ---
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, farmerId, search, maxPrice, organicOnly } = req.query;
    const products = db.getProducts({
      category: category as string,
      farmerId: farmerId as string,
      search: search as string,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      organicOnly: organicOnly === 'true'
    });
    res.json(products);
  });

  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    try {
      const newProduct = db.createProduct(req.body);
      res.status(201).json(newProduct);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.patch('/api/products/:id', (req: Request, res: Response) => {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const success = db.deleteProduct(req.params.id);
    res.json({ success });
  });

  // --- FARMERS ENDPOINTS ---
  app.get('/api/farmers', (req: Request, res: Response) => {
    const farmers = db.getAllFarmers();
    res.json(farmers);
  });

  app.get('/api/farmers/:id', (req: Request, res: Response) => {
    const farmer = db.getUserById(req.params.id);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json(farmer);
  });

  app.post('/api/farmers/:id/verify', (req: Request, res: Response) => {
    const { verified } = req.body;
    const farmer = db.verifyFarmer(req.params.id, verified !== false);
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    res.json(farmer);
  });

  // --- ORDERS ENDPOINTS ---
  app.get('/api/orders', (req: Request, res: Response) => {
    const { buyerId, farmerId, status } = req.query;
    const orders = db.getOrders({
      buyerId: buyerId as string,
      farmerId: farmerId as string,
      status: status as string
    });
    res.json(orders);
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const order = db.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const result = db.createOrder(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error, code: 'INSUFFICIENT_STOCK' });
    }
    res.status(201).json(result.order);
  });

  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, actorName } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required' });
    const order = db.updateOrderStatus(req.params.id, status, actorName || 'User');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  });

  // --- PAYMENT ENDPOINTS ---
  app.post('/api/payments/create', async (req: Request, res: Response) => {
    try {
      const { amount, currency, receipt, notes } = req.body;
      const order = await paymentService.createPaymentOrder({
        amount,
        currency: currency || 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes
      });
      res.json(order);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/payments/verify', async (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
      const isValid = await paymentService.verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      });

      if (!isValid) {
        return res.status(400).json({ success: false, error: 'Invalid payment signature' });
      }

      if (orderId) {
        const order = db.getOrderById(orderId);
        if (order) {
          order.paymentStatus = 'SUCCESS';
          order.paymentId = razorpay_payment_id;
          order.status = 'PAID';
          db.updateOrderStatus(orderId, 'PAID', 'Payment Service');
        }
      }

      res.json({ success: true, paymentId: razorpay_payment_id });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/payments/webhook', (req: Request, res: Response) => {
    // Idempotent webhook handler
    console.log('[Payment Webhook Received]', req.body?.event);
    res.json({ status: 'ok', received: true });
  });

  // --- MARKET PRICES & WEATHER ---
  app.get('/api/market-prices', (req: Request, res: Response) => {
    res.json(db.getMarketPrices());
  });

  app.get('/api/weather', async (req: Request, res: Response) => {
    const lat = req.query.lat ? Number(req.query.lat) : 13.1367;
    const lng = req.query.lng ? Number(req.query.lng) : 78.1346;
    const weather = await weatherService.getWeatherByCoordinates(lat, lng, req.query.city as string);
    res.json(weather);
  });

  // --- B2B BULK REQUIREMENTS & QUOTES ---
  app.get('/api/bulk-requirements', (req: Request, res: Response) => {
    res.json(db.getBulkRequirements());
  });

  app.post('/api/bulk-requirements', (req: Request, res: Response) => {
    try {
      const created = db.createBulkRequirement(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.get('/api/quotes', (req: Request, res: Response) => {
    const { requirementId } = req.query;
    res.json(db.getQuotes(requirementId as string));
  });

  app.post('/api/quotes', (req: Request, res: Response) => {
    try {
      const created = db.createQuote(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post('/api/quotes/:id/accept', (req: Request, res: Response) => {
    const result = db.acceptQuote(req.params.id);
    if (!result.success) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    res.json(result);
  });

  // --- AI ADVISORY & ANALYTICS ---
  app.get('/api/ai/insights', async (req: Request, res: Response) => {
    const insights = await aiService.getPriceInsights();
    res.json(insights);
  });

  app.get('/api/ai/forecast', async (req: Request, res: Response) => {
    const forecasts = await aiService.getDemandForecast();
    res.json(forecasts);
  });

  app.post('/api/ai/match', async (req: Request, res: Response) => {
    const { requirementId } = req.body;
    const match = await aiService.smartMatchBuyerRequirement(requirementId);
    res.json(match);
  });

  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    const { query, role } = req.body;
    if (!query) return res.status(400).json({ error: 'Query is required' });
    const response = await aiService.answerAssistantQuery(query, role || 'general');
    res.json(response);
  });

  // --- ADMIN & IMPACT ---
  app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
    res.json(db.getAuditLogs());
  });

  app.get('/api/admin/analytics', (req: Request, res: Response) => {
    const orders = db.getOrders();
    const products = db.getProducts();
    const farmers = db.getAllFarmers();
    const totalGmv = orders.reduce((sum, o) => sum + o.totalPaid, 0);
    const platformFees = orders.reduce((sum, o) => sum + o.platformFee, 0);
    const farmerEarnings = orders.reduce((sum, o) => sum + o.farmerEarnings, 0);

    res.json({
      totalGmv,
      platformFees,
      farmerEarnings,
      totalOrders: orders.length,
      activeListings: products.length,
      registeredFarmers: farmers.length,
      pendingVerifications: farmers.filter(f => !f.verified).length
    });
  });

  app.get('/api/impact', (req: Request, res: Response) => {
    res.json(db.getImpactMetrics());
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 FarmDirect server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup failure:', err);
});
