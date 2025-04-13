import { useAuth } from '@/contexts/AuthContext';
import { useAuthModal } from '@/components/auth/AuthModalController';
import * as nessieApi from './nessieApi';
import {
  Account,
  CreatePurchaseRequest,
  CreateTransferRequest,
  Customer,
  Merchant,
  Purchase,
  Transfer
} from '../types/nessie';

/**
 * This file provides wrapper functions around the Nessie API functions
 * that check authentication before making API calls.
 * 
 * These functions should be used in React components with the useAuthNessieApi hook.
 */

export function useAuthNessieApi() {
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();

  /**
   * Checks if the user is authenticated and opens the auth modal if not.
   * Returns true if authenticated, false otherwise.
   */
  const checkAuth = (): boolean => {
    if (!isAuthenticated) {
      openAuthModal();
      return false;
    }
    return true;
  };

  // Wrapped API functions for customers
  const getCustomerById = async (customerId: string): Promise<Customer | null> => {
    if (!checkAuth()) return null;
    return nessieApi.getCustomerById(customerId);
  };

  // Wrapped API functions for accounts
  const getCustomerAccounts = async (customerId: string): Promise<Account[]> => {
    if (!checkAuth()) return [];
    return nessieApi.getCustomerAccounts(customerId);
  };

  const getAccountById = async (accountId: string): Promise<Account | null> => {
    if (!checkAuth()) return null;
    return nessieApi.getAccountById(accountId);
  };

  // Wrapped API functions for purchases
  const getAccountPurchases = async (accountId: string): Promise<Purchase[]> => {
    if (!checkAuth()) return [];
    return nessieApi.getAccountPurchases(accountId);
  };

  const createPurchase = async (accountId: string, purchaseData: CreatePurchaseRequest): Promise<Purchase | null> => {
    if (!checkAuth()) return null;
    return nessieApi.createPurchase(accountId, purchaseData);
  };

  // Wrapped API functions for merchants
  const getMerchants = async (): Promise<Merchant[]> => {
    if (!checkAuth()) return [];
    return nessieApi.getMerchants();
  };

  // Wrapped API functions for transfers
  const createTransfer = async (fromAccountId: string, transferData: CreateTransferRequest): Promise<Transfer | null> => {
    if (!checkAuth()) return null;
    return nessieApi.createTransfer(fromAccountId, transferData);
  };

  const getAccountTransfers = async (accountId: string): Promise<Transfer[]> => {
    if (!checkAuth()) return [];
    return nessieApi.getAccountTransfers(accountId);
  };

  return {
    getCustomerById,
    getCustomerAccounts,
    getAccountById,
    getAccountPurchases,
    createPurchase,
    getMerchants,
    createTransfer,
    getAccountTransfers
  };
}
