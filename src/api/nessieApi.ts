import axios from 'axios';
// These types are used in function signatures and return types
import {
  Account,
  CreateAccountRequest,
  CreateCustomerRequest,
  CreateDepositRequest,
  CreatePurchaseRequest,
  CreateTransferRequest,
  CreateWithdrawalRequest,
  Customer,
  Deposit,
  Merchant,
  Purchase,
  Transfer,
  Withdrawal
} from '../types/nessie';

// Nessie API base URL
<<<<<<< HEAD
const API_BASE_URL = 'http://api.nessieisreal.com/';
=======
const API_BASE_URL = 'https://cool-king-ba1a.nidhikamath.workers.dev/';
>>>>>>> upstream/master

// You would typically store this in an environment variable
// For this hackathon, we'll hardcode it for simplicity
// Using the API key from the Postman collection
const API_KEY = 'a79b506a26366f4e60a98aefb3844ea0';

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

// Note: The Nessie API doesn't support direct account updates.
// Account balances are updated automatically when transactions (transfers, deposits, withdrawals) are created.

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
export const createTransfer = async (fromAccountId: string, transferData: CreateTransferRequest): Promise<Transfer> => {
  const response = await nessieApi.post<Transfer>(`/accounts/${fromAccountId}/transfers`, transferData);
  return response.data;
};

export const getAccountTransfers = async (accountId: string): Promise<Transfer[]> => {
  const response = await nessieApi.get<Transfer[]>(`/accounts/${accountId}/transfers`);
  return response.data;
};

export const getTransferById = async (transferId: string): Promise<Transfer> => {
  const response = await nessieApi.get<Transfer>(`/transfers/${transferId}`);
  return response.data;
};

export const updateTransfer = async (transferId: string, transferData: Partial<Transfer>): Promise<Transfer> => {
  const response = await nessieApi.put<Transfer>(`/transfers/${transferId}`, transferData);
  return response.data;
};

export const deleteTransfer = async (transferId: string): Promise<void> => {
  await nessieApi.delete(`/transfers/${transferId}`);
};

// API functions for deposits
export const createDeposit = async (accountId: string, depositData: CreateDepositRequest): Promise<Deposit> => {
  const response = await nessieApi.post<Deposit>(`/accounts/${accountId}/deposits`, depositData);
  return response.data;
};

export const getAccountDeposits = async (accountId: string): Promise<Deposit[]> => {
  const response = await nessieApi.get<Deposit[]>(`/accounts/${accountId}/deposits`);
  return response.data;
};

export const getDepositById = async (depositId: string): Promise<Deposit> => {
  const response = await nessieApi.get<Deposit>(`/deposits/${depositId}`);
  return response.data;
};

export const updateDeposit = async (depositId: string, depositData: Partial<Deposit>): Promise<Deposit> => {
  const response = await nessieApi.put<Deposit>(`/deposits/${depositId}`, depositData);
  return response.data;
};

export const deleteDeposit = async (depositId: string): Promise<void> => {
  await nessieApi.delete(`/deposits/${depositId}`);
};

// API functions for withdrawals
export const createWithdrawal = async (accountId: string, withdrawalData: CreateWithdrawalRequest): Promise<Withdrawal> => {
  const response = await nessieApi.post<Withdrawal>(`/accounts/${accountId}/withdrawals`, withdrawalData);
  return response.data;
};

export const getAccountWithdrawals = async (accountId: string): Promise<Withdrawal[]> => {
  const response = await nessieApi.get<Withdrawal[]>(`/accounts/${accountId}/withdrawals`);
  return response.data;
};

export const getWithdrawalById = async (withdrawalId: string): Promise<Withdrawal> => {
  const response = await nessieApi.get<Withdrawal>(`/withdrawals/${withdrawalId}`);
  return response.data;
};

export const updateWithdrawal = async (withdrawalId: string, withdrawalData: Partial<Withdrawal>): Promise<Withdrawal> => {
  const response = await nessieApi.put<Withdrawal>(`/withdrawals/${withdrawalId}`, withdrawalData);
  return response.data;
};

export const deleteWithdrawal = async (withdrawalId: string): Promise<void> => {
  await nessieApi.delete(`/withdrawals/${withdrawalId}`);
};

export default nessieApi;
