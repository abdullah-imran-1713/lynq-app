import GoogleAuthButton from '@/components/ui/auth/GoogleAuthButton';
import { MessageCircle } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Glassmorphism Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-10 animate-fade-in">
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>

              {/* Icon Container */}
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-5 rounded-2xl animate-slide-up">
                <MessageCircle
                  className="w-14 h-14 text-white"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* App Name */}
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
              Lynq
            </h1>

            {/* Tagline */}
            <p className="text-white/70 text-center text-lg font-light">
              Where conversations flow naturally
            </p>
          </div>

          {/* Google Sign In Button */}
          <div className="mt-8">
            <GoogleAuthButton />
          </div>

          {/* Terms */}
          <p className="text-xs text-white/50 text-center mt-8 leading-relaxed">
            By signing in, you agree to our{' '}
            <span className="text-white/70 hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-white/70 hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Lynq. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
