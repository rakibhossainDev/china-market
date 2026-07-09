import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminDashboard() {
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-slate-700 transition-all flex flex-col justify-center">
          <h3 className="text-slate-400 font-medium tracking-wide uppercase text-sm">Total Products</h3>
          <p className="text-5xl font-bold text-white mt-3 drop-shadow-md">{productCount || 0}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-slate-700 transition-all flex flex-col justify-center">
          <h3 className="text-slate-400 font-medium tracking-wide uppercase text-sm">Total Categories</h3>
          <p className="text-5xl font-bold text-white mt-3 drop-shadow-md">{categoryCount || 0}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm shadow-xl hover:border-slate-700 transition-all flex flex-col justify-center">
          <h3 className="text-slate-400 font-medium tracking-wide uppercase text-sm">Active Orders</h3>
          <p className="text-5xl font-bold text-emerald-500 mt-3 drop-shadow-md">{orderCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
