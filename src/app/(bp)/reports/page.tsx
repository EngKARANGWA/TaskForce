import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TransactionTable } from "@/app/(bp)/reports/TransactionTable";
import { getTransactionsWithDetails } from "@/lib/queries/transaction";
import { generateReport } from "@/lib/queries/report";

export default async function ReportsPage() {
  // Get user session
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return <h2 className="text-2xl font-bold text-center mt-6">Please log in to continue</h2>;
  }

  try {
    // Fetch and process transactions
    const transactions = (await getTransactionsWithDetails(user.id)).map((transaction) => ({
      ...transaction,
      date: transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date,
      amount: parseFloat(transaction.amount),
      description: transaction.description ?? undefined,
    }));

    // Render report
    return (
      <div className="space-y-6 px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800">Financial Report</h1>
        <TransactionTable
          transactions={transactions}
          onGenerateReport={async (format) => {
            "use server";
            if (!user?.id) return;

            // Trigger report generation
            await generateReport({
              kindeId: user.id,
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
              format,
            });
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error fetching transactions or generating report:", error);

    // Render error message
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
        <p className="text-gray-700 mt-2">
          We could not load your financial report. Please try again later.
        </p>
      </div>
    );
  }
}
