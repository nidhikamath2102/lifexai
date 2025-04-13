'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHealthLogs, getLatestHealthLog } from '@/api/healthApi';
import { calculateHealthScore, calculateMoodScore, calculateAverageSleep, calculateAverageExercise } from '@/utils/healthUtils';

export default function HealthSummary() {
  const { customerId } = useAuth();
  
  // Fetch health logs
  const { 
    data: healthLogs,
    isLoading: isLoadingLogs,
    error: logsError
  } = useQuery({
    queryKey: ['healthLogs', customerId],
    queryFn: () => customerId ? getUserHealthLogs(customerId) : Promise.resolve([]),
    enabled: !!customerId
  });
  
  // Fetch latest health log
  const { 
    data: latestLog,
    isLoading: isLoadingLatest,
    error: latestError
  } = useQuery({
    queryKey: ['latestHealthLog', customerId],
    queryFn: () => customerId ? getLatestHealthLog(customerId) : Promise.resolve(null),
    enabled: !!customerId
  });
  
  // Calculate health metrics
  const healthScore = healthLogs ? calculateHealthScore(healthLogs) : 0;
  const moodScore = healthLogs ? calculateMoodScore(healthLogs) : 0;
  const avgSleep = healthLogs ? calculateAverageSleep(healthLogs) : 0;
  const avgExercise = healthLogs ? calculateAverageExercise(healthLogs) : 0;
  
  // Get mood emoji
  const getMoodEmoji = (score: number) => {
    if (score >= 3.5) return '😊';
    if (score >= 2.5) return '😐';
    if (score >= 1.5) return '😔';
    return '😰';
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'short', 
      day: 'numeric'
    });
  };
  
  // Loading state
  if (isLoadingLogs || isLoadingLatest) {
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
  if (logsError || latestError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center text-red-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium">Error Loading Health Data</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {(logsError as Error)?.message || (latestError as Error)?.message || 'Failed to load health data'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Health Summary</h2>
      </div>
      
      <div className="p-6">
        {healthLogs && healthLogs.length > 0 ? (
          <div className="space-y-6">
            {/* Health Score */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Health Score</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Based on your recent health logs</p>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${
                  healthScore >= 80 ? 'text-green-500' :
                  healthScore >= 60 ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {healthScore}/100
                </div>
              </div>
            </div>
            
            {/* Health Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">{getMoodEmoji(moodScore)}</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Mood</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {moodScore >= 3.5 ? 'Happy' :
                   moodScore >= 2.5 ? 'Neutral' :
                   moodScore >= 1.5 ? 'Sad' : 'Anxious'}
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">💤</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Sleep</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {avgSleep.toFixed(1)} hours
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                <div className="text-3xl mb-2">🏃</div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Exercise</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-white">
                  {avgExercise.toFixed(0)} min/day
                </div>
              </div>
            </div>
            
            {/* Latest Log */}
            {latestLog && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Latest Check-In</h3>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(latestLog.date)}
                    </span>
                    <span className="text-2xl">
                      {latestLog.mood === 'Happy' ? '😊' :
                       latestLog.mood === 'Neutral' ? '😐' :
                       latestLog.mood === 'Sad' ? '😔' : '😰'}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Sleep:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{latestLog.sleep_hours} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Meals:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{latestLog.meals}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Exercise:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{latestLog.exercise_minutes} minutes</span>
                    </div>
                    
                    {latestLog.symptoms && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                        <span className="text-gray-600 dark:text-gray-300 block mb-1">Symptoms:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{latestLog.symptoms}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Health Logs Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Complete your first health check-in to see your health summary.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
