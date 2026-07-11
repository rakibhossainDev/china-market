"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Phone, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInstantLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!phone) {
      setErrorMsg('Please enter your phone number.');
      return;
    }

    setIsLoading(true);
    
    try {
      const virtualEmail = `${phone.trim()}@gmail.com`;
      const dynamicPassword = `${phone.trim()}_china_market_secure_pass`;
      
      // First, attempt a standard password sign-in
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: virtualEmail,
        password: dynamicPassword,
      });

      if (signInError) {
        // If signInError indicates the user does not exist (or any error in this instant flow), automatically trigger sign-up
        const { error: signUpError } = await supabase.auth.signUp({
          email: virtualEmail,
          password: dynamicPassword,
        });

        if (signUpError) {
          setErrorMsg(signUpError.message);
        } else {
          // Signup & instant session allocation successful
          setShowSuccess(true);
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 1500);
        }
      } else {
        // Sign in successful
        setShowSuccess(true);
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1500);
      }
    } catch (err: any) {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-7rem)] flex items-start sm:items-center justify-center bg-white sm:bg-[#F8FAFC] p-0 sm:p-4">
      <div className="w-full max-w-md bg-white border-0 sm:border border-slate-100 p-6 sm:p-8 rounded-none sm:rounded-md shadow-none sm:shadow-sm pt-12 sm:pt-8 flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              CM <span className="text-[#F2A900]">China Market</span>
            </span>
          </Link>
          <h1 className="mt-4 text-lg font-semibold text-slate-800">
            Sign in to your account
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter your phone number for instant access
          </p>
        </div>

        {/* Status Banners */}
        {errorMsg && (
          <div className="w-full p-3 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
            {errorMsg}
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleInstantLogin} className="w-full space-y-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
              Phone Number / মোবাইল নাম্বার
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
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
            {isLoading ? 'Processing...' : 'Instant Login / Sign Up'}
          </button>
        </form>

      </div>

      {showSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-2.5 z-50 animate-in fade-in slide-in-from-top-5 duration-300 text-sm font-bold tracking-wide">
          <CheckCircle2 className="w-5 h-5 text-emerald-100 flex-shrink-0"/>
          <span>Login Successful! Redirecting...</span>
        </div>
      )}
    </div>
  );
}
