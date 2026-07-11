import React from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Package } from 'lucide-react';

export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedSearchParams.category as string | undefined;
  const subId = resolvedSearchParams.sub as string | undefined;

  let query = supabase.from('products').select('*');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (subId) {
    query = query.eq('sub_category_id', subId);
  }

  const { data: products, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return <div className="p-8 text-red-500">Failed to load products.</div>;
  }

  return (
    <div className="w-full max-w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Products Catalog</h1>
        {products && <p className="text-sm text-slate-500 mt-1">Showing {products.length} results</p>}
      </div>

      {!products || products.length === 0 ? (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <Package className="w-12 h-12 text-slate-300 mb-3" />
          <h2 className="text-lg font-semibold text-slate-700">No products found</h2>
          <p className="text-slate-500 text-sm mt-1">We couldn't find any products matching your current category filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group relative overflow-hidden bg-white border border-slate-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2A900] focus:ring-inset flex flex-col">
              <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center rounded-lg mb-3">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png'} 
                  alt={product.title} 
                  className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-105"
                />
                {product.images && product.images.length > 1 && (
                  <img 
                    src={product.images[1]} 
                    alt={`${product.title} alternate`} 
                    className="absolute inset-0 h-full w-full object-cover opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-col flex-grow justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2 group-hover:text-[#F2A900] transition-colors">{product.title}</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-slate-900">৳{product.price?.toFixed(2) || '0.00'}</span>
                    {product.old_price && (
                      <span className="text-sm text-slate-400 line-through">৳{product.old_price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                  <span className="font-medium bg-slate-100 px-2 py-1 rounded">MOQ: {product.moq || 1} pcs</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `Stock: ${product.stock}` : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
