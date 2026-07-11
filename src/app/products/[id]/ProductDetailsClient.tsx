"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plane, ShieldCheck, FileText, Anchor, Star, ChevronRight, Truck, Info } from 'lucide-react';
import B2BOrderCalculator from '@/components/B2BOrderCalculator';

interface Product {
  id: string;
  title: string;
  price: number;
  old_price?: number;
  moq: number;
  stock: number;
  images: string[];
  description?: string;
  category_id?: string;
  sub_category_id?: string;
}

export default function ProductDetailsClient({ product }: { product: Product }) {
  const [currentImage, setCurrentImage] = useState<string>(
    product.images && product.images.length > 0 ? product.images[0] : '/placeholder-image.png'
  );

  const [activeTab, setActiveTab] = useState<'spec' | 'desc' | 'seller'>('spec');
  const [selectedColor, setSelectedColor] = useState<string>('Default');

  // Hardcoded for demo purposes as requested
  const pricingTiers = [
    { min: product.moq || 1, max: 99, discount: 0 },
    { min: 100, max: 299, discount: 5 },
    { min: 300, max: Infinity, discount: 10 }
  ];

  const defaultSpecs = {
    material: "Premium ABS Plastic & Silicone",
    weight: "0.15 KG / unit (packaged)",
    cbm: "0.002 CBM / unit",
    origin: "Shenzhen, Guangdong, China",
    battery: "45mAh (Earbuds), 400mAh (Case)"
  };

  const colors = ['Default', 'Black', 'White', 'Blue'];


  return (
    <div className="min-h-screen bg-slate-50 py-6">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="text-sm text-slate-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/products" className="hover:text-amber-600 transition-colors">Catalog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-medium truncate max-w-[300px]">{product.title}</span>
        </nav>
      </div>

      {/* Main 3-Column Product Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 lg:p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            
            {/* Column 1: Visual Gallery (Left) */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="w-full aspect-square border border-slate-200 rounded-lg overflow-hidden bg-slate-50 relative">
                <img 
                  src={currentImage} 
                  alt={product.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Horizontal Thumbnail Track */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1">
                {product.images && product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`w-16 h-16 shrink-0 rounded-md overflow-hidden border-2 transition-all ${currentImage === img ? 'border-amber-500' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Column 2: Details & Variant Selection (Middle) */}
            <div className="lg:col-span-5 flex flex-col">
              <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
                {product.title}
              </h1>
              
              {/* Mock Ratings & Volume */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500" />
                  <Star className="w-4 h-4 fill-amber-500 opacity-50" />
                  <span className="ml-1.5 text-slate-700 font-medium">4.5</span>
                </div>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <span className="text-slate-600 font-medium">286+ Sold</span>
                <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                <span className="text-emerald-600 font-medium">Verified Supplier</span>
              </div>

              {/* Wholesale Pricing Tiers */}
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
                <h3 className="text-xs font-bold text-orange-800 uppercase tracking-wider mb-3">Wholesale Bulk Pricing</h3>
                <div className="grid grid-cols-3 gap-2">
                  {pricingTiers.map((tier, idx) => {
                    const priceForTier = product.price * (1 - tier.discount / 100);
                    return (
                      <div key={idx} className="flex flex-col border-r border-orange-200/50 last:border-0 px-2 text-center">
                        <span className="text-orange-900/60 text-xs font-medium mb-1">
                          {tier.min}{tier.max === Infinity ? '+' : ` - ${tier.max}`} pcs
                        </span>
                        <span className="text-lg font-bold text-orange-900">৳{priceForTier.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Variant Selector - Colors */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">Color: <span className="text-slate-600 font-normal">{selectedColor}</span></h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedColor === color ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Trade Assurance</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Package className="w-4 h-4 text-emerald-500" />
                  <span>Quality Inspected</span>
                </div>
              </div>
            </div>

            {/* Column 3: Logistics & Calculator (Right) */}
            <div className="lg:col-span-3 flex flex-col">
                <B2BOrderCalculator product={product} />
            </div>
          </div>
        </div>

        {/* Bottom Technical Specifications Tier */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs Header */}
          <div className="flex border-b border-slate-200 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('spec')}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'spec' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              Product Specification
            </button>
            <button 
              onClick={() => setActiveTab('desc')}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'desc' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              Detailed Description
            </button>
            <button 
              onClick={() => setActiveTab('seller')}
              className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'seller' ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-600 hover:text-slate-900'}`}
            >
              Seller Info
            </button>
          </div>
          
          {/* Tabs Content */}
          <div className="p-6 lg:p-8">
            {activeTab === 'spec' && (
              <div className="max-w-3xl">
                <table className="w-full text-sm text-left">
                  <tbody>
                    {Object.entries(defaultSpecs).map(([key, value], idx) => (
                      <tr key={idx} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 px-4 font-medium text-slate-500 bg-slate-50 w-1/3 capitalize">{key}</td>
                        <td className="py-3 px-4 text-slate-900">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'desc' && (
              <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  <p>No detailed description provided by the manufacturer for this product. Please refer to the specifications tab or contact our sourcing agent for detailed imagery and documentation.</p>
                )}
              </div>
            )}

            {activeTab === 'seller' && (
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Verified Shenzhen Manufacturer</h4>
                  <p className="text-slate-500 text-sm mb-3">Gold Supplier • 5+ Years on Platform</p>
                  <div className="flex gap-2">
                    <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded">ISO 9001</span>
                    <span className="inline-flex text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-1 rounded">CE Certified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
