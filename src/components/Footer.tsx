"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Facebook, MessageCircle, Youtube, Linkedin, Send } from 'lucide-react';

export default function Footer() {
  const [categories, setCategories] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .is('deleted_at', null)
        .order('name')
        .limit(4);
      if (data) setCategories(data);
    }
    fetchCategories();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setStatus('loading');
    
    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }]);
        
      if (error) {
        if (error.code === '23505') {
          // Unique violation
          setErrorMessage('You are already subscribed!');
        } else {
          setErrorMessage('Failed to subscribe. Try again.');
        }
        setStatus('error');
      } else {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred.');
      setStatus('error');
    }
  };

  return (
    <footer className="w-full flex flex-col mt-auto shrink-0 bg-[#070E1A] text-slate-300 pt-16 pb-8 border-t border-slate-800/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 w-full">
        
        {/* Main Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Left Side: 4 Structural Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            
            {/* Column 1: Shop */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-lg">Shop</h4>
              <ul className="space-y-3 text-sm">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <li key={cat.id}>
                      <Link href={`/category/${cat.slug}`} className="hover:text-amber-500 transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><span className="animate-pulse bg-slate-800 text-transparent rounded">Electronics</span></li>
                    <li><span className="animate-pulse bg-slate-800 text-transparent rounded">Bags</span></li>
                    <li><span className="animate-pulse bg-slate-800 text-transparent rounded">Jewelry</span></li>
                  </>
                )}
                <li>
                  <Link href="/categories" className="hover:text-amber-500 transition-colors font-medium text-slate-400">
                    View All Categories &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Services */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-lg">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/bulk-order" className="hover:text-amber-500 transition-colors">Bulk Order</Link></li>
                <li><Link href="/services/track-sourcing" className="hover:text-amber-500 transition-colors">Track Sourcing</Link></li>
                <li><Link href="/services/accounting" className="hover:text-amber-500 transition-colors">Accounting</Link></li>
                <li><Link href="/services/custom-clearance" className="hover:text-amber-500 transition-colors">Custom Clearance</Link></li>
              </ul>
            </div>

            {/* Column 3: Help */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-lg">Help</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/help/faq" className="hover:text-amber-500 transition-colors">FAQ</Link></li>
                <li><Link href="/help/shipping-policy" className="hover:text-amber-500 transition-colors">Shipping Policy</Link></li>
                <li><Link href="/help/customs-duties" className="hover:text-amber-500 transition-colors">Customs & Duties</Link></li>
                <li><Link href="/help/contact-us" className="hover:text-amber-500 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 4: China Market */}
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-bold text-lg">China Market</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-amber-500 transition-colors">About Us</Link></li>
                <li><Link href="/wholesale-program" className="hover:text-amber-500 transition-colors">Wholesale Program</Link></li>
                <li><Link href="/success-stories" className="hover:text-amber-500 transition-colors">Success Stories</Link></li>
                <li><Link href="/careers" className="hover:text-amber-500 transition-colors">Careers</Link></li>
              </ul>
            </div>

          </div>

          {/* Right Side: Newsletter & Social */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <h4 className="text-white font-bold text-lg mb-3">Newsletter</h4>
              <p className="text-sm text-slate-400 mb-4">
                Subscribe to get wholesale updates & global deal alerts.
              </p>
              
              <form onSubmit={handleSubscribe} className="relative flex">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder="Enter your email address" 
                  className="flex-1 bg-slate-900 border border-slate-700 border-r-0 rounded-l-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#F2A900] transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="bg-[#F2A900] hover:bg-[#D99700] text-slate-950 font-bold px-6 py-3 rounded-r-lg transition-all disabled:opacity-70 flex items-center justify-center shrink-0"
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Subscribe</span>
                      <Send className="w-4 h-4 sm:hidden" />
                    </>
                  )}
                </button>
              </form>
              
              {/* Alert Messages */}
              <div className="mt-2 min-h-[24px]">
                {status === 'success' && (
                  <p className="text-emerald-500 text-sm font-medium">Thanks for subscribing!</p>
                )}
                {status === 'error' && (
                  <p className="text-rose-500 text-sm font-medium">{errorMessage}</p>
                )}
              </div>
            </div>

            {/* Social Group */}
            <div>
              <h4 className="text-slate-400 font-medium text-sm mb-4 uppercase tracking-wider">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#1877F2] hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-white transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#FF0000] hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm font-medium">
            © 2026 China Market Wholesale. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <span className="opacity-50">|</span>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
