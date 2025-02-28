"use client";

import { type ReactNode, useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Initializing chat widget...");

      // Use environment variable for webhook URL
      const chatInstance = createChat({
        webhookUrl: process.env.NEXT_PUBLIC_WEBHOOK_CHAT || "",
      });

      return () => {
        if (chatInstance && "destroy" in chatInstance && typeof chatInstance.destroy === "function") {
          chatInstance.destroy();
        }
      };
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 text-lg font-bold">Turing Machine article</nav>
      <main className="flex-1 p-6">{children}</main>
      <footer className="bg-gray-800 text-white text-center p-2">&copy; 2025 Turing Article</footer>
    </div>
  );
};

export default Layout;
