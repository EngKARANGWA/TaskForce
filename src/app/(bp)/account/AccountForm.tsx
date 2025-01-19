"use client"
import React, { useState } from 'react';

type Account = {
  id: number;
  kindeId: string;
  name: string;
  type: "BANK" | "MOBILE_MONEY" | "CASH";
  balance: number;
  currency: string;
  description?: string;
};

const AccountForm = ({ 
  account, 
  onSubmit 
}: { 
  account?: Account; 
  onSubmit: (data: Partial<Account>) => Promise<void>; 
}) => {
  const [formData, setFormData] = useState({
    name: account?.name || '',
    type: account?.type || 'BANK',
    balance: account?.balance || 0,
    currency: account?.currency || 'USD',
    description: account?.description || ''
  });

  const [error, setError] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (!formData.name.trim()) {
        setError('Account name is required');
        return;
      }
      await onSubmit(formData);
    } catch (error) {
      setError('Failed to submit form. Please try again.');
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">
        {account ? 'Edit Account' : 'New Account'}
      </h2>

      {error && (
        <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="name">
          Account Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="type">
          Account Type
        </label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="BANK">Bank Account</option>
          <option value="MOBILE_MONEY">Mobile Money</option>
          <option value="CASH">Cash</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="balance">
          Initial Balance
        </label>
        <input
          id="balance"
          name="balance"
          type="number"
          step="0.01"
          value={formData.balance}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="currency">
          Currency
        </label>
        <input
          id="currency"
          name="currency"
          type="text"
          value={formData.currency}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {account ? 'Update' : 'Create'} Account
      </button>
    </form>
  );
};

export default AccountForm;