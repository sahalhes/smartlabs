"use client";

import { useEffect } from "react";
import "@n8n/chat/style.css";
import { createChat } from "@n8n/chat";

export default function Page() {
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
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome to Sample Page</h1>
      <p className="text-gray-700 mb-6">
        This is a sample page with some random information.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Sample Content</h2>
          <p className="text-gray-600">
            This page demonstrates a simple layout with a header, content, and footer.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Responsive design</li>
            <li>Clean interface</li>
            <li>Easy navigation</li>
            <li>Modern aesthetics</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">About This Demo</h2>
        <p className="text-blue-700">
          This sample page is part of a larger application that includes a chat interface
          and code evaluation functionality.
        </p>
      </div>
    </div>
  );
}
