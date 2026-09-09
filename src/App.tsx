import React, { useState, useEffect } from 'react';
import {
  Sprout,
  ShoppingCart,
  ShieldCheck,
  TrendingUp,
  Package,
  Truck,
  Building2,
  CheckCircle,
  AlertCircle,
  Eye,
  Info
} from 'lucide-react';
import {
  UserRole,
  LanguageCode,
  Product,
  FarmerProfile,
  Order,
  CartItem,
  MarketPrice,
  WeatherData,
  BulkRequirement,
  Quote,
  AuditLog,
  ImpactMetrics,
  User,
  OrderStatus
} from './types';
import { api } from './services/api';
import { calculatePriceBreakdown, formatINR } from './utils/pricing';
import { TRANSLATIONS } from './data/translations';

// Components
import { Navbar } from './components/Navbar';
import { MarketplaceView } from './components/MarketplaceView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { PriceTransparencyCard } from './components/PriceTransparencyCard';
import { FarmMap } from './components/FarmMap';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { FarmerDashboard } from './components/FarmerDashboard';
import { BusinessDashboard } from './components/BusinessDashboard';
import { LogisticsDashboard } from './components/LogisticsDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { MarketIntelligenceView } from './components/MarketIntelligenceView';
import { WeatherDashboard } from './components/WeatherDashboard';
import { AIAssistantModal } from './components/AIAssistantModal';
import { ImpactModal } from './components/ImpactModal';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  // Localization
  const { language, setLanguage, t, translateCrop, translateStatus } = useLanguage();

  // Core state
  const [currentRole, setCurrentRole] = useState<UserRole>('consumer');
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Entities
  const [products, setProducts] = useState<Product[]>([]);
  const [farmers, setFarmers] = useState<FarmerProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [marketPrices, setMarketPrices] = useState<MarketPrice[]>([]);
  const [bulkRequirements, setBulkRequirements] = useState<BulkRequirement[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [impact, setImpact] = useState<ImpactMetrics | null>(null);
  const [analytics, setAnalytics] = useState<any>({});
  const [aiInsights, setAIInsights] = useState<any[]>([]);
  const [aiMatchResult, setAIMatchResult] = useState<any>(null);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isImpactOpen, setIsImpactOpen] = useState(false);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  // Demo user identities mapped to roles
  const usersByRole: Record<UserRole, User> = {
    consumer: {
      id: 'user-consumer-1',
      name: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      phone: '+91 98860 41235',
      role: 'consumer',
      address: {
        street: 'Flat 402, Green Glen Layout, Bellandur',
        villageOrCity: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        pinCode: '560103',
        lat: 12.9260,
        lng: 77.6762
      },
      createdAt: '2026-01-15'
    },
    farmer: {
      id: 'farmer-1',
      name: 'Ramesh Patel',
      email: 'ramesh.patel@kolarfarms.in',
      phone: '+91 94481 23456',
      role: 'farmer',
      address: {
        street: 'Survey No. 42, Narasapura Road',
        villageOrCity: 'Vokkaleri Village',
        district: 'Kolar',
        state: 'Karnataka',
        pinCode: '563101',
        lat: 13.1367,
        lng: 78.1346
      },
      createdAt: '2025-08-10'
    },
    business: {
      id: 'user-business-1',
      name: 'Chef Vikram Roy (The Deccan Bistro)',
      email: 'procurement@deccanbistro.com',
      phone: '+91 99002 88471',
      role: 'business',
      address: {
        street: '12th Main Road, Indiranagar',
        villageOrCity: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        pinCode: '560038',
        lat: 12.9716,
        lng: 77.6412
      },
      createdAt: '2025-11-20'
    },
    logistics: {
      id: 'user-logistics-1',
      name: 'Suresh Kumar (Electric Reefer KA-04)',
      email: 'dispatch@ecofarmtrans.in',
      phone: '+91 97401 55920',
      role: 'logistics',
      address: {
        street: 'Hoskote Industrial Logistics Hub',
        villageOrCity: 'Hoskote',
        district: 'Bengaluru Rural',
        state: 'Karnataka',
        pinCode: '562114',
        lat: 13.0700,
        lng: 77.7980
      },
      createdAt: '2025-09-05'
    },
    admin: {
      id: 'user-admin-1',
      name: 'Pooja Hegde (Compliance Director)',
      email: 'pooja.hegde@farmdirect.org',
      phone: '+91 80 2554 9911',
      role: 'admin',
      address: {
        street: 'Agro Innovation Hub, Cubbon Road',
        villageOrCity: 'Bengaluru',
        district: 'Bengaluru Urban',
        state: 'Karnataka',
        pinCode: '560001',
        lat: 12.9780,
        lng: 77.5990
      },
      createdAt: '2025-01-01'
    }
  };

  const currentUser = usersByRole[currentRole];

  // Helper toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Initial Data Fetching
  useEffect(() => {
    async function loadInitialData() {
      try {
        const [
          prodData,
          farmerData,
          orderData,
          priceData,
          reqData,
          quoteData,
          weatherData,
          auditData,
          impactData,
          analyticsData,
          insightsData
        ] = await Promise.all([
          api.getProducts(),
          api.getFarmers(),
          api.getOrders(),
          api.getMarketPrices(),
          api.getBulkRequirements(),
          api.getQuotes(),
          api.getWeather('Kolar'),
          api.getAuditLogs(),
          api.getImpact(),
          api.getAdminAnalytics(),
          api.getAIInsights()
        ]);

        setProducts(prodData);
        setFarmers(farmerData);
        setOrders(orderData);
        setMarketPrices(priceData);
        setBulkRequirements(reqData);
        setQuotes(quoteData);
        setWeather(weatherData);
        setAuditLogs(auditData);
        setImpact(impactData);
        setAnalytics(analyticsData);
        setAIInsights(insightsData);
      } catch (err) {
        console.error('Error loading initial data:', err);
      }
    }
    loadInitialData();
  }, []);

  // Update default tab when role changes
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'farmer') {
      setActiveTab('dashboard');
    } else if (newRole === 'business') {
      setActiveTab('business-procurement');
    } else if (newRole === 'logistics') {
      setActiveTab('logistics-tasks');
    } else if (newRole === 'admin') {
      setActiveTab('admin-overview');
    } else {
      setActiveTab('marketplace');
    }
    showToast(`Switched view to ${newRole.toUpperCase()} mode (${usersByRole[newRole].name})`);
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantityKg: number) => {
    const breakdown = calculatePriceBreakdown(product.pricePerKg, product.traditionalRetailPrice);

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantityKg: item.quantityKg + quantityKg }
            : item
        );
      }
      return [...prev, { product, quantityKg, priceBreakdown: breakdown }];
    });

    showToast(`Added ${quantityKg} kg of ${product.name} to cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantityKg + delta;
            return newQty > 0 ? { ...item, quantityKg: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Order created (from checkout or quote acceptance)
  const handleOrderPlaced = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setTrackingOrder(newOrder);
    showToast(`Order #${newOrder.id} placed & payment escrow held via Razorpay!`);
  };

  // Farmer operations
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const created = await api.createProduct(productData);
      setProducts(prev => [created, ...prev]);
      showToast(`Fresh listing for ${created.name} published directly to buyers!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to list product');
    }
  };

  const handleUpdateStock = async (productId: string, newStockKg: number) => {
    try {
      const updated = await api.updateProduct(productId, { availableQuantityKg: newStockKg });
      setProducts(prev => prev.map(p => (p.id === productId ? updated : p)));
      showToast('Inventory stock updated successfully');
    } catch (err: any) {
      showToast(err.message || 'Failed to update stock');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Listing removed from marketplace');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove listing');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status, currentUser.name);
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      if (trackingOrder?.id === orderId) {
        setTrackingOrder(updated);
      }
      showToast(`Order #${orderId} moved to ${status}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to update order status');
    }
  };

  // B2B operations
  const handlePostBulkRequirement = async (data: any) => {
    try {
      const created = await api.createBulkRequirement(data);
      setBulkRequirements(prev => [created, ...prev]);
      showToast(`Bulk RFQ for ${created.productName} broadcast to nearby farmers!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to broadcast RFQ');
    }
  };

  const handleFarmerSubmitQuote = async (quoteData: any) => {
    try {
      const created = await api.createQuote(quoteData);
      setQuotes(prev => [created, ...prev]);
      showToast(`Quotation submitted to ${quoteData.farmName}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit quotation');
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    try {
      const res = await api.acceptQuote(quoteId);
      if (res.order) {
        setOrders(prev => [res.order!, ...prev]);
        setTrackingOrder(res.order);
      }
      setQuotes(prev =>
        prev.map(q => (q.id === quoteId ? { ...q, status: 'ACCEPTED' } : q))
      );
      showToast('Farmer quotation accepted! Escrow payment locked and order created.');
    } catch (err: any) {
      showToast(err.message || 'Failed to accept quote');
    }
  };

  const handleRequestAIMatch = async (reqId: string) => {
    try {
      const match = await api.getAIMatch(reqId);
      setAIMatchResult(match);
      showToast('AI multi-farmer fulfillment match computed successfully!');
    } catch (err: any) {
      showToast('AI match calculation error');
    }
  };

  // Admin operations
  const handleVerifyFarmer = async (farmerId: string, verified: boolean) => {
    try {
      const updated = await api.verifyFarmer(farmerId, verified);
      setFarmers(prev => prev.map(f => (f.id === farmerId ? updated : f)));
      showToast(`Farmer ${updated.name} verification status set to ${verified ? 'VERIFIED' : 'SUSPENDED'}`);
    } catch (err: any) {
      showToast('Verification update failed');
    }
  };

  const handleWeatherCityChange = async (city: string) => {
    try {
      const data = await api.getWeather(city);
      setWeather(data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantityKg, 0);

  return (
    <div className="min-h-screen bg-stone-100/60 text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageChange={setLanguage}
        cartCount={cart.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        onOpenImpact={() => setIsImpactOpen(true)}
        currentUser={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Container Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Consumer Views */}
        {activeTab === 'marketplace' && (
          <MarketplaceView
            products={products}
            farmers={farmers}
            onSelectProduct={p => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onViewFarmerProfile={farmerId => {
              const f = farmers.find(farm => farm.id === farmerId);
              if (f) {
                showToast(`Viewing ${f.farmName} in Kolar cluster`);
              }
            }}
          />
        )}

        {activeTab === 'farms-map' && (
          <FarmMap
            farmers={farmers}
            products={products}
            onSelectProduct={p => setSelectedProduct(p)}
            onViewFarmer={fId => showToast(`Selected farm ${fId}`)}
          />
        )}

        {activeTab === 'transparency' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
              <h2 className="text-xl font-bold text-stone-900 mb-1">
                Zero Middlemen Direct Pricing Engine
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                See exact financial allocations across our top harvested produce vs traditional APMC wholesale & retail supermarkets.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.slice(0, 4).map(product => (
                  <PriceTransparencyCard
                    key={product.id}
                    farmerPricePerKg={product.pricePerKg}
                    traditionalRetailPrice={product.traditionalRetailPrice}
                    productName={product.name}
                    mandiBenchmark={product.marketReferencePrice}
                    mandiLocation={`${product.farmerLocation.district} APMC Mandi`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h2 className="text-xl font-bold text-stone-900">{t('myOrders')}</h2>
                <p className="text-xs text-stone-500">
                  {t('trackLiveOrders')}
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
                {orders.length} {t('myOrders')}
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-16 text-xs text-stone-500">
                {t('noOrders')}
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {orders.map(order => (
                  <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-stone-900">{t('orderNumber')} #{order.id}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                          {translateStatus(order.status)}
                        </span>
                        <span className="text-xs text-stone-400">&bull; {order.createdAt}</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        {order.items.map(i => `${translateCrop(i.productName)} (${i.quantityKg}kg)`).join(', ')}
                      </p>
                      <span className="text-[11px] text-stone-400">
                        {t('estimatedDeliveryTime')}: {order.estimatedDeliveryTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block">{t('totalCost')}</span>
                        <span className="text-base font-bold text-emerald-950">
                          {formatINR(order.totalPaid)}
                        </span>
                      </div>
                      <button
                        onClick={() => setTrackingOrder(order)}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        {t('liveOrderTracking')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}


        {/* Farmer Dashboard Views */}
        {(activeTab === 'dashboard' || activeTab === 'inventory' || activeTab === 'bulk-leads') && currentRole === 'farmer' && (
          <FarmerDashboard
            farmer={farmers[0] || (currentUser as any)}
            products={products}
            orders={orders}
            marketPrices={marketPrices}
            bulkRequirements={bulkRequirements}
            weather={weather || { city: 'Kolar', state: 'Karnataka', temperatureC: 28, condition: 'Clear', icon: 'sun', humidityPercent: 62, rainProbabilityPercent: 65, windSpeedKmh: 14, advisory: 'Schedule harvest early.', forecast5Days: [] }}
            aiInsights={aiInsights}
            onAddProduct={handleAddProduct}
            onUpdateStock={handleUpdateStock}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSubmitQuote={handleFarmerSubmitQuote}
          />
        )}

        {/* Business Procurement Views */}
        {activeTab === 'business-procurement' && (
          <BusinessDashboard
            currentUser={currentUser}
            requirements={bulkRequirements}
            quotes={quotes}
            orders={orders}
            onPostRequirement={handlePostBulkRequirement}
            onAcceptQuote={handleAcceptQuote}
            onRequestAIMatch={handleRequestAIMatch}
            aiMatchResult={aiMatchResult}
          />
        )}

        {/* Logistics Views */}
        {activeTab === 'logistics-tasks' && (
          <LogisticsDashboard
            orders={orders}
            onUpdateStatus={handleUpdateOrderStatus}
          />
        )}

        {/* Admin Views */}
        {activeTab === 'admin-overview' && (
          <AdminDashboard
            analytics={analytics}
            farmers={farmers}
            auditLogs={auditLogs}
            impact={impact || { intermediariesEliminatedCount: 4, totalProduceDeliveredKg: 18450, totalFarmerExtraIncomeRupees: 142800, totalBuyerSavingsRupees: 98000, foodMilesReductionPercent: 42, activeFarmingFamiliesCount: 120 }}
            onVerifyFarmer={handleVerifyFarmer}
          />
        )}

        {/* Mandi Intelligence Tab */}
        {activeTab === 'mandi' && (
          <MarketIntelligenceView
            marketPrices={marketPrices}
            aiInsights={aiInsights}
          />
        )}

        {/* Weather Tab */}
        {activeTab === 'weather' && weather && (
          <WeatherDashboard
            weather={weather}
            onCityChange={handleWeatherCityChange}
          />
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          farmer={farmers.find(f => f.id === selectedProduct.farmerId)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={() => setCart([])}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal with Razorpay Test Mode */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        currentUser={currentUser}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Order Tracking Modal */}
      {trackingOrder && (
        <OrderTrackingModal
          order={trackingOrder}
          onClose={() => setTrackingOrder(null)}
          onRateOrder={(orderId, rating, comment) => {
            showToast(`Thank you for rating Order #${orderId}!`);
          }}
        />
      )}

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        userRole={currentRole}
      />

      {/* Impact Modal */}
      {impact && (
        <ImpactModal
          isOpen={isImpactOpen}
          onClose={() => setIsImpactOpen(false)}
          impact={impact}
        />
      )}

      {/* Minimal Footer */}
      <footer className="mt-12 bg-white border-t border-stone-200 py-6 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            <span className="font-bold text-stone-800">FarmDirect</span>
            <span>&bull; {t('tagline')} &bull; {t('fairTradeCertified')}</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>{t('escrowSecure')}</span>
            <span>&bull;</span>
            <span>{t('officialGovNotice')}</span>
            <span>&bull;</span>
            <span>{t('middlemenEliminatedText')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
