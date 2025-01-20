/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createTransaction, getTransactions } from "@/lib/queries/transaction";
import { getAccounts } from "@/lib/queries/account";
import { getCategories } from "@/lib/queries/category";
import TransactionForm from "@/app/(bp)/transactions/TransactionForm";
import { Card } from "@/components/ui/card";
import { revalidatePath } from "next/cache";

export default async function TransactionsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
        <h2 className="text-2xl font-semibold text-center text-gray-700">User not authenticated</h2>
      </div>
    );
  }

  try {
    let accounts = await getAccounts(user.id);
    accounts = accounts.map(account => ({
      ...account,
      balance: account.balance ? parseFloat(account.balance).toString() : '0',
    }));

    const categories = await getCategories(user.id);
    const transactions = await getTransactions(user.id);

    async function handleSubmit(formData: FormData) {
      'use server';

      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      // Parse and validate form data
      const accountId = parseInt(formData.get('accountId') as string);
      const categoryId = parseInt(formData.get('categoryId') as string);
      const amount = parseFloat(formData.get('amount') as string);
      const type = formData.get('type') as 'INCOME' | 'EXPENSE';
      const description = formData.get('description') as string;
      const date = formData.get('date') ? new Date(formData.get('date') as string) : null;

      // Validate required fields
      if (isNaN(accountId) || isNaN(categoryId) || isNaN(amount) || !type || !date) {
        throw new Error("Missing or invalid required fields");
      }

      try {
        await createTransaction({
          kindeId: user.id,
          accountId,
          // @ts-ignore
          categoryId,
          type,
          amount,
          description,
          date,
        });

        // Revalidate the page to show the new transaction
        revalidatePath('/transactions');
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw new Error("Failed to create transaction");
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-10 px-6 mt-20">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Transactions</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="flex justify-between items-center p-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{transaction.description}</h2>
                    <p className="text-gray-600 mt-2">
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: accounts.find(a => a.id === transaction.accountId)?.currency || 'USD'
                      }).format(Number(transaction.amount))}
                    </p>
                    <p className="text-gray-500 text-sm">
                      {transaction.date ? new Date(transaction.date).toLocaleDateString() : "No date"}
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 text-sm rounded-md ${
                      transaction.type === 'INCOME'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {transaction.type}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <TransactionForm
              //@ts-ignore
              accounts={accounts}
              //@ts-ignore
              categories={categories}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching transactions data:", error);
    return <p className="text-red-500 text-center mt-6">An error occurred while loading transactions.</p>;
  }
}
