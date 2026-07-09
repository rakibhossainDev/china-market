import { supabase } from '@/lib/supabase';

export const revalidate = 0;

export default async function AdminDashboard() {
  const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
  const { count: categoryCount } = await supabase.from('categories').select('*', { count: 'exact', head: true });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-slate-400 font-medium">Total Products</h3>
          <p className="text-4xl font-bold text-white mt-2">{productCount || 0}</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <h3 className="text-slate-400 font-medium">Total Categories</h3>
          <p className="text-4xl font-bold text-white mt-2">{categoryCount || 0}</p>
        </div>
      </div>
    </div>
  );
}
