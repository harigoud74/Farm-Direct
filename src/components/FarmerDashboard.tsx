import React, { useState } from 'react';
import {
  Sprout,
  TrendingUp,
  Package,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  CloudRain,
  CheckCircle,
  Truck,
  DollarSign,
  Sparkles,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Product, Order, MarketPrice, BulkRequirement, WeatherData, FarmerProfile } from '../types';
import { formatINR } from '../utils/pricing';

interface FarmerDashboardProps {
  farmer: FarmerProfile;
  products: Product[];
  orders: Order[];
  marketPrices: MarketPrice[];
  bulkRequirements: BulkRequirement[];
  weather: WeatherData;
  aiInsights: any[];
  onAddProduct: (productData: Omit<Product, 'id'>) => void;
  onUpdateStock: (productId: string, newStockKg: number) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: any) => void;
  onSubmitQuote: (quoteData: any) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  farmer,
  products,
  orders,
  marketPrices,
  bulkRequirements,
  weather,
  aiInsights,
  onAddProduct,
  onUpdateStock,
  onDeleteProduct,
  onUpdateOrderStatus,
  onSubmitQuote
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedReqForQuote, setSelectedReqForQuote] = useState<BulkRequirement | null>(null);
  const [quotePrice, setQuotePrice] = useState<number>(28);
  const [quoteQuantity, setQuoteQuantity] = useState<number>(100);

  // New product form
  const [newProductName, setNewProductName] = useState('');
  const [newVariety, setNewVariety] = useState('');
  const [newCategory, setNewCategory] = useState('Vegetables');
  const [newPrice, setNewPrice] = useState<number>(30);
  const [newRetailPrice, setNewRetailPrice] = useState<number>(45);
  const [newStock, setNewStock] = useState<number>(200);
  const [newGrade, setNewGrade] = useState('A Grade Premium');
  const [newMethod, setNewMethod] = useState('Natural Farming (ZBNF)');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80');

  const farmerProducts = products.filter(p => p.farmerId === farmer.id);
  const farmerOrders = orders.filter(o => o.items.some(item => item.farmerId === farmer.id));

  const totalFarmerRevenue = farmerOrders.reduce(
    (sum, o) => sum + o.items.filter(i => i.farmerId === farmer.id).reduce((s, i) => s + i.farmerTotal, 0),
    0
  );

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newPrice || !newStock) return;

    onAddProduct({
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmName: farmer.farmName,
      farmerLocation: {
        village: farmer.address.villageOrCity,
        district: farmer.address.district,
        state: farmer.address.state,
        pincode: farmer.address.pinCode,
        lat: farmer.address.lat,
        lng: farmer.address.lng
      },
      farmerRating: farmer.rating,
      name: newProductName,
      variety: newVariety || 'Hybrid Select',
      category: newCategory as any,
      description: `Direct farm harvest of fresh ${newProductName} from ${farmer.farmName}. High nutritional value and zero chemical residues.`,
      images: [newImageUrl],
      pricePerKg: Number(newPrice),
      traditionalRetailPrice: Number(newRetailPrice) || Number(newPrice) * 1.5,
      marketReferencePrice: Number(newPrice) * 1.1,
      unit: 'kg',
      minOrderQuantityKg: 1,
      availableQuantityKg: Number(newStock),
      harvestDate: 'Harvested Today at Dawn',
      shelfLifeDays: 5,
      isOrganic: true,
      qualityGrade: newGrade,
      farmingMethod: newMethod,
      freshnessGuaranteeHours: 24,
      deliveryRadiusKm: 120
    });

    setShowAddModal(false);
    setNewProductName('');
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForQuote) return;

    onSubmitQuote({
      requirementId: selectedReqForQuote.id,
      farmerId: farmer.id,
      farmerName: farmer.name,
      farmName: farmer.farmName,
      farmerRating: farmer.rating,
      farmerDistanceKm: 32,
      pricePerKg: quotePrice,
      offeredQuantityKg: quoteQuantity,
      harvestDate: 'Within 48 hours of order confirmation',
      qualityGrade: 'A Grade Institutional Batch',
      notes: 'Direct farm pickup or delivery via cold-chain van.'
    });

    setSelectedReqForQuote(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Profile Bar */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl shadow-sm">
            {farmer.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900">{farmer.farmName}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified Farmer
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Owner: <strong>{farmer.name}</strong> &bull; {farmer.address.villageOrCity}, {farmer.address.district} &bull; {farmer.farmSizeAcres} Acres
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>List New Harvest Produce</span>
        </button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Total Direct Revenue</span>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">
            {formatINR(totalFarmerRevenue || 34200)}
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
            +66% vs local Mandi commission
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Active Listed Produce</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1">
            {farmerProducts.length} Items
          </div>
          <span className="text-[11px] text-stone-500 block mt-0.5">
            {farmerProducts.reduce((sum, p) => sum + p.availableQuantityKg, 0)} kg in inventory
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Orders Awaiting Pickup</span>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">
            {farmerOrders.filter(o => o.status === 'PAID' || o.status === 'ACCEPTED').length} Orders
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">
            Electric Van dispatch active
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium block">Farmer Rating</span>
          <div className="text-2xl font-extrabold text-stone-900 mt-1 flex items-center gap-1">
            <span>{farmer.rating}</span>
            <span className="text-xs text-stone-400 font-normal">/ 5.0</span>
          </div>
          <span className="text-[11px] text-teal-700 font-semibold block mt-0.5">
            Top 5% verified in district
          </span>
        </div>
      </div>

      {/* Weather & AI Advisory Dual Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weather alert */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
          <div className="flex items-center justify-between text-blue-900 font-bold text-xs mb-1">
            <span className="flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-blue-600" />
              Agro-Weather Advisory ({weather.city})
            </span>
            <span className="text-[11px] bg-blue-100 px-2 py-0.5 rounded-full">
              Rain Prob: {weather.rainProbabilityPercent}%
            </span>
          </div>
          <p className="text-xs text-blue-950 font-medium mt-1">
            {weather.advisory}
          </p>
          <div className="text-[11px] text-blue-700 mt-2 flex gap-4">
            <span>Temp: {weather.temperatureC}°C</span>
            <span>Humidity: {weather.humidityPercent}%</span>
            <span>Wind: {weather.windSpeedKmh} km/h</span>
          </div>
        </div>

        {/* AI Selling Recommendation */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
          <div className="flex items-center justify-between text-emerald-950 font-bold text-xs mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI Harvest & Pricing Intelligence
            </span>
            <span className="text-[11px] bg-emerald-200/80 px-2 py-0.5 rounded-full text-emerald-900">
              Confidence 88%
            </span>
          </div>
          <p className="text-xs text-emerald-950 font-medium mt-1">
            {aiInsights[0]?.recommendation || 'Consider scheduling tomato delivery within 2–4 days before anticipated rain disruptions.'}
          </p>
          <div className="text-[11px] text-emerald-800 mt-2">
            Mandi Benchmark: ₹30/kg modal &bull; Recommended Direct Listing: ₹28–₹30/kg
          </div>
        </div>
      </div>

      {/* Orders to Fulfill Queue */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-emerald-700" />
            Active Direct Orders Queue ({farmerOrders.length})
          </h3>
          <span className="text-xs text-stone-500">Live order status progression</span>
        </div>

        {farmerOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-stone-500">
            No incoming orders currently pending fulfillment.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {farmerOrders.map(order => (
              <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">Order #{order.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      order.status === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'PAID'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className="text-xs text-stone-400">&bull; {order.estimatedDeliveryTime}</span>
                  </div>
                  <p className="text-xs text-stone-600 mt-1">
                    Buyer: <strong>{order.buyerName}</strong> ({order.shippingAddress.city})
                  </p>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Items: {order.items.map(i => `${i.productName} (${i.quantityKg}kg)`).join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Your Earnings</span>
                    <span className="text-base font-bold text-emerald-900">
                      {formatINR(order.farmerEarnings)}
                    </span>
                  </div>

                  {order.status === 'PAID' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'ACCEPTED')}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Accept Order
                    </button>
                  )}
                  {order.status === 'ACCEPTED' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'READY_FOR_PICKUP')}
                      className="px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Ready for Pickup
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Listed Produce Inventory Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-700" />
            My Active Produce Listings ({farmerProducts.length})
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs text-emerald-700 font-bold hover:underline cursor-pointer"
          >
            + Add Another Crop
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600 mt-2">
            <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
              <tr>
                <th className="py-3 px-3">Crop / Produce</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Your Rate (₹/kg)</th>
                <th className="py-3 px-3">Market Mandi Benchmark</th>
                <th className="py-3 px-3">Available Stock (kg)</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {farmerProducts.map(p => (
                <tr key={p.id} className="hover:bg-stone-50/60">
                  <td className="py-3 px-3 font-bold text-stone-900 flex items-center gap-2">
                    <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <div>{p.name}</div>
                      <span className="text-[10px] text-stone-400 font-normal">{p.variety}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 font-medium">{p.category}</td>
                  <td className="py-3 px-3 font-bold text-emerald-900 text-sm">
                    {formatINR(p.pricePerKg)}/{p.unit}
                  </td>
                  <td className="py-3 px-3 text-stone-500">
                    {formatINR(p.marketReferencePrice)}/{p.unit}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-800">{p.availableQuantityKg} kg</span>
                      <button
                        onClick={() => {
                          const newQty = prompt('Enter updated available inventory (kg):', p.availableQuantityKg.toString());
                          if (newQty && !isNaN(Number(newQty))) {
                            onUpdateStock(p.id, Number(newQty));
                          }
                        }}
                        className="text-[10px] text-emerald-700 font-bold hover:underline cursor-pointer"
                      >
                        Adjust
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right space-x-2">
                    <button
                      onClick={() => onDeleteProduct(p.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer"
                      title="Delete produce"
                    >
                      <Trash2 className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* B2B Opportunity Board (Bulk Requirements from Restaurants & Hotels) */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Restaurant & Institutional Bulk Procurement Requests
            </h3>
            <p className="text-xs text-stone-500">
              Sell high-volume harvest directly to restaurants and supermarkets without APMC commission agents.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg">
            {bulkRequirements.length} Open Requests
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {bulkRequirements.map(req => (
            <div key={req.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded">
                    {req.productName}
                  </span>
                  <h4 className="text-sm font-bold text-stone-900 mt-1">{req.businessName}</h4>
                  <span className="text-xs text-stone-500">{req.businessType} &bull; {req.deliveryLocation}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Target Rate</span>
                  <span className="text-sm font-bold text-stone-900">{formatINR(req.targetPricePerKg)}/kg</span>
                </div>
              </div>

              <div className="flex justify-between text-xs text-stone-600 py-2 border-y border-stone-200">
                <span>Quantity Required: <strong>{req.quantityRequiredKg} kg</strong></span>
                <span>Delivery: <strong>{req.deliveryDateRequired}</strong></span>
              </div>

              <button
                onClick={() => {
                  setSelectedReqForQuote(req);
                  setQuotePrice(req.targetPricePerKg);
                  setQuoteQuantity(Math.min(req.quantityRequiredKg, 200));
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Submit Farmer Quotation
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-stone-900">List New Farm Harvest Produce</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-700">
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Produce Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shivam Hybrid Tomatoes"
                  value={newProductName}
                  onChange={e => setNewProductName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Variety</label>
                  <input
                    type="text"
                    placeholder="e.g. Grade A Hybrid"
                    value={newVariety}
                    onChange={e => setNewVariety(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                    className="w-full p-2.5 border border-stone-300 rounded-xl cursor-pointer"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Spices & Herbs">Spices & Herbs</option>
                    <option value="Dairy & Honey">Dairy & Honey</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Your Price (₹/kg)</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Retail Store Est. (₹)</label>
                  <input
                    type="number"
                    value={newRetailPrice}
                    onChange={e => setNewRetailPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Stock (kg)</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={e => setNewStock(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Photo Preview URL</label>
                <input
                  type="text"
                  value={newImageUrl}
                  onChange={e => setNewImageUrl(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quote Submission Modal */}
      {selectedReqForQuote && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-stone-900">
              Submit Quotation for {selectedReqForQuote.productName}
            </h3>
            <p className="text-xs text-stone-500">
              Buyer: <strong>{selectedReqForQuote.businessName}</strong> &bull; Total Required: {selectedReqForQuote.quantityRequiredKg} kg
            </p>

            <form onSubmit={handleSendQuote} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Your Offered Price (₹/kg)</label>
                <input
                  type="number"
                  value={quotePrice}
                  onChange={e => setQuotePrice(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Offered Quantity (kg)</label>
                <input
                  type="number"
                  value={quoteQuantity}
                  onChange={e => setQuoteQuantity(Number(e.target.value))}
                  className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedReqForQuote(null)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Submit Quote
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
