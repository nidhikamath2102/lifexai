import React from 'react';
import { CategorizedPurchase } from '../../utils/financeUtils';

interface RecurringExpensesProps {
  recurringExpenses: CategorizedPurchase[];
}

const RecurringExpenses: React.FC<RecurringExpensesProps> = ({ 
  recurringExpenses 
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Group recurring expenses by merchant and amount
  const groupedExpenses = React.useMemo(() => {
    const groups: Record<string, CategorizedPurchase[]> = {};
    
    recurringExpenses.forEach(expense => {
      const key = `${expense.merchant_id}_${expense.amount}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(expense);
    });
    
    return Object.values(groups)
      .filter(group => group.length >= 2) // Ensure at least 2 occurrences
      .sort((a, b) => b[0].amount - a[0].amount); // Sort by amount (descending)
  }, [recurringExpenses]);
  
  // Calculate monthly total
  const monthlyTotal = React.useMemo(() => {
    return groupedExpenses.reduce((total, group) => {
      return total + group[0].amount;
    }, 0);
  }, [groupedExpenses]);
  
  // Calculate yearly total
  const yearlyTotal = monthlyTotal * 12;
  
  // If no recurring expenses, show a message
  if (groupedExpenses.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Recurring Expenses</h2>
        <div className="text-center py-8 text-gray-500">
          No recurring expenses detected.
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Recurring Expenses</h2>
      
      {/* Summary */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Monthly Total:</span>
          <span className="font-bold">{formatCurrency(monthlyTotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Yearly Total:</span>
          <span className="font-bold">{formatCurrency(yearlyTotal)}</span>
        </div>
      </div>
      
      {/* Subscription List */}
      <div className="space-y-4">
        {groupedExpenses.map((group, index) => {
          const expense = group[0]; // Use the first expense for display
          
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {expense.merchantName || 'Unknown Merchant'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {expense.category} • {group.length} occurrences
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold">
                    {formatCurrency(expense.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatCurrency(expense.amount * 12)}/year
                  </div>
                </div>
              </div>
              
              {/* Optimization tip */}
              {expense.amount > 50 && (
                <div className="mt-2 text-sm bg-blue-50 p-2 rounded text-blue-700">
                  <span className="font-medium">Tip:</span> Consider reviewing this subscription to see if you can find a better deal.
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Tips */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">Subscription Management Tips</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>Review your subscriptions regularly to avoid paying for services you no longer use</li>
          <li>Consider annual plans for services you use frequently to save money</li>
          <li>Set calendar reminders for free trial end dates</li>
        </ul>
      </div>
    </div>
  );
};

export default RecurringExpenses;
