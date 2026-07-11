"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Loader2, Package } from 'lucide-react';
import Link from 'next/link';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/login');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        
        setOrders(data || []);
      } catch (err: any) {
        setError('Failed to load orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [router]);

  const getStatusBadge = (status: string) => {
    const s = status?.toLowerCase() || 'pending';
    
    if (s === 'delivered' || s === 'completed') {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs px-2.5 py-1 font-semibold rounded inline-block">
          Delivered
        </span>
      );
    }
    
    if (s === 'shipped') {
      return (
        <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-xs px-2.5 py-1 font-semibold rounded inline-block">
          Shipped
        </span>
      );
    }
    
    // Default to pending / processing
    return (
      <span className="bg-amber-50 text-amber-700 border border-amber-200/60 text-xs px-2.5 py-1 font-semibold rounded inline-block">
        Pending
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-7rem)] bg-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-[#F2A900] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-7rem)] bg-slate-50 p-4 sm:p-6 flex flex-col items-center">
      
      {/* Header Row */}
      <div className="w-full max-w-md flex items-center gap-3 mb-6">
        <Link 
          href="/profile" 
          className="p-2 -ml-2 bg-white hover:bg-slate-100 rounded-full transition-colors border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-slate-700" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900">My Bulk Orders</h1>
      </div>

      {error ? (
        <div className="w-full max-w-md p-4 bg-red-50 text-red-600 rounded-md border border-red-100 text-center text-sm">
          {error}
        </div>
      ) : orders.length === 0 ? (
        <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-md shadow-sm flex flex-col items-center text-center">
          <Package className="w-12 h-12 text-slate-300 mb-3" />
          <h2 className="text-lg font-semibold text-slate-700">No orders yet</h2>
          <p className="text-sm text-slate-500 mt-1">When you place an order, it will appear here.</p>
          <Link 
            href="/"
            className="mt-6 bg-[#F2A900] hover:bg-[#D99600] text-white font-bold py-2.5 px-6 rounded text-sm transition-colors shadow-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="w-full max-w-md space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="w-full bg-white border border-slate-100 p-4 rounded-md shadow-sm space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 font-mono text-sm">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              
              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-sm text-slate-600 font-medium">
                  {order.items?.length || 1} {order.items?.length === 1 || !order.items ? 'item' : 'items'} purchased
                </span>
                <span className="font-bold text-slate-900 text-base">
                  {order.total_amount ? `৳${order.total_amount}` : '৳0'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
