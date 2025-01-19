'use client';

import {RegisterLink, LoginLink} from "@kinde-oss/kinde-auth-nextjs/components";

export default function AuthPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-6">Welcome</h1>
        <p className="text-lg text-gray-600 mb-6">
          Please sign up or log in to get started.
        </p>
        <div className="space-x-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-md shadow hover:bg-blue-600 transition"
          >
            <LoginLink>
            Log In
            </LoginLink>
          </button>
          <button
            className="px-6 py-3 bg-green-500 text-white font-medium rounded-md shadow hover:bg-green-600 transition"
          >
            <RegisterLink>
            Sign Up
            </RegisterLink>
          </button>
        </div>
      </div>
    </main>
  );
}
