"use client";

import { useState, useEffect, Suspense } from 'react';
import { X, ChevronDown, ChevronRight, Home, Package, Plane, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const coreLinks = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Bulk Order', href: '/bulk-order', icon: Package },
  { label: 'Track Sourcing', href: '/track', icon: Plane },
  { label: 'Account', href: '/account', icon: User },
];

const productCategories = [
  {
    name: 'Bags',
    id: 'bags',
    subcategories: [
      { name: 'Purse', id: 'purse' },
      { name: 'Briefcases', id: 'briefcases' },
      { name: 'Money Clip', id: 'money-clip' },
      { name: 'Wallet', id: 'wallet' },
      { name: 'Backpack', id: 'backpack' },
    ]
  },
  {
    name: 'Jewelry',
    id: 'jewelry',
    subcategories: [
      { name: 'Necklaces', id: 'necklaces' },
      { name: 'Rings', id: 'rings' },
      { name: 'Bracelets', id: 'bracelets' },
      { name: 'Earrings', id: 'earrings' },
    ]
  },
  {
    name: 'Electronics',
    id: 'electronics',
    subcategories: [
      { name: 'Smartphones', id: 'smartphones' },
      { name: 'Laptops', id: 'laptops' },
      { name: 'Accessories', id: 'accessories' },
      { name: 'Wearables', id: 'wearables' },
    ]
  },
  {
    name: 'Fashion',
    id: 'fashion',
    subcategories: [
      { name: 'Men', id: 'men' },
      { name: 'Women', id: 'women' },
      { name: 'Kids', id: 'kids' },
      { name: 'Shoes', id: 'shoes' },
      { name: 'Accessories', id: 'fashion-accessories' },
    ]
  }
];

function SidebarContent({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const subParam = searchParams.get('sub');

  const [expandedCategory, setExpandedCategory] = useState<string | null>(categoryParam);

  useEffect(() => {
    if (categoryParam) {
      setExpandedCategory(categoryParam);
    }
  }, [categoryParam]);

  const handleCategoryClick = (categoryId: string) => {
    // Toggle accordion state
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
    
    // Navigate to the category
    router.push(`/products?category=${categoryId}`);
    if (window.innerWidth < 768) {
      // Don't auto-close on mobile when clicking a parent category if it just expands, 
      // but since it navigates, maybe close it. Wait, if it navigates, user might want to see subcategories.
      // Let's keep it open on mobile when clicking parent so they can see subs.
    }
  };

  const handleSubCategoryClick = (categoryId: string, subId: string) => {
    router.push(`/products?category=${categoryId}&sub=${subId}`);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

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
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-slate-900 text-lg">
              CM
            </div>
            <span className="font-bold text-xl tracking-tight">China Market</span>
          </div>
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6 text-slate-300" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
          {/* Core Links */}
          <nav className="space-y-1">
            {coreLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white font-medium"
                  onClick={() => {
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-800 pt-4">
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Categories
            </h3>
            <nav className="space-y-1">
              {productCategories.map((category) => {
                const isActiveCategory = categoryParam === category.id;
                const isExpanded = expandedCategory === category.id;

                return (
                  <div key={category.id} className="flex flex-col">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors font-medium w-full text-left ${
                        isActiveCategory 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span>{category.name}</span>
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                      ) : (
                        <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                      )}
                    </button>
                    
                    {/* Subcategories Accordion */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-96 opacity-100 mt-1' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="flex flex-col space-y-1 px-4 pb-2 border-l-2 border-slate-800 ml-4">
                        {category.subcategories.map((sub) => {
                          const isActiveSub = isActiveCategory && subParam === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={() => handleSubCategoryClick(category.id, sub.id)}
                              className={`text-left pl-4 py-2 text-sm rounded-lg transition-colors ${
                                isActiveSub 
                                  ? 'text-amber-500 bg-amber-500/10 font-medium' 
                                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                              }`}
                            >
                              {sub.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Sidebar(props: { isOpen: boolean; setIsOpen: (val: boolean) => void }) {
  return (
    <Suspense fallback={<div className="w-64 bg-slate-900 hidden md:block h-full fixed"></div>}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
