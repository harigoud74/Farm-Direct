import React, { useState } from 'react';
import {
  Sprout,
  ShoppingCart,
  Languages,
  Bot,
  TrendingUp,
  UserCheck,
  Truck,
  Building2,
  ShieldCheck,
  CloudSun,
  Menu,
  X
} from 'lucide-react';
import { UserRole, LanguageCode, User } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language?: LanguageCode;
  onLanguageChange?: (lang: LanguageCode) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAIAssistant: () => void;
  onOpenImpact: () => void;
  currentUser: User | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language: propLanguage,
  onLanguageChange,
  cartCount,
  onOpenCart,
  onOpenAIAssistant,
  onOpenImpact,
  currentUser,
  activeTab,
  onTabChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language: contextLanguage, setLanguage: setContextLanguage, t: tFunc } = useLanguage();
  const currentLang = propLanguage || contextLanguage;
  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;

  const handleLanguageSwitch = (newLang: LanguageCode) => {
    setContextLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  const roleConfigs: { role: UserRole; label: string; icon: any; color: string }[] = [
    { role: 'consumer', label: t.consumerRole, icon: ShoppingCart, color: 'emerald' },
    { role: 'farmer', label: t.farmerRole, icon: Sprout, color: 'green' },
    { role: 'business', label: t.businessRole, icon: Building2, color: 'blue' },
    { role: 'logistics', label: t.logisticsRole, icon: Truck, color: 'amber' },
    { role: 'admin', label: t.adminRole, icon: ShieldCheck, color: 'purple' }
  ];


  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top Banner: Transparency & Fair Pricing notice */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>{t.savingsBanner}</span>
        <button
          onClick={onOpenImpact}
          className="ml-2 underline hover:text-white font-semibold cursor-pointer"
        >
          {t.impactCalculator} &rarr;
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onTabChange('marketplace')}
              className="flex items-center gap-2 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-stone-900 flex items-center gap-1.5">
                  Farm<span className="text-emerald-700">Direct</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    Fair Trade
                  </span>
                </span>
                <span className="text-[11px] text-stone-500 block leading-tight hidden sm:block">
                  {t.tagline}
                </span>
              </div>
            </button>
          </div>

          {/* Center: Navigation Tabs based on Role */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200">
            {currentRole === 'consumer' && (
              <>
                <button
                  onClick={() => onTabChange('marketplace')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'marketplace'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.exploreProduce}
                </button>
                <button
                  onClick={() => onTabChange('farms-map')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'farms-map'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.navFarmsMap || 'Farms Map'}
                </button>
                <button
                  onClick={() => onTabChange('transparency')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'transparency'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.priceTransparency}
                </button>
                <button
                  onClick={() => onTabChange('orders')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.orders}
                </button>
              </>
            )}

            {currentRole === 'farmer' && (
              <>
                <button
                  onClick={() => onTabChange('dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.navDashboard || 'Farmer Dashboard'}
                </button>
                <button
                  onClick={() => onTabChange('inventory')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'inventory'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.myInventory}
                </button>
                <button
                  onClick={() => onTabChange('mandi')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'mandi'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.mandiIntelligence || t.marketPrices}
                </button>
                <button
                  onClick={() => onTabChange('bulk-leads')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'bulk-leads'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.navBulkLeads || 'B2B Leads'}
                </button>
              </>
            )}

            {currentRole === 'business' && (
              <>
                <button
                  onClick={() => onTabChange('business-procurement')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'business-procurement'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.navB2BProcurement || 'Bulk Procurement'}
                </button>
                <button
                  onClick={() => onTabChange('marketplace')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'marketplace'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.exploreProduce}
                </button>
                <button
                  onClick={() => onTabChange('orders')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-white text-emerald-800 shadow-xs font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {t.navOrders || t.orders}
                </button>
              </>
            )}

            {currentRole === 'logistics' && (
              <button
                onClick={() => onTabChange('logistics-tasks')}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-white text-amber-900 shadow-xs"
              >
                {t.navLogistics || 'Logistics Dispatch Hub'}
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => onTabChange('admin-overview')}
                className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-white text-purple-900 shadow-xs"
              >
                {t.navAdmin || 'Platform Administration'}
              </button>
            )}

            <button
              onClick={() => onTabChange('weather')}
              className={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                activeTab === 'weather'
                  ? 'bg-white text-teal-800 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
              title="Agro Weather Alerts"
            >
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>{t.navWeather || 'Weather'}</span>
            </button>
          </nav>

          {/* Right Actions: Role Selector, Language, AI Bot, Cart */}
          <div className="flex items-center gap-2">
            {/* Quick Role Switcher Dropdown / Pills */}
            <div className="relative group">
              <div className="flex items-center gap-1 bg-stone-100 hover:bg-stone-200/80 p-1 rounded-xl border border-stone-200 transition-colors">
                <span className="text-[11px] font-semibold text-stone-500 pl-2 uppercase tracking-wider hidden lg:inline">
                  {t.switchRole}:
                </span>
                <select
                  value={currentRole}
                  onChange={e => onRoleChange(e.target.value as UserRole)}
                  className="bg-transparent text-xs font-bold text-stone-800 py-1 px-2 focus:outline-none cursor-pointer rounded-lg"
                  aria-label="Switch User Role"
                >
                  {roleConfigs.map(rc => (
                    <option key={rc.role} value={rc.role}>
                      {rc.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <Languages className="w-4 h-4 text-stone-500 ml-1.5" />
              <select
                value={currentLang}
                onChange={e => handleLanguageSwitch(e.target.value as LanguageCode)}
                className="bg-transparent text-xs font-medium text-stone-700 py-1 px-2 focus:outline-none cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* AI Agro Assistant Trigger */}
            <button
              onClick={onOpenAIAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-semibold shadow-xs hover:shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all cursor-pointer"
              title="FarmDirect AI Assistant"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI AgroBot</span>
            </button>

            {/* Cart Button (Always visible for consumers & businesses) */}
            {(currentRole === 'consumer' || currentRole === 'business') && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                aria-label="View Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-stone-600 hover:bg-stone-100 md:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => {
                onTabChange('marketplace');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-medium"
            >
              {t.exploreProduce}
            </button>
            <button
              onClick={() => {
                onTabChange('farms-map');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-medium"
            >
              {t.navFarmsMap || 'Farms Map'}
            </button>
            <button
              onClick={() => {
                onTabChange('transparency');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-medium"
            >
              {t.priceTransparency}
            </button>
            <button
              onClick={() => {
                onTabChange('mandi');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-medium"
            >
              {t.mandiIntelligence || t.marketPrices}
            </button>
            <button
              onClick={() => {
                onTabChange('weather');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 bg-stone-100 text-stone-800 rounded-lg text-xs font-medium"
            >
              {t.navWeather || 'Agro Weather'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
