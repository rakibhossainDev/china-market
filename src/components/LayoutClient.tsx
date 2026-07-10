"use client";

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import MobileBottomNav from './MobileBottomNav';
import { usePathname } from 'next/navigation';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC] font-sans text-slate-900">
      <Sidebar 
        isOpen={isMobileSidebarOpen} 
        setIsOpen={setIsMobileSidebarOpen} 
        isDesktopExpanded={isDesktopExpanded}
        setIsDesktopExpanded={setIsDesktopExpanded}
      />
      
      <div className={`flex-1 flex flex-col overflow-auto w-full relative transition-all duration-300 ease-in-out ${isDesktopExpanded ? 'md:ml-64' : 'md:ml-16'}`}>
        <Header onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="flex-1 shrink-0">{children}</main>
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
}
