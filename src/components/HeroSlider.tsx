"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    title: "China Market - Your Direct China Source to",
    highlight: "Bangladesh",
    subtitle: "Factory Direct Pricing. Cut out the middleman and maximize your margins.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8ed7c80a02?q=80&w=2070&auto=format&fit=crop" // Logistics/Shipping
  },
  {
    id: 2,
    title: "Global Trade",
    highlight: "Warehousing",
    subtitle: "End-to-end logistics with 7 days air shipping from China to Bangladesh.",
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?q=80&w=2070&auto=format&fit=crop" // Wholesale Warehouse
  },
  {
    id: 3,
    title: "Premium Wholesale",
    highlight: "Tech & Gadgets",
    subtitle: "Verified suppliers ensuring guaranteed quality for every bulk order.",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop" // Gadgets
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
    <div className="w-full px-4 pt-4 md:px-0 md:pt-0 mb-6 md:mb-10 transition-all duration-300 ease-in-out">
      <section className="relative overflow-hidden group h-[220px] md:h-[380px] lg:h-[420px] w-full rounded-[5px] shadow-sm transition-all duration-300 ease-in-out">
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
              {/* Image Element for better scaling and cropping */}
              <img 
                src={slide.image}
                alt={slide.title || 'Slide Image'}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />
            </div>
          ))}
        </div>

        {/* Navigation Arrows (Visible on hover on desktop) */}
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

        {/* Pagination Dots at Bottom Center */}
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
      </section>
    </div>
  );
}
