"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trash2, RefreshCcw, Package, Folder, AlertTriangle } from 'lucide-react';

export default function AdminRecycleBinPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [deletedProducts, setDeletedProducts] = useState<any[]>([]);
  const [deletedCategories, setDeletedCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeletedData();
  }, [activeTab]);

  async function fetchDeletedData() {
    setIsLoading(true);
    try {
      if (activeTab === 'products') {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .not('deleted_at', 'is', null)
          .order('deleted_at', { ascending: false });
        
        if (data) setDeletedProducts(data);
        if (error) console.error("Error fetching deleted products:", error);
      } else {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .not('deleted_at', 'is', null)
          .order('deleted_at', { ascending: false });
          
        if (data) setDeletedCategories(data);
        if (error) console.error("Error fetching deleted categories:", error);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleRestore = async (id: string, table: 'products' | 'categories') => {
    const { error } = await supabase.from(table).update({ deleted_at: null }).eq('id', id);
    if (error) {
      console.error("Restore error:", error);
      alert(`Failed to restore ${table === 'products' ? 'product' : 'category'}.`);
    } else {
      fetchDeletedData();
      router.refresh();
    }
  };

  const handlePermanentDelete = async (id: string, table: 'products' | 'categories') => {
    if (!confirm("Are you sure? This action is permanent and cannot be undone.")) return;
    
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      console.error("Permanent delete error:", error);
      alert(`Failed to permanently delete ${table === 'products' ? 'product' : 'category'}.`);
    } else {
      fetchDeletedData();
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Recycle Bin</h1>
            <p className="text-sm text-slate-400">Manage and restore soft-deleted items.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
            activeTab === 'products' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Deleted Products
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${
            activeTab === 'categories' 
              ? 'border-amber-500 text-amber-500' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Folder className="w-4 h-4" />
          Deleted Categories
        </button>
      </div>

      {/* Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-semibold">Item Name</th>
                <th className="px-6 py-4 font-semibold">Deleted At</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-32 h-4 bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-24 h-4 bg-slate-800 rounded"></div></td>
                    <td className="px-6 py-4"><div className="w-32 h-8 bg-slate-800 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : (
                activeTab === 'products' ? (
                  deletedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                        <p className="text-lg">No deleted products found.</p>
                      </td>
                    </tr>
                  ) : (
                    deletedProducts.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={item.images && item.images.length > 0 ? item.images[0] : (item.image_url || 'https://via.placeholder.com/40')} alt={item.title} className="w-10 h-10 rounded object-cover bg-slate-800 border border-slate-700" />
                            <span className="font-medium text-slate-200">{item.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(item.deleted_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleRestore(item.id, 'products')}
                              className="px-3 py-1.5 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                            >
                              <RefreshCcw className="w-4 h-4" /> Restore
                            </button>
                            <button 
                              onClick={() => handlePermanentDelete(item.id, 'products')}
                              className="px-3 py-1.5 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Forever
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  deletedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                        <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                        <p className="text-lg">No deleted categories found.</p>
                      </td>
                    </tr>
                  ) : (
                    deletedCategories.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Folder className="w-6 h-6 text-amber-500" />
                            <span className="font-medium text-slate-200">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(item.deleted_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => handleRestore(item.id, 'categories')}
                              className="px-3 py-1.5 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                            >
                              <RefreshCcw className="w-4 h-4" /> Restore
                            </button>
                            <button 
                              onClick={() => handlePermanentDelete(item.id, 'categories')}
                              className="px-3 py-1.5 text-red-500 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                            >
                              <Trash2 className="w-4 h-4" /> Delete Forever
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
