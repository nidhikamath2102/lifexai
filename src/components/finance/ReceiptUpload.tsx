'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Image from 'next/image';
import { Account, Merchant, CreatePurchaseRequest } from '@/types/nessie';
import { useAuthNessieApi } from '@/api/authNessieApi';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/components/auth/AuthModalController';

interface ReceiptUploadProps {
  accounts: Account[];
  merchants: Merchant[];
  selectedAccountId: string;
  onTransactionComplete: () => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({
  accounts,
  merchants,
  selectedAccountId,
  onTransactionComplete
}) => {
  // Get authentication context
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  
  // Check authentication on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal(() => {
        // This callback will be called after successful authentication
        console.log('Authentication successful, continuing with receipt upload');
      });
    }
  }, [isAuthenticated, openAuthModal]);
  // State for form fields
  const [merchantName, setMerchantName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [accountId, setAccountId] = useState(selectedAccountId);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // State for form submission and AI analysis
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Handle file upload and AI analysis
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      setError('Please log in to analyze receipts');
      openAuthModal(() => {
        // After successful authentication, try again
        handleFileChange(e);
      });
      return;
    }
    
    try {
      setIsAnalyzing(true);
      setError(null);
      
      // Create a preview URL
      const fileReader = new FileReader();
      
      // Create a promise to wait for the file to be read
      const fileDataPromise = new Promise<string>((resolve) => {
        fileReader.onload = () => {
          const result = fileReader.result as string;
          setPreviewUrl(result);
          resolve(result);
        };
      });
      
      // Read the file as data URL
      fileReader.readAsDataURL(file);
      
      // Wait for the file to be read
      const fileData = await fileDataPromise;
      
      // We have the full data URL in fileData, which we'll send to the API
      // No need to extract the base64 data separately for our implementation
      
      // Call the Gemini Vision API to analyze the receipt
      const response = await axios.post('/api/v1/gemini-vision', {
        image: fileData,
        prompt: 'Extract merchant name, amount, date, and description from this receipt'
      });
      
      // Update form fields with the extracted data
      const receiptData = response.data;
      setMerchantName(receiptData.merchantName || '');
      setAmount(receiptData.amount?.toString() || '');
      setDescription(receiptData.description || '');
      
      // Set the date if available, otherwise keep the current date
      if (receiptData.date) {
        setPurchaseDate(receiptData.date);
      }
      
    } catch (err) {
      console.error('Error analyzing receipt:', err);
      setError('Failed to analyze receipt. Please enter details manually.');
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // Find merchant ID by name
  const findMerchantId = (name: string): string | null => {
    const merchant = merchants.find(m => 
      m.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(m.name.toLowerCase())
    );
    
    return merchant?._id || null;
  };
  
  // Get authenticated Nessie API
  const authNessieApi = useAuthNessieApi();
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validate form
      if (!merchantName || !amount || !description || !purchaseDate || !accountId) {
        throw new Error('All fields are required');
      }
      
      // Find merchant ID
      const merchantId = findMerchantId(merchantName);
      if (!merchantId) {
        throw new Error(`No merchant found matching &quot;${merchantName}&quot;`);
      }
      
      // Create purchase data
      const purchaseData: CreatePurchaseRequest = {
        merchant_id: merchantId,
        medium: 'balance',
        purchase_date: purchaseDate,
        amount: parseFloat(amount),
        description
      };
      
      // Submit purchase using authenticated API
      const result = await authNessieApi.createPurchase(accountId, purchaseData);
      
      // If result is null, it means the user is not authenticated
      if (!result) {
        setError('Authentication required. Please try again after logging in.');
        setIsSubmitting(false);
        return;
      }
      
      // Show success message
      setSuccess('Receipt transaction added successfully!');
      
      // Reset form
      setMerchantName('');
      setAmount('');
      setDescription('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
      setPreviewUrl(null);
      
      // Notify parent component
      onTransactionComplete();
    } catch (err) {
      setError((err as Error).message || 'Failed to add transaction');
    } finally {
      setIsSubmitting(false);
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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Upload Receipt</h2>
      <p className="text-gray-600 mb-4">
        Upload a receipt image and we&apos;ll automatically extract the details using AI.
      </p>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{success}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Receipt Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Receipt Image
          </label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full mb-2"
                    />
                    <p className="text-sm text-gray-500">Analyzing receipt with AI...</p>
                  </div>
                ) : previewUrl ? (
                  <div className="h-24 relative w-full">
                    <Image 
                      src={previewUrl} 
                      alt="Receipt preview" 
                      className="object-contain"
                      fill
                    />
                  </div>
                ) : (
                  <>
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".jpg,.jpeg,.png" 
                onChange={handleFileChange}
                disabled={isAnalyzing}
              />
            </label>
          </div>
        </div>
        
        {/* Account Selection */}
        <div>
          <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
            Account *
          </label>
          <select
            id="account"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            required
          >
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.nickname || `Account ${account.account_number}`} ({account.type}) - {formatCurrency(account.balance)}
              </option>
            ))}
          </select>
        </div>
        
        {/* Merchant Name */}
        <div>
          <label htmlFor="merchantName" className="block text-sm font-medium text-gray-700 mb-1">
            Merchant Name *
          </label>
          <input
            type="text"
            id="merchantName"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={merchantName}
            onChange={(e) => setMerchantName(e.target.value)}
            placeholder="e.g. Walmart, Amazon, Starbucks"
            required
          />
        </div>
        
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount ($) *
          </label>
          <input
            type="number"
            id="amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <input
            type="text"
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Weekly grocery shopping, Coffee with friends"
            required
          />
        </div>
        
        {/* Purchase Date */}
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-gray-700 mb-1">
            Purchase Date *
          </label>
          <input
            type="date"
            id="purchaseDate"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            required
          />
        </div>
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full"
              />
            ) : (
              'Add Transaction'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          * Required fields. Upload a receipt image and we&apos;ll use AI to extract the details, or enter them manually.
          The transaction will be categorized automatically based on the merchant and description.
        </p>
      </div>
    </div>
  );
};

export default ReceiptUpload;
