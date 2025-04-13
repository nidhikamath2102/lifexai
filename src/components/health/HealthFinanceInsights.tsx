'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { getUserHealthLogs, getLatestHealthInsight } from '@/api/healthApi';
import { calculateHealthScore, calculateMoodScore, calculateAverageSleep, calculateAverageExercise } from '@/utils/healthUtils';

export default function HealthFinanceInsights() {
  const { customerId } = useAuth();
  
  // Fetch health logs (similar to HealthSummary component)
  const { 
    data: healthLogs,
    isLoading: isLoadingLogs,
    error: logsError,
    refetch: refetchLogs
  } = useQuery({
    queryKey: ['healthLogs', customerId],
    queryFn: () => customerId ? getUserHealthLogs(customerId) : Promise.resolve([]),
    enabled: !!customerId
  });
  
  // We'll still fetch insights for recommendations, but use health logs for metrics
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
  
  // Calculate health metrics directly from logs (just like in HealthSummary)
  const healthScore = healthLogs ? calculateHealthScore(healthLogs) : 0;
  const moodScore = healthLogs ? calculateMoodScore(healthLogs) : 0;
  const avgSleep = healthLogs ? calculateAverageSleep(healthLogs) : 0;
  const avgExercise = healthLogs ? calculateAverageExercise(healthLogs) : 0;
  
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
      
      // Refetch both datasets
      refetchLatest();
      refetchLogs();
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
  
  // Get mood description
  const getMoodDescription = (score: number) => {
    if (score >= 3.5) return 'Positive';
    if (score >= 2.5) return 'Neutral';
    if (score >= 1.5) return 'Sad';
    return 'Anxious';
  };
  
  // Generate client-side recommendations based on current health metrics
  const generateClientRecommendations = (healthScore: number, moodScore: number, avgSleep: number, avgExercise: number): string[] => {
    const recommendations: string[] = [];
    
    // Health score recommendations
    if (healthScore < 50) {
      recommendations.push("Your overall health score needs attention. Try to improve your sleep, exercise, and mood.");
    } else if (healthScore < 70) {
      recommendations.push("Your health score is average. Small improvements in sleep and exercise can boost it significantly.");
    } else if (healthScore >= 80) {
      recommendations.push("You have an excellent health score. Keep maintaining your healthy habits.");
    }
    
    // Sleep recommendations
    if (avgSleep < 6) {
      recommendations.push("Aim for 7-8 hours of sleep each night to improve overall health and cognitive function.");
      recommendations.push("Create a consistent sleep schedule, going to bed and waking up at the same time daily.");
    } else if (avgSleep < 7) {
      recommendations.push("Try to increase your sleep to 7-8 hours each night for optimal health.");
    } else if (avgSleep > 9) {
      recommendations.push("While rest is important, excessive sleep (>9 hours) may indicate other health issues.");
    }
    
    // Exercise recommendations
    if (avgExercise < 10) {
      recommendations.push("Start with short 10-minute walks daily and gradually increase duration.");
    } else if (avgExercise < 20) {
      recommendations.push("Aim to increase your activity to at least 30 minutes daily for better cardiovascular health.");
    } else if (avgExercise < 30) {
      recommendations.push("You're on the right track with exercise. Consider increasing to 30-45 minutes for optimal benefits.");
    } else if (avgExercise > 90) {
      recommendations.push("Ensure you're allowing adequate recovery time between intense workouts.");
    }
    
    // Mood recommendations
    if (moodScore < 2) {
      recommendations.push("Consider speaking with a mental health professional about your persistent low mood.");
      recommendations.push("Practice daily mindfulness meditation to help manage negative emotions.");
    } else if (moodScore < 2.5) {
      recommendations.push("Regular physical activity can help improve mood through the release of endorphins.");
    } else if (moodScore < 3.5) {
      recommendations.push("Try incorporating activities you enjoy into your daily routine to boost mood.");
    }
    
    // General health recommendations to fill if we don't have many specific ones
    if (recommendations.length < 3) {
      if (!recommendations.find(r => r.includes("water"))) {
        recommendations.push("Stay hydrated by drinking at least 8 glasses of water daily.");
      }
      if (!recommendations.find(r => r.includes("fruit"))) {
        recommendations.push("Include more fruits and vegetables in your diet for essential nutrients.");
      }
      if (!recommendations.find(r => r.includes("stress"))) {
        recommendations.push("Practice stress-reduction techniques like deep breathing or meditation.");
      }
    }
    
    return recommendations;
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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Health Insights</h2>
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
            
            {/* Health Summary - Using calculated metrics directly */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="font-medium text-green-800 dark:text-green-300">Health Summary</h4>
                  
                  {/* Using same calculated metrics as Dashboard tab */}
                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Health Score:</span>
                      <span className={`font-medium ${
                        healthScore >= 80 ? 'text-green-600 dark:text-green-400' :
                        healthScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {healthScore}/100
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Mood:</span>
                      <span className="font-medium text-green-800 dark:text-green-300">
                        {getMoodDescription(moodScore)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Sleep:</span>
                      <span className="font-medium text-green-800 dark:text-green-300">
                        {avgSleep.toFixed(1)} hours/day
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Exercise:</span>
                      <span className="font-medium text-green-800 dark:text-green-300">
                        {avgExercise.toFixed(0)} min/day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Financial Summary section removed */}
            
            {/* Recommendations - Generated based on current health metrics */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h4>
              <ul className="space-y-3">
                {generateClientRecommendations(healthScore, moodScore, avgSleep, avgExercise).map((recommendation, index) => (
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
                These recommendations are based on your current health metrics.
              </p>
            </div>
          </div>
        ) : healthLogs && healthLogs.length > 0 ? (
          // If we have health logs but no insights yet, still show health metrics
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                Your Health Summary
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Current
              </span>
            </div>
            
            {/* Health Summary - Using calculated metrics directly */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="w-full">
                  <h4 className="font-medium text-green-800 dark:text-green-300">Health Summary</h4>
                  
                  {/* Using same calculated metrics as Dashboard tab */}
                  <div className="mt-3 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Health Score:</span>
                      <span className={`font-medium ${
                        healthScore >= 80 ? 'text-green-600 dark:text-green-400' :
                        healthScore >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {healthScore}/100
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Mood:</span>
                      <span className="font-medium text-green-800 dark:text-green-300">
                        {getMoodDescription(moodScore)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Sleep:</span>
                      <span className="font-medium text-green-800 dark:text-green-300">
                        {avgSleep.toFixed(1)} hours/day
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-green-700 dark:text-green-400">Exercise:</span>
                      <span className="font-medium text-green-800 dark:text-green-300">
                        {avgExercise.toFixed(0)} min/day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Show client-side recommendations when there are no stored insights */}
            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Recommendations</h4>
              <ul className="space-y-3">
                {generateClientRecommendations(healthScore, moodScore, avgSleep, avgExercise).map((recommendation, index) => (
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
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  These recommendations are based on your current health metrics.
                </p>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Want more detailed insights? Generate a full analysis:
                </p>
                <button
                  onClick={handleGenerateInsights}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md font-medium hover:bg-purple-700 transition-colors"
                >
                  Generate Detailed Insights
                </button>
              </div>
            </div>
          </div>
        ) : (
          // No health logs or insights
          <div className="text-center py-8">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Health Data Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Complete your first health check-in on the Dashboard tab to see your health metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
