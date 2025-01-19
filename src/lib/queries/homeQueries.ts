import { db } from "@/db";
import { 
  accounts, 
  transactions, 
  budgets, 
  categories,
} from "@/db/schema";
import { eq, and, gte, desc } from "drizzle-orm";


interface EnhancedTransaction {
  id: number;
  amount: number;
  description: string | null;
  date: Date;
  categoryName: string;
  accountName: string;
}


interface BudgetWithSpending {
  id: number;
  name: string;
  amount: number;
  notificationThreshold: number;
  categoryId: number;
  currentSpending: number;
}

export const getHomeData = async (kindeId: string) => {
  try {
    const userAccounts = await db
      .select()
      .from(accounts)
      .where(eq(accounts.kindeId, kindeId));


    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentTransactions = await db
        .select({
            id: transactions.id,
            type: transactions.type,
            amount: transactions.amount,
            description: transactions.description,
            date: transactions.date,
            categoryName: categories.name,
            accountName: accounts.name,
        })
        .from(transactions)
        .where(
            and(
                eq(transactions.kindeId, kindeId),
                gte(transactions.date, thirtyDaysAgo)
            )
        )
        .innerJoin(categories, eq(transactions.categoryId, categories.id))
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .orderBy(desc(transactions.date))
        .limit(50) as unknown as EnhancedTransaction[];

    const currentDate = new Date();
    const activeBudgets = await db
      .select()
      .from(budgets)
      .where(
        and(
          eq(budgets.kindeId, kindeId),
          gte(budgets.endDate, currentDate)
        )
      );

    
    const budgetsWithSpending: BudgetWithSpending[] = await Promise.all(
      activeBudgets.map(async (budget) => {
        const spending = await db
          .select({
            total: transactions.amount,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.categoryId, budget.categoryId),
              eq(transactions.type, "EXPENSE"),
              gte(transactions.date, budget.startDate)
            )
          );

        const currentSpending = spending.reduce(
          (total, t) => total + Number(t.total),
          0
        );

        return {
          ...budget,
          amount: Number(budget.amount),
          currentSpending,
        };
      })
    );


    const userCategories = await db
      .select({
        id: categories.id,
        name: categories.name,
        parentId: categories.parentId,
      })
      .from(categories)
      .where(eq(categories.kindeId, kindeId));


    const categorySpending = await Promise.all(
      userCategories.map(async (category) => {
        const spending = await db
          .select({
            total: transactions.amount,
          })
          .from(transactions)
          .where(
            and(
              eq(transactions.categoryId, category.id),
              eq(transactions.type, "EXPENSE"),
              gte(transactions.date, thirtyDaysAgo)
            )
          );

        return {
          categoryId: category.id,
          name: category.name,
          total: spending.reduce((sum, t) => sum + Number(t.total), 0),
        };
      })
    );

    return {
      accounts: userAccounts,
      recentTransactions,
      budgets: budgetsWithSpending,
      categories: userCategories,
      categorySpending,
    };
  } catch (error) {
    console.error("Error fetching home data:", error);
    throw error;
  }
};

