"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, RefreshCw } from "lucide-react";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [codeMessages]);

  // Fetch a random question on initial load
  useEffect(() => {
    fetchRandomQuestion();
  }, []);

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
          message: `Coding question: ${input} based on pattern ${selectedPattern}`, // Use selectedPattern
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
  

  return (
    <div className="flex flex-col h-full p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Code Evaluation</h1>
        
        <div className="flex items-center justify-between mt-2 bg-blue-50 p-3 rounded-lg border border-blue-100">
          <p className="text-gray-700 flex-1 truncate mr-2">
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