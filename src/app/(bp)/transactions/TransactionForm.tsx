"use client"

import React, { useState, useTransition } from 'react';

type PersonalAccount = {
  id: number;
  name: string;
  type: "BANK" | "MOBILE_MONEY" | "CASH";
  balance: number;
  currency: string;
};

type FinancialTransaction = {
  id: number;
  kindeId: string;
  accountId: number;
  categoryId: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description?: string;
  date: Date;
};

interface TransactionFormProps {
  accounts: PersonalAccount[];
  categories: { id: number; name: string }[];
  transaction?: FinancialTransaction;
  onSubmit: (data: FormData) => Promise<void>;
}

const TransactionForm = ({ 
  accounts, 
  categories,
  transaction, 
  onSubmit 
}: TransactionFormProps) => {
  const [error, setError] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      startTransition(async () => {
        try {
          await onSubmit(formData);
          if (!transaction) {
            (e.target as HTMLFormElement).reset();
            // Set default date to today
            const dateInput = document.getElementById('date') as HTMLInputElement;
            if (dateInput) {
              dateInput.value = new Date().toISOString().split('T')[0];
            }
          }
        } catch (error) {
          setError(error instanceof Error ? error.message : 'Failed to submit transaction');
        }
      });
    } catch (error) {
      setError('Failed to submit transaction. Please try again.');
      console.error('Error submitting transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {transaction ? 'Edit Transaction' : 'New Transaction'}
      </h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="accountId">
          Account
        </label>
        <select
          id="accountId"
          name="accountId"
          defaultValue={transaction?.accountId || accounts[0]?.id || ''}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select an account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name} ({account.type} - {account.currency})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="categoryId">
          Category
        </label>
        <select
          id="categoryId"
          name="categoryId"
          defaultValue={transaction?.categoryId || categories[0]?.id || ''}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          name="type"
          defaultValue={transaction?.type || 'EXPENSE'}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="amount">
          Amount
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          defaultValue={transaction?.amount || ''}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={transaction?.date 
            ? new Date(transaction.date).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0]}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={transaction?.description || ''}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
      >
        {isPending 
          ? 'Processing...' 
          : transaction 
            ? 'Update Transaction' 
            : 'Add Transaction'
        }
      </button>
    </form>
  );
};

export default TransactionForm;