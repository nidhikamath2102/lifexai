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

// Function to categorize a purchase based on merchant category and name
export const categorizePurchase = (
  purchase: Purchase,
  merchant?: Merchant
): CategorizedPurchase => {
  let category = TransactionCategory.OTHER;
  
  // If merchant is provided, use its category and name to determine the transaction category
  if (merchant) {
    const merchantCategory = typeof merchant.category === 'string' ? merchant.category.toLowerCase() : '';
    const merchantName = typeof merchant.name === 'string' ? merchant.name.toLowerCase() : '';
    
    // First try to categorize based on merchant category
    if (merchantCategory) {
      // Food & Dining
      if (
        merchantCategory.includes('food') ||
        merchantCategory.includes('restaurant') ||
        merchantCategory.includes('dining') ||
        merchantCategory.includes('cafe') ||
        merchantCategory.includes('coffee') ||
        merchantCategory.includes('bakery') ||
        merchantCategory.includes('grocery') ||
        merchantCategory.includes('supermarket') ||
        merchantCategory.includes('meal') ||
        merchantCategory.includes('fast food') ||
        merchantCategory.includes('pizzeria') ||
        merchantCategory.includes('deli')
      ) {
        category = TransactionCategory.FOOD;
      }
      // Shopping
      else if (
        merchantCategory.includes('shopping') ||
        merchantCategory.includes('retail') ||
        merchantCategory.includes('clothing') ||
        merchantCategory.includes('apparel') ||
        merchantCategory.includes('department store') ||
        merchantCategory.includes('electronics') ||
        merchantCategory.includes('jewelry') ||
        merchantCategory.includes('bookstore') ||
        merchantCategory.includes('market') ||
        merchantCategory.includes('store') ||
        merchantCategory.includes('mall') ||
        merchantCategory.includes('outlet')
      ) {
        category = TransactionCategory.SHOPPING;
      }
      // Entertainment
      else if (
        merchantCategory.includes('entertainment') ||
        merchantCategory.includes('movie') ||
        merchantCategory.includes('cinema') ||
        merchantCategory.includes('theater') ||
        merchantCategory.includes('game') ||
        merchantCategory.includes('amusement') ||
        merchantCategory.includes('park') ||
        merchantCategory.includes('concert') ||
        merchantCategory.includes('music') ||
        merchantCategory.includes('event') ||
        merchantCategory.includes('sport') ||
        merchantCategory.includes('recreation')
      ) {
        category = TransactionCategory.ENTERTAINMENT;
      }
      // Travel
      else if (
        merchantCategory.includes('travel') ||
        merchantCategory.includes('hotel') ||
        merchantCategory.includes('motel') ||
        merchantCategory.includes('lodging') ||
        merchantCategory.includes('airline') ||
        merchantCategory.includes('flight') ||
        merchantCategory.includes('airport') ||
        merchantCategory.includes('cruise') ||
        merchantCategory.includes('vacation') ||
        merchantCategory.includes('resort') ||
        merchantCategory.includes('booking') ||
        merchantCategory.includes('tourism')
      ) {
        category = TransactionCategory.TRAVEL;
      }
      // Transportation
      else if (
        merchantCategory.includes('transportation') ||
        merchantCategory.includes('gas') ||
        merchantCategory.includes('fuel') ||
        merchantCategory.includes('automotive') ||
        merchantCategory.includes('auto') ||
        merchantCategory.includes('car') ||
        merchantCategory.includes('vehicle') ||
        merchantCategory.includes('taxi') ||
        merchantCategory.includes('uber') ||
        merchantCategory.includes('lyft') ||
        merchantCategory.includes('transit') ||
        merchantCategory.includes('train') ||
        merchantCategory.includes('bus') ||
        merchantCategory.includes('subway') ||
        merchantCategory.includes('parking')
      ) {
        category = TransactionCategory.TRANSPORTATION;
      }
      // Utilities
      else if (
        merchantCategory.includes('utilities') ||
        merchantCategory.includes('utility') ||
        merchantCategory.includes('telecom') ||
        merchantCategory.includes('phone') ||
        merchantCategory.includes('mobile') ||
        merchantCategory.includes('internet') ||
        merchantCategory.includes('cable') ||
        merchantCategory.includes('electricity') ||
        merchantCategory.includes('water') ||
        merchantCategory.includes('gas utility') ||
        merchantCategory.includes('energy') ||
        merchantCategory.includes('bill payment')
      ) {
        category = TransactionCategory.UTILITIES;
      }
      // Health & Medical
      else if (
        merchantCategory.includes('health') ||
        merchantCategory.includes('medical') ||
        merchantCategory.includes('healthcare') ||
        merchantCategory.includes('pharmacy') ||
        merchantCategory.includes('drug') ||
        merchantCategory.includes('doctor') ||
        merchantCategory.includes('hospital') ||
        merchantCategory.includes('clinic') ||
        merchantCategory.includes('dental') ||
        merchantCategory.includes('vision') ||
        merchantCategory.includes('fitness') ||
        merchantCategory.includes('gym')
      ) {
        category = TransactionCategory.HEALTH;
      }
      // Education
      else if (
        merchantCategory.includes('education') ||
        merchantCategory.includes('school') ||
        merchantCategory.includes('university') ||
        merchantCategory.includes('college') ||
        merchantCategory.includes('academy') ||
        merchantCategory.includes('tuition') ||
        merchantCategory.includes('course') ||
        merchantCategory.includes('training') ||
        merchantCategory.includes('learning')
      ) {
        category = TransactionCategory.EDUCATION;
      }
      // Personal Care
      else if (
        merchantCategory.includes('personal') ||
        merchantCategory.includes('beauty') ||
        merchantCategory.includes('salon') ||
        merchantCategory.includes('spa') ||
        merchantCategory.includes('barber') ||
        merchantCategory.includes('cosmetic') ||
        merchantCategory.includes('hair') ||
        merchantCategory.includes('nail')
      ) {
        category = TransactionCategory.PERSONAL;
      }
      // Home
      else if (
        merchantCategory.includes('home') ||
        merchantCategory.includes('furniture') ||
        merchantCategory.includes('hardware') ||
        merchantCategory.includes('appliance') ||
        merchantCategory.includes('garden') ||
        merchantCategory.includes('improvement') ||
        merchantCategory.includes('decor') ||
        merchantCategory.includes('construction') ||
        merchantCategory.includes('repair') ||
        merchantCategory.includes('maintenance')
      ) {
        category = TransactionCategory.HOME;
      }
    }
    
    // If category is still OTHER, try to categorize based on merchant name
    if (category === TransactionCategory.OTHER && merchantName) {
      // Food & Dining
      if (
        merchantName.includes('restaurant') ||
        merchantName.includes('cafe') ||
        merchantName.includes('coffee') ||
        merchantName.includes('starbucks') ||
        merchantName.includes('mcdonald') ||
        merchantName.includes('burger') ||
        merchantName.includes('pizza') ||
        merchantName.includes('taco') ||
        merchantName.includes('subway') ||
        merchantName.includes('chipotle') ||
        merchantName.includes('wendy') ||
        merchantName.includes('kfc') ||
        merchantName.includes('donut') ||
        merchantName.includes('bakery') ||
        merchantName.includes('grocery') ||
        merchantName.includes('market') ||
        merchantName.includes('food') ||
        merchantName.includes('deli') ||
        merchantName.includes('walmart') ||
        merchantName.includes('target') ||
        merchantName.includes('costco') ||
        merchantName.includes('safeway') ||
        merchantName.includes('kroger') ||
        merchantName.includes('trader') ||
        merchantName.includes('whole foods')
      ) {
        category = TransactionCategory.FOOD;
      }
      // Shopping
      else if (
        merchantName.includes('amazon') ||
        merchantName.includes('walmart') ||
        merchantName.includes('target') ||
        merchantName.includes('costco') ||
        merchantName.includes('best buy') ||
        merchantName.includes('macy') ||
        merchantName.includes('nordstrom') ||
        merchantName.includes('nike') ||
        merchantName.includes('adidas') ||
        merchantName.includes('apple') ||
        merchantName.includes('microsoft') ||
        merchantName.includes('store') ||
        merchantName.includes('shop') ||
        merchantName.includes('mall') ||
        merchantName.includes('outlet')
      ) {
        category = TransactionCategory.SHOPPING;
      }
      // Entertainment
      else if (
        merchantName.includes('netflix') ||
        merchantName.includes('hulu') ||
        merchantName.includes('disney') ||
        merchantName.includes('spotify') ||
        merchantName.includes('apple music') ||
        merchantName.includes('cinema') ||
        merchantName.includes('theater') ||
        merchantName.includes('movie') ||
        merchantName.includes('ticket') ||
        merchantName.includes('concert') ||
        merchantName.includes('event') ||
        merchantName.includes('game') ||
        merchantName.includes('steam') ||
        merchantName.includes('playstation') ||
        merchantName.includes('xbox')
      ) {
        category = TransactionCategory.ENTERTAINMENT;
      }
      // Travel
      else if (
        merchantName.includes('hotel') ||
        merchantName.includes('airbnb') ||
        merchantName.includes('booking') ||
        merchantName.includes('expedia') ||
        merchantName.includes('airline') ||
        merchantName.includes('delta') ||
        merchantName.includes('united') ||
        merchantName.includes('american airlines') ||
        merchantName.includes('southwest') ||
        merchantName.includes('flight') ||
        merchantName.includes('travel') ||
        merchantName.includes('vacation') ||
        merchantName.includes('cruise') ||
        merchantName.includes('resort')
      ) {
        category = TransactionCategory.TRAVEL;
      }
      // Transportation
      else if (
        merchantName.includes('uber') ||
        merchantName.includes('lyft') ||
        merchantName.includes('taxi') ||
        merchantName.includes('gas') ||
        merchantName.includes('shell') ||
        merchantName.includes('exxon') ||
        merchantName.includes('chevron') ||
        merchantName.includes('bp') ||
        merchantName.includes('auto') ||
        merchantName.includes('car') ||
        merchantName.includes('parking') ||
        merchantName.includes('transit') ||
        merchantName.includes('metro') ||
        merchantName.includes('train') ||
        merchantName.includes('amtrak')
      ) {
        category = TransactionCategory.TRANSPORTATION;
      }
      // Utilities
      else if (
        merchantName.includes('at&t') ||
        merchantName.includes('verizon') ||
        merchantName.includes('t-mobile') ||
        merchantName.includes('sprint') ||
        merchantName.includes('comcast') ||
        merchantName.includes('xfinity') ||
        merchantName.includes('spectrum') ||
        merchantName.includes('utility') ||
        merchantName.includes('electric') ||
        merchantName.includes('water') ||
        merchantName.includes('gas') ||
        merchantName.includes('power') ||
        merchantName.includes('energy') ||
        merchantName.includes('internet') ||
        merchantName.includes('phone') ||
        merchantName.includes('mobile')
      ) {
        category = TransactionCategory.UTILITIES;
      }
      // Health & Medical
      else if (
        merchantName.includes('cvs') ||
        merchantName.includes('walgreens') ||
        merchantName.includes('rite aid') ||
        merchantName.includes('pharmacy') ||
        merchantName.includes('doctor') ||
        merchantName.includes('hospital') ||
        merchantName.includes('clinic') ||
        merchantName.includes('medical') ||
        merchantName.includes('health') ||
        merchantName.includes('dental') ||
        merchantName.includes('vision') ||
        merchantName.includes('fitness') ||
        merchantName.includes('gym') ||
        merchantName.includes('planet fitness') ||
        merchantName.includes('24 hour fitness')
      ) {
        category = TransactionCategory.HEALTH;
      }
    }
    
    // If we still couldn't categorize based on merchant name or category,
    // try to categorize based on purchase description
    if (category === TransactionCategory.OTHER && purchase.description) {
      const description = purchase.description.toLowerCase();
      
      // Check for keywords in the description
      if (
        description.includes('food') ||
        description.includes('grocery') ||
        description.includes('restaurant') ||
        description.includes('meal') ||
        description.includes('lunch') ||
        description.includes('dinner') ||
        description.includes('breakfast')
      ) {
        category = TransactionCategory.FOOD;
      }
      else if (
        description.includes('shopping') ||
        description.includes('purchase') ||
        description.includes('buy') ||
        description.includes('store')
      ) {
        category = TransactionCategory.SHOPPING;
      }
      else if (
        description.includes('movie') ||
        description.includes('entertainment') ||
        description.includes('game') ||
        description.includes('ticket')
      ) {
        category = TransactionCategory.ENTERTAINMENT;
      }
      else if (
        description.includes('travel') ||
        description.includes('hotel') ||
        description.includes('flight') ||
        description.includes('trip')
      ) {
        category = TransactionCategory.TRAVEL;
      }
      else if (
        description.includes('gas') ||
        description.includes('uber') ||
        description.includes('lyft') ||
        description.includes('taxi') ||
        description.includes('transport')
      ) {
        category = TransactionCategory.TRANSPORTATION;
      }
      else if (
        description.includes('bill') ||
        description.includes('utility') ||
        description.includes('phone') ||
        description.includes('internet')
      ) {
        category = TransactionCategory.UTILITIES;
      }
      else if (
        description.includes('doctor') ||
        description.includes('medical') ||
        description.includes('health') ||
        description.includes('pharmacy')
      ) {
        category = TransactionCategory.HEALTH;
      }
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
