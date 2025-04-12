'use client';

import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { SpendingByCategory } from '../../utils/financeUtils';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface SpendingCategoryChartProps {
  spendingByCategory: SpendingByCategory[];
}

const SpendingCategoryChart: React.FC<SpendingCategoryChartProps> = ({ 
  spendingByCategory 
}) => {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  // Category colors
  const categoryColors = [
    'rgba(255, 99, 132, 0.7)',   // Red
    'rgba(54, 162, 235, 0.7)',   // Blue
    'rgba(255, 206, 86, 0.7)',   // Yellow
    'rgba(75, 192, 192, 0.7)',   // Teal
    'rgba(153, 102, 255, 0.7)',  // Purple
    'rgba(255, 159, 64, 0.7)',   // Orange
    'rgba(199, 199, 199, 0.7)',  // Gray
    'rgba(83, 102, 255, 0.7)',   // Indigo
    'rgba(255, 99, 255, 0.7)',   // Pink
    'rgba(99, 255, 132, 0.7)',   // Green
    'rgba(255, 159, 255, 0.7)',  // Magenta
    'rgba(255, 99, 64, 0.7)',    // Red-Orange
  ];
  
  // Border colors (slightly darker versions of the fill colors)
  const borderColors = categoryColors.map(color => 
    color.replace('0.7', '1')
  );
  
  // Prepare chart data
  const chartData = {
    labels: spendingByCategory.map(item => item.category),
    datasets: [
      {
        data: spendingByCategory.map(item => item.amount),
        backgroundColor: categoryColors.slice(0, spendingByCategory.length),
        borderColor: borderColors.slice(0, spendingByCategory.length),
        borderWidth: 1,
      },
    ],
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          boxWidth: 15,
          padding: 15,
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = context.parsed || 0;
            return `${label}: ${formatCurrency(value)} (${percentage.toFixed(1)}%)`;
          },
        },
      },
    },
  };
  
  // Calculate total spending
  const totalSpending = spendingByCategory.reduce(
    (sum, category) => sum + category.amount, 
    0
  );
  
  // If no data, show a message
  if (spendingByCategory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No spending data available</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
      
      <div className="flex flex-col lg:flex-row">
        {/* Chart */}
        <div className="lg:w-1/2">
          <div className="h-64 flex items-center justify-center">
            <Pie data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Category breakdown */}
        <div className="lg:w-1/2 mt-6 lg:mt-0">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Total Spending</h3>
            <p className="text-2xl font-bold">{formatCurrency(totalSpending)}</p>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Top Categories</h3>
            {spendingByCategory.slice(0, 5).map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: categoryColors[index] }}
                  ></div>
                  <span>{category.category}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium mr-2">
                    {formatCurrency(category.amount)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({category.percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpendingCategoryChart;
