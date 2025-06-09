import React from 'react';
import { Building2 } from 'lucide-react';

const Logo = () => {
  const companyName = import.meta.env.VITE_COMPANY_NAME || 'LeaveHub';
  const companyDescription = import.meta.env.VITE_COMPANY_DESCRIPTION || 'HR Management';

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="bg-blue-600 p-4 rounded-full shadow-lg">
        <Building2 className="h-12 w-12 text-white" />
      </div>
      <div className="ml-4">
        <h2 className="text-2xl font-bold text-gray-800">{companyName}</h2>
        <p className="text-sm text-gray-500">{companyDescription}</p>
      </div>
    </div>
  );
};

export default Logo;
