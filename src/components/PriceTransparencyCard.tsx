import React, { useState } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Truck,
  Building,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { calculatePriceBreakdown, formatINR } from '../utils/pricing';

interface PriceTransparencyCardProps {
  farmerPricePerKg: number;
  traditionalRetailPrice: number;
  productName: string;
  unit?: string;
  mandiBenchmark?: number;
  mandiLocation?: string;
  freshnessTimestamp?: string;
  compact?: boolean;
}

export const PriceTransparencyCard: React.FC<PriceTransparencyCardProps> = ({
  farmerPricePerKg,
  traditionalRetailPrice,
  productName,
  unit = 'kg',
  mandiBenchmark = 32,
  mandiLocation = 'Kolar APMC Mandi',
  freshnessTimestamp = 'Today 08:30 AM (AGMARKNET Official)',
  compact = false
}) => {
  const [showExplanation, setShowExplanation] = useState(false);
  const breakdown = calculatePriceBreakdown(farmerPricePerKg, traditionalRetailPrice);

  if (compact) {
    return (
      <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-xs text-stone-700">
        <div className="flex items-center justify-between font-semibold text-emerald-950 mb-1">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            Transparent Pricing
          </span>
          <span className="text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md text-[10px]">
            Buyer Saves {formatINR(breakdown.buyerSavings)}/{unit}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1 text-[11px] text-stone-600">
          <div>
            <span className="block text-[10px] text-stone-400">Farmer Takes</span>
            <span className="font-bold text-stone-900">{formatINR(breakdown.farmerPrice)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-stone-400">Logistics+Fee</span>
            <span className="font-medium text-stone-700">{formatINR(breakdown.logisticsFee + breakdown.platformFee)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-stone-400">Retail Store</span>
            <span className="line-through text-stone-400">{formatINR(traditionalRetailPrice)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Direct Price Transparency Engine
          </div>
          <h3 className="text-base font-bold text-stone-900 mt-0.5">
            Where Every Rupee Goes: {productName}
          </h3>
        </div>
        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="text-xs text-stone-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer self-start sm:self-auto"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{showExplanation ? 'Hide Methodology' : 'How is this calculated?'}</span>
        </button>
      </div>

      {showExplanation && (
        <div className="my-3 p-3 bg-stone-50 rounded-xl text-xs text-stone-600 border border-stone-200 space-y-1">
          <p className="font-semibold text-stone-800">
            Methodology & Data Freshness ({freshnessTimestamp}):
          </p>
          <p>
            Traditional supply chains involve 4–5 intermediaries: Village Trader &rarr; Commission Agent &rarr; Wholesale Mandi Broker &rarr; Distributor &rarr; Retail Supermarket.
            Middlemen absorb up to 55-60% of consumer expenditure. FarmDirect connects you directly to the farmer with a fixed 3% platform fee and actual cold-chain logistics.
          </p>
          <p className="text-stone-500 text-[11px]">
            Market Benchmark Reference: <strong>{mandiLocation}</strong> modal price of {formatINR(mandiBenchmark)}/{unit}.
          </p>
        </div>
      )}

      {/* Comparative Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Traditional Middleman Chain */}
        <div className="bg-stone-50/90 border border-stone-200 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
            <span>Traditional Retail Market</span>
            <span className="text-stone-400">4 Intermediaries</span>
          </div>
          <div className="text-2xl font-bold text-stone-800 mb-2">
            {formatINR(breakdown.traditionalRetailPrice)}
            <span className="text-xs font-normal text-stone-500">/{unit}</span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-stone-600">
              <span>Farmer receives (est. 40%)</span>
              <span className="font-semibold text-stone-800">
                {formatINR(breakdown.traditionalRetailPrice - breakdown.farmerBonus - breakdown.buyerSavings - breakdown.logisticsFee)}
              </span>
            </div>
            <div className="flex justify-between text-amber-800 bg-amber-50/80 px-2 py-1 rounded-md">
              <span>Middlemen margins & wastage</span>
              <span className="font-semibold">
                {formatINR(breakdown.traditionalRetailPrice * 0.48)}
              </span>
            </div>
            <div className="flex justify-between text-stone-500 text-[11px] pt-1">
              <span>Logistics & transit loss</span>
              <span>{formatINR(breakdown.logisticsFee + 4)}</span>
            </div>
          </div>
        </div>

        {/* FarmDirect Model */}
        <div className="bg-gradient-to-br from-emerald-50/90 to-teal-50/60 border-2 border-emerald-500/40 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            FAIR TRADE MODEL
          </div>

          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">
            FarmDirect Transparent Price
          </div>
          <div className="text-2xl font-bold text-emerald-950 mb-2 flex items-baseline gap-2">
            {formatINR(breakdown.totalConsumerPrice)}
            <span className="text-xs font-normal text-stone-600">/{unit}</span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              Save {breakdown.savingsPercentage}%
            </span>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between text-emerald-950 font-bold bg-white/80 px-2 py-1 rounded-md border border-emerald-100">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Farmer Receives Directly (80%)
              </span>
              <span className="text-emerald-800">{formatINR(breakdown.farmerPrice)}/{unit}</span>
            </div>
            <div className="flex justify-between text-stone-700 px-2">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-stone-400" />
                Actual Farm-to-Fork Logistics
              </span>
              <span className="font-medium">{formatINR(breakdown.logisticsFee)}/{unit}</span>
            </div>
            <div className="flex justify-between text-stone-700 px-2">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3 text-stone-400" />
                Platform Service Fee (3%)
              </span>
              <span className="font-medium">{formatINR(breakdown.platformFee)}/{unit}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Outcome Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-stone-100">
        <div className="bg-emerald-50 rounded-xl p-2.5 text-center">
          <span className="block text-[11px] text-emerald-800 font-medium">Farmer Benefit</span>
          <span className="text-base font-extrabold text-emerald-900">
            +{formatINR(breakdown.farmerBonus)}/{unit}
          </span>
          <span className="block text-[10px] text-emerald-700 font-semibold">
            (+{breakdown.farmerBonusPercentage}% vs middlemen)
          </span>
        </div>

        <div className="bg-teal-50 rounded-xl p-2.5 text-center">
          <span className="block text-[11px] text-teal-800 font-medium">Buyer Savings</span>
          <span className="text-base font-extrabold text-teal-900">
            {formatINR(breakdown.buyerSavings)}/{unit}
          </span>
          <span className="block text-[10px] text-teal-700 font-semibold">
            (Saved vs Retail Supermarket)
          </span>
        </div>

        <div className="bg-stone-50 rounded-xl p-2.5 text-center col-span-2 sm:col-span-1">
          <span className="block text-[11px] text-stone-600 font-medium">Mandi Benchmark</span>
          <span className="text-base font-extrabold text-stone-900">
            {formatINR(mandiBenchmark)}/{unit}
          </span>
          <span className="block text-[10px] text-stone-500 truncate" title={mandiLocation}>
            {mandiLocation}
          </span>
        </div>
      </div>
    </div>
  );
};
