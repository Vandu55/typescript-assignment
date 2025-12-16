import { fuelPriceData, City, FuelType, monthNames } from '@/data/fuelPrices';

export interface MonthlyAverage {
  month: string;
  average: number;
}

/**
 * Calculate monthly average RSP for a given city, fuel type, and year
 * Missing values are treated as 0
 */
export const calculateMonthlyAverages = (
  city: City,
  fuelType: FuelType,
  year: number
): MonthlyAverage[] => {
  // Initialize monthly data structure
  const monthlyData: { [key: number]: number[] } = {};
  for (let i = 0; i < 12; i++) {
    monthlyData[i] = [];
  }

  // Filter and group data by month
  fuelPriceData.forEach((record) => {
    const recordDate = new Date(record.date);
    const recordYear = recordDate.getFullYear();
    const recordMonth = recordDate.getMonth();

    if (record.city === city && recordYear === year) {
      const price = fuelType === 'Petrol' ? record.petrol : record.diesel;
      // Treat missing/undefined values as 0
      monthlyData[recordMonth].push(price || 0);
    }
  });

  // Calculate averages for each month
  return monthNames.map((monthName, index) => {
    const prices = monthlyData[index];
    const average = prices.length > 0
      ? prices.reduce((sum, price) => sum + price, 0) / prices.length
      : 0;

    return {
      month: monthName,
      average: Math.round(average * 100) / 100, // Round to 2 decimal places
    };
  });
};

/**
 * Get the maximum value across all monthly averages for dynamic chart scaling
 */
export const getMaxPrice = (data: MonthlyAverage[]): number => {
  const max = Math.max(...data.map((d) => d.average));
  // Round up to nearest 20 for cleaner axis
  return Math.ceil(max / 20) * 20;
};

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return `₹${price.toFixed(2)}`;
};
