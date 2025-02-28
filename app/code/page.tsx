"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

// The webhook URL for the code evaluation service
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "";

type CodeMessage = {
  id: string;
  code: string;
  response?: string;
  isLoading: boolean;
  error?: string;
  result?: string;
};

export default function CodePage() {
  const [codeMessages, setCodeMessages] = useState<CodeMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [codeMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add code message to list
    const newCodeMessage: CodeMessage = {
      id: Date.now().toString(),
      code: input,
      isLoading: true,
    };

    setCodeMessages((prev) => [...prev, newCodeMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send code to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: `Coding question: ${input}`,
          type: "code"
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response
      let responseText = "I received your code!";
      
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        responseText = data[0].output;
      } else if (data.response) {
        responseText = data.response;
      }

      // Update the code message with the response
      setCodeMessages((prev) =>
        prev.map((msg) =>
          msg.id === newCodeMessage.id
            ? { ...msg, response: responseText, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Error:", error);

      // Update with error
      setCodeMessages((prev) =>
        prev.map((msg) =>
          msg.id === newCodeMessage.id
            ? {
                ...msg,
                error: "Failed to evaluate code. Please try again.",
                isLoading: false,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Code Evaluation</h1>
        <p className="text-gray-500">
          Write or paste code snippets to evaluate them
        </p>
      </div>

      <div className="flex-1 overflow-auto mb-6">
        {codeMessages.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500">
              Your code snippets and evaluations will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {codeMessages.map((message) => (
              <div key={message.id} className="space-y-4">
                <Card className="p-4 bg-gray-50">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Your Code:</h3>
                  <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto">
                    <code>{message.code}</code>
                  </pre>
                </Card>

                {message.isLoading ? (
                  <div className="flex items-center justify-center h-16 bg-white rounded-lg border border-gray-200">
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin mr-2" />
                    <p className="text-gray-500">Evaluating code...</p>
                  </div>
                ) : message.error ? (
                  <Card className="p-4 bg-red-50 text-red-700">
                    <p>{message.error}</p>
                  </Card>
                ) : (
                  <Card className="p-4 bg-white">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Response:</h3>
                    <div className="prose max-w-none">
                      <ReactMarkdown>{message.response || ""}</ReactMarkdown>
                    </div>
                  </Card>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <Card className="p-4 bg-white">
        <form onSubmit={handleSubmitCode}>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write or paste your code here..."
            className="min-h-[150px] mb-4 font-mono"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-400">{input.length}/2000</div>
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={cn(
                "px-4 py-2",
                input.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-200 text-gray-500"
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Evaluate Code
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}