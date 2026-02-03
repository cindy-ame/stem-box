import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-cardBgSoft flex justify-center">
      <div className="w-full max-w-sm bg-white min-h-screen relative shadow-xl">
        {children}
      </div>
    </div>
  );
}
