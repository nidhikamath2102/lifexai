import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  let client;
  
  try {
    // Parse request body
    const { username, email, password } = await request.json();
    console.log('Signup attempt for username:', username);
    
    // Validate input
    if (!username || !email || !password) {
      console.log('Missing required fields');
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }
    
    // For demo purposes, if username is 'demo', return a mock response
    if (username === 'demo') {
      console.log('Creating mock user for demo');
      return NextResponse.json({
        username: 'demo',
        customer_id: process.env.DEMO_USER_ID || '66235a8f9683f20dd51899d5'
      });
    }
    
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
      
      // For demo purposes, create a mock user
      console.log('Using mock user creation for demo');
      const mockCustomerId = crypto.createHash('md5').update(username + Date.now()).digest('hex');
      
      return NextResponse.json({
        username,
        customer_id: mockCustomerId
      });
    }
    
    // Get database and collection
    const database = client.db(process.env.MONGODB_DB || "userDatabase");
    const usersCollection = database.collection("users");
    
    // Check if username already exists
    console.log('Checking if username already exists...');
    const existingUser = await usersCollection.findOne({ username });
    
    if (existingUser) {
      console.log('Username already exists');
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }
    
    // Generate a unique customer_id
    const customer_id = crypto.createHash('md5').update(username + Date.now()).digest('hex');
    console.log('Generated new customer_id:', customer_id);
    
    // Create new user
    const newUser = {
      username,
      email,
      password, // In a real app, you would hash this password
      customer_id,
      createdAt: new Date()
    };
    
    console.log('Creating new user...');
    await usersCollection.insertOne(newUser);
    console.log('User created successfully');
    
    const responseData = {
      username: newUser.username,
      customer_id: newUser.customer_id
    };
    
    console.log('Signup response data:', responseData);
    
    return NextResponse.json(responseData);
  } catch (err) {
    console.error('Signup API error:', err);
    
    // Provide more detailed error information
    const errorMessage = err instanceof Error 
      ? `${err.name}: ${err.message}` 
      : 'Unknown error';
      
    console.error('Detailed error:', errorMessage);
    
    if (err instanceof Error && err.stack) {
      console.error('Error stack:', err.stack);
    }
    
    return NextResponse.json({ 
      error: 'Registration failed',
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
