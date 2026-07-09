"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const { data, error } = await supabase
          .from('hero_banners')
          .select('*')
          .eq('is_visible', true)
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setSlides(data);
        }
      } catch (error) {
        console.error("Error fetching hero banners:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBanners();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length, currentSlide]); // Depend on currentSlide for proper autoplay timing

  if (isLoading) {
    return (
      <div className="w-full px-4 pt-4 md:px-0 md:pt-0 mb-6 md:mb-10 transition-all duration-300 ease-in-out">
        <section className="relative overflow-hidden group h-[140px] sm:h-[180px] md:h-[260px] lg:h-[300px] w-full rounded-[5px] shadow-sm bg-slate-900 animate-pulse flex items-center justify-center">
           <ImageIcon className="w-12 h-12 text-slate-700" />
        </section>
      </div>
    );
  }

  if (slides.length === 0) {
    return null; // Don't render slider if no active banners
  }

  return (
    <div className="w-full px-4 pt-4 md:px-0 md:pt-0 mb-6 md:mb-10 transition-all duration-300 ease-in-out">
      <section className="relative overflow-hidden group h-[140px] sm:h-[180px] md:h-[260px] lg:h-[300px] w-full rounded-[5px] shadow-sm transition-all duration-300 ease-in-out">
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full w-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="min-w-full h-full flex-shrink-0 flex items-center relative bg-slate-900"
            >
              <img 
                src={slide.image_url}
                alt="Hero Banner"
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Visible on hover on desktop) */}
        {slides.length > 1 && (
          <>
            <button 
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20 hidden md:flex"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-1.5 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20 hidden md:flex"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </>
        )}

        {/* Pagination Dots at Bottom Center */}
        {slides.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3 z-20 items-center justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-amber-500 w-3 h-3 sm:w-3.5 sm:h-3.5 shadow-md shadow-amber-500/20' 
                    : 'bg-white/50 hover:bg-white/80 w-2 h-2 sm:w-2.5 sm:h-2.5'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
