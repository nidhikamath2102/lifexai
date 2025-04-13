import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  let client;
  
  try {
    // Parse request body
    const { username, password } = await request.json();
    console.log('Login attempt for username:', username);
    
    // MongoDB connection string from environment variables
    const uri = process.env.MONGODB_URI || "";
    
    // Create MongoDB client
    client = new MongoClient(uri);
    
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    try {
      await client.connect();
      console.log('Connected to MongoDB successfully');
    } catch (connectError) {
      console.error('MongoDB connection error:', connectError);
      
      // If we can't connect to MongoDB, use a mock user for demo purposes
      if (username === 'demo' && password === 'demo') {
        console.log('Using mock user for demo');
        return NextResponse.json({
          username: 'demo',
          customer_id: process.env.DEMO_USER_ID || '66235a8f9683f20dd51899d5'
        });
      }
      
      throw connectError;
    }
    
    // Get database and collection
    const database = client.db(process.env.MONGODB_DB || "userDatabase");
    const usersCollection = database.collection("users");
    
    // Find user
    console.log('Finding user in database...');
    const user = await usersCollection.findOne({ username, password });
    
    if (!user) {
      console.log('User not found or invalid credentials');
      
      // If credentials are invalid but username is 'demo', use mock user for demo purposes
      if (username === 'demo' && password === 'demo') {
        console.log('Using mock user for demo');
        return NextResponse.json({
          username: 'demo',
          customer_id: process.env.DEMO_USER_ID || '66235a8f9683f20dd51899d5'
        });
      }
      
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    
    console.log('User found:', user);
    
    // Check if user has a unique customer_id, if not generate one
    let customer_id = user.customer_id;
    
    if (!customer_id) {
      // Generate a unique customer_id based on username
      customer_id = crypto.createHash('md5').update(username + Date.now()).digest('hex');
      console.log('Generated new customer_id:', customer_id);
      
      // Update the user with the new customer_id
      try {
        await usersCollection.updateOne(
          { _id: user._id },
          { $set: { customer_id: customer_id } }
        );
        console.log('Updated user with new customer_id');
      } catch (updateError) {
        console.error('Error updating user with customer_id:', updateError);
        // Continue with the generated customer_id even if update fails
      }
    } else {
      console.log('Using existing customer_id:', customer_id);
    }
    
    const responseData = {
      username: user.username,
      customer_id: customer_id
    };
    
    console.log('Login response data:', responseData);
    
    return NextResponse.json(responseData);
  } catch (err) {
    console.error('Login API error:', err);
    
    // Provide more detailed error information
    const errorMessage = err instanceof Error 
      ? `${err.name}: ${err.message}` 
      : 'Unknown error';
      
    console.error('Detailed error:', errorMessage);
    
    if (err instanceof Error && err.stack) {
      console.error('Error stack:', err.stack);
    }
    
    return NextResponse.json({ 
      error: 'Authentication failed',
      details: errorMessage
    }, { status: 500 });
  } finally {
    // Close MongoDB connection if client exists and is connected
    if (client) {
      try {
        await client.close();
        console.log('MongoDB connection closed');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }
  }
}
