/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getBudgets, createBudget } from "@/lib/queries/budget";
import { getCategories } from "@/lib/queries/category";
import BudgetForm from "@/app/(bp)/budget/BudgetForm";
import { Card } from "@/components/ui/card";

interface Category {
  id: number;
  name: string;
}

interface Budget {
  id: number;
  name: string;
  categoryId: number;
  amount: number;
  startDate: string;
  endDate: string;
  notificationThreshold: number;
}

export default async function BudgetsPage() {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50">
          <h2 className="text-2xl font-semibold text-center text-gray-700">Please log in to continue</h2>
        </div>
      );
    }

    const [budgetsData, categoriesData] = await Promise.all([
      getBudgets(user.id),
      getCategories(user.id),
    ]);

    const budgets: Budget[] = budgetsData.map((budget) => ({
      ...budget,
      amount: Number(budget.amount),
      startDate: budget.startDate.toISOString(),
      endDate: budget.endDate.toISOString(),
    }));

    // @ts-ignore
    const categories: Category[] = categoriesData.map((category) => ({
      id: category.id,
      name: category.name,
    }));

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 mt-20 py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Budgets</h1>

          {budgets.length === 0 ? (
            <p className="text-gray-600">You have no budgets. Create one below!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {budgets.map((budget: Budget) => {
                const category = categories.find((c) => c.id === budget.categoryId);
                const now = new Date();
                const startDate = new Date(budget.startDate);
                const endDate = new Date(budget.endDate);
                const isActive = now >= startDate && now <= endDate;

                return (
                  <Card key={budget.id} className="hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800">{budget.name}</h3>
                      <p className="text-gray-600">{category?.name || "Uncategorized"}</p>
                      <p className="text-2xl font-bold mt-2">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(Number(budget.amount))}
                      </p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-500">
                          {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                        </p>
                        <p className="text-sm">
                          Status:{" "}
                          <span className={isActive ? "text-green-500" : "text-gray-500"}>
                            {isActive ? "Active" : "Inactive"}
                          </span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Alert at: {budget.notificationThreshold}% of budget
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="mt-10">
            <Card className="p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create a New Budget</h2>
              <BudgetForm
                categories={categories}
                onSubmit={async (data: Partial<Budget>) => {
                  "use server";
                  try {
                    if (!user?.id) return;
                    await createBudget({
                      kindeId: user.id,
                      name: data.name ?? "Untitled Budget",
                      categoryId: data.categoryId ?? categories[0]?.id ?? 0,
                      amount: data.amount ?? 0,
                      startDate: data.startDate ? new Date(data.startDate) : new Date(),
                      endDate: data.endDate ? new Date(data.endDate) : new Date(),
                      notificationThreshold: data.notificationThreshold ?? 0,
                    });
                  } catch (error) {
                    console.error("Failed to create budget:", error);
                  }
                }}
              />
            </Card>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching budgets or categories:", error);
    return <p className="text-red-500 text-center mt-6">An error occurred while loading your budgets.</p>;
  }
}
