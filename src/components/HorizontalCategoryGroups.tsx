import React from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default async function HorizontalCategoryGroups() {
  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('*')
    .order('name');
    
  if (catError || !categories) {
    console.error("Error fetching categories:", catError);
    return null;
  }

  const categoryGroups = await Promise.all(
    categories.map(async (cat) => {
      const { data: subCats } = await supabase
        .from('sub_categories')
        .select('*')
        .eq('category_id', cat.id)
        .limit(4);
        
      return {
        id: cat.id,
        title: `${cat.name} Collection`,
        items: (subCats || []).map(s => ({
          name: s.name,
          image: s.image_url || 'https://via.placeholder.com/150'
        }))
      };
    })
  );

  const activeGroups = categoryGroups.filter(g => g.items.length > 0);

  if (activeGroups.length === 0) return null;

  return (
    <section className="pb-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex overflow-x-auto space-x-4 px-4 sm:px-6 lg:px-8 pb-4 scrollbar-hide snap-x snap-mandatory">
          {activeGroups.map((group) => (
            <div 
              key={group.id} 
              className="w-[88%] sm:w-[45%] md:w-[31%] flex-shrink-0 bg-white rounded-2xl p-4 border border-slate-100 shadow-sm snap-center"
            >
              <h3 className="text-orange-600 font-bold text-base md:text-lg mb-4">{group.title}</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {group.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center group cursor-pointer">
                    <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-center aspect-square h-24 md:h-28 w-full group-hover:bg-slate-100 transition-colors overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center rounded bg-no-repeat group-hover:scale-105 transition-transform duration-300" 
                        style={{ backgroundImage: `url(${item.image})` }}
                      />
                    </div>
                    <span className="text-xs md:text-sm text-center text-slate-700 font-medium mt-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
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
