"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  Home,
  BarChart2,
  TrendingUp,
  Folder,
  BellRing,
  User,
  LogOut,
  Menu,
  X,
  PieChart,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function TopHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    {
      href: "/home",
      label: "Dashboard",
      icon: Home,
      gradient: "from-green-500 to-green-700",
    },
    {
      href: "/budget",
      label: "Budgets",
      icon: BarChart2,
      gradient: "from-yellow-500 to-yellow-700",
    },
    {
      href: "/transactions",
      label: "Transactions",
      icon: TrendingUp,
      gradient: "from-blue-500 to-blue-700",
    },
    {
      href: "/categories",
      label: "Categories",
      icon: Folder,
      gradient: "from-purple-500 to-purple-700",
    },
    {
      href: "/reports",
      label: "Reports",
      icon: PieChart,
      gradient: "from-orange-500 to-orange-700",
    },
    {
      href: "/profile",
      label: "Notifications",
      icon: BellRing,
      gradient: "from-pink-500 to-pink-700",
    },
    {
      href: "/account",
      label: "Accounts",
      icon: User,
      gradient: "from-teal-500 to-teal-700",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-xl shadow-md z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-yellow-500 flex items-center justify-center shadow-lg">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-800">WalletPro</h1>
            <p className="text-sm text-gray-500">Financial Management</p>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Navigation Links */}
        <nav
          className={cn(
            "absolute md:relative top-16 md:top-auto left-0 right-0 md:flex md:space-x-6 bg-white md:bg-transparent md:shadow-none shadow-lg md:translate-x-0 transition-transform duration-300",
            isMenuOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
          )}
        >
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:items-center">
            {navLinks.map(({ href, label, icon: Icon, gradient }) => (
              <li key={href} className="md:mx-2">
                <Link
                  href={href}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 group",
                    pathname === href
                      ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div
                    className={cn(
                      "w-8 h-8 flex items-center justify-center rounded-full",
                      pathname === href
                        ? "bg-white/20 backdrop-blur-sm"
                        : `bg-gradient-to-r ${gradient} text-white`
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <LogoutLink>
          <button className="hidden md:flex items-center space-x-2 px-4 py-2 text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-all duration-200">
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white">
              <LogOut className="w-5 h-5" />
            </div>
            <span className="font-medium">Log out</span>
          </button>
        </LogoutLink>
      </div>

      {/* Mobile Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </header>
  );
}
