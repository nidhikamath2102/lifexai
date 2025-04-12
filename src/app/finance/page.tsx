'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getAccounts, 
  getCustomers, 
  getAccountPurchases, 
  getMerchants 
} from '../../api/nessieApi';
import { 
  categorizePurchase, 
  calculateSpendingByCategory,
  calculateSpendingTrends,
  detectSpendingAnomalies,
  identifyRecurringExpenses,
  calculateFinancialHealthScore,
  CategorizedPurchase
} from '../../utils/financeUtils';
import { Account, Customer, Merchant, Purchase } from '../../types/nessie';

// We'll create these components next
import AccountSummary from '../../components/finance/AccountSummary';
import TransactionList from '../../components/finance/TransactionList';
import SpendingCategoryChart from '../../components/finance/SpendingCategoryChart';
import SpendingTrendsChart from '../../components/finance/SpendingTrendsChart';
import FinancialHealthScore from '../../components/finance/FinancialHealthScore';
import AnomalyDetection from '../../components/finance/AnomalyDetection';
import RecurringExpenses from '../../components/finance/RecurringExpenses';

export default function FinancePage() {
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [categorizedPurchases, setCategorizedPurchases] = useState<CategorizedPurchase[]>([]);
  
  // Fetch customers
  const { 
    data: customers,
    isLoading: isLoadingCustomers,
    error: customersError
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomers
  });
  
  // Fetch accounts
  const { 
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError
  } = useQuery({
    queryKey: ['accounts'],
    queryFn: getAccounts
  });
  
  // Fetch merchants
  const { 
    data: merchants,
    isLoading: isLoadingMerchants,
    error: merchantsError
  } = useQuery({
    queryKey: ['merchants'],
    queryFn: getMerchants
  });
  
  // Fetch purchases for selected account
  const { 
    data: purchases,
    isLoading: isLoadingPurchases,
    error: purchasesError
  } = useQuery({
    queryKey: ['purchases', selectedAccountId],
    queryFn: () => selectedAccountId ? getAccountPurchases(selectedAccountId) : Promise.resolve([]),
    enabled: !!selectedAccountId
  });
  
  // Set the first account as selected when accounts are loaded
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0]._id);
    }
  }, [accounts, selectedAccountId]);
  
  // Categorize purchases when purchases and merchants are loaded
  useEffect(() => {
    if (purchases && merchants) {
      const categorized = purchases.map(purchase => {
        const merchant = merchants.find(m => m._id === purchase.merchant_id);
        return categorizePurchase(purchase, merchant);
      });
      setCategorizedPurchases(categorized);
    }
  }, [purchases, merchants]);
  
  // Calculate financial metrics
  const spendingByCategory = categorizedPurchases.length > 0 
    ? calculateSpendingByCategory(categorizedPurchases)
    : [];
    
  const spendingTrends = purchases 
    ? calculateSpendingTrends(purchases, 'monthly')
    : [];
    
  const anomalies = categorizedPurchases.length > 0
    ? detectSpendingAnomalies(categorizedPurchases)
    : [];
    
  const recurringExpenses = categorizedPurchases.length > 0
    ? identifyRecurringExpenses(categorizedPurchases)
    : [];
    
  const financialHealthScore = (accounts && purchases)
    ? calculateFinancialHealthScore(accounts, purchases)
    : 0;
  
  // Handle account selection
  const handleAccountSelect = (accountId: string) => {
    setSelectedAccountId(accountId);
  };
  
  // Loading state
  if (isLoadingCustomers || isLoadingAccounts || isLoadingMerchants) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading financial data...</h2>
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (customersError || accountsError || merchantsError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error loading financial data</h2>
          <p className="text-red-500">
            {(customersError as Error)?.message || 
             (accountsError as Error)?.message || 
             (merchantsError as Error)?.message}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">LifexAI Financial Dashboard</h1>
      
      {/* Account Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Account</h2>
        <div className="flex flex-wrap gap-4">
          {accounts && accounts.map((account) => (
            <button
              key={account._id}
              onClick={() => handleAccountSelect(account._id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedAccountId === account._id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {account.nickname || `Account ${account.account_number}`}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Summary */}
        <div className="lg:col-span-2">
          <AccountSummary 
            account={accounts?.find(a => a._id === selectedAccountId)} 
            customer={customers?.find(c => c._id === accounts?.find(a => a._id === selectedAccountId)?.customer_id)}
          />
        </div>
        
        {/* Financial Health Score */}
        <div>
          <FinancialHealthScore score={financialHealthScore} />
        </div>
        
        {/* Spending by Category */}
        <div className="lg:col-span-2">
          <SpendingCategoryChart spendingByCategory={spendingByCategory} />
        </div>
        
        {/* Spending Trends */}
        <div className="lg:col-span-1">
          <SpendingTrendsChart spendingTrends={spendingTrends} />
        </div>
        
        {/* Transaction List */}
        <div className="lg:col-span-3">
          <TransactionList 
            transactions={categorizedPurchases} 
            isLoading={isLoadingPurchases} 
            error={purchasesError as Error}
          />
        </div>
        
        {/* Anomaly Detection */}
        <div className="lg:col-span-2">
          <AnomalyDetection anomalies={anomalies} />
        </div>
        
        {/* Recurring Expenses */}
        <div className="lg:col-span-1">
          <RecurringExpenses recurringExpenses={recurringExpenses} />
        </div>
      </div>
    </div>
  );
}
