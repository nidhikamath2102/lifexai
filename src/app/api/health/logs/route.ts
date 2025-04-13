import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

// MongoDB connection string
const uri = "mongodb+srv://rajatnagarr:zJww2J53xTOqqi7l@cluster0.suzi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = 'userDatabase';
const collectionName = 'health_logs';

// GET /api/health/logs?userId=123
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
    
    // Find all health logs for the user, sorted by date (newest first)
    const logs = await collection
      .find({ user_id: userId })
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(logs);
  } catch (error) {
    console.error('Error fetching health logs:', error);
    return NextResponse.json({ error: 'Failed to fetch health logs' }, { status: 500 });
  } finally {
    await client.close();
  }
}

// POST /api/health/logs
export async function POST(request: NextRequest) {
  try {
    const healthLog = await request.json();
    
    // Validate required fields
    if (!healthLog.user_id || !healthLog.date || !healthLog.mood) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Insert the health log
    const result = await collection.insertOne({
      ...healthLog,
      date: new Date(healthLog.date).toISOString(),
      created_at: new Date().toISOString(),
      // Ensure all fields from the HealthLog interface are handled
      mood: healthLog.mood,
      sleep_hours: healthLog.sleep_hours || 0,
      meals: healthLog.meals || 0,
      exercise_minutes: healthLog.exercise_minutes || 0,
      symptoms: healthLog.symptoms || '',
      location: healthLog.location || null
    });
    
    // Return the inserted health log with its ID
    return NextResponse.json({
      ...healthLog,
      _id: result.insertedId.toString()
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving health log:', error);
    return NextResponse.json({ error: 'Failed to save health log' }, { status: 500 });
  } finally {
    await client.close();
  }
}
