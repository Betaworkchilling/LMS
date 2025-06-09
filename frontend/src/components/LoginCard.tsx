
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LoginCard = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    console.log('Get started clicked');
    navigate('/login');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold text-gray-800">
          Get Started
        </CardTitle>
        <CardDescription className="text-gray-600">
          Access your leave management dashboard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={handleGetStarted}
          className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          size="lg"
        >
          <User className="mr-3 h-5 w-5" />
          Sign In to Continue
        </Button>
        
        <div className="text-center pt-4">
          <p className="text-sm text-gray-500">
            Need help? Contact{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
              IT Support
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginCard;
