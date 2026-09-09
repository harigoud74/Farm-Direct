import React, { useState } from 'react';
import {
  X,
  Sprout,
  ShieldCheck,
  TrendingUp,
  Truck,
  Leaf,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';
import { ImpactMetrics } from '../types';
import { formatINR } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';

interface ImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
  impact: ImpactMetrics;
}

export const ImpactModal: React.FC<ImpactModalProps> = ({
  isOpen,
  onClose,
  impact
}) => {
  const { t } = useLanguage();
  const [householdKgPerWeek, setHouseholdKgPerWeek] = useState<number>(15);

  if (!isOpen) return null;

  // Real-time calculation based on user input
  const annualKg = householdKgPerWeek * 52;
  const annualSavings = Math.round(annualKg * 10.5); // ~₹10.5 saved per kg vs retail supermarket
  const farmerExtraEarnings = Math.round(annualKg * 12.0); // ~₹12 extra to farmer

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">{t('impactMetrics')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Key Aggregate Numbers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
              <span className="text-[11px] text-stone-500 font-medium block">{t('middlemenCut')}</span>
              <span className="text-2xl font-extrabold text-stone-900 mt-1 block">0%</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{t('middlemenEliminatedText')}</span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl">
              <span className="text-[11px] text-emerald-800 font-medium block">{t('fairTradeCertified')}</span>
              <span className="text-2xl font-extrabold text-emerald-950 mt-1 block">+66.4%</span>
              <span className="text-[10px] text-emerald-700 font-semibold">{t('farmerUpliftTotal')}</span>
            </div>

            <div className="bg-teal-50 border border-teal-200 p-3.5 rounded-2xl">
              <span className="text-[11px] text-teal-800 font-medium block">{t('consumerRole')}</span>
              <span className="text-2xl font-extrabold text-teal-950 mt-1 block">23.2%</span>
              <span className="text-[10px] text-teal-700 font-semibold">{t('transparentPricingNotice')}</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl">
              <span className="text-[11px] text-stone-500 font-medium block">{t('foodMilesReduced')}</span>
              <span className="text-2xl font-extrabold text-stone-900 mt-1 block">{impact.foodMilesReducedKm} km</span>
              <span className="text-[10px] text-stone-500 font-medium">{t('coldChainLabel')}</span>
            </div>
          </div>

          {/* Interactive Personal Impact Calculator */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-stone-900">
                {t('impactMetrics')} - Calculator
              </h4>
              <p className="text-xs text-stone-500">
                {t('transparentBreakdownDesc')}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-800 mb-1.5">
                <span>{t('weightKg')}:</span>
                <span className="font-bold text-emerald-900 text-sm">{householdKgPerWeek} kg / week</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={householdKgPerWeek}
                onChange={e => setHouseholdKgPerWeek(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-stone-200 rounded-lg cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-200">
              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center">
                <span className="text-[11px] text-stone-500 block">{t('consumerRole')}</span>
                <span className="text-lg font-bold text-emerald-900">{formatINR(annualSavings)}/yr</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">{t('appTitle')}</span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-200 text-center">
                <span className="text-[11px] text-stone-500 block">{t('farmerReceives')}</span>
                <span className="text-lg font-bold text-emerald-900">+{formatINR(farmerExtraEarnings)}/yr</span>
                <span className="text-[10px] text-emerald-700 block font-semibold">{t('directChain')}</span>
              </div>
            </div>
          </div>

          {/* Environmental & Traceability Standard */}
          <div className="space-y-3 text-xs text-stone-600">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              {t('fairTradeCertified')}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {t('escrowSecure')}
                </span>
                <p className="text-[11px] text-stone-500">
                  {t('escrowDesc')}
                </p>
              </div>

              <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block flex items-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  {t('coldChainLabel')}
                </span>
                <p className="text-[11px] text-stone-500">
                  {t('qualityAssurance')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
};

