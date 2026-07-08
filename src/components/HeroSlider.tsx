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
    <div className="w-full px-4 pt-4 md:px-0 md:pt-0">
      <section className="relative overflow-hidden group h-[220px] sm:h-[380px] md:h-[500px] w-full rounded-[5px]">
        {/* Slides Container */}
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div 
              key={slide.id} 
              className="min-w-full flex-shrink-0 flex items-center relative bg-slate-900"
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              ></div>
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
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-amber-500 scale-125' : 'bg-white/50 hover:bg-white/80'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
