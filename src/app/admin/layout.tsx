import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-slate-950 text-slate-300">
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-amber-500">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Dashboard Overview</Link>
          <Link href="/admin/categories" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Manage Categories</Link>
          <Link href="/admin/products" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Products Management</Link>
          <Link href="/admin/orders" className="block px-4 py-2 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">Orders</Link>
          <div className="pt-4 mt-4 border-t border-slate-800">
             <Link href="/" className="block px-4 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">Back to Storefront</Link>
          </div>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
