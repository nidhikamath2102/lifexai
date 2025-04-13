'use client';

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthModal } from "@/components/auth/AuthModalController";
import { useState, useEffect } from "react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleExploreFinance = () => {
    if (isAuthenticated) {
      router.push('/finance');
    } else {
      openAuthModal(() => {
        router.push('/finance');
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading LifexAI...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 fade-in">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gradient-text">
            Welcome to LifexAI
          </h1>
          <p className="text-xl text-gray-600 mt-6">
            Your AI detective for health, finance, and digital safety
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 stagger-fade-in">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-8 shadow-lg hover-lift">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300">Financial Dashboard</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our financial dashboard helps you track your spending, detect unusual transactions, and manage your subscriptions with an intuitive interface.
            </p>
            <button 
              onClick={handleExploreFinance}
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <div className="flex items-center">
                <span>Explore Finance Features</span>
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-8 shadow-lg hover-lift">
            <div className="flex items-center mb-4">
              <div className="bg-green-500 p-3 rounded-full mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-green-700 dark:text-green-300">Coming Soon</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We&apos;re working on adding health monitoring and digital safety features. Stay tuned for updates on these exciting new capabilities!
            </p>
            <button 
              disabled
              className="inline-block bg-gray-400 text-white px-6 py-3 rounded-lg cursor-not-allowed opacity-75"
            >
              <div className="flex items-center">
                <span>Coming Soon</span>
                <svg className="w-5 h-5 ml-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-12 hover-lift">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">About LifexAI</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              LifexAI is your personal "holistic detective," analyzing clues from your life – health habits, financial transactions, and digital footprints – to give you actionable insights. It features a beautiful, playful UI and leverages cutting-edge AI/ML to provide you with valuable information about your daily life.
            </p>
            
            <h3 className="text-xl font-semibold mb-4 text-blue-500 dark:text-blue-300">Features</h3>
            <ul className="list-none space-y-4 text-gray-600 dark:text-gray-300 mb-6 stagger-fade-in">
              <li className="flex items-start">
                <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-blue-700 dark:text-blue-300">Financial Analysis:</strong> Track your spending, detect anomalies, and get personalized financial advice
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-green-700 dark:text-green-300">Health Monitoring:</strong> Analyze your health data and receive recommendations for improvement
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <strong className="text-purple-700 dark:text-purple-300">Digital Safety:</strong> Protect your digital footprint and stay safe online
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center fade-in" style={{ animationDelay: "0.5s" }}>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Created for Bitcamp 2025 Hackathon
          </p>
        </div>
      </div>
    </div>
  );
}
