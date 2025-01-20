/* eslint-disable @typescript-eslint/ban-ts-comment */
import { db } from "@/db";
import { accounts } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getAccounts = async (kindeId: string) => {
  return await db
    .select()
    .from(accounts)
    .where(eq(accounts.kindeId, kindeId));
};

export const createAccount = async (data: {
  kindeId: string;
  name: string;
  type: "BANK" | "MOBILE_MONEY" | "CASH";
  balance: number;
  currency: string;
  description?: string;
}) => {
  // @ts-ignore
  return await db.insert(accounts).values(data);
};
// @ts-ignore
export const updateAccount = async (id: number, data: Partial<Account>) => {
  return await db
    .update(accounts)
    .set(data)
    .where(eq(accounts.id, id));
};