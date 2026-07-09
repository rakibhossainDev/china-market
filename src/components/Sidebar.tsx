"use client";

import { useState, useEffect, Suspense } from 'react';
import { X, ChevronDown, ChevronRight, Home, Package, Plane, User, ShoppingBag, Gem, Monitor, Shirt, PanelLeftClose, Menu } from 'lucide-react';
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
    icon: ShoppingBag,
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
    icon: Gem,
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
    icon: Monitor,
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
    icon: Shirt,
    subcategories: [
      { name: 'Men', id: 'men' },
      { name: 'Women', id: 'women' },
      { name: 'Kids', id: 'kids' },
      { name: 'Shoes', id: 'shoes' },
      { name: 'Accessories', id: 'fashion-accessories' },
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
  isDesktopExpanded: boolean;
  setIsDesktopExpanded: (val: boolean) => void;
}

function SidebarContent({ isOpen, setIsOpen, isDesktopExpanded, setIsDesktopExpanded }: SidebarProps) {
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
    if (!isDesktopExpanded) setIsDesktopExpanded(true);
    setExpandedCategory(prev => (prev === categoryId ? null : categoryId));
    router.push(`/products?category=${categoryId}`);
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
      <div 
        className={`fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar Content */}
      <aside 
        className={`fixed left-0 top-0 z-50 h-full bg-slate-900 text-white shadow-2xl transform transition-transform md:transition-all duration-300 ease-in-out flex flex-col 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          ${isDesktopExpanded ? 'md:w-64' : 'md:w-16'}
          w-[280px] sm:w-[320px]
        `}
      >
        <div className={`flex items-center h-20 border-b border-slate-800 shrink-0 transition-all duration-300 ease-in-out ${isDesktopExpanded ? 'px-6 justify-between' : 'px-6 justify-between md:px-0 md:justify-center'}`}>
          <div className={`flex items-center gap-2 ${!isDesktopExpanded ? 'md:hidden' : ''}`}>
             <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center font-bold text-slate-900 text-lg shrink-0">
                CM
             </div>
             <span className="font-bold text-xl tracking-tight whitespace-nowrap">China Market</span>
          </div>
          
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6 text-slate-300" />
          </button>
          
          <button 
            className="hidden md:flex p-2 hover:bg-slate-800 rounded-lg shrink-0" 
            onClick={() => setIsDesktopExpanded(!isDesktopExpanded)}
          >
            {isDesktopExpanded ? (
              <PanelLeftClose className="h-5 w-5 text-slate-400 hover:text-white" />
            ) : (
              <Menu className="h-6 w-6 text-slate-300 hover:text-white" />
            )}
          </button>
        </div>
        
        <div className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-4 space-y-6 ${isDesktopExpanded ? 'px-4' : 'px-4 md:px-2'}`}>
          {/* Core Links */}
          <nav className="space-y-1">
            {coreLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link 
                  key={link.label}
                  href={link.href}
                  title={!isDesktopExpanded ? link.label : undefined}
                  className={`flex items-center gap-3 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white font-medium ${isDesktopExpanded ? 'px-4' : 'px-4 md:px-0 md:justify-center'}`}
                  onClick={() => {
                    if (window.innerWidth < 768) setIsOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className={`${!isDesktopExpanded ? 'md:hidden' : ''} whitespace-nowrap`}>
                    {link.label}
                  </span>
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-slate-800 pt-4">
            <h3 className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ${!isDesktopExpanded ? 'md:hidden' : ''}`}>
              Categories
            </h3>
            <nav className="space-y-1">
              {productCategories.map((category) => {
                const isActiveCategory = categoryParam === category.id;
                const isExpanded = expandedCategory === category.id && isDesktopExpanded;
                const Icon = category.icon;

                return (
                  <div key={category.id} className="flex flex-col">
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      title={!isDesktopExpanded ? category.name : undefined}
                      className={`flex items-center justify-between py-3 rounded-lg transition-colors font-medium w-full text-left ${
                        isActiveCategory 
                          ? 'bg-amber-500/10 text-amber-500' 
                          : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      } ${isDesktopExpanded ? 'px-4' : 'px-4 md:px-0 md:justify-center'}`}
                    >
                      <div className={`flex items-center ${isDesktopExpanded ? 'gap-3' : 'gap-3 md:gap-0'}`}>
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className={`${!isDesktopExpanded ? 'md:hidden' : ''} whitespace-nowrap`}>{category.name}</span>
                      </div>
                      <div className={`${!isDesktopExpanded ? 'md:hidden' : ''}`}>
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                        )}
                      </div>
                    </button>
                    
                    {/* Subcategories Accordion */}
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${!isDesktopExpanded ? 'md:hidden' : ''} ${
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
                              className={`text-left pl-4 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
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

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<div className={`bg-slate-900 hidden md:block h-full fixed z-50 ${props.isDesktopExpanded ? 'w-64' : 'w-16'}`}></div>}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
