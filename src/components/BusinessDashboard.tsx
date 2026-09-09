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
import { useLanguage } from '../context/LanguageContext';

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
  const { t, translateCrop } = useLanguage();
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
              {t('b2bContractOrders')}
            </span>
            <span className="text-xs text-stone-500">{t('directChain')}</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {currentUser?.name || 'The Deccan Bistro'} {t('buyerProcurementHub')}
          </h2>
          <p className="text-xs text-stone-500">
            {t('b2bLeadsSubtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('createBulkContract')}</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('openRequirements')}</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{requirements.length}</div>
          <span className="text-[11px] text-stone-500">{t('quotesReceived')}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('estimatedSavings')}</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">28.4%</div>
          <span className="text-[11px] text-emerald-700 font-medium">vs {t('mandiBenchmark')}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('totalHarvestListed')}</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">2,850 kg</div>
          <span className="text-[11px] text-stone-500">100% {t('farmOrigin')}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('activeDispatches')}</span>
          <div className="text-2xl font-bold text-blue-900 mt-1">{orders.length}</div>
          <span className="text-[11px] text-blue-700 font-medium">{t('onTimeDeliveryRate')}</span>
        </div>
      </div>

      {/* Open Bulk Requirements with Received Quotes */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-stone-900">
          {t('b2bLeadsTitle')}
        </h3>

        <div className="space-y-6">
          {requirements.map(req => {
            const reqQuotes = quotes.filter(q => q.requirementId === req.id);
            const cropDisplay = translateCrop(req.productName);

            return (
              <div key={req.id} className="border border-stone-200 rounded-2xl p-5 bg-stone-50/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {cropDisplay}
                    </span>
                    <h4 className="text-sm font-bold text-stone-900 mt-1">
                      {req.quantityRequiredKg} kg @ {formatINR(req.targetPricePerKg)}/kg
                    </h4>
                    <p className="text-xs text-stone-500">
                      {t('estimatedDeliveryTime')}: {req.deliveryDateRequired} &bull; {t('gradeFilter')}: {req.qualityGradeRequired}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onRequestAIMatch(req.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{t('aiMultiFarmerMatching')}</span>
                    </button>
                  </div>
                </div>

                {/* AI Multi-Farmer Matching Display if active */}
                {aiMatchResult && aiMatchResult.requirementId === req.id && (
                  <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold text-emerald-950">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        {t('aiMultiFarmerMatching')}
                      </span>
                      <span className="text-emerald-800 font-extrabold">
                        {t('buyerSaves')} {formatINR(aiMatchResult.savingsVsMiddlemen)} vs Mandi
                      </span>
                    </div>
                    <p className="text-emerald-900">
                      Matched {aiMatchResult.recommendedFarmers.length} local farmers within 35 km to guarantee 100% volume ({aiMatchResult.totalQuantityNeeded} kg) @ {formatINR(aiMatchResult.averagePricePerKg)}/kg.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {aiMatchResult.recommendedFarmers.map((f: any) => (
                        <div key={f.farmerId} className="bg-white p-2.5 rounded-xl border border-emerald-200">
                          <span className="font-bold text-stone-900 block">{f.farmName} ({f.farmerName})</span>
                          <span className="text-stone-500 text-[11px] block">{t('foodMiles')}: {f.distanceKm} km &bull; {t('farmerRatingLabel')}: {f.rating}&#9733;</span>
                          <span className="text-emerald-800 font-bold block mt-1">
                            {f.allocatedQuantityKg} kg @ {formatINR(f.offeredPrice)}/kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quotations List */}
                <div>
                  <h5 className="text-xs font-bold text-stone-700 mb-2">
                    {t('quotesReceived')} ({reqQuotes.length}):
                  </h5>

                  {reqQuotes.length === 0 ? (
                    <div className="text-xs text-stone-400 italic py-2">
                      {t('awaitingFarmerQuotes')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {reqQuotes.map(q => (
                        <div key={q.id} className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-stone-900 text-xs">{q.farmName}</span>
                              <p className="text-[11px] text-stone-500">
                                {q.farmerName} &bull; {q.farmerDistanceKm} km &bull; {q.farmerRating}&#9733;
                              </p>
                            </div>
                            <span className="text-sm font-extrabold text-emerald-900">
                              {formatINR(q.pricePerKg)}/kg
                            </span>
                          </div>

                          <div className="text-[11px] text-stone-600 bg-stone-50 p-2 rounded-lg">
                            <span>{t('availableStock')}: <strong>{q.offeredQuantityKg} kg</strong></span> &bull; <span>{t('harvestDate')}: {q.harvestDate}</span>
                          </div>

                          {q.status === 'ACCEPTED' ? (
                            <span className="block text-center text-xs font-bold text-emerald-800 bg-emerald-100 py-1.5 rounded-lg">
                              {t('quoteAccepted')}
                            </span>
                          ) : (
                            <button
                              onClick={() => onAcceptQuote(q.id)}
                              className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            >
                              {t('acceptQuote')}
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
            <h3 className="text-base font-bold text-stone-900">{t('createBulkContract')}</h3>
            <form onSubmit={handlePost} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-600 font-medium mb-1">{t('cropNameLabel')}</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">{t('quantityKgLabel')}</label>
                  <input
                    type="number"
                    value={quantityKg}
                    onChange={e => setQuantityKg(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-stone-600 font-medium mb-1">{t('targetPriceKg')}</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={e => setTargetPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-stone-300 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">{t('deliveryTimeline')}</label>
                <input
                  type="text"
                  value={deliveryDate}
                  onChange={e => setDeliveryDate(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-stone-600 font-medium mb-1">{t('gradeFilter')}</label>
                <input
                  type="text"
                  value={qualityGrade}
                  onChange={e => setQualityGrade(e.target.value)}
                  className="w-full p-2.5 border border-stone-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold cursor-pointer"
                >
                  {t('postRfq')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

