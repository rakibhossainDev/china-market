"use client";

import { useState, useEffect, use } from 'react';
import { Package, Plane, ShieldCheck, HelpCircle, FileText, Anchor } from 'lucide-react';
import Link from 'next/link';

// Mock Data
const productData = {
  id: "1",
  title: "Premium TWS Wireless Earbuds Pro - Noise Cancelling",
  sku: "TWS-PRO-2026-X",
  moq: 100,
  images: [
    "https://images.unsplash.com/photo-1606220588913-b3aea9056d4c?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=2124&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1572569433114-6105c3b6f272?q=80&w=2187&auto=format&fit=crop"
  ],
  pricingTiers: [
    { min: 100, max: 500, price: 150 },
    { min: 501, max: 2000, price: 130 },
    { min: 2001, max: Infinity, price: 110 }
  ],
  specs: {
    material: "Premium ABS Plastic & Silicone",
    weight: "0.15 KG / unit (packaged)",
    cbm: "0.002 CBM / unit",
    origin: "Shenzhen, Guangdong, China",
    battery: "45mAh (Earbuds), 400mAh (Case)"
  }
};

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  
  const [currentImage, setCurrentImage] = useState(productData.images[0]);
  const [quantity, setQuantity] = useState<number | ''>(productData.moq);
  const [unitPrice, setUnitPrice] = useState<number>(productData.pricingTiers[0].price);

  useEffect(() => {
    if (typeof quantity === 'number') {
      const tier = productData.pricingTiers.find(
        t => quantity >= t.min && quantity <= t.max
      );
      if (tier) {
        setUnitPrice(tier.price);
      } else if (quantity < productData.pricingTiers[0].min) {
        // Fallback to base price if below MOQ
        setUnitPrice(productData.pricingTiers[0].price);
      } else if (quantity > productData.pricingTiers[productData.pricingTiers.length - 1].max) {
         setUnitPrice(productData.pricingTiers[productData.pricingTiers.length - 1].price);
      }
    }
  }, [quantity]);

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

  const isBelowMOQ = typeof quantity === 'number' && quantity < productData.moq;
  const totalAmount = typeof quantity === 'number' ? quantity * unitPrice : 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <nav className="text-sm text-slate-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="#" className="hover:text-amber-600 transition-colors">Electronics</Link>
          <span>/</span>
          <Link href="#" className="hover:text-amber-600 transition-colors">Audio</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-[200px] inline-block">{productData.title}</span>
        </nav>
      </div>

      {/* Main Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Left Column: Image Gallery */}
            <div className="space-y-4">
              <div 
                className="w-full aspect-square bg-slate-100 rounded-[5px] overflow-hidden relative bg-cover bg-center transition-all duration-300"
                style={{ backgroundImage: `url(${currentImage})` }}
              >
              </div>
              <div className="grid grid-cols-4 gap-4">
                {productData.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentImage(img)}
                    className={`aspect-square rounded-[5px] overflow-hidden relative bg-cover bg-center border-2 transition-colors ${currentImage === img ? 'border-amber-500' : 'border-transparent hover:border-slate-300'}`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
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

              {/* Tiered Pricing Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-8">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">Wholesale Tiered Pricing</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  {productData.pricingTiers.map((tier, idx) => (
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
