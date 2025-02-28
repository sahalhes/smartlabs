"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, RefreshCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

// The webhook URL for the agents
const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || "";
const WEBHOOK_URL_2 = process.env.NEXT_PUBLIC_WEBHOOK_URL_2 || "";

const CODING_PATTERNS = [
  "Implement a binary search algorithm",
  "Write a breadth-first search (BFS) algorithm for a graph",
  "Implement a depth-first search (DFS) algorithm for a tree",
  "Write a merge sort algorithm",
  "Implement a quick sort algorithm",
  "Create a solution for the knapsack problem using dynamic programming",
  "Implement a solution for finding the longest common subsequence",
  "Write an algorithm to detect a cycle in a linked list",
  "Implement a solution for the sliding window technique",
  "Create an algorithm for topological sorting of a directed graph"
];

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
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isQuestionLoading, setIsQuestionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [codeMessages]);

  // Fetch a random question on initial load
  useEffect(() => {
    fetchRandomQuestion();
  }, []);

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getRandomPattern = () => {
    return CODING_PATTERNS[Math.floor(Math.random() * CODING_PATTERNS.length)];
  };

  const [selectedPattern, setSelectedPattern] = useState("");

  const fetchRandomQuestion = async () => {
    setIsQuestionLoading(true);
    const randomPattern = getRandomPattern();
    setSelectedPattern(randomPattern); // Store the pattern in state

    try {
      const response = await fetch(WEBHOOK_URL_2, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Generate a concise coding question about: ${randomPattern}`,
          type: "question"
        }),
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0 && data[0].output) {
          setCurrentQuestion(data[0].output);
        } else if (data.response) {
          setCurrentQuestion(data.response);
        } else {
          setCurrentQuestion(randomPattern);
        }
      } else {
        setCurrentQuestion(randomPattern);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
      setCurrentQuestion(randomPattern);
    } finally {
      setIsQuestionLoading(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
  
    const newCodeMessage: CodeMessage = {
      id: Date.now().toString(),
      code: input,
      isLoading: true,
    };
  
    setCodeMessages((prev) => [...prev, newCodeMessage]);
    setInput("");
    setIsLoading(true);
  
    try {
      console.log(selectedPattern);
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: `Coding question: ${input}`, // Use selectedPattern
          type: "code"
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }
  
      const data = await response.json();
      
      let responseText = "I received your code!";
      
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        responseText = data[0].output;
      } else if (data.response) {
        responseText = data.response;
      }
  
      setCodeMessages((prev) =>
        prev.map((msg) =>
          msg.id === newCodeMessage.id
            ? { ...msg, response: responseText, isLoading: false }
            : msg
        )
      );
    } catch (error) {
      console.error("Error:", error);
  
      setCodeMessages((prev) =>
        prev.map((msg) =>
          msg.id === newCodeMessage.id
            ? { ...msg, error: "Failed to evaluate code. Please try again.", isLoading: false }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (codeMessages.length > 0) {
      navigator.clipboard.writeText(codeMessages[codeMessages.length - 1].code);
      setCopied(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Code Evaluation</h1>
      
      {/* Current question - top section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-700 flex-1 mr-2">
            {isQuestionLoading ? (
              <span className="flex items-center">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                Loading question...
              </span>
            ) : (
              <span className="font-medium">{currentQuestion}</span>
            )}
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchRandomQuestion}
            disabled={isQuestionLoading}
            className="flex-shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            New Question
          </Button>
        </div>
      </div>
      
      {/* Main content area with side-by-side layout */}
      <div className="flex flex-row gap-6 h-[calc(100vh-220px)]">
        {/* Left side - AI explanation/responses */}
        <div className="w-1/2 flex flex-col">
          <div className="flex-1 overflow-auto bg-white rounded-lg border border-gray-200 p-4">
            {codeMessages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                Your code evaluations will appear here
              </div>
            ) : (
              <div className="space-y-6">
                {codeMessages.map((message) => (
                  <div key={message.id} className="space-y-4">
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
        </div>
        
        {/* Right side - Code editor */}
        <div className="w-1/2 flex flex-col">
          {/* Code display area */}
          <div className="flex-1 bg-white rounded-lg border border-gray-200 mb-4 overflow-hidden">
            <div className="h-full flex flex-col">
              <div className="p-2 bg-gray-100 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Your Code:</h3>
              </div>
              <div className="flex-1 overflow-auto p-4 relative">
                {codeMessages.length > 0 ? (
                  <>
                    <pre className="bg-gray-900 text-white p-4 rounded-md overflow-x-auto h-full">
                      <code>{codeMessages[codeMessages.length - 1].code}</code>
                    </pre>
                    <button 
                      onClick={copyToClipboard}
                      className="absolute top-6 right-6 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-md transition-colors"
                      title="Copy code"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    Your submitted code will appear here
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Code input form */}
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
      </div>
    </div>
  );
}