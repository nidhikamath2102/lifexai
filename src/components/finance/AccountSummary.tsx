'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Account } from '../../types/nessie';
import { Customer } from '../../types/nessie';
import TransferModal from './TransferModal';
import PayBillModal from './PayBillModal';

interface AccountSummaryProps {
  account: Account | undefined;
  customer: Customer | undefined;
  accounts?: Account[];
  onTransactionComplete?: () => void;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ 
  account, 
  customer,
  accounts = [],
  onTransactionComplete
}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isPayBillModalOpen, setIsPayBillModalOpen] = useState(false);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format account ID for display
  const formatAccountNumber = (account: Account | undefined) => {
    if (!account) {
      return 'N/A';
    }
    return account._id;
  };
  
  // Get account type icon
  const getAccountTypeIcon = () => {
    if (!account) return null;
    
    switch (account.type.toLowerCase()) {
      case 'checking':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'savings':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'credit card':
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  // If no account, show a placeholder
  if (!account) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Account Summary</h2>
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
        </div>
        <div className="flex justify-center items-center h-40">
          <p className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Select an account to view details
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow-md overflow-hidden`}>
      {/* Account Card Header */}
      <div className={`p-6 ${
        account.type.toLowerCase() === 'checking' 
          ? isDarkMode ? 'bg-blue-900' : 'bg-blue-600' 
          : account.type.toLowerCase() === 'savings'
            ? isDarkMode ? 'bg-green-900' : 'bg-green-600'
            : isDarkMode ? 'bg-purple-900' : 'bg-purple-600'
      } text-white`}>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold mb-1">{account.nickname || `${account.type} Account`}</h2>
            <p className="text-sm opacity-80">{formatAccountNumber(account)}</p>
          </div>
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
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
        </div>
        
        <div className="mt-6">
          <p className="text-sm opacity-80">Current Balance</p>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-3xl font-bold">{formatCurrency(account.balance)}</h3>
          </motion.div>
        </div>
      </div>
      
      {/* Account Details */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Account Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account Type</span>
                <span className="font-medium flex items-center">
                  <span className="mr-2">{getAccountTypeIcon()}</span>
                  {account.type}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Account ID</span>
                <span className="font-medium">{formatAccountNumber(account)}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rewards Points</span>
                <span className="font-medium">{account.rewards.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Customer Info */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Customer Information
            </h3>
            {customer ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Name</span>
                  <span className="font-medium">{customer.first_name} {customer.last_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</span>
                  <span className="font-medium text-right">
                    {customer.address.street_number} {customer.address.street_name}<br />
                    {customer.address.city}, {customer.address.state} {customer.address.zip}
                  </span>
                </div>
              </div>
            ) : (
              <div className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Customer information not available
              </div>
            )}
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="mt-8">
          <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => setIsTransferModalOpen(true)}
              disabled={account.type.toLowerCase() === 'credit card' || accounts.length <= 1}
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
                account.type.toLowerCase() === 'credit card' || accounts.length <= 1
                  ? isDarkMode 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span className="text-sm">Transfer</span>
            </button>
            <button 
              onClick={() => setIsPayBillModalOpen(true)}
              disabled={account.type.toLowerCase() === 'credit card' || !accounts.some(a => a.type.toLowerCase() === 'credit card')}
              className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
                account.type.toLowerCase() === 'credit card' || !accounts.some(a => a.type.toLowerCase() === 'credit card')
                  ? isDarkMode 
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : isDarkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm">Pay Bill</span>
            </button>
            <button className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}>
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span className="text-sm">Statements</span>
            </button>
            <button className={`p-4 rounded-lg flex flex-col items-center justify-center transition-colors ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}>
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-sm">Settings</span>
            </button>
          </div>
        </div>
        
        {/* Transfer Modal */}
        {account && (
          <TransferModal
            isOpen={isTransferModalOpen}
            onClose={() => setIsTransferModalOpen(false)}
            accounts={accounts}
            selectedAccount={account}
            onTransferComplete={() => {
              if (onTransactionComplete) onTransactionComplete();
            }}
            isDarkMode={isDarkMode}
          />
        )}
        
        {/* Pay Bill Modal */}
        {account && (
          <PayBillModal
            isOpen={isPayBillModalOpen}
            onClose={() => setIsPayBillModalOpen(false)}
            accounts={accounts}
            selectedAccount={account}
            onPaymentComplete={() => {
              if (onTransactionComplete) onTransactionComplete();
            }}
            isDarkMode={isDarkMode}
          />
        )}
      </div>
    </div>
  );
};

export default AccountSummary;
