import React from 'react';
import { CategorizedPurchase } from '../../utils/financeUtils';

interface AnomalyDetectionProps {
  anomalies: CategorizedPurchase[];
}

const AnomalyDetection: React.FC<AnomalyDetectionProps> = ({ anomalies }) => {
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
  
  // Get anomaly severity
  const getAnomalySeverity = (anomaly: CategorizedPurchase) => {
    // This is a simplified approach. In a real app, you might have more sophisticated logic.
    if (anomaly.amount > 1000) return 'high';
    if (anomaly.amount > 500) return 'medium';
    return 'low';
  };
  
  // Get severity color
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Get severity icon
  const getSeverityIcon = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'medium':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'low':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Get anomaly explanation
  const getAnomalyExplanation = (anomaly: CategorizedPurchase) => {
    return `This ${anomaly.category} transaction is unusually ${anomaly.amount > 0 ? "high" : "low"} compared to your typical spending in this category.`;
  };
  
  // If no anomalies, show a message
  if (anomalies.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Spending Anomalies</h2>
        <div className="bg-green-50 p-4 rounded-lg text-green-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>No unusual spending patterns detected. Your spending habits look consistent!</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Spending Anomalies</h2>
        <p className="text-gray-600 mb-4">
          We&apos;ve detected {anomalies.length} unusual transaction{anomalies.length !== 1 ? 's' : ''} that may require your attention.
        </p>
      
      <div className="space-y-4">
        {anomalies.map((anomaly) => {
          const severity = getAnomalySeverity(anomaly);
          const severityColor = getSeverityColor(severity);
          const severityIcon = getSeverityIcon(severity);
          
          return (
            <div 
              key={anomaly._id} 
              className={`border rounded-lg p-4 ${severityColor}`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    {severityIcon}
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {anomaly.merchantName || 'Unknown Merchant'}
                    </h3>
                    <p className="text-sm">
                      {formatDate(anomaly.purchase_date)} • {anomaly.category}
                    </p>
                    <p className="mt-1">
                      {getAnomalyExplanation(anomaly)}
                    </p>
                  </div>
                </div>
                <div className="font-bold">
                  {formatCurrency(anomaly.amount)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>
          Anomalies are detected by comparing transactions against your typical spending patterns.
          Review these transactions to ensure they&apos;re legitimate.
        </p>
      </div>
    </div>
  );
};

export default AnomalyDetection;
