import { db } from "@/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get categories for a specific user
export const getCategories = async (kindeId: string) => {
  return await db
    .select()
    .from(categories)
    .where(eq(categories.kindeId, kindeId));
};

// Create a new category
export const createCategory = async (data: {
  kindeId: string;
  name: string;
  description?: string;
  parentId?: number;
}) => {
  return await db.insert(categories).values(data);
};

// Update an existing category
export const updateCategory = async (id: number, data: Partial<typeof categories>) => {
  return await db
    .update(categories)
    .set(data)
    .where(eq(categories.id, id));
};
