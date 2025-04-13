import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { generateHealthFinanceInsights } from '@/utils/healthUtils';
import { categorizePurchase, CategorizedPurchase } from '@/utils/financeUtils';
import { Purchase, Merchant } from '@/types/nessie';
import { HealthLog } from '@/api/healthApi';

// MongoDB connection string from environment variables
const uri = "mongodb+srv://rajatnagarr:PvXjpUN8p40XO3IA@cluster0.suzi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = 'userDatabase';

// const healthLogsCollection = 'health_logs'; // Not used at this level
const insightsCollection = 'user_insights';

// GET /api/health/insights?userId=123
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(insightsCollection);
    
    // Find all insights for the user, sorted by week (newest first)
    const insights = await collection
      .find({ user_id: userId })
      .sort({ week_of: -1 })
      .toArray();
    
    return NextResponse.json(insights);
  } catch (error) {
    console.error('Error fetching health insights:', error);
    return NextResponse.json({ error: 'Failed to fetch health insights' }, { status: 500 });
  } finally {
    await client.close();
  }
}

// POST /api/health/insights
// This endpoint generates new insights based on health logs and financial data
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    await client.connect();
    const db = client.db(dbName);
    
    // Get health logs
    const healthLogsCollection = db.collection('health_logs');
    const healthLogsData = await healthLogsCollection
      .find({ user_id: userId })
      .sort({ date: -1 })
      .limit(30) // Last 30 days
      .toArray();
    
    // Convert MongoDB documents to HealthLog type
    const healthLogs: HealthLog[] = healthLogsData.map(log => ({
      _id: log._id.toString(),
      user_id: log.user_id,
      date: log.date,
      mood: log.mood,
      sleep_hours: log.sleep_hours,
      meals: log.meals,
      exercise_minutes: log.exercise_minutes,
      symptoms: log.symptoms,
      location: log.location
    }));
    
    // Get financial transactions
    const purchasesCollection = db.collection('purchases');
    const merchants = await db.collection('merchants').find({}).toArray();
    
    const purchasesData = await purchasesCollection
      .find({ user_id: userId })
      .sort({ purchase_date: -1 })
      .limit(100) // Last 100 transactions
      .toArray();
    
    // Convert MongoDB documents to Purchase type and categorize
    const categorizedPurchases: CategorizedPurchase[] = purchasesData.map(p => {
      const purchase = {
        _id: p._id.toString(),
        type: p.type,
        merchant_id: p.merchant_id,
        payer_id: p.payer_id,
        purchase_date: p.purchase_date,
        amount: p.amount,
        status: p.status,
        medium: p.medium,
        description: p.description
      } as Purchase;
      
      const merchantDoc = merchants.find(m => m._id.toString() === purchase.merchant_id);
      const merchant = merchantDoc ? {
        _id: merchantDoc._id.toString(),
        name: merchantDoc.name,
        category: merchantDoc.category,
        address: merchantDoc.address,
        geocode: merchantDoc.geocode
      } as Merchant : undefined;
      
      return categorizePurchase(purchase, merchant);
    });
    
    // Generate insights
    const insight = generateHealthFinanceInsights(healthLogs, categorizedPurchases);
    
    // Save the insight
    const insightsCollection = db.collection('user_insights');
    const insightToSave = {
      user_id: insight.user_id,
      week_of: insight.week_of,
      health_summary: insight.health_summary,
      financial_summary: insight.financial_summary,
      recommendations: insight.recommendations,
      created_at: new Date().toISOString()
    };
    
    const result = await insightsCollection.insertOne(insightToSave);
    
    // Return the generated insight
    return NextResponse.json({
      ...insight,
      _id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error generating health insights:', error);
    return NextResponse.json({ error: 'Failed to generate health insights' }, { status: 500 });
  } finally {
    await client.close();
  }
}
