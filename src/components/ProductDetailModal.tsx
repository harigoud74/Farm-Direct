import React, { useState } from 'react';
import {
  X,
  MapPin,
  Star,
  CheckCircle,
  Leaf,
  Clock,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  ShoppingCart,
  Award
} from 'lucide-react';
import { Product, FarmerProfile } from '../types';
import { formatINR } from '../utils/pricing';
import { PriceTransparencyCard } from './PriceTransparencyCard';
import { useLanguage } from '../context/LanguageContext';

interface ProductDetailModalProps {
  product: Product;
  farmer?: FarmerProfile;
  onClose: () => void;
  onAddToCart: (product: Product, quantityKg: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  farmer,
  onClose,
  onAddToCart
}) => {
  const { t, translateCrop, translateCategory } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(product.minOrderQuantityKg || 1);

  const handleIncrement = () => {
    if (quantity + 1 <= product.availableQuantityKg) {
      setQuantity(q => q + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity - 1 >= product.minOrderQuantityKg) {
      setQuantity(q => q - 1);
    }
  };

  const translatedCropName = translateCrop(product.name);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
              {translateCategory(product.category)}
            </span>
            <span className="text-xs text-stone-500 font-medium">
              {t('varietyLabel')}: <strong>{product.variety}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
            aria-label={t('close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gallery */}
            <div className="space-y-3">
              <div className="aspect-4/3 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={translatedCropName}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedImage === idx ? 'border-emerald-600 scale-105' : 'border-stone-200 opacity-70'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Farmer Profile Snippet Card */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-3">
                  {farmer?.avatar ? (
                    <img src={farmer.avatar} alt={farmer.name} className="w-12 h-12 rounded-full object-cover border border-emerald-500" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold">
                      {product.farmerName.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1">
                      {product.farmName}
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </h4>
                    <p className="text-xs text-stone-500">
                      {product.farmerName} &bull; {farmer?.experienceYears || 15} yrs farming
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-stone-600 mt-0.5">
                      <span className="flex items-center gap-0.5 text-amber-800 font-semibold">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {product.farmerRating}
                      </span>
                      <span>&bull;</span>
                      <span>{farmer?.totalOrdersFulfilled || 300}+ {t('completedDeliveries')}</span>
                    </div>
                  </div>
                </div>

                {farmer?.story && (
                  <p className="text-xs text-stone-600 italic border-t border-stone-200/80 pt-2">
                    &ldquo;{farmer.story}&rdquo;
                  </p>
                )}

                {/* Farmer Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(farmer?.badges || ['Zero Chemicals', 'Fresh Harvest', 'Verified Farm']).map((b, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-white border border-stone-200 px-2 py-0.5 rounded-full text-stone-700">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Produce Information */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                  {translatedCropName}
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    {product.farmerLocation.village}, {product.farmerLocation.district}, {product.farmerLocation.state}
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {product.description}
              </p>

              {/* Quality & Origin Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 border border-stone-200 rounded-xl p-3.5">
                <div>
                  <span className="text-[11px] text-stone-400 block">{t('gradeFilter')}</span>
                  <span className="font-bold text-stone-800">{product.qualityGrade}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{t('farmingMethod')}</span>
                  <span className="font-bold text-emerald-800">{product.farmingMethod}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{t('harvestDate')}</span>
                  <span className="font-bold text-stone-800">{product.harvestDate}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block">{t('shelfLifeDays')}</span>
                  <span className="font-bold text-stone-800">{product.shelfLifeDays} days</span>
                </div>
              </div>

              {/* Stock Status & Quantity Selector */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-emerald-900 block font-medium">{t('farmerReceives')}</span>
                    <div className="text-2xl font-extrabold text-stone-900">
                      {formatINR(product.pricePerKg)}
                      <span className="text-sm font-normal text-stone-500">/{product.unit}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">{t('availableStock')}</span>
                    <span className="text-sm font-bold text-emerald-800">
                      {product.availableQuantityKg} {product.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 pt-2 border-t border-emerald-200/80">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-stone-700">{t('quantityKgLabel')}:</span>
                    <div className="flex items-center bg-white border border-stone-300 rounded-xl">
                      <button
                        onClick={handleDecrement}
                        className="p-2 hover:bg-stone-100 text-stone-600 rounded-l-xl cursor-pointer"
                        disabled={quantity <= product.minOrderQuantityKg}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-stone-900">
                        {quantity} {product.unit}
                      </span>
                      <button
                        onClick={handleIncrement}
                        className="p-2 hover:bg-stone-100 text-stone-600 rounded-r-xl cursor-pointer"
                        disabled={quantity >= product.availableQuantityKg}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-500 block">{t('subtotal')}:</span>
                    <span className="text-lg font-bold text-emerald-950">
                      {formatINR(product.pricePerKg * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dedicated Full Price Transparency Section */}
          <div className="pt-2">
            <PriceTransparencyCard
              farmerPricePerKg={product.pricePerKg}
              traditionalRetailPrice={product.traditionalRetailPrice}
              productName={translatedCropName}
              mandiBenchmark={product.marketReferencePrice}
              mandiLocation={`${product.farmerLocation.district} Mandi`}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-4">
          <div className="text-xs text-stone-500">
            {t('minOrder')}: {product.minOrderQuantityKg} {product.unit} &bull; {t('logisticsFee')}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors cursor-pointer"
            >
              {t('backToShopping')}
            </button>
            <button
              onClick={() => {
                onAddToCart(product, quantity);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t('addToCart')} ({formatINR(product.pricePerKg * quantity)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

