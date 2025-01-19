import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getHomeData } from "@/lib/queries/homeQueries";
import HomePage from "./HomeData";



export const revalidate = 300;

export default async function Home() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return <h2 className="text-2xl mb-2">Please log in to continue</h2>;
  }

  try {
    const {
      accounts,
      recentTransactions,
      budgets,
      categories,
      categorySpending,
    } = await getHomeData(user.id);

    return (
    <HomePage 
      user={user}
      accounts={accounts}
      transactions={recentTransactions.map(({ id, amount, date, categoryId, description }) => ({ id, amount, date, categoryId, description }))}
      budgets={budgets}
      categories={categories}
      categorySpending={categorySpending.map(({ name, total }) => ({ name, value: total }))}
    />
    );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return <div>Error loading dashboard</div>;
  }
}