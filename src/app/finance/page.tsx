'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getCustomerById,
  getCustomerAccounts,
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

// Components
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
  const [activeView, setActiveView] = useState<'dashboard' | 'transactions' | 'insights'>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Customer ID
  const customerId = '66235a8f9683f20dd51899d5';
  
  // Fetch specific customer
  const { 
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError
  } = useQuery({
    queryKey: ['customer', customerId],
    queryFn: () => getCustomerById(customerId)
  });
  
  // Fetch accounts for specific customer
  const { 
    data: accounts,
    isLoading: isLoadingAccounts,
    error: accountsError
  } = useQuery({
    queryKey: ['customerAccounts', customerId],
    queryFn: () => getCustomerAccounts(customerId)
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
      console.log('Accounts:', JSON.stringify(accounts, null, 2));
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

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get total balance across all accounts
  const getTotalBalance = () => {
    if (!accounts) return 0;
    return accounts.reduce((total, account) => total + account.balance, 0);
  };

  // Get account type icon
  const getAccountTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'savings':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'credit card':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };
  
  // Loading state
  if (isLoadingCustomer || isLoadingAccounts || isLoadingMerchants) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-6">Loading your financial data</h2>
            <p className="text-lg mb-8 text-gray-500">Please wait while we fetch your latest financial information...</p>
          </motion.div>
          
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              rotate: { duration: 1.5, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, repeatType: "reverse" }
            }}
            className="mx-auto"
          >
            <div className={`w-20 h-20 rounded-full border-t-4 border-b-4 ${isDarkMode ? 'border-blue-400' : 'border-blue-600'}`}></div>
          </motion.div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (customerError || accountsError || merchantsError) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 rounded-xl shadow-xl bg-white dark:bg-gray-800"
        >
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <p className="text-red-500 mb-6">
            {(customerError as Error)?.message || 
             (accountsError as Error)?.message || 
             (merchantsError as Error)?.message}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  // Get selected account
  const selectedAccount = accounts?.find(a => a._id === selectedAccountId);
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">LifexAI Finance</h1>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {customer ? `Welcome, ${customer.first_name} ${customer.last_name}` : 'Welcome to your financial dashboard'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <div className={`hidden md:block px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Balance:</span>
                <span className={`ml-2 font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {formatCurrency(getTotalBalance())}
                </span>
              </div>
              
              <div className="relative">
                <button className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
                {anomalies.length > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {anomalies.length}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex mt-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeView === 'dashboard'
                  ? isDarkMode 
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                    : 'bg-white text-blue-600 border-b-2 border-blue-500'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                Dashboard
              </div>
            </button>
            
            <button
              onClick={() => setActiveView('transactions')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeView === 'transactions'
                  ? isDarkMode 
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                    : 'bg-white text-blue-600 border-b-2 border-blue-500'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Transactions
              </div>
            </button>
            
            <button
              onClick={() => setActiveView('insights')}
              className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors ${
                activeView === 'insights'
                  ? isDarkMode 
                    ? 'bg-gray-700 text-white border-b-2 border-blue-500' 
                    : 'bg-white text-blue-600 border-b-2 border-blue-500'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-200'
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Insights
                {anomalies.length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {anomalies.length}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>
      
      {/* Account Selection */}
      <div className={`container mx-auto px-4 py-6 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
          <h2 className="text-lg font-semibold mb-4">Your Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {accounts && accounts.map((account) => (
              <motion.div
                key={account._id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => handleAccountSelect(account._id)}
                  className={`w-full p-4 rounded-lg transition-all ${
                    selectedAccountId === account._id
                      ? isDarkMode 
                        ? 'bg-blue-900 border-l-4 border-blue-500' 
                        : 'bg-blue-50 border-l-4 border-blue-500'
                      : isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${
                      selectedAccountId === account._id
                        ? isDarkMode ? 'bg-blue-800 text-blue-300' : 'bg-blue-100 text-blue-600'
                        : isDarkMode ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {getAccountTypeIcon(account.type)}
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-medium">{account.nickname || `Account ${account.account_number}`}</h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {account.type}
                      </p>
                      <p className={`text-lg font-bold mt-1 ${
                        account.balance >= 0 
                          ? isDarkMode ? 'text-green-400' : 'text-green-600' 
                          : isDarkMode ? 'text-red-400' : 'text-red-600'
                      }`}>
                        {formatCurrency(account.balance)}
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Account Summary */}
              <div className="lg:col-span-2">
              <AccountSummary 
                account={selectedAccount} 
                customer={customer}
                accounts={accounts || []}
                onTransactionComplete={() => {
                  // Refetch accounts and purchases when a transaction is completed
                  if (selectedAccountId) {
                    // For a production app, we would use queryClient.invalidateQueries() here
                    // But for this hackathon, we'll use a simple reload approach
                    // This ensures we get fresh data from the API after a transaction
                    window.location.reload();
                  }
                }}
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
            </motion.div>
          )}
          
          {activeView === 'transactions' && (
            <motion.div
              key="transactions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <TransactionList 
                transactions={categorizedPurchases} 
                isLoading={isLoadingPurchases} 
                error={purchasesError as Error}
              />
            </motion.div>
          )}
          
          {activeView === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Anomaly Detection */}
              <div className="lg:col-span-2">
                <AnomalyDetection anomalies={anomalies} />
              </div>
              
              {/* Recurring Expenses */}
              <div className="lg:col-span-1">
                <RecurringExpenses recurringExpenses={recurringExpenses} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer */}
      <footer className={`mt-12 py-8 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 LifexAI. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm hover:underline">Privacy Policy</a>
              <a href="#" className="text-sm hover:underline">Terms of Service</a>
              <a href="#" className="text-sm hover:underline">Contact Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
