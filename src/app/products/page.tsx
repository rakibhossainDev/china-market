import React from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

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
        <div className="bg-slate-50 rounded-2xl p-12 text-center text-slate-500 border border-slate-100">
          No products found for the selected category.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="group block bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-[#F2A900] focus:ring-inset">
              <div className="aspect-square bg-slate-50 relative overflow-hidden flex items-center justify-center p-2">
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png'} 
                  alt={product.title} 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <div className="p-4 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">{product.title}</h3>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="text-lg font-bold text-slate-900">৳{product.price?.toFixed(2) || '0.00'}</span>
                    {product.old_price && (
                      <span className="text-sm text-slate-400 line-through">৳{product.old_price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-medium bg-slate-100 px-2 py-1 rounded">MOQ: {product.moq || 1}</span>
                  <span>Stock: {product.stock || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
