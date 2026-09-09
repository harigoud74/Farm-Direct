import React, { useState } from 'react';
import {
  X,
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  CheckCircle,
  Truck,
  AlertCircle,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { CartItem, Order, User } from '../types';
import { formatINR } from '../utils/pricing';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currentUser: User | null;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onOrderPlaced
}) => {
  const { t, translateCrop } = useLanguage();
  const [addressLine, setAddressLine] = useState(currentUser?.address?.street || 'Flat 402, Green Glen Layout, Bellandur');
  const [city, setCity] = useState(currentUser?.address?.villageOrCity || 'Bengaluru');
  const [pinCode, setPinCode] = useState(currentUser?.address?.pinCode || '560103');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98860 41235');
  const [deliverySlot, setDeliverySlot] = useState('Tomorrow Morning (07:00 AM - 10:00 AM)');

  // Payment simulation state
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARDS' | 'NETBANKING'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'id'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.name || 'Ananya Sharma');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalProductAmount = cartItems.reduce((sum, item) => sum + item.product.pricePerKg * item.quantityKg, 0);
  const totalLogisticsFee = cartItems.reduce((sum, item) => sum + item.priceBreakdown.logisticsFee * item.quantityKg, 0);
  const totalPlatformFee = Math.max(1, Math.round(totalProductAmount * 0.03));
  const grandTotal = totalProductAmount + totalLogisticsFee + totalPlatformFee;

  const handlePayAndPlaceOrder = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // 1. Create payment order via Razorpay abstraction
      const paymentOrder = await api.createPayment(grandTotal, `rcpt_${Date.now()}`);

      // 2. Simulate user authorized the payment
      const paymentId = `pay_rzp_test_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const signature = 'simulated_success_signature';

      // 3. Create confirmed order payload
      const orderItems = cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        farmerId: item.product.farmerId,
        farmerName: item.product.farmerName,
        quantityKg: item.quantityKg,
        unitPrice: item.product.pricePerKg,
        farmerTotal: item.product.pricePerKg * item.quantityKg,
        platformFee: item.priceBreakdown.platformFee * item.quantityKg,
        logisticsFee: item.priceBreakdown.logisticsFee * item.quantityKg,
        subtotal: item.priceBreakdown.totalConsumerPrice * item.quantityKg
      }));

      const newOrder = await api.createOrder({
        buyerId: currentUser?.id || 'user-consumer-1',
        buyerName: currentUser?.name || 'Ananya Sharma',
        buyerPhone: phone,
        buyerRole: (currentUser?.role as any) || 'consumer',
        shippingAddress: {
          addressLine,
          city,
          state: 'Karnataka',
          pinCode,
          lat: 12.9260,
          lng: 77.6762
        },
        items: orderItems,
        productAmount: totalProductAmount,
        logisticsFee: totalLogisticsFee,
        platformFee: totalPlatformFee,
        totalPaid: grandTotal,
        farmerEarnings: totalProductAmount,
        status: 'PAID',
        paymentId,
        paymentStatus: 'SUCCESS',
        paymentMethod: paymentMethod === 'UPI' ? 'UPI' : paymentMethod === 'CARDS' ? 'CARDS' : 'NETBANKING',
        logisticsPartnerName: 'Suresh Kumar (Electric Van KA-04-EV-8842)',
        estimatedDeliveryTime: deliverySlot,
        deliveryProofOtp: Math.floor(1000 + Math.random() * 9000).toString(),
        driverLocation: { lat: 12.9410, lng: 77.6820 }
      });

      // 4. Verify payment with server
      await api.verifyPayment({
        razorpay_order_id: paymentOrder.id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
        orderId: newOrder.id
      });

      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClose();
    } catch (err: any) {
      setIsProcessing(false);
      setPaymentError(err.message || 'Payment processing failed. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-stone-900">{t('buyerEscrowProtection')}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Step 1: Delivery Address & Time Slot */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-emerald-600" />
              1. {t('shippingAddress')}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <label className="block text-stone-500 text-[11px] mb-1">{t('streetAddress')}</label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={e => setAddressLine(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-500 text-[11px] mb-1">{t('city')}</label>
                <input
                  type="text"
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-500 text-[11px] mb-1">{t('pinCode')}</label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={e => setPinCode(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-500 text-[11px] mb-1">{t('phoneNumber')}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-stone-500 text-[11px] mb-1">{t('estimatedDeliveryTime')}</label>
                <select
                  value={deliverySlot}
                  onChange={e => setDeliverySlot(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium cursor-pointer"
                >
                  <option>Tomorrow Morning (07:00 AM - 10:00 AM)</option>
                  <option>Tomorrow Afternoon (12:00 PM - 03:00 PM)</option>
                  <option>Tomorrow Evening (05:00 PM - 08:00 PM)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Payment Simulator (Razorpay Test Mode) */}
          <div className="space-y-3 pt-2 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                2. Razorpay Escrow Gateway
              </h4>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                TEST ENVIRONMENT
              </span>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARDS')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'CARDS'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('NETBANKING')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  paymentMethod === 'NETBANKING'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>NetBanking</span>
              </button>
            </div>

            {/* Method Details */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl">
              {paymentMethod === 'UPI' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    {['gpay', 'phonepe', 'paytm'].map(app => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiApp(app as any)}
                        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold capitalize border cursor-pointer ${
                          upiApp === app ? 'bg-white border-emerald-500 text-emerald-900 shadow-xs' : 'border-stone-200 text-stone-600'
                        }`}
                      >
                        {app === 'gpay' ? 'Google Pay' : app === 'phonepe' ? 'PhonePe' : 'Paytm'}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-stone-500 flex items-center justify-between">
                    <span>UPI ID:</span>
                    <strong className="text-stone-800">ananya@okhdfcbank</strong>
                  </div>
                </div>
              )}

              {paymentMethod === 'CARDS' && (
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-stone-500 text-[10px] mb-0.5">Test Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-stone-500 text-[10px] mb-0.5">Expiry</label>
                      <input
                        type="text"
                        defaultValue="12/28"
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-500 text-[10px] mb-0.5">CVV</label>
                      <input
                        type="text"
                        defaultValue="789"
                        className="w-full p-2 bg-white border border-stone-300 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NETBANKING' && (
                <div className="space-y-2 text-xs">
                  <label className="block text-stone-500 text-[10px]">Select Indian Commercial Bank</label>
                  <select
                    value={selectedBank}
                    onChange={e => setSelectedBank(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-lg font-medium cursor-pointer"
                  >
                    <option>HDFC Bank</option>
                    <option>State Bank of India</option>
                    <option>ICICI Bank</option>
                    <option>Axis Bank</option>
                    <option>Kotak Mahindra Bank</option>
                  </select>
                </div>
              )}
            </div>

            {paymentError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}
          </div>

          {/* Transparent Invoice Review */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs space-y-1.5">
            <div className="flex justify-between text-stone-600">
              <span>{t('farmerReceives')} ({cartItems.length} {t('freshHarvestItems')})</span>
              <span className="font-bold text-stone-900">{formatINR(totalProductAmount)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{t('logisticsFee')}</span>
              <span>{formatINR(totalLogisticsFee)}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>{t('platformFee')}</span>
              <span>{formatINR(totalPlatformFee)}</span>
            </div>
            <div className="flex justify-between text-stone-900 font-extrabold text-sm pt-2 border-t border-emerald-200">
              <span>{t('totalPayable')}</span>
              <span className="text-emerald-950 text-base">{formatINR(grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="text-[11px] text-stone-500 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit SSL &bull; {t('buyerEscrowProtection')}</span>
          </div>

          <button
            onClick={handlePayAndPlaceOrder}
            disabled={isProcessing}
            className="py-2.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <span>{t('loading')}...</span>
            ) : (
              <>
                <span>{t('payWithRazorpay')} ({formatINR(grandTotal)})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

