import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  // Validate input
  if (!username || !email || !password) {
    return NextResponse.json(
      { error: 'Username, email, and password are required' },
      { status: 400 }
    );
  }

  const uri = "mongodb+srv://rajatnagarr:zJww2J53xTOqqi7l@cluster0.suzi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("userDatabase");
    const usersCollection = database.collection("users");

    // Check if username already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
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

    await usersCollection.insertOne(newUser);

    const responseData = {
      username: newUser.username,
      customer_id: newUser.customer_id
    };

    console.log('Signup response data:', responseData);

    return NextResponse.json(responseData);
  } catch (err) {
    console.error('Signup API error:', err);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
