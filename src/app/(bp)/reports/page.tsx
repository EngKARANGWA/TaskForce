import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TransactionTable } from "@/app/(bp)/reports/TransactionTable";
import { getTransactionsWithDetails } from "@/lib/queries/transaction";
import { generateReport } from "@/lib/queries/report";


export default async function ReportsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return <h2 className="text-2xl mb-2">Please log in to continue</h2>;
  }

  try {
    const transactions = await getTransactionsWithDetails(user.id);

    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Financial Report</h1>
        
        <TransactionTable
          transactions={transactions}
          onGenerateReport={async (format) => {
            'use server';
            if (!user?.id) return;
            await generateReport({
              kindeId: user.id,
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
              format
            });
          }}
        />
      </div>
    );
  } catch (e) {
    if (e instanceof Error) {
      throw e;
    }
  }
}
