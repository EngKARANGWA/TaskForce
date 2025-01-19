"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import {
  LayoutDashboard,
  Wallet,
  Receipt,
  PieChart,
  Tags,
  Bell,
  Building2,
  LogOut,
  Menu,
  X,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { 
      href: "/home", 
      label: "Dashboard", 
      icon: LayoutDashboard,
      description: "Overview of your finances",
      gradient: "from-green-400 to-green-600"
    },
    { 
      href: "/budget", 
      label: "Budgets", 
      icon: Wallet,
      description: "Manage your budgets",
      gradient: "from-yellow-400 to-yellow-600"
    },
    { 
      href: "/transactions", 
      label: "Transactions", 
      icon: Receipt,
      description: "Track your spending",
      gradient: "from-green-400 to-green-600"
    },
    { 
      href: "/reports", 
      label: "Reports", 
      icon: PieChart,
      description: "Financial analytics",
      gradient: "from-yellow-400 to-yellow-600"
    },
    { 
      href: "/categories", 
      label: "Categories", 
      icon: Tags,
      description: "Organize expenses",
      gradient: "from-green-400 to-green-600"
    },
    { 
      href: "/account", 
      label: "Notifications", 
      icon: Bell,
      description: "Alerts and updates",
      gradient: "from-yellow-400 to-yellow-600"
    },
    { 
      href: "/account", 
      label: "Accounts", 
      icon: Building2,
      description: "Manage accounts",
      gradient: "from-green-400 to-green-600"
    },
  ];

  return (
    <>
    
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-green-500 to-yellow-500 text-white p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Menu className="w-6 h-6 text-white" />
        )}
      </button>

      <aside
        className={cn(
          "h-screen w-64 md:w-56 bg-white/95 backdrop-blur-xl shadow-xl flex flex-col fixed z-40 transition-all duration-300 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
       
        <div className="flex items-center space-x-2 p-4 bg-gradient-to-r from-green-500 to-yellow-500 text-white">
          <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-wide">WalletPro</span>
            <span className="text-xs text-white/80">Financial Management</span>
          </div>
        </div>

       
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map(({ href, label, icon: Icon, description, gradient }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group relative",
                    pathname === href
                      ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
                      : "text-gray-700 hover:bg-gray-50"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={cn(
                    "w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-200",
                    pathname === href
                      ? "bg-white/20 backdrop-blur-sm"
                      : `bg-gradient-to-r ${gradient} text-white`
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{label}</span>
                    <span className={cn(
                      "text-xs",
                      pathname === href ? "text-white/80" : "text-gray-500"
                    )}>
                      {description}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        
        <div className="p-2 border-t border-gray-200">
          <LogoutLink>
            <button
              className="flex items-center w-full space-x-3 px-3 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-all duration-200 group"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white group-hover:from-red-500 group-hover:to-red-700">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Log out</span>
                <span className="text-xs text-red-500">End your session</span>
              </div>
            </button>
          </LogoutLink>
        </div>
      </aside>

  
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden transition-all duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}