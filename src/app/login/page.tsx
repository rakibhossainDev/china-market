"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { User, KeyRound } from 'lucide-react';

type ViewState = 'request' | 'verify';

export default function LoginPage() {
  const router = useRouter();
  
  const [viewState, setViewState] = useState<ViewState>('request');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { shouldCreateUser: true } 
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Verification code sent! Please check your email.');
        setViewState('verify');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpToken) {
      setErrorMsg('Please enter the verification code.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({ 
        email, 
        token: otpToken, 
        type: 'email' 
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        // Successful login
        router.push('/');
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 p-6 sm:p-8 rounded-md shadow-sm flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              CM <span className="text-[#F2A900]">China Market</span>
            </span>
          </Link>
          <h1 className="mt-4 text-lg font-semibold text-slate-800">
            {viewState === 'request' ? 'Sign in to your account' : 'Verify your email'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {viewState === 'request' 
              ? 'Enter your email to receive a secure login code' 
              : `We sent a code to ${email || 'your email'}`}
          </p>
        </div>

        {/* Status Banners */}
        {errorMsg && (
          <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {errorMsg}
          </div>
        )}
        
        {successMsg && viewState === 'verify' && (
          <div className="w-full p-3 mb-4 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded">
            {successMsg}
          </div>
        )}

        {/* Forms */}
        {viewState === 'request' ? (
          <form onSubmit={handleSendOTP} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 bg-slate-50 text-sm text-slate-800 rounded focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] outline-none"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F2A900] hover:bg-[#D99600] text-white font-bold py-2.5 rounded text-sm transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              )}
              {isLoading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="w-full space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">
                6-Digit Code
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
                <input
                  id="otp"
                  type="text"
                  value={otpToken}
                  onChange={(e) => setOtpToken(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full pl-10 pr-3 py-2 border border-slate-200 bg-slate-50 text-sm text-slate-800 rounded focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] outline-none tracking-widest font-mono"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#F2A900] hover:bg-[#D99600] text-white font-bold py-2.5 rounded text-sm transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && (
                <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              )}
              {isLoading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}

        {/* Step Navigation Links */}
        <div className="mt-6 text-sm text-center">
          {viewState === 'request' ? (
            <button 
              onClick={() => {
                setViewState('verify');
                setErrorMsg('');
                setSuccessMsg('');
              }} 
              className="text-slate-500 hover:text-[#F2A900] transition-colors"
            >
              Already has an OTP ? Click Here
            </button>
          ) : (
            <button 
              onClick={() => {
                setViewState('request');
                setErrorMsg('');
                setSuccessMsg('');
                setOtpToken('');
              }} 
              className="text-slate-500 hover:text-[#F2A900] transition-colors"
            >
              Change Email Address
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
