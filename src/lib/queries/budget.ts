// lib/queries/budget.ts
import { db } from "@/db";
import { budgets } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getBudgets = async (kindeId: string) => {
  return await db
    .select()
    .from(budgets)
    .where(eq(budgets.kindeId, kindeId));
};

export const createBudget = async (data: {
  kindeId: string;
  name: string;
  categoryId: number;
  amount: number;
  startDate: Date;
  endDate: Date;
  notificationThreshold: number;
}) => {
  return await db.insert(budgets).values(data);
};

export const updateBudget = async (id: number, data: Partial<Budget>) => {
  return await db
    .update(budgets)
    .set(data)
    .where(eq(budgets.id, id));
};