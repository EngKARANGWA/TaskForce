import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100">
      <div className="text-center max-w-2xl px-4">
        <Image
          src="/assets/logo.png" 
          alt="App Logo"
          width={150}
          height={150}
          className="mx-auto mb-6"
        />
        <h1 className="text-4xl font-extrabold text-green-600">
          Welcome to Your Personal Finance App
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Simplify your financial management. Track transactions, manage
          budgets, and gain insights into your spending habits – all in one
          place.
        </p>
        <div className="mt-8">
          <Link
            href="/auth"
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
      <footer className="mt-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Personal Finance App. All rights
        reserved.
      </footer>
    </main>
  );
}
