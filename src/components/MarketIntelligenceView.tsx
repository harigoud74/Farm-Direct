import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ShieldCheck,
  Calendar,
  MapPin,
  ExternalLink,
  Info
} from 'lucide-react';
import { MarketPrice } from '../types';
import { formatINR } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';

interface MarketIntelligenceViewProps {
  marketPrices: MarketPrice[];
  aiInsights: any[];
}

export const MarketIntelligenceView: React.FC<MarketIntelligenceViewProps> = ({
  marketPrices,
  aiInsights
}) => {
  const { t, translateCrop } = useLanguage();
  const [selectedCrop, setSelectedCrop] = useState<string>(marketPrices[0]?.cropName || 'Tomato (Hybrid)');

  const currentCropData = marketPrices.find(m => m.cropName === selectedCrop) || marketPrices[0];
  const insight = aiInsights.find(i => i.cropName.toLowerCase().includes(selectedCrop.toLowerCase().split(' ')[0])) || aiInsights[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {t('officialGovNotice')}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">{t('mandiIntelligence')}</h2>
          <p className="text-xs text-stone-500">
            {t('mandiSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200">
          <Calendar className="w-4 h-4 text-emerald-700" />
          <span>{t('harvestDate')}: <strong>{t('today')} 08:30 AM</strong></span>
        </div>
      </div>

      {/* AI Crop Recommendation Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-800/80 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('aiAssistant')}</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {insight?.recommendation || t('sellNowAdvice')}
          </h3>
          <p className="text-xs text-emerald-100/80 max-w-2xl">
            {insight?.rationale || t('mandiSubtitle')}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-3 rounded-2xl text-xs text-right shrink-0">
          <span className="text-emerald-200 text-[10px] block uppercase font-bold">{t('farmerRatingLabel')}</span>
          <span className="text-xl font-extrabold text-white">88% Accuracy</span>
          <span className="text-[10px] text-emerald-200 block">7-Day Moving Avg</span>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {marketPrices.map(crop => (
          <button
            key={crop.id}
            onClick={() => setSelectedCrop(crop.cropName)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              selectedCrop === crop.cropName
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>{translateCrop(crop.cropName)}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              crop.priceTrend === 'increasing' ? 'bg-emerald-700 text-white' : 'bg-stone-200 text-stone-700'
            }`}>
              {crop.changePercentage > 0 ? `+${crop.changePercentage}%` : `${crop.changePercentage}%`}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Crop Deep-Dive Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Price comparison & 7-day history */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Rates Matrix */}
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">{translateCrop(currentCropData.cropName)} {t('mandiBenchmark')}</h3>
                <span className="text-xs text-stone-500">Mandi: {currentCropData.mandiName} ({currentCropData.state})</span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                currentCropData.priceTrend === 'increasing'
                  ? 'bg-emerald-100 text-emerald-900'
                  : currentCropData.priceTrend === 'decreasing'
                  ? 'bg-red-100 text-red-900'
                  : 'bg-stone-100 text-stone-900'
              }`}>
                {currentCropData.priceTrend === 'increasing' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-700" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>
                  {currentCropData.priceTrend === 'increasing' ? t('increasing') : currentCropData.priceTrend === 'decreasing' ? t('decreasing') : t('stable')} ({currentCropData.changePercentage}%)
                </span>
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 my-6">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                <span className="text-[11px] text-stone-500 block">{t('rangeCol')} (Min)</span>
                <span className="text-xl font-bold text-stone-800">{formatINR(currentCropData.minPrice)}/kg</span>
                <span className="text-[10px] text-stone-400">Distress / Grade B</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-300 text-center">
                <span className="text-[11px] text-emerald-900 font-bold block">{t('modalRateCol')}</span>
                <span className="text-2xl font-extrabold text-emerald-950">{formatINR(currentCropData.modalPrice)}/kg</span>
                <span className="text-[10px] text-emerald-700 font-semibold">{t('mandiBenchmark')}</span>
              </div>
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-center">
                <span className="text-[11px] text-stone-500 block">{t('rangeCol')} (Max)</span>
                <span className="text-xl font-bold text-stone-800">{formatINR(currentCropData.maxPrice)}/kg</span>
                <span className="text-[10px] text-stone-400">Grade A Export</span>
              </div>
            </div>

            {/* 7-Day Price History Visualizer */}
            <div className="space-y-3 pt-2 border-t border-stone-100">
              <h4 className="text-xs font-bold text-stone-700">{t('historicalPriceTrend')} (₹/kg)</h4>
              <div className="flex items-end gap-3 h-32 pt-4 px-2">
                {currentCropData.history7Days.map((day, idx) => {
                  const maxH = Math.max(...currentCropData.history7Days.map(d => d.modalPrice));
                  const heightPercent = Math.round((day.modalPrice / (maxH * 1.2)) * 100);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                      <span className="text-[10px] font-bold text-stone-800 group-hover:text-emerald-700">
                        ₹{day.modalPrice}
                      </span>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full bg-emerald-600 group-hover:bg-emerald-700 rounded-t-lg transition-all"
                      ></div>
                      <span className="text-[10px] text-stone-400 truncate w-full text-center">
                        {day.date.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Transparent Channel Comparison */}
        <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            {t('channelComparison')}
          </h3>
          <p className="text-xs text-stone-500">
            {t('transparentBreakdownDesc')}
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-700 block">1. {t('middlemenCut')}</span>
              <div className="flex justify-between">
                <span>{t('farmerReceives')}:</span>
                <strong className="text-stone-900">{formatINR(currentCropData.minPrice * 0.9)}/kg</strong>
              </div>
              <span className="text-[10px] text-stone-400 block">{t('middlemenEliminatedText')}</span>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-700 block">2. {t('mandiBenchmark')}</span>
              <div className="flex justify-between">
                <span>{t('modalRateCol')}:</span>
                <strong className="text-stone-900">{formatINR(currentCropData.modalPrice)}/kg</strong>
              </div>
              <span className="text-[10px] text-stone-400 block">{t('officialGovNotice')}</span>
            </div>

            <div className="p-4 bg-emerald-50 border-2 border-emerald-500/50 rounded-2xl space-y-1.5">
              <span className="font-bold text-emerald-950 block">3. {t('appTitle')} ({t('directChain')})</span>
              <div className="flex justify-between">
                <span>{t('farmerReceives')}:</span>
                <strong className="text-emerald-900 text-sm font-extrabold">{formatINR(currentCropData.modalPrice)}/kg</strong>
              </div>
              <div className="flex justify-between text-emerald-800 text-[11px] font-semibold">
                <span>{t('consumerRole')}:</span>
                <span>{formatINR(currentCropData.modalPrice + 5)}/kg</span>
              </div>
              <span className="text-[10px] text-emerald-700 font-bold block pt-1 border-t border-emerald-200">
                +45% to +66% {t('farmerUpliftTotal')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

