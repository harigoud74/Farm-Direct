import React, { useState } from 'react';
import {
  Truck,
  MapPin,
  CheckCircle2,
  Navigation,
  Thermometer,
  ShieldCheck,
  Phone,
  Clock,
  Key
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatINR } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';

interface LogisticsDashboardProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}

export const LogisticsDashboard: React.FC<LogisticsDashboardProps> = ({
  orders,
  onUpdateStatus
}) => {
  const { t, translateCrop, translateStatus } = useLanguage();
  const [otpInput, setOtpInput] = useState<{ [orderId: string]: string }>({});
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'DELIVERED'>('ACTIVE');

  const activeOrders = orders.filter(o => o.status !== 'DELIVERED');
  const deliveredOrders = orders.filter(o => o.status === 'DELIVERED');

  const handleVerifyOtpAndDeliver = (order: Order) => {
    const input = otpInput[order.id] || '';
    if (input === order.deliveryProofOtp || input === '4829' || input.length === 4) {
      onUpdateStatus(order.id, 'DELIVERED');
    } else {
      alert(`Invalid OTP! Please ask the customer for their delivery verification OTP (Demo OTP: ${order.deliveryProofOtp || '4829'})`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Driver Header */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-stone-900">Suresh Kumar</h2>
              <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                KA-04-EV-8842 &bull; Electric Reefer Van
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {t('driverRouteInfo')}
            </p>
          </div>
        </div>

        {/* Cold-chain telemetry */}
        <div className="flex items-center gap-3 bg-stone-50 border border-stone-200 p-3 rounded-2xl text-xs">
          <div className="flex items-center gap-1.5 text-teal-800 font-bold">
            <Thermometer className="w-4 h-4 text-teal-600" />
            <span>{t('cargoTemp')}: 4.8°C</span>
          </div>
          <span className="text-stone-300">|</span>
          <span className="text-stone-600">{t('batteryRange')}</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('assignedTrips')}</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{activeOrders.length} {t('assignedTrips')}</div>
          <span className="text-[11px] text-emerald-700 font-medium">{t('urgentPickups')}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('completedDeliveries')}</span>
          <div className="text-2xl font-bold text-emerald-800 mt-1">{deliveredOrders.length}</div>
          <span className="text-[11px] text-stone-500">{t('onTimeDeliveryRate')}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('dailyLogisticsPayout')}</span>
          <div className="text-2xl font-bold text-stone-900 mt-1">{formatINR(orders.reduce((s, o) => s + o.logisticsFee, 0))}</div>
          <span className="text-[11px] text-stone-500">{t('paidDirectlyPerKm')}</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">{t('transitLoss')}</span>
          <div className="text-2xl font-bold text-teal-800 mt-1">0.0%</div>
          <span className="text-[11px] text-teal-700 font-medium">{t('zeroBruising')}</span>
        </div>
      </div>

      {/* Active Trip Manifest */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-emerald-700" />
            {t('deliveryRouteTasks')}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'ACTIVE' ? 'bg-amber-100 text-amber-900' : 'text-stone-500'
              }`}
            >
              {t('activeTrips')} ({activeOrders.length})
            </button>
            <button
              onClick={() => setActiveTab('DELIVERED')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                activeTab === 'DELIVERED' ? 'bg-emerald-100 text-emerald-900' : 'text-stone-500'
              }`}
            >
              {t('completedDeliveries')} ({deliveredOrders.length})
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {(activeTab === 'ACTIVE' ? activeOrders : deliveredOrders).map(order => (
            <div
              key={order.id}
              className="p-5 bg-stone-50 border border-stone-200 rounded-2xl flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-stone-900">{t('orderNumber')} #{order.id}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white border border-stone-200 px-2 py-0.5 rounded-full text-emerald-800">
                    {translateStatus(order.status)}
                  </span>
                  <span className="text-xs text-stone-500">&bull; {t('slotLabel')}: {order.estimatedDeliveryTime}</span>
                </div>

                {/* Pickup and Delivery routing points */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-emerald-600" />
                      {t('farmPickupPoint')}
                    </span>
                    <span className="font-semibold text-stone-900 block">{order.items[0]?.farmerName}</span>
                    <p className="text-[11px] text-stone-500">Green Valley Agro, Kolar District</p>
                    <span className="text-[10px] text-stone-400">{t('payloadLabel')}: {order.items.reduce((s, i) => s + i.quantityKg, 0)} kg produce</span>
                  </div>

                  <div className="p-3 bg-white border border-stone-200 rounded-xl space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                      <Navigation className="w-3 h-3 text-teal-600" />
                      {t('buyerDestination')}
                    </span>
                    <span className="font-semibold text-stone-900 block">{order.buyerName}</span>
                    <p className="text-[11px] text-stone-500 truncate">{order.shippingAddress.addressLine}, {order.shippingAddress.city}</p>
                    <span className="text-[10px] text-stone-400">{t('phoneNumber')}: {order.buyerPhone}</span>
                  </div>
                </div>
              </div>

              {/* Status Progression Controls */}
              <div className="lg:w-72 flex flex-col gap-2 p-3 bg-white border border-stone-200 rounded-xl">
                <div className="flex justify-between text-xs font-bold text-stone-800 pb-1 border-b border-stone-100">
                  <span>{t('logisticsFee')}</span>
                  <span className="text-emerald-900">{formatINR(order.logisticsFee)}</span>
                </div>

                {order.status === 'ACCEPTED' || order.status === 'PAID' ? (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'READY_FOR_PICKUP')}
                    className="w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('markAtFarm')}
                  </button>
                ) : order.status === 'READY_FOR_PICKUP' ? (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'IN_TRANSIT')}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {t('markInTransit')}
                  </button>
                ) : order.status === 'IN_TRANSIT' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-stone-400 shrink-0" />
                      <input
                        type="text"
                        placeholder={`${t('enterCustomerOtp')} (${order.deliveryProofOtp || '4829'})`}
                        value={otpInput[order.id] || ''}
                        onChange={e => setOtpInput({ ...otpInput, [order.id]: e.target.value })}
                        className="w-full p-1.5 border border-stone-300 rounded-lg text-xs text-center font-mono font-bold"
                      />
                    </div>
                    <button
                      onClick={() => handleVerifyOtpAndDeliver(order)}
                      className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('verifyOtpDeliver')}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-2 text-xs font-bold text-emerald-800 bg-emerald-50 rounded-lg flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('deliveredAndSettled')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

