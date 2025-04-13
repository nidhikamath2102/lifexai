'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Account } from '../../types/nessie';
import { createTransfer } from '../../api/nessieApi';

interface PayBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  selectedAccount: Account;
  onPaymentComplete: () => void;
  isDarkMode: boolean;
}

const PayBillModal: React.FC<PayBillModalProps> = ({
  isOpen,
  onClose,
  accounts,
  selectedAccount,
  onPaymentComplete,
  isDarkMode
}) => {
  const [amount, setAmount] = useState<string>('');
  const [targetAccountId, setTargetAccountId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  // Filter accounts to only show credit card accounts
  const creditCardAccounts = accounts.filter(account => 
    account.type.toLowerCase() === 'credit card'
  );

  // Set the first credit card account as the default target account
  useEffect(() => {
    if (creditCardAccounts.length > 0 && !targetAccountId) {
      setTargetAccountId(creditCardAccounts[0]._id);
    }
  }, [creditCardAccounts, targetAccountId]);

  // Reset form when modal is opened
  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setError(null);
      setSuccess(false);
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal points
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Validate amount
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    
    // Validate target account
    if (!targetAccountId) {
      setError('Please select a credit card account');
      return;
    }
    
    // Check if amount is greater than balance (for checking/savings)
    if (selectedAccount.type.toLowerCase() !== 'credit card' && amountValue > selectedAccount.balance) {
      setError('Insufficient funds');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create transfer (payment)
      const transferData = {
        medium: 'balance',
        payee_id: targetAccountId,
        amount: amountValue,
        transaction_date: new Date().toISOString(),
        description: `Payment from ${selectedAccount.type} to Credit Card`
      };
      
      // Create the transfer (payment)
      await createTransfer(selectedAccount._id, transferData);
      
      // Note: The Nessie API doesn't automatically update account balances in the UI
      // We'll manually update the UI by triggering a refresh
      
      setSuccess(true);
      setIsLoading(false);
      
      // Notify parent component that payment is complete
      setTimeout(() => {
        onPaymentComplete();
        onClose();
      }, 1500);
    } catch (err) {
      setError('Failed to process payment. Please try again.');
      setIsLoading(false);
      console.error('Payment error:', err);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className={`relative w-full max-w-md p-6 rounded-lg shadow-xl ${
              isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
            }`}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-1 rounded-full ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-semibold mb-4">Pay Credit Card Bill</h2>
            
            {/* From account info */}
            <div className={`p-4 rounded-lg mb-4 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>From</p>
              <div className="flex items-center mt-1">
                <div className={`p-2 rounded-full mr-3 ${
                  isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                }`}>
                  {selectedAccount.type.toLowerCase() === 'checking' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  ) : selectedAccount.type.toLowerCase() === 'savings' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedAccount.nickname || `${selectedAccount.type} Account`}</p>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Balance: {formatCurrency(selectedAccount.balance)}
                  </p>
                </div>
              </div>
            </div>
            
            {success ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-500 mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatCurrency(parseFloat(amount))} has been paid successfully.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Target account selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Pay To</label>
                  {creditCardAccounts.length > 0 ? (
                    <div className="space-y-2">
                      {creditCardAccounts.map(account => (
                        <div
                          key={account._id}
                          className={`p-3 rounded-lg border cursor-pointer ${
                            targetAccountId === account._id
                              ? isDarkMode
                                ? 'border-purple-500 bg-purple-900 bg-opacity-20'
                                : 'border-purple-500 bg-purple-50'
                              : isDarkMode
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setTargetAccountId(account._id)}
                        >
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-3 ${
                              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-medium">{account.nickname || `${account.type}`}</p>
                              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Balance: {formatCurrency(account.balance)}
                              </p>
                            </div>
                            {targetAccountId === account._id && (
                              <div className="ml-auto">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`p-4 rounded-lg text-center ${
                      isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
                    }`}>
                      No credit card accounts found
                    </div>
                  )}
                </div>
                
                {/* Amount input */}
                <div className="mb-6">
                  <label htmlFor="amount" className="block text-sm font-medium mb-2">Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>$</span>
                    </div>
                    <input
                      type="text"
                      id="amount"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className={`block w-full pl-8 pr-12 py-2 rounded-lg ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>USD</span>
                    </div>
                  </div>
                </div>
                
                {/* Error message */}
                {error && (
                  <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Submit button */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`mr-2 px-4 py-2 rounded-lg ${
                      isDarkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || creditCardAccounts.length === 0}
                    className={`px-4 py-2 rounded-lg ${
                      isLoading
                        ? isDarkMode ? 'bg-purple-800 text-purple-200' : 'bg-purple-300 text-purple-700'
                        : creditCardAccounts.length === 0
                          ? isDarkMode ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : isDarkMode ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      'Pay Bill'
                    )}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PayBillModal;
