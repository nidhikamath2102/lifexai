import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = "mongodb+srv://rajatnagarr:zJww2J53xTOqqi7l@cluster0.suzi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = 'userDatabase';
const collectionName = 'user_insights';

// GET /api/health/insights/latest?userId=123
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
    
    // Find the most recent insight for the user
    const latestInsight = await collection
      .find({ user_id: userId })
      .sort({ week_of: -1 })
      .limit(1)
      .toArray();
    
    if (latestInsight.length === 0) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json(latestInsight[0]);
  } catch (error) {
    console.error('Error fetching latest health insight:', error);
    return NextResponse.json({ error: 'Failed to fetch latest health insight' }, { status: 500 });
  } finally {
    await client.close();
  }
}
