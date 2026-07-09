"use client";

import { useState, useEffect, use } from 'react';
import { Package, Plane, ShieldCheck, HelpCircle, FileText, Anchor } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

// Hardcoded defaults for unmapped schema data
const defaultPricingTiers = [
  { min: 100, max: 500, price: 150 },
  { min: 501, max: 2000, price: 130 },
  { min: 2001, max: Infinity, price: 110 }
];

const defaultSpecs = {
  material: "Premium ABS Plastic & Silicone",
  weight: "0.15 KG / unit (packaged)",
  cbm: "0.002 CBM / unit",
  origin: "Shenzhen, Guangdong, China",
  battery: "45mAh (Earbuds), 400mAh (Case)"
};

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  
  const [productData, setProductData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [currentImage, setCurrentImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number>(0);

  useEffect(() => {
    async function loadProduct() {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', unwrappedParams.id)
        .single();
        
      if (data) {
        // Handle images array or fallback to legacy image_url
        const images = data.images && data.images.length > 0 ? data.images : [data.image_url || 'https://via.placeholder.com/400'];
        
        const pData = {
          ...data,
          images,
          pricingTiers: defaultPricingTiers,
          specs: defaultSpecs,
          sku: `SKU-${data.id.substring(0, 8).toUpperCase()}`
        };
        setProductData(pData);
        setCurrentImage(images[0]);
        setQuantity(data.moq || 100);
        setUnitPrice(data.price || 150);
      }
      setIsLoading(false);
    }
    loadProduct();
  }, [unwrappedParams.id]);

  useEffect(() => {
    if (productData && typeof quantity === 'number') {
      const tier = productData.pricingTiers.find(
        (t: any) => quantity >= t.min && quantity <= t.max
      );
      if (tier) {
        setUnitPrice(tier.price);
      } else if (quantity < productData.pricingTiers[0].min) {
        setUnitPrice(productData.pricingTiers[0].price);
      } else if (quantity > productData.pricingTiers[productData.pricingTiers.length - 1].max) {
         setUnitPrice(productData.pricingTiers[productData.pricingTiers.length - 1].price);
      }
    }
  }, [quantity, productData]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      setQuantity('');
    } else {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed >= 0) {
        setQuantity(parsed);
      }
    }
  };

  if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading product...</div>;
  if (!productData) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Product not found.</div>;

  const isBelowMOQ = typeof quantity === 'number' && quantity < productData.moq;
  const totalAmount = typeof quantity === 'number' ? quantity * unitPrice : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="text-sm text-slate-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="#" className="hover:text-amber-600 transition-colors">Catalog</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px] inline-block">{productData.title}</span>
        </nav>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Image Gallery */}
            <div className="flex gap-4 h-[300px] sm:h-[400px] md:h-[500px]">
              {/* Vertical Strip */}
              <div className="flex flex-col gap-3 w-16 md:w-20 shrink-0 overflow-y-auto scrollbar-hide">
                {productData.images.map((img: string, idx: number) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`w-full aspect-square rounded-[5px] overflow-hidden relative bg-cover bg-center border-2 transition-all ${currentImage === img ? 'border-amber-500 opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
              {/* Main Feature Image */}
              <div 
                className="flex-1 bg-slate-100 rounded-[5px] overflow-hidden relative bg-cover bg-center transition-all duration-300 h-full"
                style={{ backgroundImage: `url(${currentImage})` }}
              >
              </div>
            </div>

            {/* Right Column: Sourcing Info & Purchasing */}
            <div className="flex flex-col">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-slate-900 text-amber-400 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5" />
                  MOQ: {productData.moq} pcs
                </span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1.5 rounded uppercase tracking-wide flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5" />
                  7-Day Fast Air Shipping Guarantee
                </span>
              </div>

              {/* Title & SKU */}
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
                {productData.title}
              </h1>
              <p className="text-slate-500 text-sm font-mono mb-6">SKU: {productData.sku}</p>

              {/* Color/Variant Selection Grid */}
              <div className="mb-6 border-b border-slate-100 pb-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Color Variations</h3>
                <div className="flex flex-wrap gap-3">
                  {productData.images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImage(img)}
                      className={`w-12 h-12 rounded-[5px] overflow-hidden relative bg-cover bg-center border-2 transition-all ${currentImage === img ? 'border-amber-500 scale-110 shadow-md' : 'border-slate-200 hover:border-slate-400'}`}
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  ))}
                </div>
              </div>

              {/* Tiered Pricing Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Wholesale Tiered Pricing</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {productData.pricingTiers.map((tier: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center">
                      <span className="text-slate-500 text-xs font-medium mb-1">{tier.min} - {tier.max === Infinity ? '+' : tier.max} pcs</span>
                      <span className="text-lg font-bold text-slate-900">৳{tier.price}</span>
                      <span className="text-slate-400 text-[10px]">/ pc</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* B2B Bulk Quantity Selector & Live Calculator */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-slate-900 mb-2">Desired Bulk Quantity</label>
                <div className="flex items-center gap-4">
                  <div className="relative max-w-[200px]">
                    <input 
                      type="number" 
                      min="0"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className={`w-full border ${isBelowMOQ ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-amber-500'} rounded-lg py-3 px-4 font-bold text-lg text-slate-900 focus:outline-none focus:ring-2`}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">pcs</span>
                  </div>
                  {isBelowMOQ && (
                    <span className="text-red-500 text-sm font-medium">
                      * Minimum order quantity is {productData.moq} pcs
                    </span>
                  )}
                </div>

                {/* Live Summary Box */}
                <div className="mt-6 bg-blue-50 border border-blue-100 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-blue-800 font-semibold uppercase tracking-wider mb-1">Total Estimated Amount</p>
                    <p className="text-3xl font-extrabold text-blue-900">
                      ৳{totalAmount.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right sm:text-left">
                    <p className="text-xs text-blue-600 font-medium uppercase tracking-wider mb-1">Active Price Per Piece</p>
                    <p className="text-lg font-bold text-slate-900">৳{unitPrice}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <button 
                  disabled={isBelowMOQ || quantity === ''}
                  className={`flex-1 font-bold text-lg py-4 px-6 rounded-lg shadow-lg transition-all ${isBelowMOQ || quantity === '' ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-amber-500 hover:bg-amber-600 text-blue-950 hover:-translate-y-1 shadow-amber-500/30'}`}
                >
                  Proceed to Bulk Order
                </button>
                <button className="flex-1 border-2 border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  Custom Sourcing Quote
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Specifications & Description Tabs */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <FileText className="w-6 h-6 text-amber-500" />
              Product Specifications
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 py-3 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Material</span>
                <span className="col-span-2 text-slate-900 font-semibold">{productData.specs.material}</span>
              </div>
              <div className="grid grid-cols-3 py-3 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Gross Weight</span>
                <span className="col-span-2 text-slate-900 font-semibold">{productData.specs.weight}</span>
              </div>
              <div className="grid grid-cols-3 py-3 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Volume (CBM)</span>
                <span className="col-span-2 text-slate-900 font-semibold">{productData.specs.cbm}</span>
              </div>
              <div className="grid grid-cols-3 py-3 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Battery</span>
                <span className="col-span-2 text-slate-900 font-semibold">{productData.specs.battery}</span>
              </div>
              <div className="grid grid-cols-3 py-3">
                <span className="text-slate-500 font-medium">Factory Origin</span>
                <span className="col-span-2 text-slate-900 font-semibold">{productData.specs.origin}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
              <Plane className="w-6 h-6 text-amber-500" />
              Shipping Policies & Timeline
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">7-Day Air Freight Guarantee</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Your bulk order is prioritized for our premium air freight route. Delivery from our China warehouse to Dhaka is guaranteed within 7 business days.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
                  <Anchor className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Customs Clearance Included</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">No hidden fees. We handle all documentation, customs clearance, and local duties so you receive a seamless door-to-door B2B experience.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Quality Inspection Before Shipping</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">Every batch is physically inspected by our on-ground team in China for defects, ensuring 100% compliance with your wholesale requirements.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
