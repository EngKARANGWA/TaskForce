/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getHomeData } from "@/lib/queries/homeQueries";
import HomePage from "./HomeData";

// Define or import the User type
type User = {
  id: string;
  // Add other properties as needed
};

export const revalidate = 300; // Cache revalidation interval in seconds

export default async function Home() {
  // Retrieve user session
  const { getUser } = getKindeServerSession();
  const user: User = await getUser();

  // Check if the user is authenticated
  if (!user?.id) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Please log in to continue</h2>
      </div>
    );
  }

  try {
    // Fetch data required for the home page
    const {
      accounts: rawAccounts,
      recentTransactions,
      budgets,
      categories,
      categorySpending,
    } = await getHomeData(user.id);

    const accounts = rawAccounts.map(
      ({ id, kindeId, name, type, balance, currency, description, createdAt, updatedAt }) => ({
        id,
        kindeId,
        name,
        type,
        balance: parseFloat(balance as string),
        currency,
        description,
        createdAt,
        updatedAt,
      })
    );

    // Map and process the fetched data for the `HomePage` component
    const transactions = recentTransactions.map(
      ({ id, amount, date, description }) => ({
        id,
        amount,
        date,
        description: description ?? '',
      })
    );

    const spendingData = categorySpending.map(({ name, total }) => ({
      name,
      value: total,
    }));

    return (
      <HomePage
        user={user}
        accounts={accounts}
        //@ts-ignore
        transactions={transactions}
        budgets={budgets}
        categories={categories}
        categorySpending={spendingData}
      />
    );
  } catch (error) {
    console.error("Error loading dashboard:", error);

    // Render an error message if the data fetch fails
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Error loading dashboard</h2>
        <p className="text-gray-700 mt-2">Please try again later.</p>
      </div>
    );
  }
}
