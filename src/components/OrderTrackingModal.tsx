import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  ShieldCheck,
  Star,
  Key,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Order } from '../types';
import { formatINR } from '../utils/pricing';

interface OrderTrackingModalProps {
  order: Order;
  onClose: () => void;
  onRateOrder?: (orderId: string, rating: number, comment: string) => void;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  order,
  onClose,
  onRateOrder
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [rated, setRated] = useState(false);

  const steps = [
    { label: 'Order Placed & Escrow Secured', status: 'PAID', time: '10:14 AM' },
    { label: 'Harvest Confirmed by Farmer', status: 'ACCEPTED', time: '10:30 AM' },
    { label: 'Grading & Crate Packing', status: 'PREPARING', time: '11:15 AM' },
    { label: 'Picked Up by Cold Chain Van', status: 'IN_TRANSIT', time: '12:00 PM' },
    { label: 'Delivered Fresh to Doorstep', status: 'DELIVERED', time: '02:45 PM' }
  ];

  const getStepStatus = (stepIndex: number) => {
    const orderStatuses = ['PENDING', 'PAID', 'ACCEPTED', 'PREPARING', 'READY_FOR_PICKUP', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'];
    const currentIdx = orderStatuses.indexOf(order.status);

    if (currentIdx >= stepIndex + 1) return 'completed';
    if (currentIdx === stepIndex) return 'current';
    return 'upcoming';
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRateOrder) {
      onRateOrder(order.id, rating, comment);
    }
    setRated(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
              Live Order Journey
            </span>
            <h3 className="text-base font-bold text-stone-900 mt-0.5">Order #{order.id}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* OTP & Delivery ETA Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-stone-500 font-medium block">Expected Arrival</span>
              <span className="text-sm font-bold text-stone-900">{order.estimatedDeliveryTime}</span>
              <p className="text-[11px] text-emerald-800 font-semibold mt-1">
                Logistics Partner: {order.logisticsPartnerName || 'Suresh Kumar (Electric Reefer KA-04)'}
              </p>
            </div>

            <div className="text-right bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
              <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
                Delivery Verification OTP
              </span>
              <span className="text-xl font-mono font-extrabold text-emerald-950 tracking-widest">
                {order.deliveryProofOtp || '4829'}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              Harvest & Transit Timeline
            </h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map((step, idx) => {
                const state = getStepStatus(idx);
                return (
                  <div key={idx} className="relative flex items-start justify-between text-xs">
                    <div className="flex items-start gap-3">
                      <span
                        className={`absolute -left-6 top-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          state === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : state === 'current'
                            ? 'bg-amber-500 text-white animate-ping'
                            : 'bg-stone-300 text-stone-600'
                        }`}
                      >
                        {state === 'completed' ? '✓' : ''}
                      </span>
                      <div>
                        <span className={`font-bold block ${state === 'completed' ? 'text-stone-900' : state === 'current' ? 'text-emerald-800' : 'text-stone-400'}`}>
                          {step.label}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {state === 'completed' ? 'Verified by dispatch' : state === 'current' ? 'Currently in progress' : 'Upcoming phase'}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-400 font-medium">{step.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items in this order */}
          <div className="p-4 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
            <h5 className="text-xs font-bold text-stone-800">Fresh Produce in this Batch:</h5>
            <div className="divide-y divide-stone-200">
              {order.items.map(item => (
                <div key={item.productId} className="py-2 flex justify-between text-xs">
                  <div>
                    <span className="font-semibold text-stone-900">{item.productName}</span>
                    <span className="text-stone-500 block text-[11px]">Farm: {item.farmerName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-stone-900">{item.quantityKg} kg</span>
                    <span className="text-stone-500 block text-[11px]">{formatINR(item.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Post Delivery Rating & Review */}
          {order.status === 'DELIVERED' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
              <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                Rate Produce Quality & Farmer
              </h5>
              {rated ? (
                <p className="text-xs text-emerald-800 font-semibold">
                  Thank you! Your feedback has been verified and added to the farmer's transparency score.
                </p>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-xl cursor-pointer ${rating >= star ? 'text-amber-500' : 'text-stone-300'}`}
                      >
                        &#9733;
                      </button>
                    ))}
                  </div>
                  <textarea
                    rows={2}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="Describe freshness, taste, and farm packaging quality..."
                    className="w-full p-2 bg-white border border-emerald-200 rounded-xl text-xs focus:outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                  >
                    Submit Verified Review
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex justify-between items-center text-xs">
          <span className="text-stone-500">Need support? Contact 24/7 Agro Helpdesk</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-semibold rounded-xl cursor-pointer"
          >
            Close Tracker
          </button>
        </div>
      </div>
    </div>
  );
};
