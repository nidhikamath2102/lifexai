'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getLatestHealthInsight, getUserHealthInsights, UserInsight } from '@/api/healthApi';

export default function HealthFinanceInsights() {
  const { customerId } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);
  
  // Fetch latest health insight
  const { 
    data: latestInsight,
    isLoading: isLoadingLatest,
    error: latestError,
    refetch: refetchLatest
  } = useQuery({
    queryKey: ['latestHealthInsight', customerId],
    queryFn: () => customerId ? getLatestHealthInsight(customerId) : Promise.resolve(null),
    enabled: !!customerId
  });
  
  // Generate new insights
  const handleGenerateInsights = async () => {
    if (!customerId) return;
    
    try {
      // Call the API to generate new insights
      await fetch('/api/health/insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: customerId }),
      });
      
      // Refetch the latest insight
      refetchLatest();
    } catch (error) {
      console.error('Error generating insights:', error);
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Loading state
  if (isLoadingLatest) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (latestError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center text-red-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium">Error Loading Insights</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {(latestError as Error)?.message || 'Failed to load health insights'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Health + Finance Insights</h2>
        <button
          onClick={handleGenerateInsights}
          className="px-3 py-1 bg-white text-purple-600 rounded-md text-sm font-medium hover:bg-purple-50 transition-colors"
        >
          Generate New
        </button>
      </div>
      
      <div className="p-6">
        {latestInsight ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Your Personalized Insights
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {latestInsight.week_of ? formatDate(latestInsight.week_of) : 'Recent'}
              </span>
            </div>
            
            {/* Health Summary */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start mb-2">
                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Health Summary</h4>
                  <p className="text-green-700 dark:text-green-400 mt-1">
                    {latestInsight.health_summary}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Financial Summary */}
            {latestInsight.financial_summary && latestInsight.financial_summary.trim() !== '' && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <div className="flex items-start mb-2">
                  <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300">Financial Summary</h4>
                    <p className="text-blue-700 dark:text-blue-400 mt-1">
                      {latestInsight.financial_summary}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h4>
              <ul className="space-y-3">
                {latestInsight.recommendations.map((recommendation, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="bg-purple-100 dark:bg-purple-800 p-1 rounded-full mr-3 mt-0.5">
                      <svg className="w-4 h-4 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{recommendation}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
            
            <div className="text-center pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                These insights are based on your health logs and financial transactions.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Insights Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              We need more data to generate personalized insights for you.
            </p>
            <button
              onClick={handleGenerateInsights}
              className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
            >
              Generate Insights
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
