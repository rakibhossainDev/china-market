"use client";

import { X } from 'lucide-react';
import Link from 'next/link';
import { desktopSidebarLinks } from '@/config/navigation';

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-blue-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-blue-900 text-lg">
              CM
            </div>
            <span className="font-bold text-xl tracking-tight">China Market</span>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6 text-slate-300" />
          </button>
        </div>
        
        <nav className="p-4 space-y-1">
          {desktopSidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link 
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors text-blue-100 hover:text-white font-medium"
                onClick={() => setIsOpen(false)}
              >
                {Icon && <Icon className="h-5 w-5" />}
                {link.label}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  );
}
