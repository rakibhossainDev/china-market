"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MessageCircle, Send } from 'lucide-react';

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
    <footer className="w-full flex flex-col mt-auto shrink-0 bg-white text-slate-600 pt-16 pb-8 border-t border-slate-200/60 font-sans">
      <div className="max-w-7xl mx-auto px-4 w-full">
        
        {/* Main Layout Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            
            {/* Column 1: Shop */}
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 font-bold text-lg">Shop</h4>
              <ul className="space-y-3 text-sm">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <li key={cat.id}>
                      <Link href={`/category/${cat.slug}`} className="hover:text-slate-900 transition-colors">
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li><span className="animate-pulse bg-slate-100 text-transparent rounded">Electronics</span></li>
                    <li><span className="animate-pulse bg-slate-100 text-transparent rounded">Bags</span></li>
                    <li><span className="animate-pulse bg-slate-100 text-transparent rounded">Jewelry</span></li>
                  </>
                )}
                <li>
                  <Link href="/categories" className="hover:text-slate-900 transition-colors font-medium text-slate-500">
                    View All Categories &rarr;
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Services */}
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 font-bold text-lg">Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/services/bulk-order" className="hover:text-slate-900 transition-colors">Bulk Order</Link></li>
                <li><Link href="/services/track-sourcing" className="hover:text-slate-900 transition-colors">Track Sourcing</Link></li>
                <li><Link href="/services/accounting" className="hover:text-slate-900 transition-colors">Accounting</Link></li>
                <li><Link href="/services/custom-clearance" className="hover:text-slate-900 transition-colors">Custom Clearance</Link></li>
              </ul>
            </div>

            {/* Column 3: Help */}
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 font-bold text-lg">Help</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/help/faq" className="hover:text-slate-900 transition-colors">FAQ</Link></li>
                <li><Link href="/help/shipping-policy" className="hover:text-slate-900 transition-colors">Shipping Policy</Link></li>
                <li><Link href="/help/customs-duties" className="hover:text-slate-900 transition-colors">Customs & Duties</Link></li>
                <li><Link href="/help/contact-us" className="hover:text-slate-900 transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Column 4: China Market */}
            <div className="flex flex-col gap-4">
              <h4 className="text-slate-900 font-bold text-lg">China Market</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="hover:text-slate-900 transition-colors">About Us</Link></li>
                <li><Link href="/wholesale-program" className="hover:text-slate-900 transition-colors">Wholesale Program</Link></li>
                <li><Link href="/success-stories" className="hover:text-slate-900 transition-colors">Success Stories</Link></li>
                <li><Link href="/careers" className="hover:text-slate-900 transition-colors">Careers</Link></li>
              </ul>
            </div>

          {/* Newsletter & Social */}
          <div className="col-span-full lg:col-span-1 flex flex-col gap-6">
            <div>
              <h4 className="text-slate-900 font-bold text-lg mb-3">Newsletter</h4>
              <p className="text-sm text-slate-500 mb-4">
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
                  className="flex-1 bg-white border border-slate-200 border-r-0 rounded-l-lg px-4 py-3 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#F2A900] transition-colors"
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
              <h4 className="text-slate-500 font-medium text-sm mb-4 uppercase tracking-wider">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="YouTube">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" clipRule="evenodd" /></svg>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors" aria-label="LinkedIn">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-medium">
            © 2026 China Market Wholesale. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-sm font-medium">
            <Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
            <span className="opacity-50">|</span>
            <Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
