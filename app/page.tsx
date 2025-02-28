"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

// The webhook URL for the chat service
const WEBHOOK_URL = "https://n8n.sahalhes.me/webhook/study";

type Message = {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const QUICK_PROMPTS = [
  { id: 1, title: "Clean account fields" },
  { id: 2, title: "Clean contact fields" },
  { id: 3, title: "Create master 'People' list" },
  { id: 4, title: "Account Fit Score" },
  { id: 5, title: "Match leads to account" },
  { id: 6, title: "See prompt library" },
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent | string) => {
    if (typeof e !== 'string') {
      e.preventDefault();
    }
    
    const messageText = typeof e === 'string' ? e : input;
    
    if (!messageText.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to webhook
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: messageText }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract the response from the array format
      let responseText = "I received your message!";
      
      // Check if data is an array with at least one item containing 'output'
      if (Array.isArray(data) && data.length > 0 && data[0].output) {
        responseText = data[0].output;
      } else if (data.response) {
        // Fallback to previous format if available
        responseText = data.response;
      }

      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I couldn't process your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Function to render message content with proper formatting
  const renderMessageContent = (content: string, sender: string) => {
    if (sender === "bot") {
      return (
        <ReactMarkdown>
          {content}
        </ReactMarkdown>
      );
    }
    return content;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-2xl flex flex-col bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="p-6 flex flex-col items-center border-b">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold">SmartLabs</h1>
          <p className="text-sm text-gray-500 text-center mt-2">
            Choose a prompt below or write your own to start chatting with AI agents
          </p>
        </div>

        {/* Quick Prompts */}
        <div className="px-6 py-4 border-b">
          <p className="text-sm font-medium text-gray-700 mb-3">Ask about:</p>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handleQuickPrompt(prompt.title)}
                className="text-left py-2 px-3 border rounded-md text-sm hover:bg-gray-50 transition-colors"
              >
                {prompt.title}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: "40vh", minHeight: "40vh" }}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
              <p className="text-sm">Your conversation will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex gap-3 w-full", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80" alt="Bot" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                    </Avatar>
                  )}

                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={cn(
                        "rounded-xl px-4 py-2 break-words",
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-800",
                      )}
                    >
                      {renderMessageContent(message.content, message.sender)}
                    </div>
                    <span className="text-xs text-gray-400 mt-1">{formatTime(message.timestamp)}</span>
                  </div>

                  {message.sender === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80" alt="User" />
                      <AvatarFallback className="bg-blue-100 text-blue-600">ME</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80" alt="Bot" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-1.5 bg-gray-100 rounded-xl px-4 py-2">
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 bg-white rounded-b-lg">
          <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border rounded-md py-2 px-3"
              disabled={isLoading}
            />
            <div className="text-xs text-gray-400 mr-2">{input.length}/2000</div>
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !input.trim()} 
              className={cn(
                "rounded-full h-10 w-10 flex items-center justify-center",
                input.trim() ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
              )}
            >
              {isLoading ? 
                <Loader2 className="h-4 w-4 animate-spin" /> : 
                <Send className="h-4 w-4" />
              }
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}