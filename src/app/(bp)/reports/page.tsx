/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TransactionTable } from "@/app/(bp)/reports/TransactionTable";
import { getTransactionsWithDetails } from "@/lib/queries/transaction";
import { generateReport } from "@/lib/queries/report";

export default async function ReportsPage() {
  // Get user session
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
        <h2 className="text-2xl font-bold text-center mt-6 text-gray-700">
          Please log in to continue
        </h2>
      </div>
    );
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
      <div className="bg-gradient-to-br mt-20 from-blue-50 via-white to-blue-100 min-h-screen py-8 px-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Financial Report</h1>
          
          <TransactionTable
            //@ts-ignore
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
      </div>
    );
  } catch (error) {
    console.error("Error fetching transactions or generating report:", error);

    // Render error message
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-100 to-red-200">
        <div className="text-center py-10 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
          <p className="text-gray-700 mt-2">
            We could not load your financial report. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
