'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  ArrowRight,
  Sparkles,
  Lock,
  Eye,
  EyeOff,
  Info,
  Check,
  X,
} from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // Password strength checks
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const allChecksPassed = Object.values(passwordChecks).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setInfo('');

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password strength
    if (!allChecksPassed) {
      setError('Please meet all password requirements');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.status === 409) {
        setInfo('Account already exists. Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      console.log('✅ OTP sent to:', email);

      sessionStorage.setItem('verificationEmail', email);
      sessionStorage.setItem('verificationType', 'signup');

      router.push('/verify-otp');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Signup failed';
      console.error('❌ Error:', error);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-10 animate-fade-in">
          {/* Logo */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-5 rounded-2xl animate-slide-up">
                <Sparkles className="w-14 h-14 text-white" strokeWidth={2} />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
              Lynq
            </h1>
            <p className="text-white/70 text-center text-lg font-light">
              Create your account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-white/80 text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  disabled={loading}
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Password Requirements - Only show when typing */}
              {password && (
                <div className="mt-3 space-y-2 bg-white/5 rounded-lg p-3 border border-white/10">
                  <p className="text-xs text-white/60 mb-2">
                    Password must contain:
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {passwordChecks.length ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordChecks.length
                            ? 'text-green-400'
                            : 'text-white/50'
                        }`}
                      >
                        At least 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {passwordChecks.uppercase ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordChecks.uppercase
                            ? 'text-green-400'
                            : 'text-white/50'
                        }`}
                      >
                        One uppercase letter (A-Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {passwordChecks.lowercase ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordChecks.lowercase
                            ? 'text-green-400'
                            : 'text-white/50'
                        }`}
                      >
                        One lowercase letter (a-z)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {passwordChecks.number ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordChecks.number
                            ? 'text-green-400'
                            : 'text-white/50'
                        }`}
                      >
                        One number (0-9)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {passwordChecks.special ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span
                        className={`text-xs ${
                          passwordChecks.special
                            ? 'text-green-400'
                            : 'text-white/50'
                        }`}
                      >
                        One special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300 animate-shake">
                {error}
              </div>
            )}

            {/* Info Message */}
            {info && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-sm text-blue-300 flex items-center gap-2">
                <Info className="w-4 h-4" />
                {info}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !allChecksPassed}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-white/50 text-sm text-center mt-6">
            We&apos;ll send a verification code to your email
          </p>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-black/40 text-white/50">
                Already have an account?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="block w-full text-center bg-white/5 hover:bg-white/10 border border-white/20 text-white font-semibold py-4 rounded-xl transition-all duration-200"
          >
            Log In
          </Link>

          {/* Terms */}
          <p className="text-xs text-white/40 text-center mt-8 leading-relaxed">
            By continuing, you agree to our{' '}
            <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
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
