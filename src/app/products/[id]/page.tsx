import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ProductDetailsClient from './ProductDetailsClient';

export const revalidate = 0; // Dynamic fetching for accurate stock/pricing

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params;
  
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', unwrappedParams.id)
    .single();

  if (error || !product) {
    // Gracefully handle invalid product IDs with Next.js 404 routing
    notFound();
  }

  // Sanitize array structures dynamically
  const formattedProduct = {
    ...product,
    images: product.images && product.images.length > 0 ? product.images : [product.image_url || '/placeholder-image.png']
  };

  return <ProductDetailsClient product={formattedProduct} />;
}
