"use client";

import { Search, Menu, ShoppingCart } from 'lucide-react';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white sticky top-0 z-30 shadow-sm border-b border-slate-200">
      <div className="flex items-center justify-between h-14 sm:h-20 px-4 sm:px-6 lg:px-8">
        <button 
          className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
        
        {/* Large Search Bar */}
        <div className="flex-1 max-w-2xl mx-4 md:ml-0 hidden sm:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              className="w-full bg-slate-100 text-slate-900 rounded-full py-2.5 px-6 pl-12 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
            <button className="absolute right-1 top-1 bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold py-1.5 px-4 rounded-full transition-colors text-sm">
              Search
            </button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <ShoppingCart className="h-6 w-6" />
            <span className="absolute top-0 right-0 bg-amber-500 text-blue-900 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
      
      {/* Mobile Search (visible only on very small screens) */}
      <div className="pb-4 px-4 sm:hidden">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full bg-slate-100 text-slate-900 rounded-lg py-2.5 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
        </div>
      </div>
    </header>
  );
}
