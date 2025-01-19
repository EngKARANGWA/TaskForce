import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getBudgets, createBudget } from "@/lib/queries/budget";
import { getCategories } from "@/lib/queries/category";
import BudgetForm from "@/app/(bp)/budget/BudgetForm";
import { Card } from "@/components/ui/card";

interface Budget {
  id: number;
  name: string;
  categoryId: number;
  amount: number;
  startDate: string;
  endDate: string;
  notificationThreshold: number;
}

interface Category {
  id: number;
  name: string;
}

export default async function BudgetsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return <h2 className="text-2xl mb-2">Please log in to continue</h2>;
  }

  try {
    const [budgets, categories] = await Promise.all([
      getBudgets(user.id),
      getCategories(user.id),
    ]);

    return (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Your Budgets</h1>

          {budgets.length === 0 ? (
            <p className="text-gray-600">You have no budgets. Create one below!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {budgets.map((budget: Budget) => {
                  const category = categories.find((c) => c.id === budget.categoryId);
                  const now = new Date();
                  const startDate = new Date(budget.startDate);
                  const endDate = new Date(budget.endDate);
                  const isActive = now >= startDate && now <= endDate;

                  return (
                      <Card key={budget.id} className="p-4">
                          <h3 className="text-xl font-semibold">{budget.name}</h3>
                          <p className="text-gray-600">{category?.name || "Uncategorized"}</p>
                          <p className="text-2xl font-bold mt-2">
                              {new Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: "USD",
                              }).format(budget.amount)}
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
                      </Card>
                  );
              })}
            </div>
          )}

          <div className="mt-8">
            <Card className="p-6">
              <BudgetForm
                categories={categories}
                onSubmit={async (data: Partial<Budget>) => {
                  'use server';
                  try {
                    if (!user?.id) return;
                    await createBudget({
                      kindeId: user.id,
                      name: data.name!,
                      categoryId: data.categoryId!,
                      amount: data.amount!,
                      startDate: new Date(data.startDate!),
                      endDate: new Date(data.endDate!),
                      notificationThreshold: data.notificationThreshold!,
                    });
                  } catch (error) {
                    console.error("Failed to create budget:", error);
                  }
                }}
              />
            </Card>
          </div>
        </div>
    );
  } catch (error) {
    console.error("Error fetching budgets or categories:", error);
    return <p className="text-red-500">An error occurred while loading your budgets.</p>;
  }
}
