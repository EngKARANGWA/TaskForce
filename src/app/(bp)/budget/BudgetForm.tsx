"use client";

import React, { useState } from "react";

interface Budget {
  id?: number;
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

interface BudgetFormProps {
  budget?: Budget;
  categories: Category[];
  onSubmit: (data: Partial<Budget>) => Promise<void>;
}

export default function BudgetForm({ budget, categories, onSubmit }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    name: budget?.name || "",
    categoryId: budget?.categoryId || 0,
    amount: budget?.amount || 0,
    startDate: budget?.startDate
      ? new Date(budget.startDate).toISOString().split("T")[0]
      : "",
    endDate: budget?.endDate
      ? new Date(budget.endDate).toISOString().split("T")[0]
      : "",
    notificationThreshold: budget?.notificationThreshold || 80,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "amount" || name === "notificationThreshold" || name === "categoryId"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      await onSubmit({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      });
      if (!budget) {
        // Reset form if it's a new budget
        setFormData({
          name: "",
          categoryId: 0,
          amount: 0,
          startDate: "",
          endDate: "",
          notificationThreshold: 80,
        });
      }
    } catch (err) {
      setError("An error occurred while submitting the budget. Please try again.");
      console.error("Error submitting budget:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {budget ? "Edit Budget" : "New Budget"}
      </h2>

      {error && (
        <div className="p-2 mb-4 text-red-600 bg-red-100 border border-red-300 rounded">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium">
          Budget Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
          aria-label="Budget Name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="categoryId" className="block text-sm font-medium">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
          aria-label="Category"
        >
          <option value={0}>Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="block text-sm font-medium">
          Budget Amount
        </label>
        <input
          id="amount"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          className="w-full p-2 border rounded-md"
          required
          aria-label="Budget Amount"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="startDate" className="block text-sm font-medium">
          Start Date
        </label>
        <input
          id="startDate"
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
          aria-label="Start Date"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="endDate" className="block text-sm font-medium">
          End Date
        </label>
        <input
          id="endDate"
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
          aria-label="End Date"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="notificationThreshold" className="block text-sm font-medium">
          Notification Threshold (%)
        </label>
        <input
          id="notificationThreshold"
          type="number"
          name="notificationThreshold"
          value={formData.notificationThreshold}
          onChange={handleChange}
          min="1"
          max="100"
          className="w-full p-2 border rounded-md"
          required
          aria-label="Notification Threshold"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        {budget ? "Update" : "Create"} Budget
      </button>
    </form>
  );
}