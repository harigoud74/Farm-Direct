import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  CheckCircle,
  Star,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { FarmerProfile, Product } from '../types';
import { formatINR } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';

interface FarmMapProps {
  farmers: FarmerProfile[];
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onViewFarmer: (farmerId: string) => void;
}

export const FarmMap: React.FC<FarmMapProps> = ({
  farmers,
  products,
  onSelectProduct,
  onViewFarmer
}) => {
  const { t, translateCrop } = useLanguage();
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>(farmers[0]?.id || 'farmer-1');
  const [radiusFilter, setRadiusFilter] = useState<number>(100);

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];
  const farmerProducts = products.filter(p => p.farmerId === selectedFarmerId);

  // Geographic coordinates mapped to SVG canvas relative to Bengaluru center (12.9716, 77.5946)
  const mapPoints = [
    {
      id: 'buyer-bengaluru',
      name: 'Your Delivery Location (Bengaluru Urban)',
      role: 'Buyer',
      x: 350,
      y: 280,
      isBuyer: true
    },
    {
      id: 'farmer-1',
      name: 'Green Valley Agro Farms (Ramesh Patel)',
      location: 'Kolar, Karnataka',
      distanceKm: 42,
      x: 440,
      y: 240,
      crops: ['Tomatoes', 'Bell Peppers'],
      rating: 4.9
    },
    {
      id: 'farmer-4',
      name: 'Kaveri River Organic Haven (Lakshmi Devi)',
      location: 'Mandya, Karnataka',
      distanceKm: 78,
      x: 240,
      y: 350,
      crops: ['Robusta Bananas', 'Country Tomatoes'],
      rating: 4.95
    },
    {
      id: 'farmer-3',
      name: 'Krishna Delta Spice Estate (Venkatesh Rao)',
      location: 'Tenali, Guntur, AP',
      distanceKm: 420,
      x: 520,
      y: 120,
      crops: ['Guntur Chillies', 'Turmeric'],
      rating: 4.92
    },
    {
      id: 'farmer-2',
      name: 'Sahyadri Bio Orchards (Sunita Jadhav)',
      location: 'Dindori, Nashik, Maharashtra',
      distanceKm: 650,
      x: 180,
      y: 80,
      crops: ['Nashik Red Onions', 'Table Grapes'],
      rating: 4.85
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
              <Compass className="w-4 h-4 text-emerald-600" />
              {t('geoRadar')}
            </div>
            <h2 className="text-xl font-bold text-stone-900 mt-1">
              {t('geoRadar')} & Food Miles
            </h2>
            <p className="text-xs text-stone-500">
              {t('geoRadarDesc')}
            </p>
          </div>

          {/* Radius selector */}
          <div className="flex items-center gap-2 bg-stone-50 p-1.5 rounded-xl border border-stone-200 text-xs">
            <span className="text-stone-500 font-medium pl-1">{t('distanceRadius')}:</span>
            {[50, 100, 250, 500].map(r => (
              <button
                key={r}
                onClick={() => setRadiusFilter(r)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  radiusFilter === r ? 'bg-emerald-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {r} km
              </button>
            ))}
          </div>
        </div>

        {/* Map Canvas Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
          <div className="lg:col-span-2 relative bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 h-[420px] flex items-center justify-center p-4">
            {/* Background Grid & Topography lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* SVG Interactive Map */}
            <svg viewBox="0 0 650 420" className="w-full h-full relative z-10">
              {/* Radius Circle from Buyer */}
              <circle
                cx="350"
                cy="280"
                r={radiusFilter * 0.5}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4,4"
                className="opacity-40 animate-pulse"
              />

              {/* Connecting Flight/Route Lines from Farms to Buyer */}
              {mapPoints.filter(p => !p.isBuyer).map(point => (
                <line
                  key={`line-${point.id}`}
                  x1="350"
                  y1="280"
                  x2={point.x}
                  y2={point.y}
                  stroke={selectedFarmerId === point.id ? '#10b981' : '#52525b'}
                  strokeWidth={selectedFarmerId === point.id ? '2' : '1'}
                  strokeDasharray={selectedFarmerId === point.id ? 'none' : '3,3'}
                />
              ))}

              {/* Buyer Pin */}
              <g transform="translate(350, 280)" className="cursor-pointer">
                <circle r="16" fill="#059669" fillOpacity="0.3" className="animate-ping" />
                <circle r="10" fill="#059669" stroke="#ffffff" strokeWidth="2" />
                <text x="14" y="4" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  {t('consumerRole')} (Bengaluru)
                </text>
              </g>

              {/* Farm Pins */}
              {mapPoints.filter(p => !p.isBuyer).map(point => {
                const isSelected = selectedFarmerId === point.id;
                return (
                  <g
                    key={point.id}
                    transform={`translate(${point.x}, ${point.y})`}
                    onClick={() => setSelectedFarmerId(point.id)}
                    className="cursor-pointer group"
                  >
                    <circle
                      r={isSelected ? 16 : 10}
                      fill={isSelected ? '#10b981' : '#27272a'}
                      stroke={isSelected ? '#ffffff' : '#10b981'}
                      strokeWidth="2"
                      className="transition-all"
                    />
                    <text
                      x="14"
                      y="4"
                      fill={isSelected ? '#34d399' : '#e4e4e7'}
                      fontSize="11"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      fontFamily="sans-serif"
                    >
                      {point.name.split(' (')[0]} ({point.distanceKm} km)
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-3 left-3 bg-stone-900/90 backdrop-blur-xs border border-stone-800 text-stone-300 px-3 py-1.5 rounded-xl text-[11px] flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                {t('farmOrigin')}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                {t('buyerRole')}
              </span>
            </div>
          </div>

          {/* Selected Farm Information Panel */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded-md">
                    {selectedFarmer?.farmingType || 'Organic'} Farm
                  </span>
                  <h3 className="text-lg font-bold text-stone-900 mt-1 flex items-center gap-1">
                    {selectedFarmer?.farmName}
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  </h3>
                  <p className="text-xs text-stone-500">
                    {selectedFarmer?.name} &bull; {selectedFarmer?.address.villageOrCity}, {selectedFarmer?.address.district}
                  </p>
                </div>
                <span className="flex items-center gap-1 font-bold text-stone-900 bg-white border border-stone-200 px-2 py-1 rounded-lg text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  {selectedFarmer?.rating}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-200/80">
                <div>
                  <span className="text-[10px] text-stone-400 block">{t('distanceRadius')}</span>
                  <span className="font-bold text-stone-800">
                    {selectedFarmer?.address.district === 'Kolar' ? '42 km (Local)' : '78 km'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">{t('acreage')}</span>
                  <span className="font-bold text-stone-800">{selectedFarmer?.farmSizeAcres} {t('acreage')}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">{t('myOrders')}</span>
                  <span className="font-bold text-stone-800">{selectedFarmer?.totalOrdersFulfilled}+ Orders</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">{t('harvestDate')}</span>
                  <span className="font-bold text-emerald-800">{t('today')}</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-stone-900 block mb-2">
                  {t('myInventory')} ({farmerProducts.length}):
                </span>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {farmerProducts.map(p => (
                    <div
                      key={p.id}
                      onClick={() => onSelectProduct(p)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-stone-200 hover:border-emerald-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={p.images[0]} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <span className="text-xs font-semibold text-stone-800 truncate">{translateCrop(p.name)}</span>
                      </div>
                      <span className="text-xs font-bold text-emerald-800 shrink-0">
                        {formatINR(p.pricePerKg)}/{p.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => onViewFarmer(selectedFarmer.id)}
              className="mt-4 w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{t('viewProfile')}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

