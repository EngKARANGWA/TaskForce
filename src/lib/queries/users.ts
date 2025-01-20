/* eslint-disable @typescript-eslint/ban-ts-comment */
import { db } from "@/db"; 
// @ts-ignore
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const findUserByEmail = async (email: string) => {
  return await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .execute();
};

export const addUser = async ({
  id,
  firstName,
  lastName,
  email,
  username,
}: {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
}) => {
  return await db.insert(users).values({
    id,
    firstName,
    lastName,
    email,
    username,
  });
};
