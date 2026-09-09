import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Building,
  CreditCard,
  QrCode,
  CheckCircle
} from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { formatINR } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout
}) => {
  const { t, translateCrop } = useLanguage();

  if (!isOpen) return null;

  const totalProductAmount = cartItems.reduce((sum, item) => sum + item.product.pricePerKg * item.quantityKg, 0);
  const totalLogisticsFee = cartItems.reduce((sum, item) => sum + item.priceBreakdown.logisticsFee * item.quantityKg, 0);
  const totalPlatformFee = Math.max(1, Math.round(totalProductAmount * 0.03));
  const grandTotal = totalProductAmount + totalLogisticsFee + totalPlatformFee;

  const totalTraditionalRetail = cartItems.reduce(
    (sum, item) => sum + item.product.traditionalRetailPrice * item.quantityKg,
    0
  );
  const totalBuyerSavings = Math.max(0, totalTraditionalRetail - grandTotal);
  const totalFarmerBonus = cartItems.reduce(
    (sum, item) => sum + item.priceBreakdown.farmerBonus * item.quantityKg,
    0
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-stone-900">{t('shoppingCart')}</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
              {cartItems.length} {t('freshHarvestItems')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                <Truck className="w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-stone-900">{t('emptyCart')}</h3>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                {t('noProduceMatchDesc')}
              </p>
            </div>
          ) : (
            <>
              {/* Transparency Highlights Banner */}
              <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold text-emerald-950">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {t('priceTransparency')}
                  </span>
                  <span className="text-emerald-700 font-extrabold">
                    {t('saveVsRetail')} {formatINR(totalBuyerSavings)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800">
                  {t('farmerReceives')} <strong>{formatINR(totalProductAmount)}</strong> (+{formatINR(totalFarmerBonus)} vs APMC).
                </p>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                {cartItems.map(item => (
                  <div
                    key={item.product.id}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-2xl flex items-start gap-3"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={translateCrop(item.product.name)}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {translateCrop(item.product.name)}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-stone-400 hover:text-red-600 p-0.5 cursor-pointer"
                          title={t('delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-stone-500 truncate">
                        {item.product.farmName} ({item.product.farmerLocation.district})
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white border border-stone-300 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, -1)}
                            className="p-1 text-stone-600 hover:bg-stone-100 rounded-l-lg cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-stone-900">
                            {item.quantityKg}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, 1)}
                            className="p-1 text-stone-600 hover:bg-stone-100 rounded-r-lg cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-stone-900 block">
                            {formatINR(item.product.pricePerKg * item.quantityKg)}
                          </span>
                          <span className="text-[10px] text-stone-400 line-through">
                            {formatINR(item.product.traditionalRetailPrice * item.quantityKg)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer with Itemized Financial Breakdown */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>{t('farmerReceives')} (100% direct)</span>
                <span className="font-bold text-stone-900">{formatINR(totalProductAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-stone-400" />
                  {t('logisticsFee')}
                </span>
                <span className="font-medium text-stone-800">{formatINR(totalLogisticsFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="flex items-center gap-1">
                  <Building className="w-3 h-3 text-stone-400" />
                  {t('platformFee')}
                </span>
                <span className="font-medium text-stone-800">{formatINR(totalPlatformFee)}</span>
              </div>
              <div className="flex justify-between text-stone-900 font-extrabold text-sm pt-2 border-t border-stone-200">
                <span>{t('totalPayable')}</span>
                <span className="text-emerald-900 text-base">{formatINR(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('proceedToCheckout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

