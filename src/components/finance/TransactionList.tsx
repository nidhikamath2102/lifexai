import React, { useState } from 'react';
import { CategorizedPurchase, TransactionCategory } from '../../utils/financeUtils';

interface TransactionListProps {
  transactions: CategorizedPurchase[];
  isLoading: boolean;
  error: Error | null;
}

const TransactionList: React.FC<TransactionListProps> = ({ 
  transactions, 
  isLoading, 
  error 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<TransactionCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };
  
  // Get category color
  const getCategoryColor = (category: TransactionCategory) => {
    switch (category) {
      case TransactionCategory.FOOD:
        return 'bg-red-100 text-red-800';
      case TransactionCategory.SHOPPING:
        return 'bg-blue-100 text-blue-800';
      case TransactionCategory.ENTERTAINMENT:
        return 'bg-purple-100 text-purple-800';
      case TransactionCategory.TRAVEL:
        return 'bg-yellow-100 text-yellow-800';
      case TransactionCategory.TRANSPORTATION:
        return 'bg-green-100 text-green-800';
      case TransactionCategory.UTILITIES:
        return 'bg-gray-100 text-gray-800';
      case TransactionCategory.HEALTH:
        return 'bg-pink-100 text-pink-800';
      case TransactionCategory.EDUCATION:
        return 'bg-indigo-100 text-indigo-800';
      case TransactionCategory.PERSONAL:
        return 'bg-orange-100 text-orange-800';
      case TransactionCategory.HOME:
        return 'bg-teal-100 text-teal-800';
      case TransactionCategory.INCOME:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(transaction => {
      // Apply search filter
      const searchMatch = 
        transaction.merchantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        formatCurrency(transaction.amount).includes(searchTerm);
      
      // Apply category filter
      const categoryMatch = categoryFilter === 'all' || transaction.category === categoryFilter;
      
      return searchMatch && categoryMatch;
    })
    .sort((a, b) => {
      // Apply sorting
      if (sortBy === 'date') {
        const dateA = new Date(a.purchase_date).getTime();
        const dateB = new Date(b.purchase_date).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
    });
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          Error loading transactions: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      
      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value as TransactionCategory | 'all')}
          >
            <option value="all">All Categories</option>
            {Object.values(TransactionCategory).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-');
              setSortBy(newSortBy as 'date' | 'amount');
              setSortOrder(newSortOrder as 'asc' | 'desc');
            }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>
      
      {/* Transactions Table */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No transactions found matching your filters.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Merchant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(transaction.purchase_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {transaction.merchantName || 'Unknown Merchant'}
                    </div>
                    {transaction.description && (
                      <div className="text-xs text-gray-500">
                        {transaction.description}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(transaction.category)}`}>
                      {transaction.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium">
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
