import { HealthLog, UserInsight } from "@/api/healthApi";
import { CategorizedPurchase, TransactionCategory } from "./financeUtils";

// Calculate average mood score (Happy=4, Neutral=3, Sad=2, Anxious=1)
export const calculateMoodScore = (logs: HealthLog[]): number => {
  if (logs.length === 0) return 0;
  
  const moodValues: Record<string, number> = {
    "Happy": 4,
    "Neutral": 3,
    "Sad": 2,
    "Anxious": 1
  };
  
  const totalScore = logs.reduce((sum, log) => sum + moodValues[log.mood], 0);
  return totalScore / logs.length;
};

// Calculate average sleep hours
export const calculateAverageSleep = (logs: HealthLog[]): number => {
  if (logs.length === 0) return 0;
  
  const totalSleep = logs.reduce((sum, log) => sum + log.sleep_hours, 0);
  return totalSleep / logs.length;
};

// Calculate average meals per day
export const calculateAverageMeals = (logs: HealthLog[]): number => {
  if (logs.length === 0) return 0;
  
  const totalMeals = logs.reduce((sum, log) => sum + log.meals, 0);
  return totalMeals / logs.length;
};

// Calculate average exercise minutes
export const calculateAverageExercise = (logs: HealthLog[]): number => {
  if (logs.length === 0) return 0;
  
  const totalExercise = logs.reduce((sum, log) => sum + log.exercise_minutes, 0);
  return totalExercise / logs.length;
};

// Calculate health score based on mood, sleep, meals, and exercise
export const calculateHealthScore = (logs: HealthLog[]): number => {
  if (logs.length === 0) return 0;
  
  const moodScore = calculateMoodScore(logs) / 4; // Normalize to 0-1
  const sleepScore = Math.min(calculateAverageSleep(logs) / 8, 1); // Normalize to 0-1 (8 hours is optimal)
  const mealScore = calculateAverageMeals(logs) / 3; // Normalize to 0-1 (3 meals is optimal)
  const exerciseScore = Math.min(calculateAverageExercise(logs) / 30, 1); // Normalize to 0-1 (30 minutes is optimal)
  
  // Weight the scores (mood: 40%, sleep: 30%, meals: 15%, exercise: 15%)
  const weightedScore = (moodScore * 0.4) + (sleepScore * 0.3) + (mealScore * 0.15) + (exerciseScore * 0.15);
  
  // Convert to a 0-100 scale
  return Math.round(weightedScore * 100);
};

