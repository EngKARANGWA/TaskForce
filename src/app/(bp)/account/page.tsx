"use client";

import { useEffect, useState } from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createAccount, getAccounts } from "@/lib/queries/account";
import AccountForm from "@/app/(bp)/account/AccountForm";
import { Card } from "@/components/ui/card";

type Account = {
  id: number;
  kindeId: string;
  name: string;
  type: "BANK" | "MOBILE_MONEY" | "CASH";
  balance: number;
  currency: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserAndAccounts() {
      try {
        const session = await getKindeServerSession();
        const user = await session.getUser();
        if (!user?.id) throw new Error("Please log in to continue");

        setUserId(user.id);
        const fetchedAccounts = await getAccounts(user.id);
        setAccounts(fetchedAccounts.map(account => ({ ...account, balance: Number(account.balance) })));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load accounts.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndAccounts();
  }, []);

  const handleCreateAccount = async (data: Partial<Account>) => {
    if (!userId) return setError("Please log in to continue");

    try {
      await createAccount({
        ...data,
        kindeId: userId,
        name: data.name || "Unnamed Account",
        balance: data.balance || 0,
        currency: data.currency || "USD",
        type: data.type || "BANK",
        description: data.description || undefined,
      });

      setAccounts((prev) => [
              ...prev,
              {
                ...data,
                id: Date.now(),
                kindeId: userId,
                name: data.name || "Unnamed Account",
                balance: data.balance || 0,
                currency: data.currency || "USD",
                type: data.type || "BANK",
                description: data.description || null,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create account.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <Card key={account.id} className="p-4">
            <h3 className="text-xl font-semibold">{account.name}</h3>
            <p className="text-gray-600">{account.type}</p>
            <p className="text-2xl font-bold mt-2">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: account.currency || "USD",
              }).format(account.balance)}
            </p>
            {account.description ? (
              <p className="text-gray-500 mt-2">{account.description}</p>
            ) : (
              <p className="text-gray-400 mt-2">No description provided</p>
            )}
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <AccountForm onSubmit={handleCreateAccount} />
      </div>
    </div>
  );
}
