"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';

export default function AdminHeroPage() {
  const router = useRouter();
  
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [newBannerFile, setNewBannerFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchBanners();
  }, []);

  async function fetchBanners() {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('hero_banners')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) setBanners(data);
      if (error) console.error("Error fetching banners:", error);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUploadBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerFile) return;
    
    const maxSizeInBytes = 200 * 1024;
    if (newBannerFile.size > maxSizeInBytes) {
      alert("Error: This image exceeds the allowed 200KB size limit! Please compress your image using tinypng.com or another tool before uploading.");
      return;
    }
    
    setIsUploading(true);
    
    const fileExt = newBannerFile.name.split('.').pop() || 'png';
    const fileName = `banner-${Date.now()}.${fileExt}`;
    const filePath = `hero/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, newBannerFile);
      
    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("Upload Failed: " + (uploadError.message || JSON.stringify(uploadError)));
      setIsUploading(false);
      return;
    }
    
    const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(filePath);
    
    const { error } = await supabase.from('hero_banners').insert([{
      image_url: publicUrl,
      is_visible: true
    }]);

    setIsUploading(false);

    if (error) {
      console.error("Error adding banner:", error);
      alert("Upload Failed: " + (error.message || JSON.stringify(error)));
    } else {
      setNewBannerFile(null);
      fetchBanners();
      router.refresh();
    }
  };

  const handleToggleVisibility = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from('hero_banners').update({ is_visible: !currentStatus }).eq('id', id);
    if (error) {
      console.error("Toggle error:", error);
      alert("Failed to update visibility");
    } else {
      setBanners(banners.map(b => b.id === id ? { ...b, is_visible: !currentStatus } : b));
      router.refresh();
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this banner?")) return;
    const { error } = await supabase.from('hero_banners').delete().eq('id', id);
    if (error) {
      console.error("Delete error:", error);
      alert("Failed to delete banner");
    } else {
      fetchBanners();
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#0B1329] p-6 rounded-md border border-slate-800 shadow-sm">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <ImageIcon className="w-6 h-6 text-amber-500" />
          Manage Hero Banners
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          {/* Add Banner Form */}
          <div className="bg-[#0B1329] border border-slate-800 rounded-md p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Upload New Banner</h2>
            <form onSubmit={handleUploadBanner} className="space-y-5 text-sm">
              <div>
                <label className="block text-slate-400 mb-1.5">Banner Image (Max 200KB)</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const maxSizeInBytes = 200 * 1024;
                      if (file.size > maxSizeInBytes) {
                        alert("Error: This image exceeds the allowed 200KB size limit! Please compress your image using tinypng.com or another tool before uploading.");
                        e.target.value = '';
                        setNewBannerFile(null);
                        return;
                      }
                      setNewBannerFile(file);
                    } else {
                      setNewBannerFile(null);
                    }
                  }} 
                  required
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-sm px-4 py-2 text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-500 hover:file:bg-amber-500/20 transition-all focus:outline-none focus:border-[#F2A900] focus:ring-1 focus:ring-[#F2A900]" 
                />
              </div>

              {newBannerFile && (
                <div className="mt-4 border border-slate-800 rounded-lg overflow-hidden bg-slate-800 aspect-video relative">
                  <img src={URL.createObjectURL(newBannerFile)} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <button 
                type="submit" 
                disabled={isUploading || !newBannerFile} 
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 rounded-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
              >
                {isUploading ? 'Uploading...' : <><Plus className="w-4 h-4" /> Add Banner</>}
              </button>
            </form>
          </div>
        </div>

        {/* Banners List */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#0B1329] border border-slate-800 rounded-md overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-video bg-slate-800"></div>
                  <div className="p-4 flex justify-between">
                    <div className="h-6 bg-slate-800 rounded-sm w-1/3"></div>
                    <div className="h-6 bg-slate-800 rounded-sm w-8"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : banners.length === 0 ? (
            <div className="bg-[#0B1329] border border-slate-800 rounded-md p-12 text-center shadow-sm">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-700" />
              <p className="text-lg text-slate-400">No banners found</p>
              <p className="text-sm text-slate-500">Upload your first hero banner to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {banners.map(banner => (
                <div key={banner.id} className={`bg-[#0B1329] border rounded-md overflow-hidden shadow-sm flex flex-col transition-all ${banner.is_visible ? 'border-amber-500/30 shadow-amber-500/5' : 'border-slate-800 opacity-60'}`}>
                  <div className="aspect-video bg-slate-800 relative group">
                    <img src={banner.image_url} alt="Banner" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    {!banner.is_visible && (
                      <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-black/80 text-white px-3 py-1.5 rounded-sm font-medium text-sm flex items-center gap-2">
                          <EyeOff className="w-4 h-4" /> Hidden
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 bg-[#0B1329] flex justify-between items-center border-t border-slate-800">
                    <button 
                      onClick={() => handleToggleVisibility(banner.id, banner.is_visible)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${banner.is_visible ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    >
                      {banner.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      {banner.is_visible ? 'Active' : 'Hidden'}
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteBanner(banner.id)} 
                      className="text-slate-500 hover:text-red-500 bg-slate-950 p-2 rounded-md hover:bg-slate-800 transition-colors" 
                      title="Delete Banner"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
