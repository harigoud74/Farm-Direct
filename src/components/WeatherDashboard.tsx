import React, { useState } from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { WeatherData } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface WeatherDashboardProps {
  weather: WeatherData;
  onCityChange: (city: string) => void;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  weather,
  onCityChange
}) => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState(weather.city || 'Kolar');

  const districts = ['Kolar', 'Mandya', 'Nashik', 'Guntur'];

  const handleSelect = (dist: string) => {
    setSelectedDistrict(dist);
    onCityChange(dist);
  };

  return (
    <div className="space-y-6">
      {/* Header & District Tabs */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {t('agronomicAdvisory')}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">{t('weatherTitle')}</h2>
          <p className="text-xs text-stone-500">
            {t('weatherSubtitle')}
          </p>
        </div>

        {/* District Switcher */}
        <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs font-bold">
          {districts.map(d => (
            <button
              key={d}
              onClick={() => handleSelect(d)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedDistrict === d ? 'bg-white text-emerald-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Card */}
      <div className="bg-gradient-to-br from-blue-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-emerald-300 bg-white/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {weather.city}, {weather.state} &bull; {t('agronomicAdvisory')}
            </span>
            <div className="flex items-baseline gap-4">
              <span className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                {weather.temperatureC}°C
              </span>
              <span className="text-lg font-medium text-emerald-100">{weather.condition}</span>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl leading-relaxed pt-2">
              <strong>{t('agronomicAdvisory')}:</strong> {weather.advisory}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs">
            <div className="text-center p-2">
              <Droplets className="w-5 h-5 text-blue-300 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-200 block">{t('humidity')}</span>
              <span className="text-base font-bold">{weather.humidityPercent}%</span>
            </div>

            <div className="text-center p-2 border-x border-white/10">
              <CloudRain className="w-5 h-5 text-teal-300 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-200 block">{t('rainProb')}</span>
              <span className="text-base font-bold">{weather.rainProbabilityPercent}%</span>
            </div>

            <div className="text-center p-2">
              <Wind className="w-5 h-5 text-emerald-300 mx-auto mb-1" />
              <span className="text-[10px] text-emerald-200 block">{t('windSpeed')}</span>
              <span className="text-base font-bold">{weather.windSpeedKmh} km/h</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Agro Forecast Table */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-700" />
          {t('fiveDayForecast')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {weather.forecast5Days.map((f, i) => (
            <div key={i} className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2 text-xs">
              <div className="flex justify-between items-center font-bold text-stone-800">
                <span>{f.day}</span>
                <span className="text-stone-500 font-normal">{f.date}</span>
              </div>

              <div className="text-lg font-bold text-stone-900 flex items-center justify-between">
                <span>{f.maxTempC}° / {f.minTempC}°</span>
                <CloudSun className="w-5 h-5 text-amber-500" />
              </div>

              <div className="flex justify-between text-stone-600 text-[11px] bg-white p-2 rounded-xl border border-stone-200">
                <span>{t('rainProb')}: <strong>{f.rainProbPercent}%</strong></span>
                <span className="truncate">{f.condition}</span>
              </div>

              <p className="text-[10px] text-emerald-900 bg-emerald-50 p-2 rounded-xl font-medium">
                {f.advisory}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

