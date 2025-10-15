'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function VerifyOTPPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [verificationType, setVerificationType] = useState('signup');

  useEffect(() => {
    // Get email from sessionStorage
    const storedEmail = sessionStorage.getItem('verificationEmail');
    const storedType = sessionStorage.getItem('verificationType');

    if (!storedEmail) {
      // No email found, redirect back to signup
      router.push('/signup');
      return;
    }

    setEmail(storedEmail);
    setVerificationType(storedType || 'signup');
  }, [router]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = pastedData.split('');

    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);

    // Focus last filled input
    const lastIndex = Math.min(newOtp.length - 1, 5);
    const lastInput = document.getElementById(`otp-${lastIndex}`);
    lastInput?.focus();
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter complete 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            code: otpCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid verification code');
      }

      console.log('✅ OTP verified successfully!');

      // Store auth token
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userEmail', email);

      // Clear session storage
      sessionStorage.removeItem('verificationEmail');
      sessionStorage.removeItem('verificationType');

      // Redirect to home
      router.push('/');
    } catch (error: any) {
      console.error('❌ Verification error:', error);
      setError(error.message || 'Invalid verification code');

      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    setError('');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-code`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend code');
      }

      setResendSuccess(true);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();

      // Hide success message after 3 seconds
      setTimeout(() => setResendSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to resend code');
    } finally {
      setResendLoading(false);
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
        {/* Back Button */}
        <button
          onClick={() => router.push('/signup')}
          className="mb-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to signup</span>
        </button>

        {/* Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-10">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-5 rounded-2xl">
                <Mail className="w-12 h-12 text-white" strokeWidth={2} />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-white text-center mb-3">
            {verificationType === 'login'
              ? "Verifying it's you"
              : 'Check your email'}
          </h1>

          <p className="text-white/70 text-center mb-8">
            {verificationType === 'login'
              ? 'We sent a security code to verify your identity'
              : 'We sent a verification code to'}
            <br />
            <span className="text-white font-medium">{email}</span>
          </p>

          {/* OTP Input */}
          <div className="flex gap-3 justify-center mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-2xl font-bold bg-white/10 border-2 border-white/20 rounded-xl text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Success Message */}
          {resendSuccess && (
            <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-sm text-green-300 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              New code sent successfully!
            </div>
          )}

          {/* Verify Button */}
          <button
            onClick={handleVerifyOTP}
            disabled={loading || otp.join('').length !== 6}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Verifying...
              </div>
            ) : (
              'Verify Code'
            )}
          </button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-white/50 text-sm mb-2">Didn't receive code?</p>
            <button
              onClick={handleResendOTP}
              disabled={resendLoading}
              className="text-purple-400 hover:text-purple-300 font-medium text-sm disabled:opacity-50 transition-colors"
            >
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </button>
          </div>

          {/* Expiry Notice */}
          <p className="text-white/40 text-xs text-center mt-6">
            Code expires in 10 minutes
          </p>
        </div>
      </div>
    </div>
  );
}
