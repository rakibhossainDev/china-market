"use client";

import Link from 'next/link';
import { Home, LayoutGrid, Search, ShoppingCart, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function MobileBottomNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 h-16 flex items-center justify-around md:hidden px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      <Link href="/" className="flex flex-col items-center justify-center w-full text-slate-500 hover:text-amber-500 transition-colors">
        <Home className="h-5 w-5 mb-1" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link href="/categories" className="flex flex-col items-center justify-center w-full text-slate-500 hover:text-amber-500 transition-colors">
        <LayoutGrid className="h-5 w-5 mb-1" />
        <span className="text-[10px] font-medium">Categories</span>
      </Link>
      <Link href="/search" className="flex flex-col items-center justify-center w-full text-slate-500 hover:text-amber-500 transition-colors">
        <Search className="h-5 w-5 mb-1" />
        <span className="text-[10px] font-medium">Search</span>
      </Link>
      <Link href="/cart" className="flex flex-col items-center justify-center w-full text-slate-500 hover:text-amber-500 transition-colors relative">
        <ShoppingCart className="h-5 w-5 mb-1" />
        <span className="text-[10px] font-medium">Cart</span>
        <span className="absolute top-0 right-3 bg-amber-500 text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
      </Link>
      <Link 
        href={isAuthenticated ? "/profile" : "/login"} 
        className="flex flex-col items-center justify-center w-full text-slate-500 hover:text-amber-500 transition-colors"
      >
        <User className="h-5 w-5 mb-1" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </nav>
  );
}
