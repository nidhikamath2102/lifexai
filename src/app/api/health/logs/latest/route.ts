import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection from environment variables
const uri = "mongodb+srv://rajatnagarr:PvXjpUN8p40XO3IA@cluster0.suzi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri);
const dbName = 'userDatabase';
const collectionName = 'health_logs';

// GET /api/health/logs/latest?userId=123
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }
  
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Find the most recent health log for the user
    const latestLog = await collection
      .find({ user_id: userId })
      .sort({ date: -1 })
      .limit(1)
      .toArray();
    
    if (latestLog.length === 0) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(latestLog[0]);
  } catch (error) {
    console.error('Error fetching latest health log:', error);
    return NextResponse.json({ error: 'Failed to fetch latest health log' }, { status: 500 });
  } finally {
    await client.close();
  }
}
