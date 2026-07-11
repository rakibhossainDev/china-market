"use client";

import { useState } from 'react';
import { Search, Menu, ShoppingCart, Camera, Heart, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-200 relative">
      {/* 
        Single Row Layout:
        Mobile: standard row layout flex items-center justify-between w-full px-4 h-16
        Desktop: standard h-20 px-6/8
      */}
      <div className={`flex items-center justify-between w-full px-4 h-16 md:px-6 lg:px-8 md:h-20 md:gap-4 ${isSearchFocused ? 'hidden md:flex' : ''}`}>
        
        {/* Mobile: Hamburger & Logo Group */}
        <div className="flex items-center gap-2 md:hidden shrink-0">
          <button 
            className="p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-md transition-colors shrink-0"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="text-sm font-bold text-slate-900 flex-shrink-0 tracking-tight hover:opacity-90 transition-opacity cursor-pointer select-none">
            CM
          </Link>
        </div>
        
        {/* Mobile Search Bar (Compact Trigger) */}
        <div className="flex-grow flex-1 mx-2 relative md:hidden">
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setIsSearchFocused(true)}
            readOnly
            className="w-full h-9 text-xs bg-slate-100 border-none rounded-md pl-8 pr-3 focus:outline-none cursor-text"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
        </div>

        {/* Desktop Search Bar (hidden on mobile, flex-1 on desktop) */}
        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name, SKU, or category..."
              className="w-full bg-slate-100 text-slate-900 rounded-md py-2.5 pl-12 pr-[120px] focus:outline-none focus:ring-2 focus:ring-[#F2A900] transition-shadow"
            />
            <Search className="absolute left-4 top-3 h-5 w-5 text-slate-400" />
            <Camera className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-[#F2A900] transition-colors z-10" />
            <button className="absolute right-1 top-1 bg-[#F2A900] hover:bg-[#D99700] text-slate-950 font-semibold py-1.5 px-4 rounded-md transition-colors text-sm">
              Search
            </button>
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center shrink-0 ml-auto md:ml-0 gap-3 md:gap-6">
          <div className="flex items-center gap-1 md:gap-3">
            <Link href="/wishlist" className="p-1.5 md:p-2 text-slate-600 hover:text-[#F2A900] hover:bg-slate-100 rounded-full transition-colors hidden md:block" title="Wishlist">
              <Heart className="h-5 w-5 md:h-6 md:w-6" />
            </Link>
            
            <Link href="/cart" className="relative p-1.5 md:p-2 text-slate-600 hover:text-[#F2A900] hover:bg-slate-100 rounded-full transition-colors inline-block" title="Cart">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              <span className="absolute top-0 right-0 bg-[#F2A900] text-slate-950 text-[10px] md:text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                0
              </span>
            </Link>

            {/* Mobile User Profile Slot */}
            <Link href="/login" className="p-1.5 text-slate-600 hover:text-[#F2A900] hover:bg-slate-100 rounded-full transition-colors md:hidden" title="Profile">
              <User className="h-5 w-5" />
            </Link>
          </div>

          {/* User Profile Card (Desktop Only) */}
          <Link href="/login" className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-900 leading-none mb-1">Rakib Hossain</span>
              <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 leading-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                +880 17... (Verified)
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Search Focus Takeover */}
      {isSearchFocused && (
        <div className="fixed top-0 inset-x-0 h-16 bg-white z-50 flex items-center px-4 gap-3 w-full border-b border-slate-100 animate-in slide-in-from-top duration-200 md:hidden">
          <button 
            onClick={() => setIsSearchFocused(false)}
            className="p-1.5 -ml-1 text-slate-600 hover:bg-slate-100 rounded-full transition-colors shrink-0"
            aria-label="Cancel search"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          
          <div className="flex-grow relative flex items-center h-10">
            <input
              type="text"
              autoFocus
              placeholder="Search products..."
              className="w-full h-full text-sm bg-slate-100 border-none rounded-md pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#F2A900]"
            />
            <Camera className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer w-5 h-5 hover:text-[#F2A900] transition-colors z-10" />
          </div>
        </div>
      )}
    </header>
  );
}
