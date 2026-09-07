import { PriceBreakdown } from '../types';

export function calculatePriceBreakdown(
  farmerPricePerKg: number,
  traditionalRetailPrice: number,
  distanceKm: number = 25
): PriceBreakdown {
  // Platform fee is a transparent flat 3%
  const platformFee = Math.max(1, Math.round(farmerPricePerKg * 0.03 * 10) / 10);

  // Logistics fee: base ₹3/kg for local (<30km), scaling gently with distance
  const logisticsRatePerKm = 0.08;
  const logisticsFee = Math.max(3, Math.round((3 + distanceKm * logisticsRatePerKm) * 10) / 10);

  // Total price buyer pays
  const totalConsumerPrice = Math.round((farmerPricePerKg + platformFee + logisticsFee) * 10) / 10;

  // Traditional supply chain estimate: middleman takes ~50-60% of retail price
  // In traditional chain, farmer usually receives ~40% of retail price
  const estimatedMiddlemanFarmerTake = Math.round(traditionalRetailPrice * 0.42);
  const farmerBonus = Math.max(0, Math.round((farmerPricePerKg - estimatedMiddlemanFarmerTake) * 10) / 10);
  const buyerSavings = Math.max(0, Math.round((traditionalRetailPrice - totalConsumerPrice) * 10) / 10);

  const savingsPercentage = traditionalRetailPrice > 0
    ? Math.round((buyerSavings / traditionalRetailPrice) * 100)
    : 0;

  const farmerBonusPercentage = estimatedMiddlemanFarmerTake > 0
    ? Math.round((farmerBonus / estimatedMiddlemanFarmerTake) * 100)
    : 0;

  return {
    farmerPrice: farmerPricePerKg,
    traditionalRetailPrice,
    platformFee,
    logisticsFee,
    totalConsumerPrice,
    farmerBonus,
    buyerSavings,
    savingsPercentage,
    farmerBonusPercentage
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
