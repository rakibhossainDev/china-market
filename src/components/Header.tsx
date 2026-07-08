"use client";

import { Search, Menu, ShoppingCart, Camera } from 'lucide-react';
import Link from 'next/link';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-200">
      {/* 
        Single Row Layout:
        Mobile: compact gap-2 px-3 py-2
        Desktop: standard h-20 px-6/8
      */}
      <div className="flex items-center justify-between gap-2 px-3 py-2 md:px-6 lg:px-8 md:h-20 md:gap-4 md:py-0">
        
        {/* Mobile: Hamburger & Logo Group */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <button 
            className="p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-md transition-colors shrink-0"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-sm font-bold text-slate-900 flex-shrink-0 tracking-tight">CM</span>
        </div>
        
        {/* Mobile Search Bar (flex-1 on mobile, hidden on desktop) */}
        <div className="flex-grow flex-1 mx-1 relative md:hidden">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-9 text-xs bg-slate-100 border-none rounded-full pl-8 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Camera className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer w-4 h-4 hover:text-orange-500 transition-colors z-10" />
        </div>

        {/* Desktop Search Bar (hidden on mobile, flex-1 on desktop) */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              className="w-full bg-slate-100 text-slate-900 rounded-full py-2.5 pl-12 pr-[120px] focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow"
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
            <Camera className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-orange-500 transition-colors z-10" />
            <button className="absolute right-1 top-1 bg-amber-500 hover:bg-amber-600 text-blue-900 font-semibold py-1.5 px-4 rounded-full transition-colors text-sm">
              Search
            </button>
          </div>
        </div>

        {/* Quick actions (Cart) */}
        <div className="flex items-center shrink-0 ml-auto md:ml-0">
          <Link href="/cart" className="relative p-1.5 md:p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors inline-block">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            <span className="absolute top-0 right-0 bg-amber-500 text-blue-900 text-[10px] md:text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
