import React from 'react';

interface FinancialHealthScoreProps {
  score: number;
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ score }) => {
  // Get score color based on value
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
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
    return (score / 100) * 283; // 283 is the circumference of a circle with radius 45
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Financial Health Score</h2>
      
      <div className="flex flex-col items-center">
        {/* Score Ring */}
        <div className="relative w-48 h-48 mb-4">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Progress circle */}
            <circle
              className={getScoreColor()}
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
            <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}</span>
            <span className="text-sm text-gray-500">out of 100</span>
          </div>
        </div>
        
        {/* Score label */}
        <div className={`text-xl font-bold mb-2 ${getScoreColor()}`}>
          {getScoreLabel()}
        </div>
        
        {/* Score description */}
        <p className="text-center text-gray-600 mb-4">
          {getScoreDescription()}
        </p>
        
        {/* Recommendations */}
        <div className="w-full">
          <h3 className="text-lg font-medium mb-2">Recommendations</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {getRecommendations().map((recommendation, index) => (
              <li key={index}>{recommendation}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FinancialHealthScore;
