import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Star, Quote } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import TestimonialCard from './TestimonialCard';

export default function TestimonialsAutoCarousel({
  testimonials = [],
  autoplay = true,
  interval = 2500, // Auto-advances every 2.5 seconds smoothly
  title = null,
  subtitle = null,
  className = '',
}) {
  const { currentLang, isRtl } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visibleItems, setVisibleItems] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const containerRef = useRef(null);

  // Update visible items based on screen breakpoint
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(1);
      } else if (width < 1024) {
        setVisibleItems(2);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const total = Array.isArray(testimonials) ? testimonials.length : 0;
  const maxIndex = Math.max(0, total - visibleItems);

  // Viewport detection: Starts 0.5s after user views the carousel, with guaranteed fallback
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    let viewTimer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (viewTimer) clearTimeout(viewTimer);
          viewTimer = setTimeout(() => {
            setIsInView(true);
          }, 500);
        }
      },
      { threshold: 0.05, rootMargin: '100px' }
    );

    observer.observe(el);

    // Guaranteed fallback after 1.2s
    const fallbackTimer = setTimeout(() => {
      setIsInView(true);
    }, 1200);

    return () => {
      observer.disconnect();
      if (viewTimer) clearTimeout(viewTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Next Slide
  const nextSlide = useCallback(() => {
    if (total <= visibleItems) return;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex, total, visibleItems]);

  // Previous Slide
  const prevSlide = useCallback(() => {
    if (total <= visibleItems) return;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex, total, visibleItems]);

  // "Video gibi olmasın, kullanıcı yanından geçtiğinde hareket etsin"
  const hasInitialMoved = useRef(false);
  const lastHoverTime = useRef(0);

  useEffect(() => {
    if (!isInView || hasInitialMoved.current || total <= visibleItems) {
      return;
    }
    const timer = setTimeout(() => {
      hasInitialMoved.current = true;
      nextSlide();
    }, 800);
    return () => clearTimeout(timer);
  }, [isInView, nextSlide, total, visibleItems]);

  const handleUserPassBy = () => {
    const now = Date.now();
    if (now - lastHoverTime.current > 1800) {
      lastHoverTime.current = now;
      nextSlide();
    }
  };

  // Swipe gesture support
  const minSwipeDistance = 45;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isRtl) {
      if (isLeftSwipe) prevSlide();
      if (isRightSwipe) nextSlide();
    } else {
      if (isLeftSwipe) nextSlide();
      if (isRightSwipe) prevSlide();
    }
  };

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const stepPercentage = 100 / visibleItems;
  const transformStyle = {
    transform: isRtl
      ? `translateX(${currentIndex * stepPercentage}%)`
      : `translateX(-${currentIndex * stepPercentage}%)`,
    transition: 'transform 450ms cubic-bezier(0.25, 1, 0.5, 1)',
  };

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={handleUserPassBy}
      onMouseMove={handleUserPassBy}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label="Student Testimonials Carousel"
    >
      {/* Header with Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          {subtitle && (
            <span className="text-brand-amber-600 font-bold text-xs uppercase tracking-wider block mb-1">
              {subtitle}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-brand-navy-950 font-cairo">
              {title}
            </h2>
          )}
        </div>

        {/* Carousel Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Autoplay Pause / Play Toggle */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
            title={isPaused ? 'Devam Ettir' : 'Durdur'}
            aria-label={isPaused ? 'Play' : 'Pause'}
          >
            {isPaused ? <Play className="w-4 h-4 fill-slate-700" /> : <Pause className="w-4 h-4" />}
          </button>

          {/* Previous Arrow Button */}
          <button
            onClick={prevSlide}
            disabled={total <= visibleItems}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-brand-amber-500 hover:text-white hover:border-brand-amber-500 text-slate-700 flex items-center justify-center transition-all disabled:opacity-40"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 flip-in-rtl" />
          </button>

          {/* Next Arrow Button */}
          <button
            onClick={nextSlide}
            disabled={total <= visibleItems}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm hover:bg-brand-amber-500 hover:text-white hover:border-brand-amber-500 text-slate-700 flex items-center justify-center transition-all disabled:opacity-40"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 flip-in-rtl" />
          </button>
        </div>
      </div>

      {/* Viewport Window */}
      <div className="overflow-hidden rounded-3xl p-1 -m-1">
        <div className="flex will-change-transform" style={transformStyle}>
          {testimonials.map((t, idx) => (
            <div
              key={t.id || idx}
              className="shrink-0 px-3 transition-opacity duration-300"
              style={{ width: `${stepPercentage}%` }}
            >
              <TestimonialCard testimonial={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dot Indicators */}
      {maxIndex > 0 && (
        <div className="flex items-center justify-center gap-1.5 pt-6">
          {Array.from({ length: Math.min(10, maxIndex + 1) }).map((_, dotIdx) => {
            const isActive =
              currentIndex === dotIdx ||
              (dotIdx === 9 && currentIndex >= 9);

            return (
              <button
                key={dotIdx}
                onClick={() => setCurrentIndex(dotIdx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-7 bg-brand-amber-500 shadow-sm shadow-brand-amber-500/50'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Go to slide ${dotIdx + 1}`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
