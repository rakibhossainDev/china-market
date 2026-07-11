import React from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Package } from 'lucide-react';

export const revalidate = 0;

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ITEMS_PER_PAGE = 40;

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const categoryId = resolvedSearchParams.category as string | undefined;
  const subId = resolvedSearchParams.sub as string | undefined;
  const pageParam = resolvedSearchParams.page as string | undefined;
  
  const currentPage = Number(pageParam) || 1;
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let query = supabase.from('products').select('*', { count: 'exact' });

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  if (subId) {
    query = query.eq('sub_category_id', subId);
  }

  const { data: products, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching products:", error);
    return <div className="p-8 text-red-500">Failed to load products.</div>;
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  // Helper to build URL securely preserving category/sub parameters
  const buildPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (categoryId) params.set('category', categoryId);
    if (subId) params.set('sub', subId);
    if (pageNumber > 1) params.set('page', String(pageNumber));
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ''}`;
  };

  return (
    <div className="w-full max-w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Products Catalog</h1>
        {products && (
          <p className="text-sm text-slate-500 mt-1">
            Showing {products.length > 0 ? from + 1 : 0} - {Math.min(to + 1, count || 0)} of {count} results
          </p>
        )}
      </div>

      {!products || products.length === 0 ? (
        <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl p-12 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <Package className="w-12 h-12 text-slate-300 mb-3" />
          <h2 className="text-lg font-semibold text-slate-700">No products found</h2>
          <p className="text-slate-500 text-sm mt-1">We couldn't find any products matching your current category filters.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`} className="group relative overflow-hidden bg-white border border-slate-100 p-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F2A900] focus:ring-inset flex flex-col">
                <div className="relative w-full aspect-square bg-slate-50 overflow-hidden rounded-t-xl mb-3">
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png'} 
                    alt={product.title} 
                    className="w-full h-full object-cover object-center transition-all duration-500 ease-in-out group-hover:scale-105"
                  />
                  {product.images && product.images.length > 1 && (
                    <img 
                      src={product.images[1]} 
                      alt={`${product.title} alternate`} 
                      className="absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-all duration-500 ease-in-out group-hover:opacity-100 group-hover:scale-105"
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

          {/* Pagination Block */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={buildPageUrl(currentPage - 1)}
                  className="px-3 py-2 sm:px-4 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Previous
                </Link>
              ) : (
                <span className="px-3 py-2 sm:px-4 border border-slate-200 rounded-md text-sm text-slate-300 cursor-not-allowed">
                  Previous
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Link
                      key={pageNum}
                      href={buildPageUrl(pageNum)}
                      className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-md border text-sm transition-colors ${
                        pageNum === currentPage
                          ? 'bg-amber-500 text-white font-bold border-amber-500 shadow-sm'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span key={pageNum} className="px-1 sm:px-2 text-slate-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {currentPage < totalPages ? (
                <Link
                  href={buildPageUrl(currentPage + 1)}
                  className="px-3 py-2 sm:px-4 border border-slate-200 rounded-md text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Next
                </Link>
              ) : (
                <span className="px-3 py-2 sm:px-4 border border-slate-200 rounded-md text-sm text-slate-300 cursor-not-allowed">
                  Next
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
