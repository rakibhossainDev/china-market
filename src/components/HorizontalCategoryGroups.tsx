import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ImageIcon } from 'lucide-react';

export default async function HorizontalCategoryGroups() {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*, sub_categories(*)')
    .eq('is_featured', true)
    .order('name');
    
  if (catError || !categories) {
    console.error("Error fetching categories:", catError);
    return null;
  }

  const categoryGroups = categories.map((cat) => {
    const subCats = cat.sub_categories || [];
      
    return {
      id: cat.id,
      title: cat.name,
      items: subCats.map((s: any) => ({
        id: s.id,
        name: s.name,
        slug: s.slug || '',
        image_url: s.image_url,
        category_id: s.category_id
      }))
    };
  });

  const activeGroups = categoryGroups.filter(g => g.items.length > 0);

  if (activeGroups.length === 0) {
    return (
      <section className="pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-full py-12 text-center bg-white rounded-2xl border border-slate-100 p-6">
            <p className="text-slate-500 text-sm">No active collections found. Please add categories and products from the Admin Dashboard.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto gap-5 pb-4 pt-2 w-full snap-x snap-mandatory scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent px-4">
          {activeGroups.map((group) => (
            <div 
              key={group.id} 
              className="w-[85vw] sm:w-[320px] md:w-[290px] lg:w-[300px] xl:w-[310px] flex-shrink-0 snap-start bg-white border border-slate-100 p-2.5 sm:p-3.5 rounded-md flex flex-col justify-between shadow-sm"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-950 mb-2.5 truncate">{group.title}</h3>
              
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {group.items.map((item: { id: number; name: string; slug: string; image_url: string | null; category_id: number }, idx: number) => (
                  <div key={idx} className="flex flex-col items-center group cursor-pointer">
                    <div className="relative w-full aspect-square bg-slate-50 rounded-md overflow-hidden flex items-center justify-center border border-slate-100">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="text-slate-400 w-8 h-8" />
                      )}
                    </div>
                    <span className="mt-1.5 text-[11px] sm:text-xs font-medium text-slate-700 text-center tracking-tight truncate w-full px-1 pb-0.5">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
