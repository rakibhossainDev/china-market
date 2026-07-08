import React from 'react';
import Link from 'next/link';

const categoryGroups = [
  {
    id: 1,
    title: "Huge Collection of Bags",
    items: [
      { name: "Handbags", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400&auto=format&fit=crop" },
      { name: "Backpacks", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400&auto=format&fit=crop" },
      { name: "Wallets", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop" },
      { name: "Luggage", image: "https://images.unsplash.com/photo-1551537482-f209ebec9d71?q=80&w=400&auto=format&fit=crop" },
    ]
  },
  {
    id: 2,
    title: "Stylish Jewelry",
    items: [
      { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478514-4a520230f878?q=80&w=400&auto=format&fit=crop" },
      { name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b454bf?q=80&w=400&auto=format&fit=crop" },
      { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=400&auto=format&fit=crop" },
      { name: "Bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=400&auto=format&fit=crop" },
    ]
  },
  {
    id: 3,
    title: "Unique Watches",
    items: [
      { name: "Smartwatches", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=400&auto=format&fit=crop" },
      { name: "Analog", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=400&auto=format&fit=crop" },
      { name: "Digital", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&auto=format&fit=crop" },
      { name: "Luxury", image: "https://images.unsplash.com/photo-1587836149817-83c9be015b6d?q=80&w=400&auto=format&fit=crop" },
    ]
  },
  {
    id: 4,
    title: "Trendy Gadgets",
    items: [
      { name: "Earbuds", image: "https://images.unsplash.com/photo-1606220588913-b3aea9056d4c?q=80&w=400&auto=format&fit=crop" },
      { name: "Power Banks", image: "https://images.unsplash.com/photo-1609091839311-d5365f47d4ea?q=80&w=400&auto=format&fit=crop" },
      { name: "Chargers", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=400&auto=format&fit=crop" },
      { name: "Cables", image: "https://images.unsplash.com/photo-1558864559-ed673ba3610b?q=80&w=400&auto=format&fit=crop" },
    ]
  }
];

export default function HorizontalCategoryGroups() {
  return (
    <section className="py-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 mb-4">
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Explore Collections</h2>
          <Link href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm md:text-base">
            View All &rarr;
          </Link>
        </div>

        <div className="flex overflow-x-auto space-x-4 px-4 sm:px-6 lg:px-8 pb-4 scrollbar-hide snap-x snap-mandatory">
          {categoryGroups.map((group) => (
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
                    <span className="text-xs md:text-sm text-center text-slate-700 font-medium mt-1.5 group-hover:text-blue-600 transition-colors">
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
