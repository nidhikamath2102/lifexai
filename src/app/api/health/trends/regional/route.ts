import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// MongoDB connection string
const uri = "mongodb+srv://rajatnagarr:zJww2J53xTOqqi7l@cluster0.suzi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = 'userDatabase';
const collectionName = 'health_logs';

// GET /api/health/trends/regional
export async function GET(request: NextRequest) {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    
    // Aggregate symptoms by region (simplified for hackathon)
    // In a real app, we would use geospatial queries and more sophisticated aggregation
    const symptomAggregation = await collection.aggregate([
      {
        $match: {
          symptoms: { $exists: true, $ne: "" },
          date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() } // Last 30 days
        }
      },
      {
        $group: {
          _id: "$symptoms",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]).toArray();
    
    // If we don't have enough real data, add some mock data for the hackathon demo
    const regionalTrends = symptomAggregation.length > 0 ? symptomAggregation : [
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
    
    return NextResponse.json(regionalTrends);
  } catch (error) {
    console.error('Error fetching regional health trends:', error);
    return NextResponse.json({ error: 'Failed to fetch regional health trends' }, { status: 500 });
  } finally {
    await client.close();
  }
}
