"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Folder, Trash2 } from 'lucide-react';

export default function AdminCategoriesPage() {
  const router = useRouter();
  
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('');

  const [newSubName, setNewSubName] = useState('');
  const [newSubImage, setNewSubImage] = useState('');
  const [newSubCategoryId, setNewSubCategoryId] = useState('');
  const [isSubmittingSub, setIsSubmittingSub] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setIsLoading(true);
    try {
      const [catRes, subRes] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('sub_categories').select('*').order('name')
      ]);

      if (catRes.data) setCategories(catRes.data);
      if (subRes.data) setSubCategories(subRes.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsSubmitting(true);
    
    const slug = newCategoryName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { error } = await supabase.from('categories').insert([{
      slug: slug,
      name: newCategoryName.trim(),
      icon_name: newCategoryIcon.trim() || 'Folder'
    }]);

    setIsSubmitting(false);

    if (error) {
      console.error("Error adding category:", error);
      alert(error.message || "Failed to add category");
    } else {
      setNewCategoryName('');
      setNewCategoryIcon('');
      fetchCategories();
      router.refresh();
    }
  };

  const handleAddSubCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCategoryId) return;
    
    setIsSubmittingSub(true);
    
    const slug = newSubName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const { error } = await supabase.from('sub_categories').insert([{
      slug: slug,
      category_id: newSubCategoryId,
      name: newSubName.trim(),
      image_url: newSubImage.trim()
    }]);

    setIsSubmittingSub(false);

    if (error) {
      console.error("Error adding sub-category:", error);
      alert(error.message || "Failed to add sub-category");
    } else {
      setNewSubName('');
      setNewSubImage('');
      setNewSubCategoryId('');
      fetchCategories();
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight">Manage Categories</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Add Category Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Create Category</h2>
            <form onSubmit={handleAddCategory} className="space-y-5 text-sm">
              <div>
                <label className="block text-slate-400 mb-1.5">Category Name</label>
                <input 
                  type="text" 
                  value={newCategoryName} 
                  onChange={(e) => setNewCategoryName(e.target.value)} 
                  required 
                  placeholder="e.g., Electronics" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                />
                <p className="text-xs text-slate-500 mt-1.5">A slug ID will be automatically generated.</p>
              </div>
              
              <div>
                <label className="block text-slate-400 mb-1.5">Icon Name (Optional)</label>
                <input 
                  type="text" 
                  value={newCategoryIcon} 
                  onChange={(e) => setNewCategoryIcon(e.target.value)} 
                  placeholder="e.g., Monitor" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                />
                <p className="text-xs text-slate-500 mt-1.5">Lucide icon name to display in the sidebar.</p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !newCategoryName.trim()} 
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? 'Creating...' : <><Plus className="w-4 h-4" /> Add Category</>}
              </button>
            </form>
          </div>

          {/* Add Sub-Category Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Create Sub-Category</h2>
            <form onSubmit={handleAddSubCategory} className="space-y-5 text-sm">
              <div>
                <label className="block text-slate-400 mb-1.5">Parent Category</label>
                <select 
                  value={newSubCategoryId} 
                  onChange={(e) => setNewSubCategoryId(e.target.value)} 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">Sub-Category Name</label>
                <input 
                  type="text" 
                  value={newSubName} 
                  onChange={(e) => setNewSubName(e.target.value)} 
                  required 
                  placeholder="e.g., Smart Watches" 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">Image URL</label>
                <input 
                  type="text" 
                  value={newSubImage} 
                  onChange={(e) => setNewSubImage(e.target.value)} 
                  required
                  placeholder="https://..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors" 
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmittingSub || !newSubName.trim() || !newSubCategoryId} 
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmittingSub ? 'Creating...' : <><Plus className="w-4 h-4" /> Add Sub-Category</>}
              </button>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm animate-pulse flex flex-col gap-4">
                  <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center shadow-sm">
              <Folder className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p className="text-lg text-slate-400">No categories found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(category => {
                const subs = subCategories.filter(s => s.category_id === category.id);
                return (
                  <div key={category.id} className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col transition-all hover:border-slate-700">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Folder className="w-5 h-5 text-amber-500" />
                          {category.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 font-mono">ID: {category.id}</p>
                      </div>
                      <button className="text-slate-500 hover:text-red-500 transition-colors" title="Delete Category">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="mt-auto">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Sub-categories ({subs.length})</h4>
                      <div className="flex flex-wrap gap-2">
                        {subs.length > 0 ? (
                          subs.map(sub => (
                            <span key={sub.id} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">
                              {sub.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-600 text-xs italic">None</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
