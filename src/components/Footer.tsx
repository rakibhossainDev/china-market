import { ShieldCheck, Plane, Tag, Headphones } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full flex flex-col mt-auto shrink-0">
      {/* Upper Section (Trust Badges Row) */}
      <div className="bg-white border-t border-slate-100 py-12 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 text-center">
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform hover:scale-105">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h4 className="text-slate-900 font-bold text-lg mb-1">Direct China Source</h4>
            <p className="text-slate-500 text-sm font-medium">Verified factory suppliers</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform hover:scale-105">
              <Plane className="w-8 h-8" />
            </div>
            <h4 className="text-slate-900 font-bold text-lg mb-1">7 Days Air Shipping</h4>
            <p className="text-slate-500 text-sm font-medium">Fastest route to BD</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform hover:scale-105">
              <Tag className="w-8 h-8" />
            </div>
            <h4 className="text-slate-900 font-bold text-lg mb-1">Tiered Pricing</h4>
            <p className="text-slate-500 text-sm font-medium">Buy more, save more</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4 transition-transform hover:scale-105">
              <Headphones className="w-8 h-8" />
            </div>
            <h4 className="text-slate-900 font-bold text-lg mb-1">24/7 Support</h4>
            <p className="text-slate-500 text-sm font-medium">Dedicated account managers</p>
          </div>

        </div>
      </div>

      {/* Lower Section (Copyright Bar) */}
      <div className="bg-[#0B1528] py-6 text-center w-full">
        <p className="text-slate-400 text-sm font-medium">
          © 2026 China Market Wholesale. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
