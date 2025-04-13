# Nessie API Postman Collection for LifexAI

This Postman collection provides a complete set of requests for creating and managing financial data for a single customer (Nidhi) in the Capital One Nessie API. The collection is designed to be used with the LifexAI application, but can also be used independently to create test data in the Nessie API.

## Prerequisites

1. [Postman](https://www.postman.com/downloads/) installed on your computer
2. A Capital One Nessie API key (already included in the collection)

## Getting Started

1. Import the collection into Postman:
   - Open Postman
   - Click "Import" in the top left corner
   - Select the `Nessie_API_Collection.json` file
   - Click "Import"

2. The collection includes the API key as a variable, so you don't need to add it manually.

## Using the Collection

The collection is organized in a step-by-step manner, with each request building on the previous ones. Follow these steps to create a complete set of financial data for Nidhi:

### Step 1: Create Customer and Accounts

1. Run the "1. Create Customer (Nidhi)" request
   - This will create a customer profile for Nidhi Sharma
   - **Important**: Copy the `_id` value from the response and set it as the `customer_id` variable in the collection variables

2. Run the "2. Create Checking Account" request
   - This will create a checking account for Nidhi
   - **Important**: Copy the `_id` value from the response and set it as the `checking_account_id` variable

3. Run the "3. Create Savings Account" request
   - This will create a savings account for Nidhi
   - **Important**: Copy the `_id` value from the response and set it as the `savings_account_id` variable

4. Run the "4. Create Credit Card Account" request
   - This will create a credit card account for Nidhi
   - **Important**: Copy the `_id` value from the response and set it as the `credit_card_id` variable

### Step 2: Get Merchants

5. Run the "5. Get All Merchants" request
   - This will retrieve all merchants from the Nessie API
   - **Important**: Select 6 merchant IDs from the response and set them as the following variables:
     - `merchant_id_1`: A grocery store merchant
     - `merchant_id_2`: A coffee shop merchant
     - `merchant_id_3`: A gas station merchant
     - `merchant_id_4`: An online retailer merchant
     - `merchant_id_5`: A streaming service merchant
     - `merchant_id_6`: A pharmacy merchant

### Step 3: Create Purchases

6. Run the purchase creation requests (6-17)
   - These will create various purchases for Nidhi's checking and credit card accounts
   - The purchases include:
     - Grocery shopping
     - Coffee purchases
     - Gas purchases
     - Online shopping
     - Subscription services
     - Pharmacy purchases
     - Electronics purchases
     - Party supplies

### Step 4: Create Transfers

7. Run the transfer creation requests (18-20)
   - These will create transfers between Nidhi's accounts
   - The transfers include:
     - Monthly savings transfers
     - Credit card payments

### Step 5: Create Deposits and Withdrawals

8. Run the deposit and withdrawal creation requests (21-23)
   - These will create deposits and withdrawals for Nidhi's checking account
   - The transactions include:
     - Payroll deposits
     - ATM withdrawals

### Step 6: View the Data

9. Run the GET requests (24-28)
   - These will retrieve the data you've created
   - You can use these requests to verify that everything was created correctly

## Setting Environment Variables

To make it easier to use the collection, you should set the IDs as environment variables after each creation request. Here's how:

1. After running a creation request, copy the `_id` value from the response
2. Click on the "Environment quick look" button (the eye icon) in the top right corner of Postman
3. Click "Edit" next to the collection variables
4. Find the appropriate variable (e.g., `customer_id`, `checking_account_id`, etc.)
5. Paste the ID into the "Current Value" field
6. Click "Save"

## Data Structure

The collection creates the following data structure:

- **Customer**: Nidhi Sharma
  - **Checking Account**: Primary checking account with a balance of $5,000.75
    - **Purchases**: Groceries, coffee, gas, party supplies
    - **Transfers**: To savings account, to credit card
    - **Deposits**: Payroll deposits
    - **Withdrawals**: ATM withdrawals
  - **Savings Account**: Emergency fund with a balance of $15,000.50
    - **Transfers**: From checking account
  - **Credit Card**: Rewards card with a balance of -$2,500.25
    - **Purchases**: Online shopping, subscriptions, pharmacy, electronics
    - **Transfers**: From checking account (payments)

## Financial Patterns

The collection creates data that demonstrates several financial patterns:

- **Recurring Expenses**: Coffee purchases, grocery shopping, monthly subscriptions
- **Regular Income**: Bi-weekly payroll deposits
- **Savings Habits**: Monthly transfers to savings account
- **Debt Management**: Credit card payments
- **Spending Anomalies**: Large purchases (smartphone, party supplies)

These patterns can be used to test the financial analysis features of the LifexAI application, such as:

- Spending by category
- Spending trends over time
- Anomaly detection
- Recurring expense identification
- Financial health score calculation

## Troubleshooting

If you encounter any issues with the collection, try the following:

1. **Invalid ID errors**: Make sure you've set all the required environment variables correctly
2. **API key errors**: The collection includes the API key, but if it's not working, you can get a new one from the [Nessie API website](http://api.nessieisreal.com/)
3. **Request failures**: Check the response body for error messages. The Nessie API provides detailed error messages that can help you troubleshoot the issue.

## Customizing the Data

You can customize the data by modifying the request bodies before sending the requests. For example:

- Change the customer's name and address
- Adjust account balances and rewards
- Modify purchase amounts and descriptions
- Change transfer amounts and dates
- Add more purchases, transfers, deposits, or withdrawals

## Using the Data in LifexAI

Once you've created the data using this collection, you can use it in the LifexAI application by:

1. Setting the API key in the application's configuration
2. Using the customer ID and account IDs in the application's API calls

The application will then be able to retrieve and display the data you've created.
