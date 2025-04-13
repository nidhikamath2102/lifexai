'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { SpendingTrend } from '../../utils/financeUtils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface SpendingTrendsChartProps {
  spendingTrends: SpendingTrend[];
}

const SpendingTrendsChart: React.FC<SpendingTrendsChartProps> = ({ 
  spendingTrends 
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    // Check if it's a weekly format (YYYY-WXX)
    if (dateString.includes('-W')) {
      const [year, week] = dateString.split('-W');
      return `Week ${week}, ${year}`;
    }
    
    // Check if it's a monthly format (YYYY-MM)
    if (dateString.length === 7) {
      const date = new Date(dateString + '-01');
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    // Default format (YYYY-MM-DD)
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Prepare chart data
  const chartData = {
    labels: spendingTrends.map(item => formatDate(item.date)),
    datasets: [
      {
        label: 'Spending',
        data: spendingTrends.map(item => item.amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'line'>) => {
            return formatCurrency(tooltipItem.raw as number);
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (tickValue: string | number) => {
            return formatCurrency(Number(tickValue));
          },
        },
      },
    },
  };
  
  // Calculate trend statistics
  const calculateTrendStats = () => {
    if (spendingTrends.length < 2) {
      return {
        trend: 'neutral',
        changeAmount: 0,
        changePercent: 0,
      };
    }
    
    const firstAmount = spendingTrends[0].amount;
    const lastAmount = spendingTrends[spendingTrends.length - 1].amount;
    const changeAmount = lastAmount - firstAmount;
    const changePercent = (changeAmount / firstAmount) * 100;
    
    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (changeAmount > 0) trend = 'up';
    else if (changeAmount < 0) trend = 'down';
    
    return {
      trend,
      changeAmount,
      changePercent,
    };
  };
  
  const trendStats = calculateTrendStats();
  
  // If no data, show a message
  if (spendingTrends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Spending Trends</h2>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No spending trend data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Spending Trends</h2>
      
      {/* Trend summary */}
      <div className="mb-6">
        <div className="flex items-center">
          <span className="text-lg font-medium mr-2">Trend:</span>
          {trendStats.trend === 'up' && (
            <span className="text-red-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
              </svg>
              Increasing
            </span>
          )}
          {trendStats.trend === 'down' && (
            <span className="text-green-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12 13a1 1 0 110 2H7a1 1 0 01-1-1v-5a1 1 0 112 0v2.586l4.293-4.293a1 1 0 011.414 0L16 9.586 19.293 6.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0L13 9.414l-3.293 3.293A1 1 0 019 13H7z" clipRule="evenodd" />
              </svg>
              Decreasing
            </span>
          )}
          {trendStats.trend === 'neutral' && (
            <span className="text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a1 1 0 01-1 1H3a1 1 0 110-2h14a1 1 0 011 1z" clipRule="evenodd" />
              </svg>
              Stable
            </span>
          )}
        </div>
        
        {trendStats.trend !== 'neutral' && (
          <div className="text-sm mt-1">
            <span className={trendStats.trend === 'up' ? 'text-red-500' : 'text-green-500'}>
              {trendStats.trend === 'up' ? '+' : ''}
              {formatCurrency(trendStats.changeAmount)} ({trendStats.changePercent.toFixed(1)}%)
            </span>
            {' '}since {formatDate(spendingTrends[0].date)}
          </div>
        )}
      </div>
      
      {/* Chart */}
      <div className="h-64">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default SpendingTrendsChart;
