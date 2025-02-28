"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function SamplePage() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${pathname}`;

      try {
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
  }, [pathname]);

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
            This page demonstrates a simple layout with header, content, and footer.
            It's based on the sample code you provided.
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
          and code evaluation functionality. Feel free to explore the other sections using
          the sidebar navigation.
        </p>
      </div>
    </div>
  );
}