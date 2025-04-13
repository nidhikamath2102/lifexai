import { NextRequest, NextResponse } from 'next/server';
import { getCustomerAccounts, getAccountPurchases } from '@/api/nessieApi';
import { getUserHealthLogs, getLatestHealthInsight } from '@/api/healthApi';
import { categorizePurchase, CategorizedPurchase } from '@/utils/financeUtils';
import { calculateHealthScore } from '@/utils/healthUtils';
import { Purchase } from '@/types/nessie';

// Define the structure of the chat message
interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
}

// Define the structure of the request body
interface RequestBody {
  message: string;
  userId: string;
  history: ChatMessage[];
}

// POST /api/chatbot
export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json();
    const { message, userId, history } = body;
    
    // Process the message and generate a response
    const response = await generateResponse(message, userId, history);
    
    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in chatbot API:', error);
    return NextResponse.json(
      { error: 'Failed to process chatbot request' },
      { status: 500 }
    );
  }
}

// Function to generate a response based on the user's message
async function generateResponse(message: string, userId: string, history: ChatMessage[]): Promise<string> {
  // Convert message to lowercase for easier matching
  const lowerMessage = message.toLowerCase();
  
  // Check if there are previous messages about this topic in the history
  const relevantHistory = history.filter(msg => 
    msg.sender === 'user' && 
    msg.text.toLowerCase().includes(message.toLowerCase().split(' ')[0])
  );
  
  // If there are relevant messages in history, we can provide a more contextual response
  const isFollowUpQuestion = relevantHistory.length > 0;
  
  // Add a prefix for follow-up questions to make the response more conversational
  let responsePrefix = '';
  if (isFollowUpQuestion) {
    responsePrefix = 'Based on our conversation, ';
  }
  
  // Check if the message is about spending
  if (
    lowerMessage.includes('spend') || 
    lowerMessage.includes('spent') || 
    lowerMessage.includes('spending') ||
    lowerMessage.includes('expenses') ||
    lowerMessage.includes('transactions') ||
    lowerMessage.includes('purchases')
  ) {
    const response = await handleSpendingQuery(lowerMessage, userId);
    return isFollowUpQuestion ? `${responsePrefix}${response}` : response;
  }
  
  // Check if the message is about health
  if (
    lowerMessage.includes('health') ||
    lowerMessage.includes('score') ||
    lowerMessage.includes('mood') ||
    lowerMessage.includes('sleep') ||
    lowerMessage.includes('exercise')
  ) {
    const response = await handleHealthQuery(lowerMessage, userId);
    return isFollowUpQuestion ? `${responsePrefix}${response}` : response;
  }
  
  // Check if the message is about how to use the app
  if (
    lowerMessage.includes('how to') ||
    lowerMessage.includes('how do i') ||
    lowerMessage.includes('help me') ||
    lowerMessage.includes('guide') ||
    lowerMessage.includes('tutorial')
  ) {
    const response = handleHowToQuery(lowerMessage);
    return isFollowUpQuestion ? `${responsePrefix}${response}` : response;
  }
  
  // Default response for unrecognized queries
  return "I'm not sure how to answer that. You can ask me about your spending patterns, health insights, or how to use the app. For example, try asking 'What did I spend the most on?' or 'How's my health score?'";
}

