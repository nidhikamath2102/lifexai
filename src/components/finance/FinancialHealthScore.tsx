import React, { useState, useEffect } from 'react';

interface FinancialHealthScoreProps {
  score: number;
  isLoading?: boolean;
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ score, isLoading = false }) => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);
  
  // Animate the score counting up
  useEffect(() => {
    if (isLoading) return;
    
    setIsAnimating(true);
    const end = score;
    const duration = 1500;
    const startTime = Date.now();
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      const currentValue = Math.round(easeOutQuad(progress) * end);
      
      setDisplayScore(currentValue);
      
      if (progress === 1) {
        clearInterval(timer);
        setIsAnimating(false);
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [score, isLoading]);
  
  // Get score color based on value
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-500 dark:text-green-400';
    if (score >= 60) return 'text-blue-500 dark:text-blue-400';
    if (score >= 40) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-red-500 dark:text-red-400';
  };
  
  // Get score background color based on value
  const getScoreBgColor = () => {
    if (score >= 80) return 'from-green-500 to-green-600 dark:from-green-600 dark:to-green-700';
    if (score >= 60) return 'from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700';
    if (score >= 40) return 'from-yellow-500 to-yellow-600 dark:from-yellow-600 dark:to-yellow-700';
    return 'from-red-500 to-red-600 dark:from-red-600 dark:to-red-700';
  };
  
  // Get score label based on value
  const getScoreLabel = () => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };
  
  // Get score description based on value
  const getScoreDescription = () => {
    if (score >= 80) {
      return 'Your financial health is excellent! You\'re managing your money well and making smart financial decisions.';
    }
    if (score >= 60) {
      return 'Your financial health is good. You\'re on the right track, but there\'s room for improvement in some areas.';
    }
    if (score >= 40) {
      return 'Your financial health is fair. Consider making some changes to improve your financial situation.';
    }
    return 'Your financial health needs improvement. Consider reviewing your spending habits and creating a budget.';
  };
  
  // Get recommendations based on score
  const getRecommendations = () => {
    if (score >= 80) {
      return [
        'Continue your excellent financial habits',
        'Consider increasing your investments',
        'Look into optimizing your tax strategy'
      ];
    }
    if (score >= 60) {
      return [
        'Build up your emergency fund',
        'Look for ways to reduce unnecessary expenses',
        'Consider increasing your savings rate'
      ];
    }
    if (score >= 40) {
      return [
        'Create a budget and stick to it',
        'Reduce non-essential spending',
        'Start building an emergency fund'
      ];
    }
    return [
      'Create a detailed budget immediately',
      'Cut back on all non-essential spending',
      'Consider seeking financial counseling'
    ];
  };
  
  // Calculate the percentage for the progress ring
  const calculateRingPercentage = () => {
    return (displayScore / 100) * 283; // 283 is the circumference of a circle with radius 45
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-gray-200">Financial Health Score</h2>
        
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-4 border-blue-200 dark:border-blue-900 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          </div>
          
          <div className="w-full space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded shimmer"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 h-full hover-lift fade-in">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Financial Health Score
      </h2>
      
      <div className="flex flex-col items-center">
        {/* Score Ring */}
        <div className="relative w-48 h-48 mb-6">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle */}
            <circle
              className={`transition-all duration-1000 ease-out ${getScoreColor()}`}
              strokeWidth="8"
              strokeDasharray="283"
              strokeDashoffset={283 - calculateRingPercentage()}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </svg>
          
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative">
              <span className={`text-5xl font-bold ${getScoreColor()}`}>{displayScore}</span>
              {isAnimating && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
              )}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">out of 100</span>
          </div>
        </div>
        
        {/* Score label */}
        <div className={`text-xl font-bold mb-3 ${getScoreColor()}`}>
          {getScoreLabel()}
        </div>
        
        {/* Score description */}
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          {getScoreDescription()}
        </p>
        
        {/* Recommendations */}
        <div className="w-full bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <h3 className="text-lg font-medium mb-3 text-gray-800 dark:text-gray-200 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Recommendations
          </h3>
          <ul className="space-y-2 text-gray-700 dark:text-gray-300 stagger-fade-in">
            {getRecommendations().map((recommendation, index) => (
              <li key={index} className="flex items-start">
                <div className={`p-1 rounded-full mr-2 bg-gradient-to-r ${getScoreBgColor()}`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthScore;
