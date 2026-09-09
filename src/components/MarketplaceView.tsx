import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Star,
  Leaf,
  Clock,
  ShieldCheck,
  CheckCircle,
  Sparkles,
  ChevronRight,
  Plus,
  ShoppingCart
} from 'lucide-react';
import { Product, ProduceCategory, FarmerProfile } from '../types';
import { formatINR } from '../utils/pricing';
import { PriceTransparencyCard } from './PriceTransparencyCard';
import { useLanguage } from '../context/LanguageContext';

interface MarketplaceViewProps {
  products: Product[];
  farmers: FarmerProfile[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantityKg: number) => void;
  onViewFarmerProfile: (farmerId: string) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  products,
  farmers,
  onSelectProduct,
  onAddToCart,
  onViewFarmerProfile
}) => {
  const { t, translateCrop, translateCategory } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number>(100);
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [freshOnly, setFreshOnly] = useState<boolean>(false);
  const [expandedTransparencyId, setExpandedTransparencyId] = useState<string | null>(null);

  const categories: (ProduceCategory | 'All')[] = [
    'All',
    'Vegetables',
    'Fruits',
    'Grains & Pulses',
    'Spices & Herbs',
    'Dairy & Honey'
  ];

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (organicOnly && !p.isOrganic) return false;
      if (selectedGrade !== 'All' && !p.qualityGrade.includes(selectedGrade)) return false;
      if (freshOnly && p.freshnessGuaranteeHours > 48) return false;

      // Distance filter simulation (distance based on farmer)
      const simulatedDistance = p.farmerLocation.district === 'Kolar' ? 42 : p.farmerLocation.district === 'Mandya' ? 78 : 120;
      if (simulatedDistance > maxDistanceKm) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q) || translateCrop(p.name).toLowerCase().includes(q);
        const matchesVariety = p.variety.toLowerCase().includes(q);
        const matchesFarmer = p.farmerName.toLowerCase().includes(q);
        const matchesDistrict = p.farmerLocation.district.toLowerCase().includes(q);
        if (!matchesName && !matchesVariety && !matchesFarmer && !matchesDistrict) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, organicOnly, selectedGrade, freshOnly, maxDistanceKm, searchQuery, translateCrop]);

  return (
    <div className="space-y-6">
      {/* Hero Search & Value Proposition Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-stone-900 text-white p-6 sm:p-8 shadow-md overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/40 text-emerald-200 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t('heroBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {t('heroTitle')}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 mb-6 leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Search Input Bar */}
          <div className="relative flex items-center max-w-2xl">
            <Search className="absolute left-4 w-5 h-5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-3.5 bg-white text-stone-900 placeholder-stone-400 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 px-2 py-1 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {t('clear')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {translateCategory(cat)}
          </button>
        ))}
      </div>

      {/* Filter Toolbar (Distance, Organic, Freshness) */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-stone-700">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 font-bold text-stone-900">
            <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
            {t('filterBy')}:
          </span>

          {/* Organic checkbox button */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              organicOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 text-emerald-600" />
            {t('organicOnly')}
          </button>

          {/* Freshness toggle */}
          <button
            onClick={() => setFreshOnly(!freshOnly)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-colors cursor-pointer ${
              freshOnly
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                : 'border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            {t('freshness48h')}
          </button>

          {/* Grade filter */}
          <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded-lg px-2 py-1">
            <span className="text-stone-500 text-[11px]">{t('gradeFilter')}:</span>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className="bg-transparent text-stone-800 text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="All">{t('allGrades')}</option>
              <option value="Export">{t('exportGrade')}</option>
              <option value="Premium">{t('premiumGrade')}</option>
              <option value="Organic">{t('organicCertified')}</option>
            </select>
          </div>
        </div>

        {/* Distance Range Slider */}
        <div className="flex items-center gap-3 min-w-[200px]">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <div className="flex-1">
            <div className="flex justify-between text-[11px] text-stone-500 mb-1">
              <span>{t('farmDistance')}:</span>
              <span className="font-bold text-stone-900">{maxDistanceKm} {t('kmRadius')}</span>
            </div>
            <input
              type="range"
              min="15"
              max="250"
              step="10"
              value={maxDistanceKm}
              onChange={e => setMaxDistanceKm(Number(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-stone-200 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Count Header */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span>
          {t('showingProduceCount')} <strong className="text-stone-900">{filteredProducts.length}</strong> {t('freshHarvestItems')}
        </span>
        <span className="text-emerald-700 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          {t('mandiVerifiedNotice')}
        </span>
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-3xl p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-stone-900 mb-1">{t('noProduceMatch')}</h3>
          <p className="text-xs text-stone-500 mb-6">
            {t('noProduceMatchDesc')}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setOrganicOnly(false);
              setFreshOnly(false);
              setSelectedGrade('All');
              setMaxDistanceKm(200);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            {t('resetFilters')}
          </button>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => {
          const isExpanded = expandedTransparencyId === product.id;
          const simulatedDistance = product.farmerLocation.district === 'Kolar' ? 42 : product.farmerLocation.district === 'Mandya' ? 78 : 120;
          const translatedName = translateCrop(product.name);

          return (
            <div
              key={product.id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative aspect-4/3 overflow-hidden bg-stone-100">
                <img
                  src={product.images[0]}
                  alt={translatedName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  {product.isOrganic && (
                    <span className="bg-emerald-900/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                      <Leaf className="w-3 h-3 text-emerald-400" />
                      {t('organicBadge')}
                    </span>
                  )}
                  <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-xs">
                    {product.qualityGrade}
                  </span>
                </div>

                <div className="absolute bottom-2.5 right-2.5 bg-white/95 backdrop-blur-xs text-stone-900 text-[11px] font-semibold px-2.5 py-1 rounded-lg shadow-xs flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{simulatedDistance} km</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Farmer Info Line */}
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                    <button
                      onClick={() => onViewFarmerProfile(product.farmerId)}
                      className="font-semibold text-stone-800 hover:text-emerald-700 flex items-center gap-1 truncate max-w-[180px] cursor-pointer"
                    >
                      <span>{product.farmName}</span>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </button>
                    <span className="flex items-center gap-1 font-bold text-stone-800 bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded text-[11px]">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {product.farmerRating}
                    </span>
                  </div>

                  {/* Crop Name */}
                  <h3
                    onClick={() => onSelectProduct(product)}
                    className="text-base font-bold text-stone-900 hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
                  >
                    {translatedName}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 mb-3">
                    {product.description}
                  </p>

                  {/* Harvest & Freshness Tag */}
                  <div className="flex items-center gap-1.5 text-[11px] text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg mb-3">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t('harvestDate')}: {product.harvestDate}</span>
                  </div>

                  {/* Pricing Comparison Snippet */}
                  <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 mb-3">
                    <div className="flex items-baseline justify-between mb-1">
                      <div>
                        <span className="text-[10px] text-stone-400 block uppercase tracking-wider">{t('farmerReceives')}</span>
                        <span className="text-xl font-extrabold text-stone-900">
                          {formatINR(product.pricePerKg)}
                          <span className="text-xs font-normal text-stone-500">/{product.unit}</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-stone-400 block uppercase tracking-wider">{t('traditionalRetail')}</span>
                        <span className="text-xs font-bold line-through text-stone-400">
                          {formatINR(product.traditionalRetailPrice)}/{product.unit}
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-emerald-800 font-semibold flex items-center justify-between pt-1 border-t border-stone-200">
                      <span>{t('saveVsRetail')} ~{formatINR(product.traditionalRetailPrice - product.pricePerKg - 4)}/{product.unit}</span>
                      <button
                        onClick={() => setExpandedTransparencyId(isExpanded ? null : product.id)}
                        className="text-emerald-700 underline text-[10px] font-bold hover:text-emerald-900 cursor-pointer"
                      >
                        {isExpanded ? t('close') : t('priceTransparency')}
                      </button>
                    </div>
                  </div>

                  {/* Expandable Transparency Engine */}
                  {isExpanded && (
                    <div className="mb-3">
                      <PriceTransparencyCard
                        farmerPricePerKg={product.pricePerKg}
                        traditionalRetailPrice={product.traditionalRetailPrice}
                        productName={translatedName}
                        compact={true}
                        mandiBenchmark={product.marketReferencePrice}
                        mandiLocation={`${product.farmerLocation.district} Mandi`}
                      />
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => onSelectProduct(product)}
                    className="flex-1 py-2 px-3 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-colors text-center cursor-pointer"
                  >
                    {t('viewDetails')}
                  </button>
                  <button
                    onClick={() => onAddToCart(product, product.minOrderQuantityKg)}
                    className="py-2 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{t('addToCart')} ({product.minOrderQuantityKg}kg)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

