import { Package, ShieldCheck, Plane, Tags, Headset, Zap } from 'lucide-react';
import Link from 'next/link';
import HeroSlider from '@/components/HeroSlider';
import HorizontalCategoryGroups from '@/components/HorizontalCategoryGroups';

const trendingProducts = [
  {
    id: 1,
    title: "Smart Watch Series 8 Ultra Clone - Bulk",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2000&auto=format&fit=crop",
    moq: 50,
    price1: "10-50 pcs: ৳120",
    price2: "50+ pcs: ৳95"
  },
  {
    id: 2,
    title: "TWS Wireless Earbuds Pro Noise Cancelling",
    image: "https://images.unsplash.com/photo-1606220588913-b3aea9056d4c?q=80&w=2070&auto=format&fit=crop",
    moq: 100,
    price1: "100-500 pcs: ৳150",
    price2: "500+ pcs: ৳130"
  },
  {
    id: 3,
    title: "Premium Men's Casual Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
    moq: 20,
    price1: "20-100 pcs: ৳500",
    price2: "100+ pcs: ৳450"
  },
  {
    id: 4,
    title: "Minimalist Coffee Maker Machine",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2070&auto=format&fit=crop",
    moq: 10,
    price1: "10-50 pcs: ৳2500",
    price2: "50+ pcs: ৳2100"
  },
  {
    id: 5,
    title: "Wireless Fast Charging Pad (15W)",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=2084&auto=format&fit=crop",
    moq: 200,
    price1: "200-500 pcs: ৳80",
    price2: "500+ pcs: ৳65"
  },
  {
    id: 6,
    title: "Luxury Leather Office Briefcase",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop",
    moq: 30,
    price1: "30-100 pcs: ৳1200",
    price2: "100+ pcs: ৳980"
  },
  {
    id: 7,
    title: "4K Action Camera Waterproof",
    image: "https://images.unsplash.com/photo-1500634245200-e5245c7574ef?q=80&w=2070&auto=format&fit=crop",
    moq: 15,
    price1: "15-50 pcs: ৳3200",
    price2: "50+ pcs: ৳2800"
  },
  {
    id: 8,
    title: "RGB Mechanical Gaming Keyboard",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop",
    moq: 40,
    price1: "40-100 pcs: ৳1500",
    price2: "100+ pcs: ৳1350"
  }
];

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trendingProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group flex flex-col h-full relative">
                {/* Product Image */}
                <div 
                  className="aspect-square bg-slate-100 relative bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url(${product.image})` }}
                >
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
                          <span className="text-slate-600 font-medium">{product.price1.split(':')[0]}:</span>
                          <span className="font-bold text-slate-900">{product.price1.split(':')[1]}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs md:text-sm">
                          <span className="text-slate-600 font-medium">{product.price2.split(':')[0]}:</span>
                          <span className="font-bold text-rose-600">{product.price2.split(':')[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
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