// Handle queries about spending
async function handleSpendingQuery(message: string, userId: string): Promise<string> {
  try {
    // Get all accounts for the user
    const accounts = await getCustomerAccounts(userId);
    
    if (!accounts || accounts.length === 0) {
      return "I couldn't find any accounts for you. Please make sure you're logged in.";
    }
    
    // Get all purchases for all accounts
    let allPurchases: Purchase[] = [];
    for (const account of accounts) {
      const purchases = await getAccountPurchases(account._id);
      allPurchases = [...allPurchases, ...purchases];
    }
    
    if (allPurchases.length === 0) {
      return "I couldn't find any transactions in your accounts. Try making some purchases first!";
    }
    
    // Categorize purchases
    const categorizedPurchases: CategorizedPurchase[] = allPurchases.map(purchase => categorizePurchase(purchase));
    
    // Handle specific spending queries
    if (message.includes('most') || message.includes('highest')) {
      // Find the category with the highest spending
      const categoryTotals = categorizedPurchases.reduce((totals, purchase) => {
        const category = purchase.category || 'Uncategorized';
        totals[category] = (totals[category] || 0) + purchase.amount;
        return totals;
      }, {} as Record<string, number>);
      
      // Find the category with the highest total
      let highestCategory = '';
      let highestAmount = 0;
      
      for (const [category, amount] of Object.entries(categoryTotals)) {
        if (amount > highestAmount) {
          highestCategory = category;
          highestAmount = amount;
        }
      }
      
      return `Based on your transaction history, you spent the most on ${highestCategory} with a total of $${highestAmount.toFixed(2)}.`;
    }
    
    if (message.includes('recent') || message.includes('latest')) {
      // Sort purchases by date (newest first)
      const sortedPurchases = [...categorizedPurchases].sort(
        (a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()
      );
      
      const latestPurchase = sortedPurchases[0];
      
      return `Your most recent transaction was $${latestPurchase.amount.toFixed(2)} at ${latestPurchase.merchantName || 'a merchant'} on ${new Date(latestPurchase.purchase_date).toLocaleDateString()} for ${latestPurchase.description}.`;
    }
    
    if (message.includes('recurring') || message.includes('subscription')) {
      // This is a simplified approach to identify recurring expenses
      // In a real app, you would use more sophisticated algorithms
      
      // Group purchases by description and count occurrences
      const descriptionCounts = categorizedPurchases.reduce((counts, purchase) => {
        const key = purchase.description.toLowerCase();
        counts[key] = (counts[key] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
      
      // Find descriptions that appear multiple times (potential recurring expenses)
      const recurringDescriptions = Object.entries(descriptionCounts)
        .filter(([, count]) => count > 1)
        .map(([description]) => description);
      
      if (recurringDescriptions.length === 0) {
        return "I couldn't identify any recurring expenses in your transaction history.";
      }
      
      // Find the amounts for these recurring expenses
      const recurringExpenses = recurringDescriptions.map(description => {
        const matchingPurchases = categorizedPurchases.filter(
          p => p.description.toLowerCase() === description
        );
        
        // Use the most recent amount
        const mostRecent = matchingPurchases.sort(
          (a, b) => new Date(b.purchase_date).getTime() - new Date(a.purchase_date).getTime()
        )[0];
        
        return {
          description: mostRecent.description,
          amount: mostRecent.amount,
          count: descriptionCounts[description.toLowerCase()]
        };
      });
      
      // Format the response
      const expensesText = recurringExpenses
        .map(e => `${e.description} ($${e.amount.toFixed(2)}, ${e.count} occurrences)`)
        .join(', ');
      
      return `I found these potential recurring expenses in your transaction history: ${expensesText}.`;
    }
    
    // General spending overview
    const totalSpent = categorizedPurchases.reduce((total, purchase) => total + purchase.amount, 0);
    const averageTransaction = totalSpent / categorizedPurchases.length;
    
    return `Based on your transaction history, you've spent a total of $${totalSpent.toFixed(2)} across ${categorizedPurchases.length} transactions, with an average of $${averageTransaction.toFixed(2)} per transaction.`;
  } catch (error) {
    console.error('Error handling spending query:', error);
    return "I'm having trouble accessing your financial data right now. Please try again later.";
  }
}

// Handle queries about health
async function handleHealthQuery(message: string, userId: string): Promise<string> {
  try {
    // Get health logs for the user
    const healthLogs = await getUserHealthLogs(userId);
    
    if (!healthLogs || healthLogs.length === 0) {
      return "I couldn't find any health data for you. Try completing a health check-in first!";
    }
    
    // Handle specific health queries
    if (message.includes('score') || message.includes('overall')) {
      const healthScore = calculateHealthScore(healthLogs);
      
      let interpretation = '';
      if (healthScore >= 80) {
        interpretation = "That's excellent! Keep up the good work.";
      } else if (healthScore >= 60) {
        interpretation = "That's good, but there's room for improvement.";
      } else {
        interpretation = "There are some areas where you could improve your health habits.";
      }
      
      return `Your current health score is ${healthScore}/100. ${interpretation}`;
    }
    
    if (message.includes('mood') || message.includes('feeling')) {
      // Calculate mood distribution
      const moodCounts = healthLogs.reduce((counts, log) => {
        counts[log.mood] = (counts[log.mood] || 0) + 1;
        return counts;
      }, {} as Record<string, number>);
      
      // Find the most common mood
      let mostCommonMood = '';
      let highestCount = 0;
      
      for (const [mood, count] of Object.entries(moodCounts)) {
        if (count > highestCount) {
          mostCommonMood = mood;
          highestCount = count;
        }
      }
      
      const percentage = (highestCount / healthLogs.length) * 100;
      
      return `Based on your health logs, your most common mood has been "${mostCommonMood}" (${percentage.toFixed(0)}% of the time).`;
    }
    
    if (message.includes('sleep')) {
      // Calculate average sleep hours
      const totalSleep = healthLogs.reduce((total, log) => total + log.sleep_hours, 0);
      const averageSleep = totalSleep / healthLogs.length;
      
      let interpretation = '';
      if (averageSleep >= 8) {
        interpretation = "That's great! You're getting the recommended amount of sleep.";
      } else if (averageSleep >= 7) {
        interpretation = "That's close to the recommended amount, but try to get a bit more if you can.";
      } else {
        interpretation = "That's below the recommended amount. Try to aim for 7-9 hours of sleep per night.";
      }
      
      return `You've been averaging ${averageSleep.toFixed(1)} hours of sleep per night. ${interpretation}`;
    }
    
    if (message.includes('exercise')) {
      // Calculate average exercise minutes
      const totalExercise = healthLogs.reduce((total, log) => total + log.exercise_minutes, 0);
      const averageExercise = totalExercise / healthLogs.length;
      
      let interpretation = '';
      if (averageExercise >= 30) {
        interpretation = "That's great! You're meeting the recommended daily exercise goal.";
      } else if (averageExercise >= 15) {
        interpretation = "That's a good start, but try to aim for at least 30 minutes per day.";
      } else {
        interpretation = "That's below the recommended amount. Try to incorporate more physical activity into your day.";
      }
      
      return `You've been averaging ${averageExercise.toFixed(0)} minutes of exercise per day. ${interpretation}`;
    }
    
    // Get the latest health insight
    const latestInsight = await getLatestHealthInsight(userId);
    
    if (latestInsight) {
      return `Here's your latest health insight: ${latestInsight.health_summary}`;
    }
    
    // General health overview
    return `Based on your health logs, you've recorded ${healthLogs.length} check-ins. Your most recent mood was "${healthLogs[0].mood}" with ${healthLogs[0].sleep_hours} hours of sleep and ${healthLogs[0].exercise_minutes} minutes of exercise.`;
  } catch (error) {
    console.error('Error handling health query:', error);
    return "I'm having trouble accessing your health data right now. Please try again later.";
  }
}

// Handle queries about how to use the app
function handleHowToQuery(message: string): string {
  if (message.includes('upload') && message.includes('receipt')) {
    return "To upload a receipt, go to the Finance page and look for the 'Upload Receipt' section. You can either drag and drop an image file or click to select one from your device. Our AI will automatically extract the merchant, amount, and other details from the receipt.";
  }
  
  if (message.includes('transfer') || (message.includes('send') && message.includes('money'))) {
    return "To transfer money between accounts, go to the Finance page and find your accounts. Click on the account you want to transfer from, then look for the 'Transfer' button. Select the destination account and enter the amount you want to transfer.";
  }
  
  if (message.includes('pay') && message.includes('bill')) {
    return "To pay a bill, go to the Finance page and find your accounts. Click on the account you want to use for payment, then look for the 'Pay Bill' button. Select the bill you want to pay and enter the amount.";
  }
  
  if (message.includes('health') && (message.includes('check') || message.includes('log'))) {
    return "To complete a health check-in, go to the Health page and look for the 'Daily Check-In' section. You'll be asked about your mood, sleep, meals, exercise, and any symptoms you might be experiencing.";
  }
  
  if (message.includes('financial') && message.includes('health')) {
    return "Your Financial Health Score is calculated based on your spending patterns, savings rate, and other financial behaviors. To view it, go to the Finance page and look for the 'Financial Health Score' card.";
  }
  
  // General help
  return "LifexAI helps you track both your financial and health data. You can upload receipts, transfer money, pay bills, complete health check-ins, and get personalized insights. What specific feature would you like to learn more about?";
}
