import axios from 'axios';
import {
  Account,
  CreateAccountRequest,
  CreateCustomerRequest,
  CreatePurchaseRequest,
  CreateTransferRequest,
  Customer,
  Merchant,
  Purchase,
  Transfer
} from '../types/nessie';

// Nessie API base URL
const API_BASE_URL = 'http://api.nessieisreal.com/';

// You would typically store this in an environment variable
// For this hackathon, we'll hardcode it for simplicity
const API_KEY = 'f666f7038dd52f8518eccc5660afb716';

// Create axios instance with base URL and default params
const nessieApi = axios.create({
  baseURL: API_BASE_URL,
  params: {
    key: API_KEY
  }
});

// API functions for customers
export const getCustomers = async (): Promise<Customer[]> => {
  const response = await nessieApi.get<Customer[]>('/customers');
  return response.data;
};

export const getCustomerById = async (customerId: string): Promise<Customer> => {
  const response = await nessieApi.get<Customer>(`/customers/${customerId}`);
  return response.data;
};

export const createCustomer = async (customerData: CreateCustomerRequest): Promise<Customer> => {
  const response = await nessieApi.post<Customer>('/customers', customerData);
  return response.data;
};

// API functions for accounts
export const getAccounts = async (): Promise<Account[]> => {
  const response = await nessieApi.get<Account[]>('/accounts');
  return response.data;
};

export const getAccountById = async (accountId: string): Promise<Account> => {
  const response = await nessieApi.get<Account>(`/accounts/${accountId}`);
  return response.data;
};

export const getCustomerAccounts = async (customerId: string): Promise<Account[]> => {
  const response = await nessieApi.get<Account[]>(`/customers/${customerId}/accounts`);
  return response.data;
};

export const createAccount = async (customerId: string, accountData: CreateAccountRequest): Promise<Account> => {
  const response = await nessieApi.post<Account>(`/customers/${customerId}/accounts`, accountData);
  return response.data;
};

// API functions for purchases
export const getAccountPurchases = async (accountId: string): Promise<Purchase[]> => {
  const response = await nessieApi.get<Purchase[]>(`/accounts/${accountId}/purchases`);
  return response.data;
};

export const getPurchaseById = async (purchaseId: string): Promise<Purchase> => {
  const response = await nessieApi.get<Purchase>(`/purchases/${purchaseId}`);
  return response.data;
};

export const createPurchase = async (accountId: string, purchaseData: CreatePurchaseRequest): Promise<Purchase> => {
  const response = await nessieApi.post<Purchase>(`/accounts/${accountId}/purchases`, purchaseData);
  return response.data;
};

// API functions for merchants
export const getMerchants = async (): Promise<Merchant[]> => {
  const response = await nessieApi.get<Merchant[]>('/merchants');
  return response.data;
};

export const getMerchantById = async (merchantId: string): Promise<Merchant> => {
  const response = await nessieApi.get<Merchant>(`/merchants/${merchantId}`);
  return response.data;
};

// API functions for transfers
export const createTransfer = async (transferData: CreateTransferRequest): Promise<Transfer> => {
  const response = await nessieApi.post<Transfer>('/transfers', transferData);
  return response.data;
};

export default nessieApi;
