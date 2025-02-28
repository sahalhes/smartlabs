import React from 'react';
import '../index.css';

export const metadata = {
  title: 'SmartLabs',
  description: 'Choose a prompt below or write your own to start chatting with AI agents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-gray-900 text-white p-4">
            <h1 className="text-xl font-bold mb-6">SmartLabs</h1>
            <nav className="space-y-2">
              <a href="/" className="flex items-center gap-2 p-3 rounded-md bg-blue-600 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                Home
              </a>
              <a href="/code" className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                Code
              </a>
              <a href="/sample" className="flex items-center gap-2 p-3 rounded-md hover:bg-gray-800 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                Sample
              </a>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}