'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { saveHealthLog, HealthLog } from '@/api/healthApi';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function DailyCheckIn() {
  const { customerId } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<HealthLog, '_id'>>({
    user_id: customerId || '',
    date: new Date().toISOString(),
    mood: 'Neutral',
    sleep_hours: 7,
    meals: 3,
    exercise_minutes: 0,
    symptoms: ''
  });
  
  const handleMoodSelect = (mood: 'Happy' | 'Sad' | 'Anxious' | 'Neutral') => {
    setFormData({ ...formData, mood });
    setStep(2);
  };
  
  const handleSleepChange = (hours: number) => {
    setFormData({ ...formData, sleep_hours: hours });
  };
  
  const handleMealsChange = (meals: number) => {
    setFormData({ ...formData, meals });
  };
  
  const handleExerciseChange = (minutes: number) => {
    setFormData({ ...formData, exercise_minutes: minutes });
  };
  
  const handleSymptomsChange = (symptoms: string) => {
    setFormData({ ...formData, symptoms });
  };
  
  // Get the query client instance
  const queryClient = useQueryClient();
  
  // Create a mutation for saving health logs
  const mutation = useMutation({
    mutationFn: (data: Omit<HealthLog, '_id'>) => saveHealthLog(data),
    onSuccess: () => {
      // Invalidate and refetch health logs queries
      queryClient.invalidateQueries({ queryKey: ['healthLogs', customerId] });
      queryClient.invalidateQueries({ queryKey: ['latestHealthLog', customerId] });
      
      // Reset form
      setFormData({
        user_id: customerId || '',
        date: new Date().toISOString(),
        mood: 'Neutral',
        sleep_hours: 7,
        meals: 3,
        exercise_minutes: 0,
        symptoms: ''
      });
      
      setStep(1);
    },
    onError: (err) => {
      console.error('Error saving health log:', err);
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerId) {
      console.error('No customer ID available');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Execute the mutation
      await mutation.mutateAsync({
        ...formData,
        user_id: customerId
      });
    } catch {
      // Error is handled in the mutation's onError
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
        <h2 className="text-xl font-bold text-white">Daily Health Check-In</h2>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">How are you feeling today?</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleMoodSelect('Happy')}
                  className="flex flex-col items-center justify-center p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  <span className="text-4xl mb-2">😊</span>
                  <span className="font-medium text-green-600 dark:text-green-400">Happy</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleMoodSelect('Sad')}
                  className="flex flex-col items-center justify-center p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <span className="text-4xl mb-2">😔</span>
                  <span className="font-medium text-blue-600 dark:text-blue-400">Sad</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleMoodSelect('Anxious')}
                  className="flex flex-col items-center justify-center p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
                >
                  <span className="text-4xl mb-2">😰</span>
                  <span className="font-medium text-yellow-600 dark:text-yellow-400">Anxious</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => handleMoodSelect('Neutral')}
                  className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="text-4xl mb-2">😐</span>
                  <span className="font-medium text-gray-600 dark:text-gray-400">Neutral</span>
                </button>
              </div>
            </motion.div>
          )}
          
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How many hours did you sleep last night?
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={formData.sleep_hours}
                    onChange={(e) => handleSleepChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[3rem] text-center">
                    {formData.sleep_hours}h
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How many proper meals did you eat today?
                </label>
                <div className="flex items-center justify-between">
                  {[0, 1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleMealsChange(num)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.meals === num
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How many minutes did you exercise today?
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={formData.exercise_minutes}
                    onChange={(e) => handleExerciseChange(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-lg font-medium text-gray-900 dark:text-white min-w-[4rem] text-center">
                    {formData.exercise_minutes}min
                  </span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Any unusual symptoms today? (Optional)
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => handleSymptomsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="e.g., headache, fatigue, sore throat"
                ></textarea>
              </div>
              
              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Back
                </button>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : 'Save Health Log'}
                </button>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
}
