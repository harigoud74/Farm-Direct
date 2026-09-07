import React, { useState } from 'react';
import {
  Building2,
  Plus,
  TrendingDown,
  CheckCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileText
} from 'lucide-react';
import { BulkRequirement, Quote, Order, User } from '../types';
import { formatINR } from '../utils/pricing';

interface BusinessDashboardProps {
  currentUser: User | null;
  requirements: BulkRequirement[];
  quotes: Quote[];
  orders: Order[];
  onPostRequirement: (data: any) => void;
  onAcceptQuote: (quoteId: string) => void;
  onRequestAIMatch: (reqId: string) => void;
  aiMatchResult: any;
}

export const BusinessDashboard: React.FC<BusinessDashboardProps> = ({
  currentUser,
  requirements,
  quotes,
  orders,
  onPostRequirement,
  onAcceptQuote,
  onRequestAIMatch,
  aiMatchResult
}) => {
  const [showPostModal, setShowPostModal] = useState(false);
  const [productName, setProductName] = useState('Shivam Hybrid Tomatoes');
  const [quantityKg, setQuantityKg] = useState<number>(400);
  const [targetPrice, setTargetPrice] = useState<number>(27);
  const [deliveryDate, setDeliveryDate] = useState('Within 48 hours');
  const [qualityGrade, setQualityGrade] = useState('Grade A Export / Culinary Standard');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    onPostRequirement({
      buyerId: currentUser?.id || 'user-business-1',
      businessName: currentUser?.name || 'The Deccan Bistro',
      businessType: 'Restaurant & Catering',
      productName,
      quantityRequiredKg: Number(quantityKg),
      targetPricePerKg: Number(targetPrice),
      deliveryLocation: 'Indiranagar, Bengaluru',
      deliveryDateRequired: deliveryDate,
      qualityGradeRequired: qualityGrade,
      status: 'OPEN',
      notes: 'Culinary consistency required. Minimum 70mm diameter tomatoes.'
    });
    setShowPostModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              B2B Institutional Procurement
            </span>
            <span className="text-xs text-stone-500">Direct Contract Farming & Daily Sourcing</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {currentUser?.name || 'The Deccan Bistro'} Procurement Desk
          </h2>
          <p className="text-xs text-stone-500">
            Source fresh, standardized restaurant-grade produce straight from verified farm clusters.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Bulk Requirement</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Active Sourcing RFQs</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{requirements.length}</div>
          <span className="text-[11px] text-stone-500">12 Farmer quotes pending</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Procurement Savings</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">28.4%</div>
          <span className="text-[11px] text-emerald-700 font-medium">vs Wholesale Mandi Agents</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Direct Sourced Produce</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">2,850 kg</div>
          <span className="text-[11px] text-stone-500">100% farm traceable</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Active B2B Orders</span>
          <div className="text-2xl font-bold text-blue-900 mt-1">{orders.length}</div>
          <span className="text-[11px] text-blue-700 font-medium">On-schedule cold chain</span>
        </div>
      </div>

      {/* Open Bulk Requirements with Received Quotes */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-stone-900">
          Open Procurement Requirements & Received Quotations
        </h3>

        <div className="space-y-6">
          {requirements.map(req => {
            const reqQuotes = quotes.filter(q => q.requirementId === req.id);

            return (
              <div key={req.id} className="border border-stone-200 rounded-2xl p-5 bg-stone-50/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {req.productName}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-1">
                      {req.quantityRequiredKg} kg needed at target {formatINR(req.targetPricePerKg)}/kg
                    </h4>
                    <p className="text-xs text-stone-500">
                      Required by: {req.deliveryDateRequired} &bull; Quality: {req.qualityGradeRequired}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRequestAIMatch(req.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Multi-Farmer Match</span>
                    </button>
                  </div>
                </div>

                {/* AI Multi-Farmer Matching Display if active */}
                {aiMatchResult && aiMatchResult.requirementId === req.id && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        AI Recommended Split Order Fulfillment
                      </span>
                      <span className="text-emerald-800 font-extrabold">
                        Save {formatINR(aiMatchResult.savingsVsMiddlemen)} vs Mandi
                      </span>
                    </div>
                    <p className="text-emerald-900">
                      Matched {aiMatchResult.recommendedFarmers.length} local farmers within 35 km to guarantee 100% volume fulfillment ({aiMatchResult.totalQuantityNeeded} kg) at an average price of {formatINR(aiMatchResult.averagePricePerKg)}/kg.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {aiMatchResult.recommendedFarmers.map((f: any) => (
                        <div key={f.farmerId} className="bg-white p-2.5 rounded-xl border border-emerald-200">
                          <span className="font-bold text-stone-900 block">{f.farmName} ({f.farmerName})</span>
                          <span className="text-stone-500 text-[11px] block">Distance: {f.distanceKm} km &bull; Rating: {f.rating}&#9733;</span>
                          <span className="text-emerald-800 font-bold block mt-1">
                            Allocated: {f.allocatedQuantityKg} kg @ {formatINR(f.offeredPrice)}/kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quotations List */}
                <div>
                  <h5 className="text-xs font-bold text-stone-700 mb-2">
                    Farmer Quotations Received ({reqQuotes.length}):
                  </h5>

                  {reqQuotes.length === 0 ? (
                    <div className="text-xs text-stone-400 italic py-2">
                      Awaiting responses from nearby verified farm clusters...
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {reqQuotes.map(q => (
                        <div key={q.id} className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-stone-900 text-xs">{q.farmName}</span>
                              <p className="text-[11px] text-stone-500">
                                {q.farmerName} &bull; {q.farmerDistanceKm} km away &bull; Rating: {q.farmerRating}&#9733;
                              </p>
                            </div>
                            <span className="text-sm font-extrabold text-emerald-900">
                              {formatINR(q.pricePerKg)}/kg
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg">
                            <span>Offered: <strong>{q.offeredQuantityKg} kg</strong></span> &bull; <span>Harvest: {q.harvestDate}</span>
                          </div>

                          {q.status === 'ACCEPTED' ? (
                            <span className="block text-center text-xs font-bold text-emerald-800 bg-emerald-100 py-1.5 rounded-lg">
                              Quotation Accepted & Order Created
                            </span>
                          ) : (
                            <button
                              onClick={() => onAcceptQuote(q.id)}
                              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              Accept Quote & Lock Escrow
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-stone-900">Post Bulk Procurement Request</h3>
            <form onSubmit={handlePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">Crop / Product Needed</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={e => setQuantityKg(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Target Price (₹/kg)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="w-full p-2.5 border rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Delivery Timeline</label>
                <input
                  type="text"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">Quality Specifications</label>
                <input
                  type="text"
                  value={qualityGrade}
                  onChange={e => setQualityGrade(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 text-white rounded-xl font-bold"
                >
                  Post RFQ to Farmers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
