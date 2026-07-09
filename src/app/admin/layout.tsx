"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path 
      ? 'bg-slate-800 text-amber-500 font-medium shadow-sm' 
      : 'text-slate-300 hover:bg-slate-800 hover:text-white';
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <aside className="h-screen fixed left-0 top-0 w-64 bg-slate-900 border-r border-slate-800 p-6 z-30 flex flex-col shadow-2xl">
        <div className="pb-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-amber-500 tracking-tight">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 pt-6 space-y-2">
          <Link href="/admin" className={`block px-4 py-2.5 rounded-lg transition-all ${isActive('/admin')}`}>Dashboard Overview</Link>
          <Link href="/admin/categories" className={`block px-4 py-2.5 rounded-lg transition-all ${isActive('/admin/categories')}`}>Manage Categories</Link>
          <Link href="/admin/products" className={`block px-4 py-2.5 rounded-lg transition-all ${isActive('/admin/products')}`}>Products Management</Link>
          <Link href="/admin/orders" className={`block px-4 py-2.5 rounded-lg transition-all ${isActive('/admin/orders')}`}>Orders</Link>
          <div className="pt-6 mt-6 border-t border-slate-800">
             <Link href="/" className="block px-4 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all">Back to Storefront</Link>
          </div>
        </nav>
      </aside>
      <main className="flex-1 pl-64 min-h-screen bg-slate-950 text-slate-100 p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
