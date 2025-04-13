import { MongoClient } from 'mongodb';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const uri = "mongodb+srv://rajatnagarr:zJww2J53xTOqqi7l@cluster0.suzi3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db("userDatabase");
    const usersCollection = database.collection("users");

    const user = await usersCollection.findOne({ username, password });

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Check if user has a unique customer_id, if not generate one
    let customer_id = user.customer_id;

    console.log('User from MongoDB:', user);

    if (!customer_id) {
      // Generate a unique customer_id based on username
      customer_id = crypto.createHash('md5').update(username + Date.now()).digest('hex');
      console.log('Generated new customer_id:', customer_id);

      // Update the user with the new customer_id
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { customer_id: customer_id } }
      );
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
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  } finally {
    await client.close();
  }
}
