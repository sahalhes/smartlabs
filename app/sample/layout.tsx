"use client";

import { type ReactNode, useEffect } from "react";
import { usePathname } from 'next/navigation';

interface LayoutProps {
  children: ReactNode;
}

const SampleLayout = ({ children }: LayoutProps) => {
  const pageUrl = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${pageUrl}`;

      try {
        console.log("Initializing chat instance for sample page...");

        // Send the POST request when the component mounts
        fetch("https://n8n.sahalhes.me/webhook/53c136fe-3e77-4709-a143-fe82746dd8b6/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "please save this website for future use",
            pageUrl: fullUrl,
          }),
        })
        .then(response => response.json())
        .then(data => console.log("Response:", data))
        .catch(error => console.error("Error:", error));
      } catch (error) {
        console.error("Error initializing sample page:", error);
      }
    }
  }, [pageUrl]);

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-blue-600 text-white p-4 text-lg font-bold">Sample App</nav>
      <main className="flex-1 p-6">{children}</main>
      <footer className="bg-gray-800 text-white text-center p-2">&copy; 2025 Sample App</footer>
    </div>
  );
};

export default SampleLayout;