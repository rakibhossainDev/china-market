import React from 'react';

export default function Loading() {
  // Render an array of 12 skeleton placeholder cards
  const skeletons = Array.from({ length: 12 }, (_, i) => i);

  return (
    <div className="w-full max-w-full px-4 py-8 animate-in fade-in duration-500">
      {/* Header Skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-slate-200 rounded-md animate-pulse w-48 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded-md animate-pulse w-32"></div>
      </div>

      {/* Grid Layout Skeleton matching the main catalog */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {skeletons.map((idx) => (
          <div 
            key={idx} 
            className="group relative bg-white border border-slate-100 p-3 rounded-xl shadow-sm flex flex-col"
          >
            {/* Image Box Placeholder */}
            <div className="w-full aspect-square bg-slate-200 animate-pulse rounded-lg mb-3"></div>
            
            {/* Product Meta Placeholders */}
            <div className="flex flex-col flex-grow justify-between">
              <div>
                {/* Title Lines */}
                <div className="h-3.5 bg-slate-200 rounded animate-pulse w-5/6 mb-2"></div>
                <div className="h-3.5 bg-slate-200 rounded animate-pulse w-2/3 mb-4"></div>
                
                {/* Pricing Line */}
                <div className="h-5 bg-slate-200 rounded animate-pulse w-20 mt-2"></div>
              </div>
              
              {/* Bottom Meta Row (MOQ & Stock) */}
              <div className="mt-4 flex items-center justify-between">
                <div className="h-6 bg-slate-200 rounded animate-pulse w-16"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-14"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
