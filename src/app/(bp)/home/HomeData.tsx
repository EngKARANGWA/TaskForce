"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";


interface User {
  id: string;
  given_name?: string;
}

interface Account {
  id: number;
  balance: number;
  currency: string;
}

interface Transaction {
  id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  categoryId: number;
}

interface Budget {
  id: number;
  name: string;
  amount: number;
  notificationThreshold: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface CategorySpending {
  name: string;
  value: number;
}

interface HomePageProps {
  user: User;
  accounts: Account[];
  transactions: Transaction[];
  budgets: Budget[];
  categories: Category[];
  categorySpending: CategorySpending[];
}


const getTotalBalance = (accounts: Account[]) => {
  return accounts.reduce((total, account) => total + Number(account.balance), 0);
};

const calculateMoMChange = (transactions: Transaction[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const currentMonthTransactions = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth)
    .reduce((total, t) => total + (t.type === 'INCOME' ? t.amount : -t.amount), 0);
  
  const lastMonthTransactions = transactions
    .filter(t => new Date(t.date).getMonth() === currentMonth - 1)
    .reduce((total, t) => total + (t.type === 'INCOME' ? t.amount : -t.amount), 0);

  return lastMonthTransactions === 0 ? 0 : 
    ((currentMonthTransactions - lastMonthTransactions) / lastMonthTransactions * 100).toFixed(1);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function HomePage({
  user,
  accounts,
  transactions,
  budgets,
  categorySpending,
}: HomePageProps) {
  const totalBalance = getTotalBalance(accounts);
  const monthlyChange = calculateMoMChange(transactions);

  const chartData = transactions
    .reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (acc: any[], transaction) => {
        const date = new Date(transaction.date).toLocaleDateString();
        const existingDay = acc.find((item) => item.date === date);

        if (existingDay) {
          if (transaction.type === "INCOME") {
            existingDay.income += Number(transaction.amount);
          } else {
            existingDay.expenses += Number(transaction.amount);
          }
        } else {
          acc.push({
            date,
            income: transaction.type === "INCOME" ? Number(transaction.amount) : 0,
            expenses: transaction.type === "EXPENSE" ? Number(transaction.amount) : 0,
          });
        }
        return acc;
      },
      []
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
      <div className="p-6 space-y-8">
        <div className="flex flex-wrap justify-between items-center bg-gradient-to-r from-green-500 to-yellow-300 text-white p-4 rounded-md shadow-lg">
          <h1 className="text-4xl font-bold">WalletPro</h1>
          <div className="text-right">
            <p className="text-sm font-light">Welcome back,</p>
            <p className="text-lg font-semibold">{user.given_name}</p>
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-xl transition-transform transform hover:scale-105">
            <CardHeader className="flex items-center space-x-2 pb-4">
              <TrendingUp className="text-green-500 w-6 h-6" />
              <CardTitle className="text-md font-semibold text-gray-700">
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-gray-900">
                {new Intl.NumberFormat("en-UK", {
                  style: "currency",
                  currency: "RWF",
                }).format(totalBalance)}
              </div>
              <p className="text-sm text-gray-500">Across all accounts</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-transform transform hover:scale-105">
            <CardHeader className="flex items-center space-x-2 pb-4">
              <TrendingDown className="text-yellow-500 w-6 h-6" />
              <CardTitle className="text-md font-semibold text-gray-700">
                Monthly Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={'text-3xl font-extrabold ' + (Number(monthlyChange) >= 0 ? "text-green-600" : "text-red-600")}>
                {monthlyChange}%
              </div>
              <p className="text-sm text-gray-500">From last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-transform transform hover:scale-105">
            <CardHeader className="flex items-center space-x-2 pb-4">
              <AlertCircle className="text-red-500 w-6 h-6" />
              <CardTitle className="text-md font-semibold text-gray-700">
                Active Budgets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-gray-900">
                {budgets.length}
              </div>
              <p className="text-sm text-gray-500">Currently tracking</p>
            </CardContent>
          </Card>
        </div>




        {budgets
          .filter((budget) => {
            const categoryTransactions = transactions
              .filter(
                (t) =>
                  t.categoryId === budget.categoryId && t.type === "EXPENSE"
              )
              .reduce((total, t) => total + Number(t.amount), 0);
            return (
              categoryTransactions >=
              budget.amount * (budget.notificationThreshold / 100)
            );
          })
          .map((budget) => (
            <Alert key={budget.id} className="hover:shadow-lg">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <AlertTitle className="text-sm font-bold">
                Budget Alert: {budget.name}
              </AlertTitle>
              <AlertDescription className="text-sm">
                You&apos;ve reached {budget.notificationThreshold}% of your budget
                for {budget.name}.
              </AlertDescription>
            </Alert>
          ))}

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4 bg-white shadow-lg rounded-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Income vs Expenses</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#4caf50" name="Income" />
                  <Line type="monotone" dataKey="expenses" stroke="#f44336" name="Expenses" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="p-4 bg-white shadow-lg rounded-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Spending by Category</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categorySpending}
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categorySpending.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      

        <Card className="p-4 bg-white shadow-lg rounded-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex justify-between items-center bg-gray-100 p-4 rounded-md hover:shadow-lg transition-all"
                >
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === "INCOME"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "RWF",
                    }).format(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}