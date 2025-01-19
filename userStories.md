# Task List

## User Account Management

1. [x] Allow users to create an account by providing email, password.
2. [x] Allow users to log in with their credentials.
3. [ ] Provide an option for users to reset their password if they forget it.
4. [x] Implement account details as Profile

## Adding Transactions

1. [ ] Allow users to add a new transaction by entering details which are amount, type (income/expense), account, and description.
2. [ ] Validate that required fields are filled before saving a transaction.
3. [ ] Save the transaction to the database and associate it with the user.

## Viewing Transactions

 1. [ ] Display all transactions for a logged-in user in a table or list.
 2. [ ] Allow users to filter transactions by account, type (income/expense), date range, and category.
 3. [ ] Implement pagination to improve performance when there are many transactions.
 4. [ ] Editing and Deleting Transactions
 5. [ ] Allow users to edit transaction details and save the changes.
 6. [ ] Allow users to delete transactions they no longer need.
 7. [ ] Confirm with the user before deleting a transaction.

## Categories and Subcategories

 1. [ ] Allow users to create categories and subcategories for organizing transactions.
 2. [ ] Provide the option to edit or delete categories and subcategories.
 3. [ ] Ensure users can assign a category or subcategory to a transaction during creation or editing.

## Budget Management

1. [ ] Allow users to set a spending limit for specific categories or subcategories.
2. [ ] Notify users if their spending exceeds the set budget for a category.
3. [ ] Provide an interface for users to view and update their budget limits.

## Reports and Insights

1. [ ] Allow users to generate a report of their transactions for a specific time period.
2. [ ] Include a breakdown of income and expenses by account and category in the report.
3. [ ] Allow users to export the report in PDF or CSV format.

## Dashboard and Visualization

1. [ ] Display a summary of the user’s financial activity on the dashboard, including total income, total expenses, and remaining budget.
2. [ ] Create visual charts pie charts and bar charts showing income and expenses by category or account.
3. [ ] Ensure the dashboard updates dynamically as new transactions are added.

## Managing Accounts

1. [ ] Allow users to add multiple accounts (e.g., bank, mobile money, cash) for tracking transactions.
2. [ ] Provide the ability to edit or delete accounts as needed.
3. [ ] Link each transaction to a specific account selected by the user.

## Notifications

1. [ ] Notify users when their spending exceeds a set budget.
2. [ ] Allow users to set reminders for reports or specific transactions.
3. [ ] Display notifications in the app and optionally send email alerts.

## Testing and Quality Assurance

1. [ ] Write unit tests for all backend business logic.
2. [ ] Write UI tests to ensure the frontend behaves as expected.

## Deployment and Monitoring

1. [ ] Deploy the application to Vercel.

## Documentation

1. [ ] Create a user guide for setting up and using the application.
2. [ ] Add clear instructions in the README for developers to run the project locally.
