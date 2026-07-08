"use client";

import { useState, useMemo } from 'react';
import { Trash2, AlertCircle, ShieldCheck, Zap, Download, Building2, MapPin, Phone, CheckCircle2, HelpCircle, Package } from 'lucide-react';
import Link from 'next/link';

// Mock Data Interfaces
interface Tier {
  min: number;
  max: number;
  price: number;
}

interface CartItem {
  id: string;
  title: string;
  variant: string;
  image: string;
  moq: number;
  quantity: number | '';
  pricingTiers: Tier[];
}

// Initial Mock Cart State
const initialCart: CartItem[] = [
  {
    id: "prod_1",
    title: "Smart Watch Series 8 Ultra Clone - Bulk Edition",
    variant: "Color: Space Grey",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=2000&auto=format&fit=crop",
    moq: 50,
    quantity: 150, // Meets MOQ
    pricingTiers: [
      { min: 50, max: 200, price: 120 },
      { min: 201, max: 500, price: 105 },
      { min: 501, max: Infinity, price: 90 }
    ]
  },
  {
    id: "prod_2",
    title: "TWS Wireless Earbuds Pro Noise Cancelling",
    variant: "Color: Matte White",
    image: "https://images.unsplash.com/photo-1606220588913-b3aea9056d4c?q=80&w=2070&auto=format&fit=crop",
    moq: 100,
    quantity: 40, // Below MOQ to show error initially
    pricingTiers: [
      { min: 100, max: 500, price: 150 },
      { min: 501, max: 2000, price: 130 },
      { min: 2001, max: Infinity, price: 110 }
    ]
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCart);
  
  // Checkout Form State
  const [businessName, setBusinessName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("Dhaka");
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("partial_advance");
  
  // Success Modal State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Helper: Get active unit price for an item based on its quantity
  const getActivePrice = (item: CartItem): number => {
    const qty = typeof item.quantity === 'number' ? item.quantity : 0;
    const tier = item.pricingTiers.find(t => qty >= t.min && qty <= t.max);
    if (tier) return tier.price;
    if (qty < item.pricingTiers[0].min) return item.pricingTiers[0].price;
    return item.pricingTiers[item.pricingTiers.length - 1].price;
  };

  // Handlers
  const handleQuantityChange = (id: string, val: string) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        if (val === '') return { ...item, quantity: '' };
        const parsed = parseInt(val, 10);
        return { ...item, quantity: isNaN(parsed) || parsed < 0 ? 0 : parsed };
      }
      return item;
    }));
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasMOQErrors || !businessName || !mobileNumber) return;
    setIsOrderPlaced(true);
  };

  // Derived State
  const hasMOQErrors = cartItems.some(item => typeof item.quantity !== 'number' || item.quantity < item.moq);
  const subtotal = cartItems.reduce((acc, item) => {
    const qty = typeof item.quantity === 'number' ? item.quantity : 0;
    return acc + (qty * getActivePrice(item));
  }, 0);
  
  const estimatedShipping = cartItems.length > 0 ? 2500 : 0; // Tentative flat charge for demo
  const totalPayable = subtotal + estimatedShipping;
  const isCartEmpty = cartItems.length === 0;

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-8">B2B Wholesale Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Cart Items (2/3 Width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cart Table/List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {isCartEmpty ? (
                <div className="p-12 text-center text-slate-500">
                  <Package className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-lg font-medium">Your wholesale cart is empty.</p>
                  <Link href="/" className="text-amber-600 hover:underline mt-2 inline-block">Continue Sourcing</Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {cartItems.map(item => {
                    const qty = typeof item.quantity === 'number' ? item.quantity : 0;
                    const isBelowMOQ = qty < item.moq;
                    const activePrice = getActivePrice(item);

                    return (
                      <div key={item.id} className={`p-4 sm:p-6 transition-colors ${isBelowMOQ ? 'bg-red-50/50' : 'bg-white'}`}>
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                          
                          {/* Image */}
                          <div 
                            className="w-24 h-24 shrink-0 rounded-lg bg-cover bg-center border border-slate-200"
                            style={{ backgroundImage: `url(${item.image})` }}
                          />
                          
                          {/* Details */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start gap-4">
                                <h3 className="font-bold text-slate-900 text-lg line-clamp-2">{item.title}</h3>
                                <button 
                                  onClick={() => handleRemoveItem(item.id)}
                                  className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
                                  title="Remove item"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-sm text-slate-500 mt-1">{item.variant}</p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mt-4">
                              {/* Price */}
                              <div>
                                <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Active Unit Price</span>
                                <span className="font-bold text-lg text-slate-900">৳{activePrice} <span className="text-sm text-slate-500 font-normal">/ pc</span></span>
                              </div>
                              
                              {/* Quantity Input */}
                              <div className="w-full sm:w-auto">
                                <span className="block text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Quantity (MOQ: {item.moq})</span>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="number"
                                    min="0"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                    className={`w-28 border ${isBelowMOQ ? 'border-red-400 focus:ring-red-500 bg-white' : 'border-slate-300 focus:ring-amber-500'} rounded-lg py-2 px-3 font-bold text-slate-900 focus:outline-none focus:ring-2`}
                                  />
                                  <span className="text-sm font-bold text-slate-900 w-24 text-right">
                                    ৳{(qty * activePrice).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            {/* MOQ Warning */}
                            {isBelowMOQ && (
                              <div className="mt-3 flex items-center gap-1.5 text-red-600 bg-red-100/50 p-2 rounded border border-red-200">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span className="text-xs font-bold">Below MOQ (Min: {item.moq} pcs required)</span>
                              </div>
                            )}

                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            {!isCartEmpty && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
                <button 
                  onClick={clearCart}
                  className="text-slate-500 hover:text-slate-800 text-sm font-semibold transition-colors"
                >
                  Clear Entire Cart
                </button>
                <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors bg-blue-50 px-4 py-2 rounded-lg">
                  <Download className="w-4 h-4" />
                  Request Custom Sourcing Spreadsheet
                </button>
              </div>
            )}
            
          </div>

          {/* Right Column: Order Summary & Checkout Form (1/3 Width) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-28">
              <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Wholesale Order Summary</h2>
              
              {/* Cost Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-bold text-slate-900">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600 flex items-center gap-1">
                    Est. Air Shipping & Handling
                    <span className="group relative cursor-help">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <div className="absolute hidden group-hover:block bottom-full mb-2 right-0 w-48 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg">
                        Final shipping costs may vary slightly based on final actual/volumetric weight.
                      </div>
                    </span>
                  </span>
                  <span className="font-bold text-slate-900">৳{estimatedShipping.toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between items-center">
                  <span className="font-bold text-slate-900 text-lg">Total Payable</span>
                  <span className="font-extrabold text-blue-900 text-2xl">৳{totalPayable.toLocaleString()}</span>
                </div>
              </div>

              {/* B2B Checkout Form */}
              <form onSubmit={handlePlaceOrder} className="space-y-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    Business / Wholesale Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="e.g. Rahim Telecom Center"
                    className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    Delivery Destination <span className="text-red-500">*</span>
                  </label>
                  <select 
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Dhaka">Inside Dhaka</option>
                    <option value="Outside_Dhaka">Outside Dhaka (Courier)</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2">
                    <Phone className="w-4 h-4 text-slate-500" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="+880 1..."
                    className="w-full border border-slate-300 rounded-lg py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Payment Method Selector */}
                <div className="pt-2">
                  <label className="block text-sm font-bold text-slate-900 mb-3">Payment Method</label>
                  <div className="space-y-3">
                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'partial_advance' ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="partial_advance" 
                        checked={paymentMethod === 'partial_advance'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="block font-bold text-sm text-slate-900">Partial Advance (Booking Amount)</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Pay 20% to initiate factory sourcing. Balance on arrival.</span>
                      </div>
                    </label>
                    <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-amber-500 bg-amber-50/30' : 'border-slate-200 hover:bg-slate-50'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="bank_transfer" 
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 w-4 h-4 text-amber-600 focus:ring-amber-500"
                      />
                      <div>
                        <span className="block font-bold text-sm text-slate-900">Bank Transfer / LC / Mobile Banking</span>
                        <span className="block text-xs text-slate-500 mt-0.5">Full or scheduled B2B payments securely.</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* 7-Day Delivery Notice Banner */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex gap-3 mt-6">
                  <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                    <strong className="block mb-0.5">⚡ Guaranteed 7-Day Air Delivery</strong>
                    from China Factory to Dhaka Hub after order confirmation.
                  </p>
                </div>

                {/* CTA Button */}
                <button 
                  type="submit"
                  disabled={hasMOQErrors || isCartEmpty}
                  className={`w-full font-bold text-lg py-4 px-6 rounded-lg shadow-lg transition-all mt-6 ${hasMOQErrors || isCartEmpty ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none' : 'bg-amber-500 hover:bg-amber-600 text-blue-950 hover:-translate-y-1 shadow-amber-500/30'}`}
                >
                  Place Wholesale Order
                </button>
              </form>

            </div>
          </div>
        </div>

      </div>

      {/* Success Modal */}
      {isOrderPlaced && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Your dedicated BHP Group account manager will contact you at <strong className="text-slate-900">{mobileNumber}</strong> within 30 minutes to verify your sourcing specifications and finalize the booking advance.
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setIsOrderPlaced(false);
                  clearCart();
                }}
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                View Dashboard
              </button>
              <Link href="/" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-lg transition-colors">
                Continue Sourcing
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
