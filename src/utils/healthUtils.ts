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
  // Get user ID from healthLogs if available
  const userId = healthLogs.length > 0 ? healthLogs[0].user_id : '';
  const currentDate = new Date().toISOString();
  const recommendations: string[] = [];

  // Initialize default summaries
  let healthSummary = "Not enough health data to generate insights.";
  let financialSummary = "Not enough financial data to generate insights.";

  // If no health data, return basic default insights
  if (healthLogs.length === 0) {
    recommendations.push("Start logging your daily health to get personalized insights.");
    return {
      user_id: userId,
      week_of: currentDate,
      health_summary: healthSummary,
      financial_summary: financialSummary,
      recommendations
    };
  }

  // Process health logs - we have health data at this point
  const sortedLogs = [...healthLogs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const recentLogs = sortedLogs.slice(0, 7); // Last 7 days
  
  // Calculate health metrics
  const healthScore = calculateHealthScore(recentLogs);
  const avgSleep = calculateAverageSleep(recentLogs);
  const avgExercise = calculateAverageExercise(recentLogs);
  const moodScore = calculateMoodScore(recentLogs);
  
  // Build a more detailed health summary with insights
  healthSummary = `Your overall health score is ${healthScore}/100. `;
  
  // Add categorization of health score
  if (healthScore >= 85) {
    healthSummary += `This is excellent! You're in the top tier of health metrics. `;
  } else if (healthScore >= 70) {
    healthSummary += `This is a good score, indicating positive health habits. `;
  } else if (healthScore >= 50) {
    healthSummary += `This is an average score with room for improvement. `;
  } else {
    healthSummary += `This score suggests your health habits need attention. `;
  }
  
  // Add trend analysis if we have enough logs
  if (recentLogs.length >= 3) {
    const oldestScore = calculateHealthScore([recentLogs[recentLogs.length - 1]]);
    const newestScore = calculateHealthScore([recentLogs[0]]);
    const scoreDiff = newestScore - oldestScore;
    
    if (Math.abs(scoreDiff) >= 5) {
      if (scoreDiff > 0) {
        healthSummary += `Your health score has been improving recently. Keep up the good work! `;
      } else {
        healthSummary += `Your health score has been declining recently. Let's focus on improving key areas. `;
      }
    }
  }
  
  // Enhanced sleep insights and recommendations
  if (avgSleep < 6) {
    healthSummary += `You're averaging only ${avgSleep.toFixed(1)} hours of sleep, which is significantly below the recommended amount. `;
    recommendations.push("Aim for 7-8 hours of sleep each night to improve overall health and cognitive function.");
    recommendations.push("Create a consistent sleep schedule, going to bed and waking up at the same time daily.");
    recommendations.push("Avoid screens and caffeine at least 1 hour before bedtime.");
  } else if (avgSleep < 7) {
    healthSummary += `You're averaging ${avgSleep.toFixed(1)} hours of sleep, which is slightly below ideal. `;
    recommendations.push("Try to increase your sleep to 7-8 hours each night for optimal health.");
    recommendations.push("Consider a relaxing bedtime routine to improve sleep quality.");
  } else if (avgSleep > 9) {
    healthSummary += `You're sleeping ${avgSleep.toFixed(1)} hours on average, which is above the typical recommendation. `;
    recommendations.push("While rest is important, excessive sleep (>9 hours) may indicate other health issues.");
    recommendations.push("Ensure your sleep quality is good, as quantity alone doesn't guarantee restful sleep.");
  } else {
    healthSummary += `You're getting a healthy ${avgSleep.toFixed(1)} hours of sleep on average. `;
    recommendations.push("Continue maintaining your excellent sleep habits.");
  }
  
  // Enhanced exercise insights and detailed recommendations
  if (avgExercise < 10) {
    healthSummary += `Your exercise level is very low at ${avgExercise.toFixed(1)} minutes per day. `;
    recommendations.push("Start with short 10-minute walks daily and gradually increase duration.");
    recommendations.push("Consider activities you enjoy - dancing, swimming, or cycling - to make exercise more appealing.");
    recommendations.push("Even brief movement breaks throughout the day can significantly improve your health.");
  } else if (avgExercise < 20) {
    healthSummary += `You're exercising ${avgExercise.toFixed(1)} minutes per day, which is below recommendations. `;
    recommendations.push("Aim to increase your activity to at least 30 minutes daily for better cardiovascular health.");
    recommendations.push("Try mixing different exercise types for better overall fitness (cardio, strength, flexibility).");
  } else if (avgExercise < 30) {
    healthSummary += `You're exercising ${avgExercise.toFixed(1)} minutes daily, which is good but could be improved. `;
    recommendations.push("You're on the right track with exercise. Consider increasing to 30-45 minutes for optimal benefits.");
  } else if (avgExercise > 90) {
    healthSummary += `You exercise extensively (${avgExercise.toFixed(1)} minutes daily). `;
    recommendations.push("Ensure you're allowing adequate recovery time between intense workouts.");
    recommendations.push("Consider incorporating rest days and varying intensity to prevent overtraining.");
  } else {
    healthSummary += `You're maintaining an excellent exercise routine with ${avgExercise.toFixed(1)} minutes per day. `;
    recommendations.push("Your exercise habits are excellent. Consider varying your routine to work different muscle groups.");
  }
  
  // Enhanced mood insights with more detailed recommendations
  if (moodScore < 2) {
    healthSummary += `Your mood has been significantly lower than optimal. `;
    recommendations.push("Consider speaking with a mental health professional about your persistent low mood.");
    recommendations.push("Practice daily mindfulness meditation to help manage negative emotions.");
    recommendations.push("Ensure you're getting enough sunlight, which can impact mood significantly.");
  } else if (moodScore < 2.5) {
    healthSummary += `Your mood has been lower than optimal. `;
    recommendations.push("Regular physical activity can help improve mood through the release of endorphins.");
    recommendations.push("Consider keeping a gratitude journal to focus on positive aspects of your life.");
  } else if (moodScore < 3.5) {
    healthSummary += `Your mood has been neutral overall. `;
    recommendations.push("Try incorporating activities you enjoy into your daily routine to boost mood.");
  } else {
    healthSummary += `Your mood has been consistently positive, which is excellent for overall wellbeing. `;
    recommendations.push("Continue the habits that are contributing to your positive outlook.");
  }
  
  // Add correlations between health factors if data supports it
  if (recentLogs.length >= 5) {
    // Sleep-mood correlation
    const highSleepLogs = recentLogs.filter(log => log.sleep_hours >= 7);
    const lowSleepLogs = recentLogs.filter(log => log.sleep_hours < 7);
    
    if (highSleepLogs.length >= 2 && lowSleepLogs.length >= 2) {
      const highSleepMood = calculateMoodScore(highSleepLogs);
      const lowSleepMood = calculateMoodScore(lowSleepLogs);
      
      if (highSleepMood - lowSleepMood > 0.5) {
        healthSummary += `We've noticed that your mood tends to be better on days when you get more sleep. `;
        recommendations.push("Prioritize sleep to help maintain a more positive mood.");
      }
    }
    
    // Exercise-mood correlation
    const highExerciseLogs = recentLogs.filter(log => log.exercise_minutes >= 30);
    const lowExerciseLogs = recentLogs.filter(log => log.exercise_minutes < 10);
    
    if (highExerciseLogs.length >= 2 && lowExerciseLogs.length >= 2) {
      const highExerciseMood = calculateMoodScore(highExerciseLogs);
      const lowExerciseMood = calculateMoodScore(lowExerciseLogs);
      
      if (highExerciseMood - lowExerciseMood > 0.5) {
        healthSummary += `Your data shows a positive relationship between exercise and mood. `;
        recommendations.push("Continue using exercise as a tool to maintain positive mental health.");
      }
    }
  }

  // If no financial data, return just health insights
  if (transactions.length === 0) {
    if (recommendations.length === 0) {
      recommendations.push("Continue maintaining your healthy lifestyle.");
      recommendations.push("Consider tracking your water intake for better hydration.");
    }
    
    return {
      user_id: userId,
      week_of: currentDate,
      health_summary: healthSummary,
      financial_summary: financialSummary,
      recommendations
    };
  }
  
  // Process financial data - we have both health and financial data at this point
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
  
  // Build financial summary
  financialSummary = "";
  
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
    user_id: userId,
    week_of: currentDate,
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
