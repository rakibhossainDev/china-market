import { Package, ShieldCheck, Plane, Tags, Headset } from 'lucide-react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';

export default function Home() {
  return (
    <div className="bg-slate-50">
      <main>
        {/* Hero Slider */}
        <HeroSlider />

        {/* Trust Badges / Features Bar */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Direct China Source</h3>
                  <p className="text-sm text-slate-500 mt-1">Verified factory suppliers</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Plane className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">7 Days Air Shipping</h3>
                  <p className="text-sm text-slate-500 mt-1">Fastest route to BD</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Tags className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Tiered Pricing</h3>
                  <p className="text-sm text-slate-500 mt-1">Buy more, save more</p>
                </div>
              </div>
              <div className="flex flex-col items-center text-center gap-3 group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Headset className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">24/7 Support</h3>
                  <p className="text-sm text-slate-500 mt-1">Dedicated account managers</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Top Wholesale Categories</h2>
            <Link href="#" className="text-blue-600 font-semibold hover:text-blue-800 transition-colors">
              View All Categories &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Electronics', 'Fashion', 'Gadgets', 'Home Appliances'].map((category, i) => (
              <div key={i} className="group cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300">
                <div className="aspect-square bg-slate-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform duration-500">
                    <Package className="h-16 w-16 opacity-20" />
                  </div>
                </div>
                <div className="p-5 text-center">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{category}</h3>
                  <p className="text-sm text-slate-500 mt-1">1,000+ Products</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Wholesale Products */}
        <section className="bg-slate-100 py-16 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Featured Products</h2>
              <div className="flex gap-2">
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Trending</button>
                <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">New Arrivals</button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Smart Watch Series 8 Ultra Clone", moq: 50 },
                { title: "TWS Wireless Earbuds Pro", moq: 100 },
                { title: "Portable Power Bank 20000mAh", moq: 20 },
                { title: "LED Desktop Ring Light set", moq: 30 }
              ].map((product, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-xl transition-all group flex flex-col h-full">
                  <div className="aspect-square rounded-xl bg-slate-50 mb-4 relative overflow-hidden flex items-center justify-center">
                    <Package className="h-12 w-12 text-slate-300" />
                    <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded">
                      MOQ: {product.moq} pcs
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    
                    <div className="mt-auto">
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-xs text-blue-800 font-semibold mb-1 uppercase tracking-wider">Tiered Pricing</p>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">10-50 pcs:</span>
                          <span className="font-bold text-slate-900">৳120</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-1">
                          <span className="text-slate-600">50+ pcs:</span>
                          <span className="font-bold text-amber-600">৳95</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button className="bg-white border-2 border-blue-900 text-blue-900 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors">
                Load More Products
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer Placeholder */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p>&copy; 2026 China Market Wholesale. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
