'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authenticateUser, registerUser } from '@/api/mongoDbApi';
import { getCustomerAccounts } from '@/api/nessieApi';
import { Account } from '@/types/nessie';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  customerId: string | null;
  accounts: Account[];
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Load auth state from localStorage on initial render
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedCustomerId = localStorage.getItem('customerId');
    
    if (storedUsername && storedCustomerId) {
      setUsername(storedUsername);
      setCustomerId(storedCustomerId);
      setIsAuthenticated(true);
      
      // Fetch accounts for the stored customer ID
      getCustomerAccounts(storedCustomerId)
        .then(customerAccounts => {
          setAccounts(customerAccounts);
        })
        .catch(error => {
          console.error('Failed to fetch customer accounts on init:', error);
          setAccounts([]);
        });
    }
  }, []);

  // Save auth state to localStorage when it changes
  useEffect(() => {
    if (isAuthenticated && username && customerId) {
      localStorage.setItem('username', username);
      localStorage.setItem('customerId', customerId);
    } else {
      localStorage.removeItem('username');
      localStorage.removeItem('customerId');
    }
  }, [isAuthenticated, username, customerId]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authenticateUser(username, password);
      setUsername(response.username);
      setCustomerId(response.customer_id);
      setIsAuthenticated(true);

      // Fetch customer accounts using the customer_id from Nessie API
      try {
        console.log('Fetching accounts for customer_id:', response.customer_id);
        const customerAccounts = await getCustomerAccounts(response.customer_id);
        console.log('Fetched accounts:', customerAccounts);
        setAccounts(customerAccounts);
      } catch (accountsError) {
        console.error('Failed to fetch customer accounts:', accountsError);
        // Continue with login even if accounts fetch fails
        setAccounts([]);
      }
    } catch (error) {
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      const response = await registerUser(username, email, password);
      setUsername(response.username);
      setCustomerId(response.customer_id);
      setIsAuthenticated(true);

      // New users won't have accounts yet, so initialize with empty array
      setAccounts([]);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUsername(null);
    setCustomerId(null);
    setAccounts([]);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      username, 
      customerId, 
      accounts, 
      login, 
      signup,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
