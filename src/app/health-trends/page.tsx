'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

// Define types for regional health trends data
interface Symptom {
  name: string;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

interface RegionalTrend {
  region: string;
  symptoms: Symptom[];
  alert_level: 'high' | 'moderate' | 'low';
  prediction: string;
}

// Hardcoded mock data for health trends
const mockRegionalTrends: RegionalTrend[] = [
  {
    region: "Northeast",
    symptoms: [
      { name: "Cough", count: 32, trend: "increasing" },
      { name: "Fever", count: 28, trend: "increasing" },
      { name: "Sore throat", count: 24, trend: "stable" }
    ],
    alert_level: "moderate",
    prediction: "Possible flu outbreak in the next 7-10 days"
  },
  {
    region: "Midwest",
    symptoms: [
      { name: "Allergies", count: 45, trend: "increasing" },
      { name: "Congestion", count: 38, trend: "increasing" },
      { name: "Headache", count: 29, trend: "stable" }
    ],
    alert_level: "low",
    prediction: "Seasonal allergies peaking in the region"
  },
  {
    region: "South",
    symptoms: [
      { name: "Fatigue", count: 27, trend: "stable" },
      { name: "Muscle aches", count: 22, trend: "decreasing" },
      { name: "Headache", count: 19, trend: "stable" }
    ],
    alert_level: "low",
    prediction: "No significant disease outbreaks predicted"
  },
  {
    region: "West",
    symptoms: [
      { name: "Cough", count: 18, trend: "increasing" },
      { name: "Fever", count: 15, trend: "increasing" },
      { name: "Shortness of breath", count: 12, trend: "increasing" }
    ],
    alert_level: "high",
    prediction: "Respiratory infection cluster forming, monitor closely"
  }
];

export default function HealthTrendsPage() {
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  
  // Check for dark mode
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDarkMode(document.documentElement.classList.contains('dark'));
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark');
      setIsDarkMode(!isDarkMode);
    }
  };
  
  // Get alert level color
  const getAlertLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-500 text-white';
      case 'moderate':
        return 'bg-yellow-500 text-yellow-900';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };
  
  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend.toLowerCase()) {
      case 'increasing':
        return (
          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case 'decreasing':
        return (
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6" />
          </svg>
        );
      case 'stable':
        return (
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
          </svg>
        );
      default:
        return null;
    }
  };
  
  // Use the mock data directly
  const regionalTrends = mockRegionalTrends;
  
  // Get selected region data or default to first region
  const selectedRegionData = selectedRegion 
    ? regionalTrends.find((r: RegionalTrend) => r.region === selectedRegion) 
    : regionalTrends[0];
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
              >
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold">LifeVitals</h1>
                <div className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-600'} font-medium`}>
                  Health Trends Dashboard
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-200 text-gray-700'}`}
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              
              <button 
                onClick={() => router.push('/')}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
                aria-label="Go home"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">Disease Prediction Feed</h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {regionalTrends.map((region: RegionalTrend) => (
                <button
                  key={region.region}
                  onClick={() => setSelectedRegion(region.region)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    (!selectedRegion && region === regionalTrends[0]) || selectedRegion === region.region
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {region.region}
                </button>
              ))}
            </div>
            
            {selectedRegionData && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {selectedRegionData.region} Region
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAlertLevelColor(selectedRegionData.alert_level)}`}>
                    {selectedRegionData.alert_level.toUpperCase()} ALERT
                  </span>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Prediction</h4>
                  <p className="text-blue-700 dark:text-blue-400">
                    {selectedRegionData.prediction}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Common Symptoms</h4>
                  <div className="space-y-2">
                    {selectedRegionData.symptoms.map((symptom: Symptom, index: number) => (
                      <motion.div
                        key={symptom.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="bg-gray-200 dark:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-800 dark:text-gray-200">{symptom.name}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-gray-600 dark:text-gray-400 mr-2">{symptom.count} reports</span>
                          {getTrendIcon(symptom.trend)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This prediction is based on anonymized health data from users in your region.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`mt-12 py-8 ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm">© 2025 LifexAI. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-sm hover:underline">Privacy Policy</a>
              <a href="#" className="text-sm hover:underline">Terms of Service</a>
              <a href="#" className="text-sm hover:underline">Contact Support</a>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
            <p>Created for Bitcamp 2025 Hackathon - Best Hack Promoting Public Health</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
