import { db } from "@/db";
import { accounts, categories, transactions } from "@/db/schema";
import { eq, and, between } from "drizzle-orm";

export const getTransactions = async (kindeId: string, filters?: {
  startDate?: Date;
  endDate?: Date;
  accountId?: number;
  type?: 'INCOME' | 'EXPENSE';
}) => {
  let query = db
    .select()
    .from(transactions)
    .where(eq(transactions.kindeId, kindeId));

  if (filters?.startDate && filters?.endDate) {
    query = query.where(
      between(transactions.date, filters.startDate, filters.endDate)
    );
  }

  if (filters?.accountId) {
    query = query.where(eq(transactions.accountId, filters.accountId));
  }

  if (filters?.type) {
    query = query.where(eq(transactions.type, filters.type));
  }

  return await query.orderBy(transactions.date);
};

export const createTransaction = async (data: {
  kindeId: string;
  accountId: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: Date;
}) => {
  return await db.insert(transactions).values(data);
};

export const updateTransaction = async (id: number, data: Partial<Transaction>) => {
  return await db
    .update(transactions)
    .set(data)
    .where(eq(transactions.id, id));
};


export const getTransactionsWithDetails = async (kindeId: string) => {
  return await db
    .select({
      id: transactions.id,
      date: transactions.date,
      type: transactions.type,
      amount: transactions.amount,
      description: transactions.description,
      category: categories.name,
      account: accounts.name,
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(eq(transactions.kindeId, kindeId))
    .orderBy(transactions.date);
};