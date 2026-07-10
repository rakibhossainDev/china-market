"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export default function AdminProductsPage() {
  const router = useRouter();
  
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    old_price: '',
    moq: '',
    stock: '',
    description: '',
    image_url: '',
    category_id: '',
    sub_category_id: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [prodRes, catRes, subRes] = await Promise.all([
        supabase.from('products').select('*').is('deleted_at', null).order('created_at', { ascending: false }),
        supabase.from('categories').select('*').is('deleted_at', null).order('name'),
        supabase.from('sub_categories').select('*').is('deleted_at', null).order('name')
      ]);

      if (prodRes.data) setProducts(prodRes.data);
      if (catRes.data) setCategories(catRes.data);
      if (subRes.data) setSubCategories(subRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(f => f.size <= 200 * 1024);
      if (validFiles.length !== files.length) {
        alert("Some files were skipped because they exceed 200KB limit.");
      }
      setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }
    setIsSubmitting(true);
    
    const { title, price, old_price, moq, stock, description, category_id, sub_category_id } = formData;
    
    const imageUrls: string[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileExt = file.name.split('.').pop() || 'png';
      const fileName = `prod-${Date.now()}-${i}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);
        
      if (uploadError) {
        console.error("Upload error:", uploadError);
        alert(`Failed to upload image ${i+1}`);
        setIsSubmitting(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
      imageUrls.push(publicUrl);
    }
    
    const { error } = await supabase.from('products').insert([{
      title,
      price,
      old_price,
      moq: parseInt(moq) || 0,
      stock: parseInt(stock) || 0,
      description,
      images: imageUrls,
      category_id: category_id || null,
      sub_category_id: sub_category_id || null
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error("Error inserting product:", error);
      alert("Failed to add product.");
    } else {
      setIsModalOpen(false);
      setFormData({
        title: '', price: '', old_price: '', moq: '', stock: '', description: '', image_url: '', category_id: '', sub_category_id: ''
      });
      setSelectedFiles([]);
      fetchData(); // Refresh list
      router.refresh(); // Refresh server caches if any
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Move this product to the recycle bin?")) return;
    const { error } = await supabase.from('products').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    } else {
      fetchData();
      router.refresh();
    }
  };

  const filteredSubCategories = subCategories.filter(sub => sub.category_id === formData.category_id);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0B1329] p-6 rounded-md border border-slate-800 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Products Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-4 rounded-sm flex items-center gap-2 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-[#0B1329] border border-slate-800 rounded-md overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Product</th>
                <th className="px-6 py-4 font-semibold">Price</th>
                <th className="px-6 py-4 font-semibold">MOQ</th>
                <th className="px-6 py-4 font-semibold">Stock</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                // Loading Placeholders
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-800 rounded-sm"></div>
                      <div className="w-32 h-4 bg-slate-800 rounded-sm"></div>
                    </td>
                    <td className="px-6 py-4"><div className="w-16 h-4 bg-slate-800 rounded-sm"></div></td>
                    <td className="px-6 py-4"><div className="w-10 h-4 bg-slate-800 rounded-sm"></div></td>
                    <td className="px-6 py-4"><div className="w-12 h-4 bg-slate-800 rounded-sm"></div></td>
                    <td className="px-6 py-4"><div className="w-20 h-4 bg-slate-800 rounded-sm ml-auto"></div></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-700" />
                    <p className="text-lg">No products found</p>
                    <p className="text-sm">Click "Add Product" to get started.</p>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.images && product.images.length > 0 ? product.images[0] : (product.image_url || 'https://via.placeholder.com/40')} alt={product.title} className="w-10 h-10 rounded object-cover bg-slate-800 border border-slate-700" />
                        <span className="font-medium text-slate-200">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      <div className="flex flex-col">
                        <span className="text-white">{product.price}</span>
                        {product.old_price && <span className="text-xs line-through text-slate-500">{product.old_price}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{product.moq} pcs</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-800 rounded transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-800 rounded transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1329] border border-slate-800 rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-800 sticky top-0 bg-[#0B1329] z-10">
              <h2 className="text-xl font-bold text-white">Add New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 text-sm">
              <div>
                <label className="block text-slate-400 mb-1.5">Product Title</label>
                <input name="title" value={formData.title} onChange={handleInputChange} required placeholder="e.g., Premium Smart Watch" className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all" />
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 mb-1.5">Price</label>
                  <input name="price" value={formData.price} onChange={handleInputChange} required placeholder="e.g., ৳150" className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5">Old Price (Optional)</label>
                  <input name="old_price" value={formData.old_price} onChange={handleInputChange} placeholder="e.g., ৳200" className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 mb-1.5">MOQ (Minimum Order)</label>
                  <input name="moq" type="number" value={formData.moq} onChange={handleInputChange} required placeholder="e.g., 50" className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5">Available Stock</label>
                  <input name="stock" type="number" value={formData.stock} onChange={handleInputChange} required placeholder="e.g., 1000" className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-slate-400 mb-1.5">Category</label>
                  <select name="category_id" value={formData.category_id} onChange={handleInputChange} className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all appearance-none">
                    <option value="">Select Category</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1.5">Sub-category</label>
                  <select name="sub_category_id" value={formData.sub_category_id} onChange={handleInputChange} disabled={!formData.category_id} className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all appearance-none disabled:opacity-50">
                    <option value="">Select Sub-category</option>
                    {filteredSubCategories.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">Images (Max 200KB each)</label>
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all" 
                />
                {selectedFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square bg-slate-800 rounded-lg overflow-hidden group">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button" 
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 bg-black/60 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-slate-400 mb-1.5">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="Product description..." className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-200 focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900] transition-all"></textarea>
              </div>
              
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-sm text-slate-300 hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-6 rounded-sm transition-colors disabled:opacity-70 flex items-center gap-2">
                  {isSubmitting ? 'Uploading Images...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
