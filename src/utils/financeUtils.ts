import { Purchase, Merchant } from '../types/nessie';

// Define transaction categories
export enum TransactionCategory {
  FOOD = 'Food & Dining',
  SHOPPING = 'Shopping',
  ENTERTAINMENT = 'Entertainment',
  TRAVEL = 'Travel',
  TRANSPORTATION = 'Transportation',
  UTILITIES = 'Utilities',
  HEALTH = 'Health & Medical',
  EDUCATION = 'Education',
  PERSONAL = 'Personal Care',
  HOME = 'Home',
  INCOME = 'Income',
  OTHER = 'Other'
}

// Interface for categorized purchase
export interface CategorizedPurchase extends Purchase {
  category: TransactionCategory;
  merchantName?: string;
}

// Interface for spending by category
export interface SpendingByCategory {
  category: TransactionCategory;
  amount: number;
  percentage: number;
}

// Interface for spending trend
export interface SpendingTrend {
  date: string;
  amount: number;
}

// Function to categorize a purchase based on merchant category
export const categorizePurchase = (
  purchase: Purchase,
  merchant?: Merchant
): CategorizedPurchase => {
  let category = TransactionCategory.OTHER;
  
  // If merchant is provided, use its category to determine the transaction category
  if (merchant && merchant.category && typeof merchant.category === 'string') {
    switch (merchant.category.toLowerCase()) {
      case 'food':
      case 'restaurant':
      case 'grocery':
        category = TransactionCategory.FOOD;
        break;
      case 'shopping':
      case 'retail':
      case 'clothing':
        category = TransactionCategory.SHOPPING;
        break;
      case 'entertainment':
      case 'movie':
      case 'game':
        category = TransactionCategory.ENTERTAINMENT;
        break;
      case 'travel':
      case 'hotel':
      case 'airline':
        category = TransactionCategory.TRAVEL;
        break;
      case 'transportation':
      case 'gas':
      case 'automotive':
        category = TransactionCategory.TRANSPORTATION;
        break;
      case 'utilities':
      case 'telecom':
        category = TransactionCategory.UTILITIES;
        break;
      case 'health':
      case 'medical':
      case 'pharmacy':
        category = TransactionCategory.HEALTH;
        break;
      case 'education':
      case 'school':
      case 'university':
        category = TransactionCategory.EDUCATION;
        break;
      case 'personal':
      case 'beauty':
        category = TransactionCategory.PERSONAL;
        break;
      case 'home':
      case 'furniture':
      case 'hardware':
        category = TransactionCategory.HOME;
        break;
      default:
        category = TransactionCategory.OTHER;
    }
  }

  return {
    ...purchase,
    category,
    merchantName: merchant?.name
  };
};

// Function to calculate spending by category
export const calculateSpendingByCategory = (
  purchases: CategorizedPurchase[]
): SpendingByCategory[] => {
  // Initialize an object to store spending by category
  const spendingMap: Record<TransactionCategory, number> = {} as Record<TransactionCategory, number>;
  
  // Initialize all categories with 0
  Object.values(TransactionCategory).forEach(category => {
    spendingMap[category] = 0;
  });
  
  // Sum up spending by category
  purchases.forEach(purchase => {
    spendingMap[purchase.category] += purchase.amount;
  });
  
  // Calculate total spending
  const totalSpending = Object.values(spendingMap).reduce((sum, amount) => sum + amount, 0);
  
  // Convert to array and calculate percentages
  return Object.entries(spendingMap).map(([category, amount]) => ({
    category: category as TransactionCategory,
    amount,
    percentage: totalSpending > 0 ? (amount / totalSpending) * 100 : 0
  })).sort((a, b) => b.amount - a.amount); // Sort by amount in descending order
};

