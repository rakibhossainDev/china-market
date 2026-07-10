"use client";

import { useState, useEffect, Suspense } from 'react';
import { X, ChevronDown, ChevronRight, Home, Package, Plane, User, ShoppingBag, Gem, Monitor, Shirt, PanelLeftClose, Menu, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const topLink = { label: 'Home', href: '/', icon: Home };
const bottomLinks = [
  { label: 'Bulk Order', href: '/bulk-order', icon: Package },
  { label: 'Track Sourcing', href: '/track', icon: Plane },
  { label: 'Accounting', href: '/account', icon: User },
];

const iconMap: Record<string, React.ElementType> = {
  'ShoppingBag': ShoppingBag,
  'Gem': Gem,
  'Monitor': Monitor,
  'Shirt': Shirt,
};

interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: SubCategory[];
}

interface SubCategory {
  id: string;
  name: string;
  category_id: string;
}

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categoryParam) {
      setExpandedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data: cats, error: catsError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
          
        const { data: subCats, error: subCatsError } = await supabase
          .from('sub_categories')
          .select('*')
          .order('name');

        if (catsError || subCatsError) {
          console.error("Error fetching categories:", catsError || subCatsError);
          setCategories([]);
          return;
        }

        const formattedCategories = (cats || []).map(cat => ({
          ...cat,
          subcategories: (subCats || []).filter(sub => sub.category_id === cat.id)
        }));
        setCategories(formattedCategories);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCategories();
  }, []);

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
        className={`fixed inset-0 bg-black/60 z-[90] md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Sidebar Content */}
      <aside 
        className={`fixed inset-y-0 left-0 z-[100] md:z-50 h-screen bg-[#0B1528] text-white shadow-2xl transform transition-transform md:transition-all duration-300 ease-in-out flex flex-col 
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
        
        <div className={`flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pt-4 pb-24 md:pb-4 space-y-6 ${isDesktopExpanded ? 'px-4' : 'px-4 md:px-2'}`}>
          {/* Top Section */}
          <nav className="space-y-1">
            <Link 
              href={topLink.href}
              title={!isDesktopExpanded ? topLink.label : undefined}
              className={`flex items-center gap-3 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white font-medium ${isDesktopExpanded ? 'px-4' : 'px-4 md:px-0 md:justify-center'}`}
              onClick={() => {
                if (window.innerWidth < 768) setIsOpen(false);
              }}
            >
              <topLink.icon className="h-5 w-5 shrink-0" />
              <span className={`${!isDesktopExpanded ? 'md:hidden' : ''} whitespace-nowrap`}>
                {topLink.label}
              </span>
            </Link>
          </nav>

          {/* Categories Section (Middle) */}
          <div>
            <h3 className={`px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ${!isDesktopExpanded ? 'md:hidden' : ''}`}>
              Categories
            </h3>
            {isLoading ? (
              <div className="space-y-2 px-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-10 bg-slate-800 rounded animate-pulse" />
                ))}
              </div>
            ) : categories.length === 0 ? (
              <p className={`text-slate-500 text-sm px-4 ${!isDesktopExpanded ? 'hidden' : ''}`}>No categories found.</p>
            ) : (
              <nav className="space-y-1">
                {categories.map((category) => {
                  const isActiveCategory = categoryParam === category.id;
                  const isExpanded = expandedCategory === category.id && isDesktopExpanded;
                  const Icon = iconMap[category.icon] || HelpCircle;

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
                      {category.subcategories && category.subcategories.length > 0 && (
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
                      )}
                    </div>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Bottom Section (Services) */}
          <div className="pt-6 border-t border-slate-800/60">
            <nav className="space-y-1">
              {bottomLinks.map((link) => {
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
          </div>
        </div>
      </aside>
    </>
  );
}

export default function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<div className={`bg-[#0B1528] hidden md:block h-full fixed z-50 ${props.isDesktopExpanded ? 'w-64' : 'w-16'}`}></div>}>
      <SidebarContent {...props} />
    </Suspense>
  );
}
