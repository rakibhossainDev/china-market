import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

export default async function AdminProductsPage() {
  const { data: products, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

  async function addProduct(formData: FormData) {
    'use server';
    
    const title = formData.get('title') as string;
    const price = formData.get('price') as string;
    const old_price = formData.get('old_price') as string;
    const moq = parseInt(formData.get('moq') as string, 10);
    const stock = parseInt(formData.get('stock') as string, 10);
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;

    const { error } = await supabase.from('products').insert([
      { title, price, old_price, moq, stock, description, image_url }
    ]);

    if (error) {
      console.error("Failed to insert product:", error);
    } else {
      revalidatePath('/admin/products');
      revalidatePath('/'); // Revalidate storefront
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Product Manager</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Product Form */}
        <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-white mb-6">Add New Product</h2>
          <form action={addProduct} className="space-y-4 text-sm">
            <div>
              <label className="block text-slate-400 mb-1">Title</label>
              <input name="title" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Price</label>
                <input name="price" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Old Price</label>
                <input name="old_price" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">MOQ</label>
                <input name="moq" type="number" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Stock</label>
                <input name="stock" type="number" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Image URL</label>
              <input name="image_url" required className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors" />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Description</label>
              <textarea name="description" rows={3} className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:outline-none focus:border-amber-500 transition-colors"></textarea>
            </div>
            <button type="submit" className="w-full bg-amber-500 text-slate-950 font-bold py-2 rounded hover:bg-amber-400 transition-colors">
              Add Product
            </button>
          </form>
        </div>

        {/* Product List */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Live Products</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="px-6 py-3 font-medium">Product</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">MOQ</th>
                  <th className="px-6 py-3 font-medium">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {error || !products || products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No products found. Add one to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product: any) => (
                    <tr key={product.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image_url} alt={product.title} className="w-10 h-10 rounded object-cover bg-slate-800" />
                          <span className="font-medium text-white">{product.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{product.price}</td>
                      <td className="px-6 py-4 text-slate-300">{product.moq}</td>
                      <td className="px-6 py-4 text-slate-300">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400">
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
