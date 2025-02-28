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
      <h1 className="text-2xl font-bold mb-4">Turing Machine Simulator</h1>
      <p className="text-gray-700 mb-6">
        Explore the fundamentals of computation with an interactive Turing Machine simulation.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">What is a Turing Machine?</h2>
          <p className="text-gray-600">
            A Turing Machine is a mathematical model of computation that defines an abstract machine
            manipulating symbols on a strip of tape according to a set of rules.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-3">Key Features</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-600">
            <li>Infinite tape for unlimited computation</li>
            <li>Deterministic and Non-Deterministic models</li>
            <li>Foundation of modern computer science</li>
            <li>Used in complexity theory and algorithms</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
        <h2 className="text-xl font-semibold mb-3 text-blue-800">How This Works</h2>
        <p className="text-blue-700">
          This demo illustrates a simple Turing Machine setup. The chat interface allows you to
          interact with a virtual machine that can process strings and demonstrate state transitions.
        </p>
      </div>
    </div>
  );
}
