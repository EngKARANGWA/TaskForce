// page.tsx
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
      <div>
        <h2 className="text-2xl mb-2">User not authenticated</h2>
      </div>
    );
  }

  const accounts = await getAccounts(user.id);
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
    const date = new Date(formData.get('date') as string);

    // Validate required fields
    if (!accountId || !categoryId || !amount || !type || !date) {
      throw new Error("Missing required fields");
    }

    try {
      await createTransaction({
        kindeId: user.id,
        accountId,
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
    <div>
      <h1 className="text-2xl mb-4">Transactions</h1>
      <div className="grid grid-cols-1 gap-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <div className="flex justify-between p-4">
              <div>
                <h2 className="text-xl font-bold">{transaction.description}</h2>
                <p className="text-gray-500">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: accounts.find(a => a.id === transaction.accountId)?.currency || 'USD'
                  }).format(transaction.amount)}
                </p>
                <p className="text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              <div className={`px-2 py-1 rounded-md ${
                transaction.type === 'INCOME' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {transaction.type}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <TransactionForm
          accounts={accounts}
          categories={categories}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}