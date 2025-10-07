'use client';

import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';
import { useState } from 'react';

export default function GoogleAuthButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    // TODO: Implement Google OAuth
    setTimeout(() => {
      console.log('Google Sign In clicked');
      setIsLoading(false);
      // Backend OAuth URL yahan integrate hoga
    }, 1500);
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 group"
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-3">
          <div className="w-5 h-5 border-3 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
          <span>Connecting...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-3">
          <Chrome className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Continue with Google</span>
        </div>
      )}
    </Button>
  );
}
