import crypto from 'crypto';

export interface PaymentOrderOptions {
  amount: number; // in INR
  currency: string;
  receipt: string;
  notes?: Record<string, string>;
}

export interface PaymentVerificationOptions {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentService {
  createPaymentOrder(options: PaymentOrderOptions): Promise<{
    id: string;
    amount: number;
    currency: string;
    keyId: string;
    isTestMode: boolean;
  }>;
  verifyPaymentSignature(options: PaymentVerificationOptions): Promise<boolean>;
  processRefund(paymentId: string, amount: number): Promise<{ success: boolean; refundId: string }>;
}

export class RazorpayPaymentService implements PaymentService {
  private keyId: string;
  private keySecret: string;
  private isTestMode: boolean;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_farmdirect_demo_key';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_abc123';
    this.isTestMode = !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_');
  }

  async createPaymentOrder(options: PaymentOrderOptions) {
    const orderId = `order_rzp_${this.isTestMode ? 'test_' : ''}${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: orderId,
      amount: Math.round(options.amount * 100), // in paise
      currency: options.currency || 'INR',
      keyId: this.keyId,
      isTestMode: this.isTestMode
    };
  }

  async verifyPaymentSignature(options: PaymentVerificationOptions): Promise<boolean> {
    if (this.isTestMode) {
      // In test mode, accept simulated valid signatures or calculate HMAC
      if (!options.razorpay_signature || options.razorpay_signature === 'simulated_success_signature') {
        return true;
      }
    }

    try {
      const generatedSignature = crypto
        .createHmac('sha256', this.keySecret)
        .update(`${options.razorpay_order_id}|${options.razorpay_payment_id}`)
        .digest('hex');

      return generatedSignature === options.razorpay_signature;
    } catch {
      return this.isTestMode;
    }
  }

  async processRefund(paymentId: string, amount: number) {
    return {
      success: true,
      refundId: `rfnd_test_${Date.now()}`
    };
  }
}

export const paymentService = new RazorpayPaymentService();
