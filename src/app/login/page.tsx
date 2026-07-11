"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type ViewState = 'request_otp' | 'verify_otp';

export default function LoginPage() {
  const router = useRouter();
  
  const [viewState, setViewState] = useState<ViewState>('request_otp');
  const [email, setEmail] = useState('');
  const [otpToken, setOtpToken] = useState('');
  
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { shouldCreateUser: true } 
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Verification code sent! Please check your email.');
        setViewState('verify_otp');
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
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

    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4">
      <div className="w-full max-w-md bg-white border border-slate-100 p-6 sm:p-8 rounded-md shadow-sm flex flex-col items-center">
        
        {/* Header / Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              CM <span className="text-[#F2A900]">China Market</span>
            </span>
          </Link>
          <h1 className="mt-4 text-lg font-semibold text-slate-800">
            {viewState === 'request_otp' ? 'Sign in to your account' : 'Verify your email'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {viewState === 'request_otp' 
              ? 'Enter your email to receive a secure login code' 
              : `We sent a code to ${email || 'your email'}`}
          </p>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {errorMsg}
          </div>
        )}
        
        {successMsg && viewState === 'verify_otp' && (
          <div className="w-full p-3 mb-4 text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 rounded">
            {successMsg}
          </div>
        )}

        {/* Forms */}
        {viewState === 'request_otp' ? (
          <form onSubmit={handleSendOTP} className="w-full space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded text-slate-800 focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] outline-none"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F2A900] hover:bg-[#D99600] text-white font-bold py-2.5 px-4 rounded transition-colors text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending Code...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="w-full space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-1">
                6-Digit Code
              </label>
              <input
                id="otp"
                type="text"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                placeholder="123456"
                required
                className="w-full px-3 py-2 border border-slate-200 bg-slate-50 rounded text-slate-800 focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] outline-none text-center tracking-widest text-lg font-mono"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F2A900] hover:bg-[#D99600] text-white font-bold py-2.5 px-4 rounded transition-colors text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
        )}

        {/* Footer Toggles */}
        <div className="mt-6 text-sm text-center">
          {viewState === 'request_otp' ? (
            <button 
              onClick={() => {
                setViewState('verify_otp');
                setErrorMsg('');
                setSuccessMsg('');
              }} 
              className="text-slate-500 hover:text-[#F2A900] transition-colors"
            >
              Already have an OTP? Click Here
            </button>
          ) : (
            <button 
              onClick={() => {
                setViewState('request_otp');
                setErrorMsg('');
                setSuccessMsg('');
                setOtpToken('');
              }} 
              className="text-slate-500 hover:text-[#F2A900] transition-colors"
            >
              Go Back to Enter Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
