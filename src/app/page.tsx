import { Package, ShieldCheck, Plane, Tags, Headset, Zap } from 'lucide-react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import HorizontalCategoryGroups from '@/components/HorizontalCategoryGroups';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data: trendingProducts } = await supabase.from('products').select('*').limit(8);
  return (
    <div className="bg-[#F8FAFC] min-h-screen flex flex-col">
      <main className="flex-1">
        {/* 1. Hero Slider */}
        <HeroSlider />

        {/* 2. Custom Category Groups Slider */}
        <HorizontalCategoryGroups />

        {/* 3. Trending Wholesale Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
                <Zap className="h-5 w-5 fill-rose-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Trending Wholesale Products</h2>
            </div>
            <button className="hidden sm:block text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              Explore Catalog &rarr;
            </button>
          </div>

          {!trendingProducts || trendingProducts.length === 0 ? (
            <div className="w-full py-12 text-center bg-white rounded-2xl border border-slate-100 p-6">
              <p className="text-slate-500 text-sm">No trending products found. Please add products from the Admin Dashboard.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {trendingProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-2xl border border-slate-100/80 shadow-sm overflow-hidden hover:-translate-y-1.5 hover:shadow-md hover:border-slate-200/50 transition-all duration-300 ease-out flex flex-col h-full relative group">
                  {/* Product Image */}
                  <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center p-4">
                    <img 
                      src={product.images?.[0] || 'https://via.placeholder.com/300'}
                      alt={product.title}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Overlay Badges */}
                    <div className="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-sm flex items-center gap-1">
                      <Plane className="h-3 w-3" />
                      7-Day Air Shipping
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded">
                      MOQ: {product.moq} pcs
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-3 md:p-4 flex-1 flex flex-col bg-white relative z-10">
                    <h3 className="font-semibold text-slate-900 text-sm md:text-base line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    <div className="mt-auto">
                      <div className="bg-slate-50 rounded p-2 md:p-3 border border-slate-100">
                        <p className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">Wholesale Price</p>
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between items-center text-xs md:text-sm">
                            <span className="text-slate-600 font-medium">Price:</span>
                            <span className="font-bold text-slate-900">৳{product.price?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <button className="w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors">
              Explore All Trending
            </button>
          </div>
        </section>

      </main>
    </div>
  );
}