// Calculate health trends over time
export const calculateHealthTrends = (logs: HealthLog[], period: 'daily' | 'weekly' | 'monthly'): { date: string; score: number }[] => {
  if (logs.length === 0) return [];
  
  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Group logs by period
  const groupedLogs: Record<string, HealthLog[]> = {};
  
  sortedLogs.forEach(log => {
    const date = new Date(log.date);
    let key: string;
    
    if (period === 'daily') {
      key = date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (period === 'weekly') {
      // Get the Monday of the week
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
      const monday = new Date(date.setDate(diff));
      key = monday.toISOString().split('T')[0];
    } else { // monthly
      key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    
    if (!groupedLogs[key]) {
      groupedLogs[key] = [];
    }
    
    groupedLogs[key].push(log);
  });
  
  // Calculate health score for each period
  return Object.entries(groupedLogs).map(([date, logs]) => ({
    date,
    score: calculateHealthScore(logs)
  }));
};

// Detect health anomalies
export const detectHealthAnomalies = (logs: HealthLog[]): { date: string; anomaly: string; severity: 'low' | 'medium' | 'high' }[] => {
  if (logs.length < 3) return []; // Need at least 3 logs to detect anomalies
  
  const anomalies: { date: string; anomaly: string; severity: 'low' | 'medium' | 'high' }[] = [];
  
  // Sort logs by date
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate averages
  const avgSleep = calculateAverageSleep(sortedLogs);
  const avgMeals = calculateAverageMeals(sortedLogs);
  const avgExercise = calculateAverageExercise(sortedLogs);
  
  // Check each log for anomalies
  sortedLogs.forEach(log => {
    // Sleep anomalies
    if (log.sleep_hours < avgSleep * 0.7) {
      anomalies.push({
        date: log.date,
        anomaly: `Significantly less sleep than usual (${log.sleep_hours.toFixed(1)} hours vs. avg ${avgSleep.toFixed(1)})`,
        severity: log.sleep_hours < avgSleep * 0.5 ? 'high' : 'medium'
      });
    }
    
    // Meal anomalies
    if (log.meals < avgMeals * 0.7) {
      anomalies.push({
        date: log.date,
        anomaly: `Fewer meals than usual (${log.meals} vs. avg ${avgMeals.toFixed(1)})`,
        severity: log.meals < avgMeals * 0.5 ? 'high' : 'medium'
      });
    }
    
    // Exercise anomalies
    if (log.exercise_minutes < avgExercise * 0.5 && avgExercise > 10) {
      anomalies.push({
        date: log.date,
        anomaly: `Less exercise than usual (${log.exercise_minutes} mins vs. avg ${avgExercise.toFixed(1)})`,
        severity: 'medium'
      });
    }
    
    // Mood anomalies
    if (log.mood === 'Sad' || log.mood === 'Anxious') {
      anomalies.push({
        date: log.date,
        anomaly: `Mood reported as ${log.mood}`,
        severity: log.mood === 'Anxious' ? 'high' : 'medium'
      });
    }
    
    // Symptom anomalies
    if (log.symptoms && log.symptoms.trim() !== '') {
      anomalies.push({
        date: log.date,
        anomaly: `Reported symptoms: ${log.symptoms}`,
        severity: 'medium'
      });
    }
  });
  
  return anomalies;
};

// Generate health and finance insights
export const generateHealthFinanceInsights = (
  healthLogs: HealthLog[], 
  transactions: CategorizedPurchase[]
): UserInsight => {
  // Default insight if no data
  if (healthLogs.length === 0 || transactions.length === 0) {
    return {
      user_id: healthLogs.length > 0 ? healthLogs[0].user_id : '',
      week_of: new Date().toISOString(),
      health_summary: "Not enough health data to generate insights.",
      financial_summary: "Not enough financial data to generate insights.",
      recommendations: ["Start logging your daily health to get personalized insights."]
    };
  }
  
  // Sort logs by date (most recent first)
  const sortedLogs = [...healthLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentLogs = sortedLogs.slice(0, 7); // Last 7 days
  
  // Calculate health metrics
  const healthScore = calculateHealthScore(recentLogs);
  const avgSleep = calculateAverageSleep(recentLogs);
  const avgExercise = calculateAverageExercise(recentLogs);
  const moodScore = calculateMoodScore(recentLogs);
  
  // Analyze financial data
  const foodDeliveryExpenses = transactions.filter(t => 
    t.category === TransactionCategory.FOOD && 
    (t.description.toLowerCase().includes('delivery') || 
     t.description.toLowerCase().includes('doordash') || 
     t.description.toLowerCase().includes('uber eats') || 
     t.description.toLowerCase().includes('grubhub'))
  );
  
  const healthcareExpenses = transactions.filter(t => t.category === TransactionCategory.HEALTH);
  const fitnessExpenses = transactions.filter(t => 
    t.category === TransactionCategory.HEALTH || 
    t.description.toLowerCase().includes('gym') || 
    t.description.toLowerCase().includes('fitness')
  );
  
  // Generate insights
  let healthSummary = `Your health score is ${healthScore}/100. `;
  let financialSummary = "";
  const recommendations: string[] = [];
  
  // Health insights
  if (avgSleep < 7) {
    healthSummary += `You're averaging only ${avgSleep.toFixed(1)} hours of sleep. `;
    recommendations.push("Try to get 7-8 hours of sleep each night for better health.");
  } else {
    healthSummary += `You're getting a healthy ${avgSleep.toFixed(1)} hours of sleep on average. `;
  }
  
  if (avgExercise < 20) {
    healthSummary += `You're only exercising ${avgExercise.toFixed(1)} minutes per day on average. `;
    recommendations.push("Aim for at least 20-30 minutes of exercise daily.");
  } else {
    healthSummary += `You're maintaining a good exercise routine with ${avgExercise.toFixed(1)} minutes per day. `;
  }
  
  if (moodScore < 2.5) {
    healthSummary += `Your mood has been lower than optimal. `;
    recommendations.push("Consider speaking with a mental health professional about your mood.");
  } else if (moodScore >= 3.5) {
    healthSummary += `Your mood has been consistently positive. `;
  }
  
  // Financial insights related to health
  if (foodDeliveryExpenses.length > 0) {
    const totalFoodDelivery = foodDeliveryExpenses.reduce((sum, t) => sum + t.amount, 0);
    financialSummary += `You've spent $${totalFoodDelivery.toFixed(2)} on food delivery recently. `;
    
    if (avgExercise < 20 && totalFoodDelivery > 50) {
      recommendations.push("Consider cooking at home more often and using the savings for fitness activities.");
    }
  }
  
  if (healthcareExpenses.length > 0) {
    const totalHealthcare = healthcareExpenses.reduce((sum, t) => sum + t.amount, 0);
    financialSummary += `You've spent $${totalHealthcare.toFixed(2)} on healthcare. `;
  }
  
  if (fitnessExpenses.length > 0) {
    const totalFitness = fitnessExpenses.reduce((sum, t) => sum + t.amount, 0);
    financialSummary += `You've invested $${totalFitness.toFixed(2)} in fitness. `;
    
    if (avgExercise < 20 && totalFitness > 20) {
      recommendations.push("Make the most of your fitness investments by using them regularly.");
    }
  }
  
  // Add default recommendations if none were generated
  if (recommendations.length === 0) {
    recommendations.push("Continue maintaining your healthy lifestyle.");
    recommendations.push("Consider tracking your water intake for better hydration.");
  }
  
  return {
    user_id: healthLogs[0].user_id,
    week_of: new Date().toISOString(),
    health_summary: healthSummary,
    financial_summary: financialSummary,
    recommendations
  };
};

// Health myths and facts
export const healthMythsAndFacts = [
  {
    myth: "You need 8 glasses of water a day.",
    fact: "Water needs vary by individual. The color of your urine is a better indicator of hydration."
  },
  {
    myth: "Eating late at night makes you gain weight.",
    fact: "Total daily calorie intake matters more than when you eat."
  },
  {
    myth: "Cracking your knuckles causes arthritis.",
    fact: "No studies have found a connection between knuckle cracking and arthritis."
  },
  {
    myth: "You lose most of your body heat through your head.",
    fact: "You lose heat through any uncovered part of your body at roughly the same rate."
  },
  {
    myth: "Reading in dim light damages your eyes.",
    fact: "Reading in dim light may cause eye strain but doesn't cause permanent damage."
  },
  {
    myth: "Vaccines cause autism.",
    fact: "Extensive research has found no link between vaccines and autism."
  },
  {
    myth: "You should wait an hour after eating before swimming.",
    fact: "There's no evidence that swimming after eating increases cramp risk."
  },
  {
    myth: "Antibiotics can treat the common cold.",
    fact: "Colds are caused by viruses, which antibiotics cannot treat."
  },
  {
    myth: "You only use 10% of your brain.",
    fact: "Most of your brain is active most of the time, even during sleep."
  },
  {
    myth: "Vitamin C prevents colds.",
    fact: "Vitamin C doesn't prevent colds but may slightly reduce their duration."
  }
];
