"use client";

import React, { useState, useEffect } from 'react';
import { ShoppingCart, CreditCard } from 'lucide-react';

interface B2BOrderCalculatorProps {
  product: {
    price: number;
    moq: number;
    stock: number;
  };
}

export default function B2BOrderCalculator({ product }: B2BOrderCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(product.moq || 100);
  const [unitPrice, setUnitPrice] = useState<number>(product.price || 150);
  const [shippingMethod, setShippingMethod] = useState<'air' | 'sea'>('air');

  // Pricing tiers calculation
  const pricingTiers = [
    { min: product.moq || 1, max: 99, discount: 0 },
    { min: 100, max: 299, discount: 5 },
    { min: 300, max: Infinity, discount: 10 }
  ];

  useEffect(() => {
    const tier = pricingTiers.slice().reverse().find(t => quantity >= t.min);
    if (tier) {
      const discountedPrice = product.price * (1 - tier.discount / 100);
      setUnitPrice(discountedPrice);
    } else {
      setUnitPrice(product.price);
    }
  }, [quantity, product.price, pricingTiers]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 0) {
      setQuantity(val);
    }
  };

  const isBelowMOQ = quantity < (product.moq || 1);
  const totalAmount = quantity * unitPrice;
  const advancePayment = totalAmount * 0.7;
  const remainingBalance = totalAmount * 0.3;

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm sticky top-24">
      
      {/* Shipping Tabs */}
      <h3 className="text-sm font-bold text-slate-900 mb-3">Logistics Method</h3>
      <div className="flex rounded-md bg-slate-100 p-1 mb-5">
        <button 
          onClick={() => setShippingMethod('air')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded ${shippingMethod === 'air' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          ⚡ By Air (7 Days)
        </button>
        <button 
          onClick={() => setShippingMethod('sea')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded ${shippingMethod === 'sea' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
        >
          🚢 By Sea (30 Days)
        </button>
      </div>

      {/* Calculator Widget */}
      <div className="mb-5">
        <div className="flex justify-between items-end mb-2">
          <label className="text-sm font-bold text-slate-900">Quantity</label>
          <span className="text-xs text-slate-500">MOQ: {product.moq || 1} pcs</span>
        </div>
        <input 
          type="number" 
          min={product.moq || 1}
          value={quantity}
          onChange={handleQuantityChange}
          className={`w-full border ${isBelowMOQ ? 'border-red-400 focus:ring-red-500' : 'border-slate-300 focus:ring-amber-500'} rounded py-2.5 px-3 font-semibold text-slate-900 focus:outline-none focus:ring-2`}
        />
        {isBelowMOQ && (
          <p className="text-red-500 text-[10px] mt-1 font-medium">* Below MOQ</p>
        )}
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-50 rounded p-3 mb-5 border border-slate-100">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-600">Unit Price:</span>
          <span className="font-semibold text-slate-900">৳{unitPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-3 pb-3 border-b border-slate-200">
          <span className="text-slate-600">Subtotal:</span>
          <span className="font-semibold text-slate-900">৳{totalAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        </div>
        
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-amber-700 font-bold flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> 70% Advance
            </span>
            <span className="font-bold text-amber-700 text-lg">৳{advancePayment.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500">
            <span>30% On Delivery</span>
            <span>৳{remainingBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button 
          disabled={isBelowMOQ}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
        <button 
          disabled={isBelowMOQ}
          className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent text-white border border-slate-900 font-bold py-3 rounded-md transition-colors"
        >
          Buy Now
        </button>
      </div>
      
    </div>
  );
}
