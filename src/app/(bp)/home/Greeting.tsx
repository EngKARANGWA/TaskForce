"use client";

import { useEffect, useState } from "react";

type GreetingProps = {
  userName: string | null;
};

export default function GreetingComponent({ userName }: GreetingProps) {
  const [greeting, setGreeting] = useState<string>("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <div className="w-full text-center">
      <h1 className="text-3xl font-semibold text-gray-800">
        {greeting}, {userName || "there"}!
      </h1>
      <p className="text-lg text-gray-600 mt-2">
        Hope you&apos;re having a great day!
      </p>
    </div>
  );
}
