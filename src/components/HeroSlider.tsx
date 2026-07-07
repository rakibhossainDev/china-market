"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "Factory Direct Pricing",
    subtitle: "Cut out the middleman and maximize your margins",
    bgClass: "bg-blue-900"
  },
  {
    id: 2,
    title: "7 Days Air Shipping",
    subtitle: "Fastest delivery from China to Bangladesh",
    bgClass: "bg-blue-800"
  },
  {
    id: 3,
    title: "Verified Suppliers",
    subtitle: "Quality guaranteed for every bulk order",
    bgClass: "bg-slate-800"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Autoplay
  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white group h-[500px] md:h-[600px] lg:h-[700px]">
      {/* Slides Container */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id} 
            className={`min-w-full flex-shrink-0 flex items-center relative ${slide.bgClass}`}
          >
            {/* Background texture/overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/30 to-transparent"></div>
            </div>
            
            <div className="w-full px-6 sm:px-8 lg:px-12 relative z-10 py-12 md:py-0">
              <div className="max-w-4xl">
                <span className="inline-block py-1.5 px-4 rounded-full bg-black/30 border border-white/20 text-amber-400 text-sm font-bold mb-6 tracking-wide uppercase">
                  B2B E-Commerce Platform
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight text-white drop-shadow-md">
                  China Market - Your Direct China Source to <span className="text-amber-500">Bangladesh</span>
                </h1>
                
                <div className="mt-8 bg-black/20 p-6 rounded-xl border border-white/10 inline-block backdrop-blur-md">
                  <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{slide.title}</h2>
                  <p className="text-lg md:text-xl text-blue-100 font-light">{slide.subtitle}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button className="bg-amber-500 hover:bg-amber-600 text-blue-950 font-bold text-lg py-4 px-8 rounded-lg shadow-lg shadow-amber-500/30 transition-all hover:-translate-y-1">
                    Explore Wholesale Catalog
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-lg py-4 px-8 rounded-lg transition-all backdrop-blur-sm">
                    Request Custom Quote
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? 'bg-amber-500 scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
