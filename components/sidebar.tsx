"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Code, FileText, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const routes = [
    {
      icon: Home,
      label: "Home",
      href: "/",
    },
    {
      icon: Code,
      label: "Code",
      href: "/code",
    },
    {
      icon: FileText,
      label: "Sample",
      href: "/sample",
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="fixed top-4 left-4 z-40 md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label={isMobileOpen ? "Close menu" : "Open menu"}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={cn(
          "bg-gray-900 text-white w-64 flex-shrink-0 transition-all duration-300 ease-in-out z-30",
          isMobileOpen ? "fixed inset-y-0 left-0" : "fixed inset-y-0 -left-64 md:left-0 md:relative"
        )}
      >
        <div className="p-6">
          <h1 className="text-xl font-bold mb-8">Talk Data to Me</h1>
          <nav className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  pathname === route.href
                    ? "bg-blue-700 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <route.icon className="h-5 w-5" />
                <span>{route.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}