// Function to calculate spending trends over time
export const calculateSpendingTrends = (
  purchases: Purchase[],
  period: 'daily' | 'weekly' | 'monthly' = 'daily'
): SpendingTrend[] => {
  // Group purchases by date
  const spendingByDate: Record<string, number> = {};
  
  purchases.forEach(purchase => {
    let dateKey: string;
    const purchaseDate = new Date(purchase.purchase_date);
    
    if (period === 'daily') {
      // Format: YYYY-MM-DD
      dateKey = purchaseDate.toISOString().split('T')[0];
    } else if (period === 'weekly') {
      // Get the week number
      const startOfYear = new Date(purchaseDate.getFullYear(), 0, 1);
      const days = Math.floor((purchaseDate.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
      const weekNumber = Math.ceil(days / 7);
      dateKey = `${purchaseDate.getFullYear()}-W${weekNumber}`;
    } else {
      // Format: YYYY-MM
      dateKey = `${purchaseDate.getFullYear()}-${String(purchaseDate.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!spendingByDate[dateKey]) {
      spendingByDate[dateKey] = 0;
    }
    
    spendingByDate[dateKey] += purchase.amount;
  });
  
  // Convert to array and sort by date
  return Object.entries(spendingByDate)
    .map(([date, amount]) => ({ date, amount }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

// Function to detect anomalies in spending
export const detectSpendingAnomalies = (
  purchases: CategorizedPurchase[],
  threshold = 1.5 // Threshold for anomaly detection (standard deviations)
): CategorizedPurchase[] => {
  // Group purchases by category
  const purchasesByCategory: Record<TransactionCategory, CategorizedPurchase[]> = {} as Record<TransactionCategory, CategorizedPurchase[]>;
  
  purchases.forEach(purchase => {
    if (!purchasesByCategory[purchase.category]) {
      purchasesByCategory[purchase.category] = [];
    }
    
    purchasesByCategory[purchase.category].push(purchase);
  });
  
  const anomalies: CategorizedPurchase[] = [];
  
  // Detect anomalies in each category
  Object.values(purchasesByCategory).forEach((categoryPurchases) => {
    if (categoryPurchases.length < 3) {
      return; // Not enough data for anomaly detection
    }
    
    // Calculate mean and standard deviation
    const amounts = categoryPurchases.map(p => p.amount);
    const mean = amounts.reduce((sum, amount) => sum + amount, 0) / amounts.length;
    const variance = amounts.reduce((sum, amount) => sum + Math.pow(amount - mean, 2), 0) / amounts.length;
    const stdDev = Math.sqrt(variance);
    
    // Find anomalies
    categoryPurchases.forEach(purchase => {
      if (Math.abs(purchase.amount - mean) > threshold * stdDev) {
        anomalies.push(purchase);
      }
    });
  });
  
  return anomalies;
};

// Function to identify recurring expenses (subscriptions)
export const identifyRecurringExpenses = (
  purchases: CategorizedPurchase[],
  timeframeInDays = 90, // Look for patterns in the last 90 days
  minOccurrences = 2 // Minimum occurrences to be considered recurring
): CategorizedPurchase[] => {
  // Group purchases by merchant and amount
  const purchasesByMerchantAndAmount: Record<string, CategorizedPurchase[]> = {};
  
  purchases.forEach(purchase => {
    const key = `${purchase.merchant_id}_${purchase.amount}`;
    
    if (!purchasesByMerchantAndAmount[key]) {
      purchasesByMerchantAndAmount[key] = [];
    }
    
    purchasesByMerchantAndAmount[key].push(purchase);
  });
  
  const recurringExpenses: CategorizedPurchase[] = [];
  
  // Identify recurring expenses
  Object.values(purchasesByMerchantAndAmount).forEach(merchantPurchases => {
    if (merchantPurchases.length >= minOccurrences) {
      // Sort by date
      const sortedPurchases = [...merchantPurchases].sort(
        (a, b) => new Date(a.purchase_date).getTime() - new Date(b.purchase_date).getTime()
      );
      
      // Check if the purchases occurred within the timeframe
      const firstPurchaseDate = new Date(sortedPurchases[0].purchase_date);
      const lastPurchaseDate = new Date(sortedPurchases[sortedPurchases.length - 1].purchase_date);
      const daysDifference = (lastPurchaseDate.getTime() - firstPurchaseDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDifference <= timeframeInDays) {
        recurringExpenses.push(...sortedPurchases);
      }
    }
  });
  
  return recurringExpenses;
};

// Function to calculate financial health score (0-100)
export const calculateFinancialHealthScore = (
  accounts: { balance: number }[],
  purchases: Purchase[],
  income = 0 // Monthly income
): number => {
  // Calculate total balance
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  
  // Calculate monthly spending
  const now = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(now.getMonth() - 1);
  
  const recentPurchases = purchases.filter(
    purchase => new Date(purchase.purchase_date) >= oneMonthAgo
  );
  
  const monthlySpending = recentPurchases.reduce(
    (sum, purchase) => sum + purchase.amount, 0
  );
  
  // Calculate metrics
  let score = 50; // Start with a neutral score
  
  // Factor 1: Savings ratio (balance to monthly spending)
  const savingsRatio = monthlySpending > 0 ? totalBalance / monthlySpending : 0;
  if (savingsRatio > 6) score += 20; // More than 6 months of expenses saved
  else if (savingsRatio > 3) score += 15;
  else if (savingsRatio > 1) score += 10;
  else if (savingsRatio > 0.5) score += 5;
  
  // Factor 2: Income to spending ratio
  if (income > 0) {
    const incomeToSpendingRatio = income / monthlySpending;
    if (incomeToSpendingRatio > 2) score += 20; // Spending less than half of income
    else if (incomeToSpendingRatio > 1.5) score += 15;
    else if (incomeToSpendingRatio > 1.2) score += 10;
    else if (incomeToSpendingRatio > 1) score += 5;
    else score -= 10; // Spending more than income
  }
  
  // Factor 3: Spending trend
  if (recentPurchases.length > 10) {
    const halfwayPoint = Math.floor(recentPurchases.length / 2);
    const firstHalfSpending = recentPurchases.slice(0, halfwayPoint)
      .reduce((sum, purchase) => sum + purchase.amount, 0);
    const secondHalfSpending = recentPurchases.slice(halfwayPoint)
      .reduce((sum, purchase) => sum + purchase.amount, 0);
    
    const spendingTrend = secondHalfSpending - firstHalfSpending;
    
    if (spendingTrend < 0) score += 10; // Decreasing spending trend
    else if (spendingTrend > firstHalfSpending * 0.2) score -= 10; // Significant increase in spending
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, score));
};
