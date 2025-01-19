import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  numeric,
  text,
  boolean,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Accounts table
export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  kindeId: varchar("kinde_id", { length: 255 }).notNull(), // Store Kinde user ID
  name: varchar("name").notNull(),
  type: varchar("type", { enum: ["BANK", "MOBILE_MONEY", "CASH"] }).notNull(),
  balance: numeric("balance", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 3 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Categories table
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  kindeId: varchar("kinde_id", { length: 255 }).notNull(), // Store Kinde user ID
  parentId: integer("parent_id").references(() => categories.id),
  name: varchar("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  kindeId: varchar("kinde_id", { length: 255 }).notNull(), // Store Kinde user ID
  accountId: integer("account_id").notNull().references(() => accounts.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  type: varchar("type", { enum: ["INCOME", "EXPENSE"] }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Budgets table
export const budgets = pgTable("budgets", {
  id: serial("id").primaryKey(),
  kindeId: varchar("kinde_id", { length: 255 }).notNull(), // Store Kinde user ID
  categoryId: integer("category_id").notNull().references(() => categories.id),
  name: varchar("name").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  notificationThreshold: integer("notification_threshold").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Notification settings table
export const notificationSettings = pgTable("notification_settings", {
  id: serial("id").primaryKey(),
  kindeId: varchar("kinde_id", { length: 255 }).notNull(), // Store Kinde user ID
  budgetId: integer("budget_id").notNull().references(() => budgets.id),
  email: boolean("email").notNull().default(true),
  push: boolean("push").notNull().default(false),
  threshold: integer("threshold").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Reports table
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  kindeId: varchar("kinde_id", { length: 255 }).notNull(), // Store Kinde user ID
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  format: varchar("format", { enum: ["PDF", "CSV", "EXCEL"] }).notNull(),
  url: text("url").notNull(),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

// Relations
export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  transactions: many(transactions),
  budgets: many(budgets),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
}));

export const budgetsRelations = relations(budgets, ({ one, many }) => ({
  category: one(categories, {
    fields: [budgets.categoryId],
    references: [categories.id],
  }),
  notificationSettings: many(notificationSettings),
}));

export const notificationSettingsRelations = relations(
  notificationSettings,
  ({ one }) => ({
    budget: one(budgets, {
      fields: [notificationSettings.budgetId],
      references: [budgets.id],
    }),
  })
);