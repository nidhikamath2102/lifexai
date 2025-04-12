import React from 'react';
import { Account, Customer } from '../../types/nessie';

interface AccountSummaryProps {
  account?: Account;
  customer?: Customer;
}

const AccountSummary: React.FC<AccountSummaryProps> = ({ account, customer }) => {
  if (!account) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
        <p className="text-gray-500">No account selected</p>
      </div>
    );
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get account type display name
  const getAccountTypeDisplay = (type: string) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'Checking Account';
      case 'savings':
        return 'Savings Account';
      case 'credit':
        return 'Credit Card';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Account Details</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Account Type:</span>
              <span className="font-medium">{getAccountTypeDisplay(account.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Account Number:</span>
              <span className="font-medium">
                {account.account_number.replace(/(\d{4})/g, '$1 ').trim()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nickname:</span>
              <span className="font-medium">{account.nickname || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rewards Points:</span>
              <span className="font-medium">{account.rewards.toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Balance Information</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-3xl font-bold text-blue-700 mb-2">
              {formatCurrency(account.balance)}
            </div>
            <div className="text-sm text-blue-600">Current Balance</div>
          </div>
          
          {customer && (
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Account Owner</h3>
              <div className="text-gray-700">
                {customer.first_name} {customer.last_name}
              </div>
              <div className="text-sm text-gray-500">
                {customer.address.street_number} {customer.address.street_name},
                {' '}{customer.address.city}, {customer.address.state} {customer.address.zip}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSummary;
