"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { User, BadgeCheck, ShoppingBag, FileText, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [router]);

  // Prevent flash of unauthenticated layout content during mount
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-7rem)] bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#F2A900] animate-spin" />
      </div>
    );
  }

  // Extract the real phone digits back to the UI from our virtual email payload
  const displayPhone = user?.email ? user.email.split('@')[0] : 'N/A';

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-slate-50 p-4 sm:p-6 flex flex-col items-center">
      
      {/* Profile Header Card */}
      <div className="w-full max-w-md flex flex-col items-center mt-2 mb-2">
        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
          <User className="h-12 w-12 text-slate-400" />
        </div>
        <h1 className="text-lg font-bold text-slate-900 mt-3">{displayPhone}</h1>
        
        <div className="flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-100">
          <BadgeCheck className="h-4 w-4" />
          <span>Verified Wholesaler Account</span>
        </div>
      </div>

      {/* Menu Item List Grid (Enterprise Sharp Radius) */}
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-md divide-y divide-slate-100 mt-4 shadow-sm overflow-hidden">
        
        <Link href="/admin/orders" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-md">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-800">My Bulk Orders</span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </Link>

        <Link href="/sourcing" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-800">Sourcing Requests</span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </Link>

        <Link href="/profile/address" className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-md">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-sm font-medium text-slate-800">Shipping & Address</span>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-400" />
        </Link>

      </div>

      <div className="w-full max-w-md">
        <button 
          onClick={async () => {
            await supabase.auth.signOut();
            router.push('/login');
          }}
          className="w-full mt-6 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 px-4 rounded text-sm transition-colors text-center border border-red-100"
        >
          Log Out
        </button>
      </div>
      
    </div>
  );
}
