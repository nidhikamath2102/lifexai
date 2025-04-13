import axios from 'axios';

interface LoginResponse {
  username: string;
  customer_id: string;
}

interface SignupResponse {
  username: string;
  customer_id: string;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  // Add other customer fields as needed
}

export const authenticateUser = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    // Connect to MongoDB Atlas and authenticate
    const response = await axios.post('/api/auth/login', { username, password });
    return response.data;
  } catch (err) {
    console.error('Authentication error:', err);
    throw new Error('Authentication failed');
  }
};

export const registerUser = async (username: string, email: string, password: string): Promise<SignupResponse> => {
  try {
    // Connect to MongoDB Atlas and register new user
    const response = await axios.post('/api/auth/signup', { username, email, password });
    return response.data;
  } catch (err) {
    console.error('Registration error:', err);
    throw new Error('Registration failed');
  }
};

export const fetchCustomerById = async (customerId: string): Promise<Customer> => {
  try {
    const response = await axios.get(`/api/customers/${customerId}`);
    return response.data;
  } catch (err) {
    console.error('Customer fetch error:', err);
    throw new Error('Failed to fetch customer data');
  }
};
