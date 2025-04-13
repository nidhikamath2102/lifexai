'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { getHealthMythsAndFacts } from '@/api/healthApi';

export default function MythBuster() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  
  // Fetch health myths and facts
  const { 
    data: mythsAndFacts,
    isLoading,
    error
  } = useQuery({
    queryKey: ['healthMythsAndFacts'],
    queryFn: getHealthMythsAndFacts
  });
  
  // Auto-rotate myths every 10 seconds if enabled
  useEffect(() => {
    if (!autoRotate || !mythsAndFacts || mythsAndFacts.length === 0) return;
    
    const interval = setInterval(() => {
      if (isFlipped) {
        setIsFlipped(false);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % mythsAndFacts.length);
        }, 500); // Wait for flip animation to complete
      } else {
        setIsFlipped(true);
      }
    }, 10000);
    
    return () => clearInterval(interval);
  }, [autoRotate, isFlipped, mythsAndFacts]);
  
  // Handle card flip
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  // Handle next myth
  const handleNext = () => {
    if (!mythsAndFacts) return;
    
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % mythsAndFacts.length);
    }, 300);
  };
  
  // Handle previous myth
  const handlePrev = () => {
    if (!mythsAndFacts) return;
    
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + mythsAndFacts.length) % mythsAndFacts.length);
    }, 300);
  };
  
  // Toggle auto-rotate
  const toggleAutoRotate = () => {
    setAutoRotate(!autoRotate);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center text-red-500">
          <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium">Error Loading Health Facts</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {(error as Error)?.message || 'Failed to load health myths and facts'}
          </p>
        </div>
      </div>
    );
  }
  
  // No data state
  if (!mythsAndFacts || mythsAndFacts.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Health Facts Available</h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for interesting health facts.
          </p>
        </div>
      </div>
    );
  }
  
  const currentMyth = mythsAndFacts[currentIndex].myth;
  const currentFact = mythsAndFacts[currentIndex].fact;
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Health Myth Buster</h2>
        <button
          onClick={toggleAutoRotate}
          className={`p-2 rounded-full ${
            autoRotate 
              ? 'bg-yellow-400 text-yellow-800' 
              : 'bg-white/20 text-white'
          }`}
          title={autoRotate ? 'Auto-rotate enabled' : 'Auto-rotate disabled'}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
      
      <div className="p-6">
        <div className="relative perspective">
          <div 
            className="relative w-full h-64 cursor-pointer"
            onClick={handleFlip}
          >
            <AnimatePresence mode="wait">
              {!isFlipped ? (
                <motion.div
                  key="front"
                  className="absolute inset-0 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 flex flex-col justify-between shadow-md"
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 180 }}
                  transition={{ duration: 0.5 }}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-red-100 dark:bg-red-800 p-2 rounded-full mr-3">
                        <svg className="w-5 h-5 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Myth</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {currentMyth}
                    </p>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Tap to reveal the fact
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="back"
                  className="absolute inset-0 bg-green-50 dark:bg-green-900/20 rounded-xl p-6 flex flex-col justify-between shadow-md"
                  initial={{ rotateY: 180 }}
                  animate={{ rotateY: 0 }}
                  exit={{ rotateY: 180 }}
                  transition={{ duration: 0.5 }}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <div>
                    <div className="flex items-center mb-4">
                      <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full mr-3">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Fact</h3>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-lg">
                      {currentFact}
                    </p>
                  </div>
                  
                  <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                    Tap to see the myth
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} of {mythsAndFacts.length}
          </div>
          
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
