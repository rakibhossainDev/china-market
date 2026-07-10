"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    return pathname === path 
      ? 'bg-slate-800 text-amber-500 font-medium shadow-sm' 
      : 'text-slate-300 hover:bg-slate-800 hover:text-white';
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Mobile Top Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 z-40 flex items-center justify-between px-4 shadow-sm">
        <h2 className="text-lg font-bold text-amber-500 tracking-tight">Admin Dashboard</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 p-6 z-50 flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="pb-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-amber-500 tracking-tight">Admin Dashboard</h2>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 pt-6 space-y-2 overflow-y-auto">
          <Link href="/admin" className={`block px-4 py-2.5 rounded-md transition-all ${isActive('/admin')}`}>Dashboard Overview</Link>
          <Link href="/admin/categories" className={`block px-4 py-2.5 rounded-md transition-all ${isActive('/admin/categories')}`}>Manage Categories</Link>
          <Link href="/admin/hero" className={`block px-4 py-2.5 rounded-md transition-all flex items-center gap-2 ${isActive('/admin/hero')}`}>
            Manage Hero
          </Link>
          <Link href="/admin/products" className={`block px-4 py-2.5 rounded-md transition-all ${isActive('/admin/products')}`}>Products Management</Link>
          <Link href="/admin/orders" className={`block px-4 py-2.5 rounded-md transition-all ${isActive('/admin/orders')}`}>Orders</Link>
          <Link href="/admin/recycle-bin" className={`block px-4 py-2.5 rounded-md transition-all flex items-center justify-between ${isActive('/admin/recycle-bin')}`}>
            Recycle Bin
          </Link>
          <div className="pt-6 mt-6 border-t border-slate-800">
             <Link href="/" className="block px-4 py-2.5 rounded-md text-slate-400 hover:bg-slate-800 hover:text-white transition-all">Back to Storefront</Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:pl-64 min-h-screen bg-slate-950 text-slate-100 p-4 pt-20 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
