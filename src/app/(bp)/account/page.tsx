import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createAccount, getAccounts } from "@/lib/queries/account";
import AccountForm from "@/app/(bp)/account/AccountForm";
import { Card } from "@/components/ui/card";

export default async function AccountsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return <h2 className="text-2xl mb-2">Please log in to continue</h2>;
  }

  try {
    const accounts = await getAccounts(user.id);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Accounts</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className="p-4">
              <h3 className="text-xl font-semibold">{account.name}</h3>
              <p className="text-gray-600">{account.type}</p>
              <p className="text-2xl font-bold mt-2">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: account.currency
                }).format(account.balance)}
              </p>
              {account.description && (
                <p className="text-gray-500 mt-2">{account.description}</p>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <AccountForm
            onSubmit={async (data) => {
              'use server';
              if (!user?.id) return;
              await createAccount({
                ...data,
                kindeId: user.id,
                balance: data.balance || 0,
                currency: data.currency || 'USD',
                type: data.type || 'BANK'
              });
            }}
          />
        </div>
      </div>
    );
  } catch (e) {
      throw e;
  }
}
