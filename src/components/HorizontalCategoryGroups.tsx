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
    <section className="pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-full overflow-x-hidden px-4">
          {activeGroups.map((group) => (
            <div 
              key={group.id} 
              className="w-full bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between"
            >
              <h3 className="text-slate-800 font-bold text-lg mb-4 truncate">{group.title}</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {group.items.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center group cursor-pointer">
                    <div className="relative w-full aspect-square bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-1">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600 mt-2 text-center truncate w-full px-1">
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
