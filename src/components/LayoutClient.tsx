"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileBottomNav from './MobileBottomNav';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Sidebar isOpen={isMobileSidebarOpen} setIsOpen={setIsMobileSidebarOpen} />
      
      <div className="flex-1 flex flex-col overflow-auto md:ml-64 w-full relative">
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <MobileBottomNav />
      </div>
    </div>
  );
}
