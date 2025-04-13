# LifexAI - Your AI Detective for Health, Finance, and Digital Safety

LifexAI is a React-based web application that acts as your personal "holistic detective," analyzing clues from your life – health habits, financial transactions, and digital footprints – to give you actionable insights. It features a beautiful, playful UI and leverages cutting-edge AI/ML to provide you with valuable information about your daily life.

This project was created for the Bitcamp 2025 Hackathon.

## Features

- **Financial Analysis:** Track your spending, detect anomalies, and get personalized financial advice
- **Health Monitoring:** (Coming Soon) Analyze your health data and receive recommendations for improvement
- **Digital Safety:** (Coming Soon) Protect your digital footprint and stay safe online

## Tech Stack

- **Frontend:** React, Next.js, TypeScript, Tailwind CSS
- **API Integration:** Capital One Nessie API for financial data
- **Data Visualization:** Chart.js for financial charts and graphs
- **State Management:** React Query for server state management

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
# Using the provided script (Unix/Linux/macOS)
./install-dependencies.sh

# Using the provided script (Windows)
install-dependencies.bat

# Or manually
npm install
```

### Running the Application

```bash
npm run dev
```

This will start the development server at [http://localhost:3000](http://localhost:3000).

## Using Financial Data

The application uses the Capital One Nessie API for financial data. You have several options for working with financial data:

### Option 1: Create Sample Data

You can create sample data in the Nessie API using the provided script:

```bash
# Using the npm script (recommended)
npm run create-data

# Or directly with ts-node
npx ts-node -P tsconfig.node.json src/scripts/createData.ts
```

This will create a sample customer, accounts, purchases, and transfers in the Nessie API. The script will output the IDs of the created entities, which you can use to view the data in the application.

### Option 2: Upload Mock Data to Nessie API

You can upload our predefined mock data to the Nessie API using the provided script:

```bash
# Using the npm script (recommended)
npm run upload-mock-data

# Or directly with ts-node
npx ts-node -P tsconfig.node.json src/scripts/uploadMockData.ts
```

This will create customers, accounts, purchases, and transfers in the Nessie API based on our mock data. The script will output the IDs of the created entities and maintain the relationships between them. This is useful if you want to have a consistent set of data in the Nessie API for testing.

### Option 3: Use Mock Data Locally

For development and testing purposes, we've created mock data and a mock API implementation that can be used without making actual API calls to the Nessie API. To use the mock API, you need to modify the imports in the finance page component:

1. Open `src/app/finance/page.tsx`
2. Change the import from `nessieApi` to `mockNessieApi`:

```typescript
// Instead of
import { 
  getAccounts, 
  getCustomers, 
  getAccountPurchases, 
  getMerchants 
} from '../../api/nessieApi';

// Use
import { 
  getAccounts, 
  getCustomers, 
  getAccountPurchases, 
  getMerchants 
} from '../../api/mockNessieApi';
```

### Option 4: Use Postman to Manage Nidhi's Account

We've created a Postman collection that allows you to interact with the Nessie API to create and manage Nidhi's account data. This is useful for testing specific scenarios or creating custom data.

The collection includes requests for:
- Creating a customer profile for Nidhi
- Creating checking, savings, and credit card accounts
- Creating purchases for Nidhi's accounts
- Creating transfers between Nidhi's accounts
- Viewing all the data you've created

To use the Postman collection:
1. Import the collection from `postman/Nessie_API_Collection.json` into Postman
2. Follow the step-by-step guide in `postman/README.md`

For more information, see the [Postman Collection Documentation](postman/README.md).

### Option 5: Use the Comprehensive Example Data

We've created a comprehensive example data file that contains a large set of sample data for the Nessie API. This data can be used as a reference for the structure of the API responses and as a source of test data.

The file is located at `examples/comprehensive_nessie_data.json` and contains:
- 5 customers
- 10 accounts
- 10 merchants
- 24 purchases
- 8 transfers
- 8 bills
- 8 deposits
- 6 withdrawals

For more information, see the [Example Data Documentation](examples/README.md).

## Project Structure

```
lifexai/
├── public/              # Static assets
├── src/
│   ├── api/             # API integration
│   ├── app/             # Next.js app router
│   ├── components/      # React components
│   │   └── finance/     # Financial components
│   ├── providers/       # React providers
│   ├── scripts/         # Utility scripts
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── examples/            # Example data files
├── postman/             # Postman collection for API testing
├── install-dependencies.sh  # Unix/Linux/macOS installation script
└── install-dependencies.bat # Windows installation script
```

## Financial Dashboard

The financial dashboard provides a comprehensive view of your financial data, including:

- **Account Summary:** View your account details and balance
- **Transaction List:** Browse your transactions with filtering and sorting
- **Spending by Category:** Visualize your spending by category
- **Spending Trends:** Track your spending over time
- **Financial Health Score:** Get a score based on your financial habits
- **Anomaly Detection:** Identify unusual spending patterns
- **Recurring Expenses:** Track subscriptions and recurring payments

## Troubleshooting

If you encounter any issues with running the scripts, make sure:

1. You have installed all dependencies:
   ```bash
   npm install
   ```

2. The ts-node package is installed as a dev dependency (it should be included in package.json)

3. You're using the correct command with the proper TypeScript configuration:
   ```bash
   npx ts-node -P tsconfig.node.json src/scripts/createData.ts
   ```

4. The API key in `src/api/nessieApi.ts` is valid

5. If you get "invalid id" errors, ensure that:
   - The IDs in your data are 16 digits as required by the Nessie API
   - You're using valid merchant IDs from the Nessie API for purchases

## Contributing

This project is a hackathon submission and is not actively maintained. However, feel free to fork the repository and make your own changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Capital One Nessie API](http://api.nessieisreal.com/) for providing mock banking data
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Chart.js](https://www.chartjs.org/) for data visualization
- [React Query](https://tanstack.com/query/latest) for server state management
