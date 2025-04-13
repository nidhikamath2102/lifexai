// Customer types
export interface Customer {
  _id: string;
  first_name: string;
  last_name: string;
  address: {
    street_number: string;
    street_name: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface CreateCustomerRequest {
  first_name: string;
  last_name: string;
  address: {
    street_number: string;
    street_name: string;
    city: string;
    state: string;
    zip: string;
  };
}

// Account types
export interface Account {
  _id: string;
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
  account_number: string;
  customer_id: string;
}

export interface CreateAccountRequest {
  type: string;
  nickname: string;
  rewards: number;
  balance: number;
}

// Purchase types
export interface Purchase {
  _id: string;
  type: string;
  merchant_id: string;
  payer_id: string;
  purchase_date: string;
  amount: number;
  status: string;
  medium: string;
  description: string;
}

export interface CreatePurchaseRequest {
  merchant_id: string;
  medium: string;
  purchase_date: string;
  amount: number;
  description: string;
}

// Merchant types
export interface Merchant {
  _id: string;
  name: string;
  category: string;
  address: {
    street_number: string;
    street_name: string;
    city: string;
    state: string;
    zip: string;
  };
  geocode: {
    lat: number;
    lng: number;
  };
}

// Transfer types
export interface Transfer {
  _id: string;
  type: string;
  transaction_date: string;
  status: string;
  medium: string;
  payer_id: string;
  payee_id: string;
  amount: number;
  description: string;
}

export interface CreateTransferRequest {
  medium: string;
  payee_id: string;
  amount: number;
  transaction_date: string;
  description: string;
}

// Deposit types
export interface Deposit {
  _id: string;
  type: string;
  transaction_date: string;
  status: string;
  medium: string;
  payee_id: string;
  amount: number;
  description: string;
}

export interface CreateDepositRequest {
  medium: string;
  transaction_date: string;
  status: string;
  amount: number;
  description: string;
}

// Withdrawal types
export interface Withdrawal {
  _id: string;
  type: string;
  transaction_date: string;
  status: string;
  medium: string;
  payer_id: string;
  amount: number;
  description: string;
}

export interface CreateWithdrawalRequest {
  medium: string;
  transaction_date: string;
  status: string;
  amount: number;
  description: string;
}

// API response types
export interface ApiResponse<T> {
  data: T;
  code: number;
  message: string;
}
