
import React from 'react';
import Header from '@/components/Header';
import Logo from '@/components/Logo';
import LoginCard from '@/components/LoginCard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-screen">
          {/* Logo Section */}
          <div className="w-full max-w-4xl">
            <Logo />
          </div>
          
          {/* Header Section */}
          <div className="w-full max-w-4xl">
            <Header />
          </div>
          
          {/* Login Card Section */}
          <div className="w-full max-w-md mt-8">
            <LoginCard />
          </div>
          
          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-400">
              © 2024 Leave Management System. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
